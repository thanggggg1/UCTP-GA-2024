package usecase

import (
	"context"
	"errors"
	"gorm.io/gorm"
	"time"
	"utp-ga-2024/backend/domain"
	"utp-ga-2024/backend/internal/tokenutil"
)

type loginUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewLoginUsecase(repo gorm.DB, timeout time.Duration) domain.LoginUsecase {
	return &loginUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (lu *loginUsecase) GetUserByEmail(c context.Context, email string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, lu.contextTimeout)
	defer cancel()

	var user domain.User
	if err := lu.repo.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.User{}, errors.New("user not found")
		}
		return domain.User{}, err
	}

	return user, nil
}

func (lu *loginUsecase) CreateAccessToken(user *domain.User, secret string, expiry int) (string, error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}

func (lu *loginUsecase) CreateRefreshToken(user *domain.User, secret string, expiry int) (string, error) {
	return tokenutil.CreateRefreshToken(user, secret, expiry)
}
