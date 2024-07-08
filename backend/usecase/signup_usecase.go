package usecase

import (
	"context"
	"gorm.io/gorm"
	"strconv"
	"time"
	"utp-ga-2024/backend/domain"
	"utp-ga-2024/backend/internal/tokenutil"
)

type signupUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewSignupUsecase(repo gorm.DB, timeout time.Duration) domain.SignupUsecase {
	return &signupUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (su *signupUsecase) Create(c context.Context, user *domain.User, universityName string) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	return su.repo.Transaction(func(tx *gorm.DB) error {
		university := &domain.University{
			Name: universityName,
		}
		if err := tx.WithContext(ctx).Create(university).Error; err != nil {
			return err
		}

		user.UniversityID = strconv.Itoa(int(university.ID))

		return tx.WithContext(ctx).Create(user).Error
	})
}

func (su *signupUsecase) GetUserByEmail(c context.Context, email string) (domain.User, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	var user domain.User
	if err := su.repo.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return domain.User{}, err
		}
		return domain.User{}, err
	}

	return user, nil
}

func (su *signupUsecase) CreateAccessToken(user *domain.User, secret string, expiry int) (string, error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}

func (su *signupUsecase) CreateRefreshToken(user *domain.User, secret string, expiry int) (string, error) {
	return tokenutil.CreateRefreshToken(user, secret, expiry)
}
