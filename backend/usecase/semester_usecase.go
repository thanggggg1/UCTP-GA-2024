package usecase

import (
	"context"
	"errors"
	"time"

	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type semesterUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewSemesterUseCase(repo gorm.DB, timeout time.Duration) domain.SemesterUsecase {
	return &semesterUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (tu *semesterUsecase) Create(c context.Context, semester *domain.Semester) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()

	// Start a transaction
	tx := tu.repo.WithContext(ctx).Begin()

	// Create the semester
	if err := tx.Create(semester).Error; err != nil {
		tx.Rollback()
		return err
	}

	// If there are course IDs, associate the courses with the semester
	if len(semester.CourseIds) > 0 {
		var courses []domain.Course
		if err := tx.Where("id IN ?", semester.CourseIds).Find(&courses).Error; err != nil {
			tx.Rollback()
			return err
		}

		if len(courses) != len(semester.CourseIds) {
			tx.Rollback()
			return errors.New("some courses not found")
		}

		// Associate the courses with the semester
		if err := tx.Model(semester).Association("Courses").Replace(courses); err != nil {
			tx.Rollback()
			return err
		}
	}

	// Commit the transaction
	return tx.Commit().Error
}

func (tu *semesterUsecase) Update(c context.Context, semester *domain.Semester) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()

	tx := tu.repo.WithContext(ctx).Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Update the semester details
	if err := tx.Save(semester).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update the course relations
	if len(semester.CourseIds) > 0 {
		// Clear existing relations
		if err := tx.Model(semester).Association("Courses").Clear(); err != nil {
			tx.Rollback()
			return err
		}
		// Add new relations
		courses := []domain.Course{}
		if err := tx.Where("id IN ?", semester.CourseIds).Find(&courses).Error; err != nil {
			tx.Rollback()
			return err
		}
		if err := tx.Model(semester).Association("Courses").Replace(&courses); err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}
func (tu *semesterUsecase) Delete(c context.Context, id uint) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	return tu.repo.WithContext(ctx).Delete(&domain.Semester{}, id).Error
}
func (tu *semesterUsecase) FetchAll(c context.Context) ([]domain.Semester, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	var sections []domain.Semester
	return sections, tu.repo.WithContext(ctx).Preload("Courses").Find(&sections).Error
}

func (tu *semesterUsecase) FetchByID(c context.Context, id uint) (domain.Semester, error) {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()
	var semester domain.Semester
	err := tu.repo.WithContext(ctx).Preload("Courses").First(&semester, id).Error
	if err != nil {
		return semester, err
	}

	// Populate CourseIds
	for _, course := range semester.Courses {
		semester.CourseIds = append(semester.CourseIds, course.ID)
	}

	return semester, nil
}
func (tu *semesterUsecase) AssignCourses(c context.Context, semesterID uint, courseIDs []uint) error {
	ctx, cancel := context.WithTimeout(c, tu.contextTimeout)
	defer cancel()

	// Start a transaction
	tx := tu.repo.WithContext(ctx).Begin()

	// Find the semester to assign courses to
	var semester domain.Semester
	if err := tx.First(&semester, semesterID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			tx.Rollback()
			return errors.New("semester not found")
		}
		tx.Rollback()
		return err
	}

	// Find the courses to be assigned
	var courses []domain.Course
	if err := tx.Where("id IN ?", courseIDs).Find(&courses).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Check if all courses were found
	if len(courses) != len(courseIDs) {
		tx.Rollback()
		return errors.New("some courses not found")
	}

	// Assign the courses to the semester
	if err := tx.Model(&semester).Association("Courses").Replace(courses); err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}
