package usecase

import (
	"context"
	"time"
	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type userUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewUserUsecase(repo gorm.DB, timeout time.Duration) domain.UserUsecase {
	return &userUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (su *userUsecase) GetByEmail(c context.Context, email string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	var user domain.User
	if err := su.repo.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		return domain.User{}, err
	}

	return user, nil
}

func (su *userUsecase) GetByID(c context.Context, id uint) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	var user domain.User
	if err := su.repo.WithContext(ctx).Preload("University").First(&user, id).Error; err != nil {
		return domain.User{}, err
	}

	return user, nil
}
