package usecase

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/tealeg/xlsx"
	"strconv"
	"time"

	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type courseUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewCourseUseCase(repo gorm.DB, timeout time.Duration) domain.CourseUsecase {
	return &courseUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (tu *courseUsecase) Create(c context.Context, course *domain.Course) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()

	// Start a transaction
	tx := tu.repo.WithContext(ctx).Begin()

	if err := tx.Create(course).Error; err != nil {
		tx.Rollback()
		return err
	}

	// If there are course IDs, associate the courses with the semester
	if len(course.InstructorIds) > 0 {
		var instructors []domain.Instructor
		if err := tx.Where("id IN ?", course.InstructorIds).Find(&instructors).Error; err != nil {
			tx.Rollback()
			return err
		}

		if len(instructors) != len(course.InstructorIds) {
			tx.Rollback()
			return errors.New("some instructors not found")
		}

		// Associate the courses with the semester
		if err := tx.Model(course).Association("Instructors").Replace(instructors); err != nil {
			tx.Rollback()
			return err
		}
	}

	// Commit the transaction
	return tx.Commit().Error
}

func (tu *courseUsecase) Update(c context.Context, course *domain.Course) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()

	tx := tu.repo.WithContext(ctx).Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Update the course details
	if err := tx.Save(course).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update the instructor relations
	if len(course.InstructorIds) > 0 {
		// Clear existing relations
		if err := tx.Model(course).Association("Instructors").Clear(); err != nil {
			tx.Rollback()
			return err
		}
		// Add new relations
		instructors := []domain.Instructor{}
		if err := tx.Where("id IN ?", course.InstructorIds).Find(&instructors).Error; err != nil {
			tx.Rollback()
			return err
		}
		if err := tx.Model(course).Association("Instructors").Replace(&instructors); err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func (tu *courseUsecase) Delete(ctx context.Context, id uint) error {
	// Start a transaction
	tx := tu.repo.WithContext(ctx).Begin()

	// Find the course to be deleted
	var course domain.Course
	if err := tx.First(&course, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			tx.Rollback()
			return errors.New("course not found")
		}
		tx.Rollback()
		return err
	}

	// Delete the associations in the many-to-many join tables
	if err := tx.Model(&course).Association("Semester").Clear(); err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Model(&course).Association("Instructors").Clear(); err != nil {
		tx.Rollback()
		return err
	}

	// Delete the course
	if err := tx.Delete(&course).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}
func (tu *courseUsecase) FetchAll(ctx context.Context, filter map[string]interface{}) ([]domain.Course, error) {
	ctx, cancel := context.WithTimeout(ctx, tu.contextTimeout)
	defer cancel()

	var courses []domain.Course
	query := tu.repo.WithContext(ctx)

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
	// Apply filters
	if universityID, ok := filter["university_id"]; ok {
		query = query.Where("university_id = ?", universityID)
	}

	err := query.Preload("Instructors").Find(&courses).Error
	return courses, err
}

func (tu *courseUsecase) FetchByID(c context.Context, id uint) (domain.Course, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	var course domain.Course

	// Fetch the course and preload the instructors
	err := tu.repo.WithContext(ctx).Preload("Instructors").First(&course, id).Error
	if err != nil {
		return course, err
	}

	// Extract the instructor IDs
	instructorIds := make([]uint, len(course.Instructors))
	for i, instructor := range course.Instructors {
		instructorIds[i] = instructor.ID
	}

	// Set the InstructorIds field
	course.InstructorIds = instructorIds

	return course, nil
}

func (tu *courseUsecase) ImportFromXLSX(ctx context.Context, filePath string, universityID uint) error {
	// Verify if the universityID exists
	var university domain.University
	if err := tu.repo.WithContext(ctx).First(&university, universityID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return fmt.Errorf("university with ID %d does not exist", universityID)
		}
		return err
	}

	file, err := xlsx.OpenFile(filePath)
	if err != nil {
		return err
	}

	var courses []domain.Course

	for _, sheet := range file.Sheets {
		// Skip the header row by starting at index 1
		for rowIndex, row := range sheet.Rows {
			if rowIndex == 0 {
				continue // Skip header row
			}

			var course domain.Course
			for cellIndex, cell := range row.Cells {
				text := cell.String()
				switch cellIndex {
				case 0:
					course.Code = text
				case 1:
					course.CodeHp = text
				case 2:
					course.Name = text
				case 3:
					hours, err := cell.Int()
					if err != nil {
						return err
					}
					course.Hours = hours
				case 4:
					course.Description = text
				case 6:
					course.Type = domain.RoomType(text)
				case 7:
					if text != "" {
						instructorIDs, err := parseInstructorIDs(text)
						if err != nil {
							return err
						}
						course.InstructorIds = instructorIDs
					}
				}
			}

			course.Divisible = true
			course.UniversityID = universityID

			courses = append(courses, course)
		}
	}

	for _, course := range courses {
		var existingCourse domain.Course
		err := tu.repo.WithContext(ctx).Where("code = ?", course.Code).First(&existingCourse).Error
		if err != nil && err != gorm.ErrRecordNotFound {
			return err
		}

		if existingCourse.ID != 0 {
			// Update existing course
			existingCourse.CodeHp = course.CodeHp
			existingCourse.Name = course.Name
			existingCourse.Hours = course.Hours
			existingCourse.Description = course.Description
			existingCourse.Divisible = course.Divisible
			existingCourse.Type = course.Type
			existingCourse.InstructorIds = course.InstructorIds
			existingCourse.UniversityID = universityID

			if err := tu.repo.WithContext(ctx).Save(&existingCourse).Error; err != nil {
				return err
			}
			// Update instructor associations
			if len(course.InstructorIds) > 0 {
				var instructors []domain.Instructor
				if err := tu.repo.WithContext(ctx).Where("id IN ?", course.InstructorIds).Find(&instructors).Error; err != nil {
					return err
				}
				if err := tu.repo.WithContext(ctx).Model(&existingCourse).Association("Instructors").Replace(instructors); err != nil {
					return err
				}
			}
		} else {
			// Create new course
			if err := tu.repo.WithContext(ctx).Create(&course).Error; err != nil {
				return err
			}
			// Set instructor associations
			if len(course.InstructorIds) > 0 {
				var instructors []domain.Instructor
				if err := tu.repo.WithContext(ctx).Where("id IN ?", course.InstructorIds).Find(&instructors).Error; err != nil {
					return err
				}
				if err := tu.repo.WithContext(ctx).Model(&course).Association("Instructors").Replace(instructors); err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func parseInstructorIDs(input string) ([]uint, error) {
	var rawIDs []interface{}
	var ids []uint

	// Unmarshal the input JSON string into a slice of empty interfaces
	if err := json.Unmarshal([]byte(input), &rawIDs); err != nil {
		return nil, fmt.Errorf("failed to parse instructor IDs: %v", err)
	}

	// Process each element in the rawIDs slice
	for _, rawID := range rawIDs {
		switch id := rawID.(type) {
		case float64: // For JSON numbers
			ids = append(ids, uint(id))
		case string: // For JSON strings
			numID, err := strconv.Atoi(id)
			if err != nil {
				return nil, fmt.Errorf("invalid instructor ID: %v", id)
			}
			ids = append(ids, uint(numID))
		default:
			return nil, fmt.Errorf("unsupported ID format: %v", rawID)
		}
	}

	return ids, nil
}
