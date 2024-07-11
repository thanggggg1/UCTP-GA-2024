package domain

import (
	"context"
	"gorm.io/datatypes"
)

// Room stores data about a classroom
type Room struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Code         string         `gorm:"size:30" json:"code" binding:"required"`
	Name         string         `gorm:"size:255" json:"name" binding:"required"`
	Type         RoomType       `json:"type" binding:"required"`
	UniversityID uint           `json:"university_id" binding:"required"`
	University   University     `gorm:"foreignKey:UniversityID" json:"university"`
	Schedule     datatypes.JSON `gorm:"type:json;not null" json:"schedule"` // JSON for schedule array
	Status       StatusType     `gorm:"default:true" json:"status"`
	Size         int            `json:"size"` // Number of seats in the classroom
}

// RoomUsecase interface defines the CreateRoom method
type RoomUsecase interface {
	Create(c context.Context, room *Room) error
	Update(c context.Context, room *Room) error
	Delete(c context.Context, id uint) error
	DeleteMany(c context.Context, ids []uint) error
	FetchAll(c context.Context, filter map[string]interface{}) ([]Room, error)
	FetchByID(c context.Context, id uint) (Room, error)
	ImportFromXLSX(c context.Context, filePath string, universityID uint) error // New method
}
