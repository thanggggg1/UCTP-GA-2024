package usecase

import (
	"context"
	"encoding/json"
	"github.com/tealeg/xlsx"
	"time"

	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type roomUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewRoomUseCase(repo gorm.DB, timeout time.Duration) domain.RoomUsecase {
	return &roomUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (tu *roomUsecase) Create(c context.Context, room *domain.Room) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.repo.WithContext(ctx).Create(room).Error
}

func (tu *roomUsecase) Update(c context.Context, room *domain.Room) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.repo.WithContext(ctx).Save(room).Error
}

func (tu *roomUsecase) Delete(c context.Context, id uint) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.repo.WithContext(ctx).Delete(&domain.Room{}, id).Error
}

func (tu *roomUsecase) FetchAll(ctx context.Context, filter map[string]interface{}) ([]domain.Room, error) {
	ctx, cancel := context.WithTimeout(ctx, tu.contextTimeout)
	defer cancel()

	var rooms []domain.Room
	query := tu.repo.WithContext(ctx)

	// Apply filters
	if universityID, ok := filter["university_id"]; ok {
		query = query.Where("university_id = ?", universityID)
	}
	if code, ok := filter["code"]; ok {
		query = query.Where("code = ?", code)
	}
	if name, ok := filter["name"]; ok {
		query = query.Where("name LIKE ?", "%"+name.(string)+"%")
	}
	if status, ok := filter["status"]; ok {
		query = query.Where("status = ?", status)
	}

	err := query.Find(&rooms).Error
	return rooms, err
}

func (tu *roomUsecase) FetchByID(c context.Context, id uint) (domain.Room, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	var room domain.Room
	return room, tu.repo.WithContext(ctx).First(&room, id).Error
}

func (tu *roomUsecase) ImportFromXLSX(ctx context.Context, filePath string, universityID uint) error {
	file, err := xlsx.OpenFile(filePath)
	if err != nil {
		return err
	}

	var rooms []domain.Room

	for _, sheet := range file.Sheets {
		// Skip the header row by starting at index 1
		for rowIndex, row := range sheet.Rows {
			if rowIndex == 0 {
				continue // Skip header row
			}

			var room domain.Room
			for cellIndex, cell := range row.Cells {
				text := cell.String()
				switch cellIndex {
				case 0:
					room.Code = text
				case 1:
					room.Name = text
				case 2:
					room.Type = domain.RoomType(text)
				}
			}

			// Set default values for schedule and status
			scheduleJSON, err := json.Marshal(defaultSchedule)
			if err != nil {
				return err
			}
			room.Schedule = scheduleJSON
			room.Status = domain.ACTIVE
			room.UniversityID = universityID // Set the university ID

			rooms = append(rooms, room)
		}
	}

	for _, room := range rooms {
		var existingRoom domain.Room
		err := tu.repo.WithContext(ctx).Where("code = ? AND university_id = ?", room.Code, universityID).First(&existingRoom).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			return err
		}

		if existingRoom.ID != 0 {
			// Update existing room
			existingRoom.Name = room.Name
			existingRoom.Type = room.Type
			existingRoom.Schedule = room.Schedule
			existingRoom.Status = room.Status

			if err := tu.repo.WithContext(ctx).Save(&existingRoom).Error; err != nil {
				return err
			}
		} else {
			// Create new room
			if err := tu.repo.WithContext(ctx).Create(&room).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
