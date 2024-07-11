package usecase

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/tealeg/xlsx"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strconv"
	"time"
	"utp-ga-2024/backend/domain"
)

type instructorUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewInstructorUsecase(repo gorm.DB, timeout time.Duration) domain.InstructorUsecase {
	return &instructorUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (iu *instructorUsecase) Create(c context.Context, instructor *domain.Instructor) error {
	ctx, cancel := context.WithTimeout(c, iu.contextTimeout)
	defer cancel()

	// Copy fields from Instructor to User
	user := domain.User{
		Name:         instructor.Name,
		Email:        instructor.Email,
		Password:     instructor.Password,
		Role:         domain.UserRole("INSTRUCTOR"),
		UniversityID: strconv.Itoa(int(instructor.UniversityID)),
	}

	// Encrypt the password
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(encryptedPassword)

	// Create the User
	err = iu.repo.WithContext(ctx).Create(&user).Error
	if err != nil {
		return err
	}

	// Associate the created User with the Instructor
	instructor.UserID = user.ID

	// Create the Instructor
	return iu.repo.WithContext(ctx).Create(instructor).Error
}

func (iu *instructorUsecase) Update(c context.Context, instructor *domain.Instructor) error {
	ctx, cancel := context.WithTimeout(c, iu.contextTimeout)
	defer cancel()

	// Update the User
	user := &domain.User{
		ID:    instructor.UserID,
		Email: instructor.Email,
		Name:  instructor.Name,
		Role:  domain.UserRole("INSTRUCTOR"),
	}

	if instructor.Password != "" {
		encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(instructor.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(encryptedPassword)
	}

	err := iu.repo.WithContext(ctx).Model(user).Updates(user).Error
	if err != nil {
		return err
	}

	// Update the Instructor
	return iu.repo.WithContext(ctx).Save(instructor).Error
}

func (iu *instructorUsecase) Delete(ctx context.Context, id uint) error {
	ctx, cancel := context.WithTimeout(ctx, iu.contextTimeout)
	defer cancel()

	// Start a transaction
	tx := iu.repo.WithContext(ctx).Begin()

	// Find the instructor to be deleted
	var instructor domain.Instructor
	if err := tx.First(&instructor, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			tx.Rollback()
			return errors.New("instructor not found")
		}
		tx.Rollback()
		return err
	}

	// Clear the association with courses
	if err := tx.Model(&instructor).Association("Courses").Clear(); err != nil {
		tx.Rollback()
		return err
	}

	// Delete the associated User
	if err := tx.Delete(&domain.User{}, instructor.UserID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Delete the Instructor
	if err := tx.Delete(&instructor).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}

func (iu *instructorUsecase) DeleteMany(ctx context.Context, ids []uint) error {
	// Start a transaction
	tx := iu.repo.WithContext(ctx).Begin()

	for _, id := range ids {
		// Find the instructor to be deleted
		var instructor domain.Instructor
		if err := tx.First(&instructor, id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				tx.Rollback()
				return errors.New("one or more instructors not found")
			}
			tx.Rollback()
			return err
		}

		if err := tx.Model(&instructor).Association("Courses").Clear(); err != nil {
			tx.Rollback()
			return err
		}

		// Delete the associated User
		if err := tx.Delete(&domain.User{}, instructor.UserID).Error; err != nil {
			tx.Rollback()
			return err
		}

		// Delete the Instructor
		if err := tx.Delete(&instructor).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Commit the transaction
	return tx.Commit().Error
}

func (iu *instructorUsecase) FetchAll(ctx context.Context, filter map[string]interface{}) ([]domain.Instructor, error) {
	ctx, cancel := context.WithTimeout(ctx, iu.contextTimeout)
	defer cancel()

	var instructors []domain.Instructor
	query := iu.repo.WithContext(ctx)

	// Apply filters
	if code, ok := filter["code"]; ok {
		query = query.Where("code = ?", code)
	}
	if name, ok := filter["name"]; ok {
		query = query.Where("name LIKE ?", "%"+name.(string)+"%")
	}
	if status, ok := filter["status"]; ok {
		query = query.Where("status = ?", status)
	}
	if universityID, ok := filter["university_id"]; ok {
		query = query.Where("university_id = ?", universityID)
	}

	err := query.Find(&instructors).Error
	return instructors, err
}

func (iu *instructorUsecase) FetchByID(c context.Context, id uint) (domain.Instructor, error) {
	ctx, cancel := context.WithTimeout(c, iu.contextTimeout)
	defer cancel()
	var instructor domain.Instructor
	return instructor, iu.repo.WithContext(ctx).First(&instructor, id).Error
}
func (iu *instructorUsecase) ImportFromXLSX(ctx context.Context, filePath string, universityID uint) error {
	file, err := xlsx.OpenFile(filePath)
	if err != nil {
		return err
	}

	var instructors []domain.Instructor

	for _, sheet := range file.Sheets {
		// Skip the header row by starting at index 1
		for rowIndex, row := range sheet.Rows {
			if rowIndex == 0 {
				continue // Skip header row
			}

			var instructor domain.Instructor
			for cellIndex, cell := range row.Cells {
				text := cell.String()
				switch cellIndex {
				case 0:
					instructor.Code = text
				case 1:
					instructor.Name = text
				case 2:
					hours, err := cell.Int()
					if err != nil {
						return err
					}
					instructor.Hours = hours
				case 3:
					instructor.Email = text
				case 4:
					instructor.Password = text
				}
			}
			// Set default values for schedule and status
			scheduleJSON, err := json.Marshal(defaultSchedule)
			if err != nil {
				return err
			}
			instructor.Schedule = scheduleJSON
			instructor.Status = domain.ACTIVE
			instructor.UniversityID = universityID

			instructors = append(instructors, instructor)
		}
	}

	for _, instructor := range instructors {
		var existingInstructor domain.Instructor
		err := iu.repo.WithContext(ctx).Where("code = ?", instructor.Code).First(&existingInstructor).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			return err
		}

		if existingInstructor.ID != 0 {
			// Update existing instructor
			existingInstructor.Name = instructor.Name
			existingInstructor.Hours = instructor.Hours
			existingInstructor.Schedule = instructor.Schedule
			existingInstructor.Status = instructor.Status
			existingInstructor.Email = instructor.Email
			existingInstructor.Password = instructor.Password
			existingInstructor.UniversityID = universityID

			if instructor.Password != "" {
				encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(instructor.Password), bcrypt.DefaultCost)
				if err != nil {
					return err
				}
				existingInstructor.Password = string(encryptedPassword)
			}

			// Update the associated user
			user := &domain.User{
				ID:           existingInstructor.UserID,
				Email:        instructor.Email,
				Name:         instructor.Name,
				Role:         domain.UserRole("INSTRUCTOR"),
				UniversityID: strconv.Itoa(int(universityID)),
			}

			if instructor.Password != "" {
				user.Password = existingInstructor.Password
			}

			err = iu.repo.WithContext(ctx).Model(user).Updates(user).Error
			if err != nil {
				return err
			}

			if err := iu.repo.WithContext(ctx).Save(&existingInstructor).Error; err != nil {
				return err
			}
		} else {
			// Create new instructor
			encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(instructor.Password), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			user := &domain.User{
				Email:        instructor.Email,
				Password:     string(encryptedPassword),
				Name:         instructor.Name,
				Role:         domain.UserRole("INSTRUCTOR"),
				UniversityID: strconv.Itoa(int(universityID)),
			}

			err = iu.repo.WithContext(ctx).Create(user).Error
			if err != nil {
				return err
			}

			instructor.UserID = user.ID

			if err := iu.repo.WithContext(ctx).Create(&instructor).Error; err != nil {
				return err
			}
		}
	}

	return nil
}
