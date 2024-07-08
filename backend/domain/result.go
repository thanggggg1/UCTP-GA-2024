package domain

import (
	"context"
	"gorm.io/datatypes"
	"time"
)

type Result struct {
	ID             uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Content        string         `json:"content" binding:"required"`
	Timestamp      time.Time      `json:"timestamp"`
	UniversityID   uint           `json:"university_id" binding:"required"`
	University     University     `gorm:"foreignKey:UniversityID" json:"university"`
	SemesterID     uint           `json:"semester_id" binding:"required"`
	TopChromosomes datatypes.JSON `json:"top_chromosomes"`
}

type ResultUsecase interface {
	FetchAll(c context.Context) ([]Result, error)
	FetchByID(c context.Context, id uint) (Result, error)
	FetchBySemesterAndUniversity(c context.Context, semesterID uint, universityID uint) (Result, error)
}
