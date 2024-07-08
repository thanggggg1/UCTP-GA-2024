package usecase

import (
	"context"
	"time"
	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type resultUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewResultUsecase(repo gorm.DB, timeout time.Duration) domain.ResultUsecase {
	return &resultUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (ru *resultUsecase) FetchAll(c context.Context) ([]domain.Result, error) {
	ctx, cancel := context.WithTimeout(c, ru.contextTimeout)
	defer cancel()

	var results []domain.Result
	err := ru.repo.WithContext(ctx).Find(&results).Error
	return results, err
}

func (ru *resultUsecase) FetchByID(c context.Context, id uint) (domain.Result, error) {
	ctx, cancel := context.WithTimeout(c, ru.contextTimeout)
	defer cancel()

	var result domain.Result
	err := ru.repo.WithContext(ctx).First(&result, id).Error
	return result, err
}

func (ru *resultUsecase) FetchBySemesterAndUniversity(c context.Context, semesterID uint, universityID uint) (domain.Result, error) {
	ctx, cancel := context.WithTimeout(c, ru.contextTimeout)
	defer cancel()

	var result domain.Result
	err := ru.repo.WithContext(ctx).Where("semester_id = ? AND university_id = ?", semesterID, universityID).First(&result).Error
	return result, err
}
