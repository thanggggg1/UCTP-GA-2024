package domain

import (
	"context"
)

type User struct {
	ID           uint       `gorm:"primaryKey;autoIncrement"`
	Name         string     `gorm:"size:255" json:"name" binding:"required"`
	Email        string     `bson:"email"`
	Password     string     `bson:"password"`
	Role         UserRole   `bson:"role"`
	UniversityID string     `bson:"university_id"`
	University   University `gorm:"foreignKey:UniversityID"`
}

type UserUsecase interface {
	GetByEmail(c context.Context, email string) (User, error)
	GetByID(c context.Context, id uint) (User, error)
}
