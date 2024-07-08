package usecase

import (
	"context"
	"time"
	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type settingUsecase struct {
	repo           gorm.DB
	contextTimeout time.Duration
}

func NewSettingUsecase(repo gorm.DB, timeout time.Duration) domain.SettingUsecase {
	return &settingUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (su *settingUsecase) Create(c context.Context, setting *domain.Setting) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	return su.repo.WithContext(ctx).Create(setting).Error
}

func (su *settingUsecase) Update(c context.Context, setting *domain.Setting) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	return su.repo.WithContext(ctx).Model(&domain.Setting{}).Where("id = ?", setting.ID).Updates(setting).Error
}

func (su *settingUsecase) Delete(c context.Context, id uint) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	return su.repo.WithContext(ctx).Where("id = ?", id).Delete(&domain.Setting{}).Error
}

func (su *settingUsecase) Fetch(c context.Context, universityID uint) (domain.Setting, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()

	var setting domain.Setting
	err := su.repo.WithContext(ctx).Where("university_id = ?", universityID).First(&setting).Error
	return setting, err
}
