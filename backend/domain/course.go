package domain

import (
	"context"
)

type Course struct {
	ID                 uint         `gorm:"primaryKey;autoIncrement" json:"id"`
	Code               string       `gorm:"size:30" json:"code" binding:"required"`
	CodeHp             string       `gorm:"size:30" json:"code_hp" binding:"required"`
	Name               string       `gorm:"size:255" json:"name" binding:"required"`
	Hours              int          `json:"hours" binding:"required"` //number of timeslots
	Description        string       `gorm:"size:255" json:"description"`
	Divisible          bool         `json:"divisible"`
	Type               RoomType     `json:"type" binding:"required"`
	Semester           []Semester   `gorm:"many2many:semester_courses;" json:"semesters"`
	UniversityID       uint         `json:"university_id" binding:"required"`
	University         University   `gorm:"foreignKey:UniversityID" json:"university"`
	Instructors        []Instructor `gorm:"many2many:course_instructors;" json:"instructors"`
	InstructorIds      []uint       `gorm:"-" json:"instructor_ids"`
	NumOfRegistrations int          `json:"num_of_registrations"`
}

type CourseUsecase interface {
	Create(c context.Context, course *Course) error
	Update(c context.Context, course *Course) error
	Delete(c context.Context, id uint) error
	DeleteMany(c context.Context, ids []uint) error
	FetchAll(c context.Context, filter map[string]interface{}) ([]Course, error)
	FetchByID(c context.Context, id uint) (Course, error)
	ImportFromXLSX(c context.Context, filePath string, universityID uint) error // New method
}
