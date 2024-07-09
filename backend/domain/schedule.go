package domain

import (
	"context"
	"github.com/hibiken/asynq"
)

// DataSchedule Data represents the raw data for the algorithm
type DataSchedule struct {
	Rooms       map[int]Room
	Instructors map[int]Instructor
	Semesters   map[int]Semester
	Courses     map[int]Course
}

// ChromosomeData represents the structure for a chromosome's data
type ChromosomeData struct {
	Semesters   map[int]SemesterDetails
	Instructors map[int][][]*int
	Rooms       map[int][][]*int
	Unplaced    map[int][]int
}

// SemesterDetails SectionDetails represents the details of a section in the chromosome
type SemesterDetails struct {
	Details  map[int]CourseDetails
	Schedule [][]*int
}

// CourseDetails SubjectDetails represents the details of a subject in the chromosome
type CourseDetails struct {
	RoomID         int
	InstructorID   int
	Days           []int
	StartSlot      int
	Length         int
	CourseName     string
	InstructorName string
}

// ScheduleTask Job payload and constants
const (
	ScheduleTask = "schedule:task"
)

type SchedulePayload struct {
	SemesterID   uint
	UniversityID uint
}
type ScheduleUsecase interface {
	HandleScheduleTask(ctx context.Context, t *asynq.Task) error
	NewScheduleTask(universityID uint, semesterID uint) (*asynq.Task, error)
	FetchData(universityID uint, semesterID uint) (DataSchedule, error)
	UpsertScheduleTask(universityID uint, semesterID uint) error
	ClearEventStream() error
}
