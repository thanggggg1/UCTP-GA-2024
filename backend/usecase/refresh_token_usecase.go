package usecase

import (
	"context"
	"gorm.io/gorm"
	"time"
	"utp-ga-2024/backend/domain"
	"utp-ga-2024/backend/internal/tokenutil"
)

type refreshTokenUsecase struct {
	db             gorm.DB
	contextTimeout time.Duration
}

func NewRefreshTokenUsecase(db gorm.DB, timeout time.Duration) domain.RefreshTokenUsecase {
	return &refreshTokenUsecase{
		db:             db,
		contextTimeout: timeout,
	}
}

func (rtu *refreshTokenUsecase) GetUserByID(c context.Context, id string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, rtu.contextTimeout)
	defer cancel()

	var user domain.User
	if err := rtu.db.WithContext(ctx).First(&user, id).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (rtu *refreshTokenUsecase) CreateAccessToken(user *domain.User, secret string, expiry int) (string, error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}

func (rtu *refreshTokenUsecase) CreateRefreshToken(user *domain.User, secret string, expiry int) (string, error) {
	return tokenutil.CreateRefreshToken(user, secret, expiry)
}

func (rtu *refreshTokenUsecase) ExtractIDFromToken(requestToken string, secret string) (string, error) {
	return tokenutil.ExtractIDFromToken(requestToken, secret)
}
