package domain

import (
	"context"
	"gorm.io/datatypes"
)

type Semester struct {
	ID           uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	Name         string         `gorm:"size:255" json:"name" binding:"required"`
	Schedule     datatypes.JSON `gorm:"type:json;not null" json:"schedule"` // JSON for schedule array
	CourseIds    []uint         `gorm:"-" json:"course_ids"`
	Courses      []Course       `gorm:"many2many:semester_courses;" json:"courses"`
	Status       StatusType     `json:"status"`
	Stay         bool           `json:"stay"`
	UniversityID uint           `json:"university_id" binding:"required"`
	University   University     `gorm:"foreignKey:UniversityID" json:"university"`
}

type SemesterUsecase interface {
	Create(c context.Context, section *Semester) error
	Update(c context.Context, section *Semester) error
	Delete(c context.Context, id uint) error
	FetchAll(c context.Context) ([]Semester, error)
	FetchByID(c context.Context, id uint) (Semester, error)
	AssignCourses(c context.Context, semesterID uint, courseIDs []uint) error // New method
}
