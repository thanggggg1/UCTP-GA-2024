package domain

import (
	"context"
)

type SignupRequest struct {
	Name           string `form:"name" binding:"required"`
	Email          string `form:"email" binding:"required,email"`
	Password       string `form:"password" binding:"required"`
	UniversityName string `form:"universityName" binding:"required"`
}

type SignupResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type SignupUsecase interface {
	Create(c context.Context, user *User, universityName string) error
	GetUserByEmail(c context.Context, email string) (User, error)
	CreateAccessToken(user *User, secret string, expiry int) (accessToken string, err error)
	CreateRefreshToken(user *User, secret string, expiry int) (refreshToken string, err error)
}
