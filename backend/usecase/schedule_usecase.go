package usecase

import (
	"context"
	"encoding/json"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
	"log"
	"time"
	"utp-ga-2024/backend/domain"
	"utp-ga-2024/backend/sse"
)

type scheduleUsecase struct {
	db             gorm.DB
	contextTimeout time.Duration
	client         *asynq.Client
}

func NewScheduleUsecase(repo gorm.DB, timeout time.Duration, client *asynq.Client) domain.ScheduleUsecase {
	return &scheduleUsecase{
		db:             repo,
		contextTimeout: timeout,
		client:         client,
	}
}

func (uc *scheduleUsecase) HandleScheduleTask(ctx context.Context, t *asynq.Task) error {
	var payload domain.SchedulePayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return err
	}

	sse.ClearStream()

	// Process the task here using payload.DataID
	clientChan := make(chan string) // Make channel for GA

	data, err := uc.FetchData(payload.UniversityID, payload.SemesterID)
	if err != nil {
		return err
	}
	// Fetch semester
	var setting domain.Setting
	if err := uc.db.Where("university_id = ?", payload.UniversityID).First(&setting).Error; err != nil {
		return err
	}
	// Run your genetic algorithm here and save the result
	geneticAlgorithm := NewGeneticAlgorithm(data, clientChan, uc.db, payload.UniversityID, payload.SemesterID, setting)
	geneticAlgorithm.RunGeneration()

	return nil
}

func (uc *scheduleUsecase) ClearEventStream() error {
	sse.ClearStream()
	return nil
}

func (uc *scheduleUsecase) NewScheduleTask(universityID uint, semesterID uint) (*asynq.Task, error) {
	payload, err := json.Marshal(domain.SchedulePayload{
		UniversityID: universityID,
		SemesterID:   semesterID,
	})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(domain.ScheduleTask, payload, asynq.MaxRetry(5), asynq.Timeout(300*time.Minute)), nil
}

func (uc *scheduleUsecase) UpsertScheduleTask(universityID uint, semesterID uint) error {
	task, err := uc.NewScheduleTask(universityID, semesterID)
	if err != nil {
		log.Fatalf("could not create task: %v", err)
	}
	if err != nil {
		return err
	}
	//Run your genetic algorithm here and save the result
	info, err := uc.client.Enqueue(task)
	if err != nil {
		log.Fatalf("could not enqueue task: %v", err)
	}
	log.Printf("enqueued task: id=%s queue=%s", info.ID, info.Queue)
	return nil
}

func (uc *scheduleUsecase) FetchData(universityID uint, semesterID uint) (domain.DataSchedule, error) {
	var data domain.DataSchedule

	// Fetch instructors
	var instructors []domain.Instructor
	if err := uc.db.Where("university_id = ?", universityID).Find(&instructors).Error; err != nil {
		return data, err
	}
	data.Instructors = make(map[int]domain.Instructor)
	for _, instructor := range instructors {
		data.Instructors[int(instructor.ID)] = instructor
	}

	// Fetch rooms
	var rooms []domain.Room
	if err := uc.db.Where("university_id = ?", universityID).Find(&rooms).Error; err != nil {
		return data, err
	}

	data.Rooms = make(map[int]domain.Room)
	for _, room := range rooms {
		data.Rooms[int(room.ID)] = room
	}

	// Fetch semester
	var semester domain.Semester
	if err := uc.db.Preload("Courses.Instructors").Where("id = ?", semesterID).First(&semester).Error; err != nil {
		return data, err
	}
	// Populate CourseIds
	for _, course := range semester.Courses {
		semester.CourseIds = append(semester.CourseIds, course.ID)
	}
	data.Semesters = make(map[int]domain.Semester)
	data.Semesters[int(semester.ID)] = semester

	// Fetch courses based on semester
	data.Courses = make(map[int]domain.Course)
	for _, course := range semester.Courses {
		// Populate InstructorIds
		for _, instructor := range course.Instructors {
			course.InstructorIds = append(course.InstructorIds, instructor.ID)
		}
		data.Courses[int(course.ID)] = course
	}

	return data, nil
}
