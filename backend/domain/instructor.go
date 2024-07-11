package domain

import (
	"context"
	"gorm.io/datatypes"
)

// Instructor represents an instructor in the system
type Instructor struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Code         string         `gorm:"size:10" json:"code" binding:"required"`
	Email        string         `json:"email" binding:"required,email"`
	Password     string         `json:"password,omitempty" binding:"required"`
	Name         string         `json:"name" binding:"required"`
	UserID       uint           `json:"user_id"`
	UniversityID uint           `json:"university_id" binding:"required"`
	University   University     `gorm:"foreignKey:UniversityID" json:"university"`
	Hours        int            `json:"hours" binding:"required"`
	Schedule     datatypes.JSON `gorm:"type:json;not null" json:"schedule"` // JSON for schedule array
	Status       StatusType     `gorm:"default:true" json:"status"`
	Courses      []Course       `gorm:"many2many:course_instructors;" json:"courses"`
}

type InstructorUsecase interface {
	Create(c context.Context, instructor *Instructor) error
	Update(c context.Context, instructor *Instructor) error
	Delete(c context.Context, id uint) error
	DeleteMany(c context.Context, ids []uint) error
	FetchAll(c context.Context, filter map[string]interface{}) ([]Instructor, error)
	FetchByID(c context.Context, id uint) (Instructor, error)
	ImportFromXLSX(c context.Context, filePath string, universityID uint) error
}
