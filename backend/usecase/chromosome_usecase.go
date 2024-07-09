package usecase

import (
	"encoding/json"
	"fmt"
	"gorm.io/datatypes"
	"utp-ga-2024/backend/domain"
)

// Data represents the raw data for the algorithm
type Data struct {
	Rooms       map[int]domain.Room
	Instructors map[int]domain.Instructor
	Semesters   map[int]domain.Semester
	Courses     map[int]domain.Course
}

// Chromosome represents a chromosome in the genetic algorithm
type Chromosome struct {
	Fitness        float64
	FitnessDetails []float64
	Data           domain.ChromosomeData
	RawData        domain.DataSchedule
	Settings       domain.Setting
	LaunchBreak    bool
}

// NewChromosome creates a new Chromosome
func NewChromosome(data domain.DataSchedule, settings domain.Setting) *Chromosome {
	c := &Chromosome{
		Settings: settings,
		Data: domain.ChromosomeData{
			Semesters:   make(map[int]domain.SemesterDetails),
			Instructors: make(map[int][][]*int),
			Rooms:       make(map[int][][]*int),
			Unplaced:    make(map[int][]int),
		},
		RawData:     data,
		LaunchBreak: settings.LunchBreak,
	}

	c.BuildChromosome()
	return c
}

// BuildChromosome builds a chromosome
func (c *Chromosome) BuildChromosome() {
	rawData := c.RawData

	// Process sections
	for sectionID, section := range rawData.Semesters {
		sectionSchedule, _ := ConvertJSONToSchedule(section.Schedule)
		c.Data.Semesters[sectionID] = domain.SemesterDetails{
			Details:  make(map[int]domain.CourseDetails),
			Schedule: make([][]*int, len(sectionSchedule)),
		}
		for i, timeslotRow := range sectionSchedule {
			c.Data.Semesters[sectionID].Schedule[i] = make([]*int, len(timeslotRow))
			for j, day := range timeslotRow {
				if day == "Available" {
					c.Data.Semesters[sectionID].Schedule[i][j] = nil
				} else {
					c.Data.Semesters[sectionID].Schedule[i][j] = new(int)
					*c.Data.Semesters[sectionID].Schedule[i][j] = 0
				}
			}
		}
		for _, subjectID := range section.CourseIds {
			c.Data.Semesters[sectionID].Details[int(subjectID)] = domain.CourseDetails{}
		}
		c.Data.Unplaced[sectionID] = []int{}
	}

	// Process instructors
	for instructorID, instructor := range rawData.Instructors {
		instructorSchedule, _ := ConvertJSONToSchedule(instructor.Schedule)

		c.Data.Instructors[instructorID] = make([][]*int, len(instructorSchedule))
		for i, timeslotRow := range instructorSchedule {
			c.Data.Instructors[instructorID][i] = make([]*int, len(timeslotRow))
			for j, day := range timeslotRow {
				if day == "Available" {
					c.Data.Instructors[instructorID][i][j] = nil
				} else {
					c.Data.Instructors[instructorID][i][j] = new(int)
					*c.Data.Instructors[instructorID][i][j] = 0
				}
			}
		}
	}

	// Process rooms
	for roomID, room := range rawData.Rooms {
		roomSchedule, _ := ConvertJSONToSchedule(room.Schedule)
		c.Data.Rooms[roomID] = make([][]*int, len(roomSchedule))
		for i, timeslotRow := range roomSchedule {
			c.Data.Rooms[roomID][i] = make([]*int, len(timeslotRow))
			for j, day := range timeslotRow {
				if day == "Available" {
					c.Data.Rooms[roomID][i][j] = nil
				} else {
					c.Data.Rooms[roomID][i][j] = new(int)
					*c.Data.Rooms[roomID][i][j] = 0
				}
			}
		}
	}

}

// InsertSchedule inserts a schedule into the chromosome
func (c *Chromosome) InsertSchedule(schedule []int) int {
	//[roomId, sectionId, subjectId, instructorID, day/s, startingTS, length]
	// Create a copy of the schedule for validation
	scheduleCopy := make([]int, len(schedule))
	copy(scheduleCopy, schedule)

	validationResult := c.ValidateSchedule(scheduleCopy)
	if validationResult != 0 {
		return validationResult
	}

	data := c.Data
	courseDetails := domain.CourseDetails{
		RoomID:         schedule[0],
		InstructorID:   schedule[3],
		Days:           []int{schedule[4]},
		StartSlot:      schedule[5],
		Length:         schedule[6],
		CourseName:     c.RawData.Courses[schedule[2]].Name,
		InstructorName: c.RawData.Instructors[schedule[3]].Name,
	}

	//insert details into section data
	section := schedule[1]
	data.Semesters[section].Details[schedule[2]] = courseDetails

	//update instructor and room timetable
	for timeslot := schedule[5]; timeslot < schedule[5]+schedule[6]; timeslot++ {
		day := schedule[4]
		if schedule[3] != 0 {
			data.Instructors[schedule[3]][timeslot][day] = &schedule[1]
		}
		data.Rooms[schedule[0]][timeslot][day] = &schedule[1]
	}
	return 5 // 5 for no error in insertion
}

// ValidateSchedule validates a schedule
func (c *Chromosome) ValidateSchedule(schedule []int) int {
	if !c.IsRoomTimeslotAvailable(schedule) {
		return 1
	}
	if !c.IsInstructorTimeslotAvailable(schedule) {
		return 2
	}
	if !c.IsSectionTimeslotAvailable(schedule) {
		return 3
	}
	if c.LaunchBreak {
		if !c.IsLunchTime(schedule) {
			return 4
		}
	}
	return 0
}

// IsLunchTime checks if a schedule is during lunchtime
func (c *Chromosome) IsLunchTime(schedule []int) bool {
	subjectTimeslot := []int{}
	for timeslot := schedule[5]; timeslot < schedule[5]+schedule[6]; timeslot++ {
		subjectTimeslot = append(subjectTimeslot, timeslot)
	}
	if contains(subjectTimeslot, 6) {
		return false
	}
	return true
}

// IsRoomTimeslotAvailable checks if a room timeslot is available
func (c *Chromosome) IsRoomTimeslotAvailable(schedule []int) bool {
	//[roomId, sectionId, subjectId, instructorID, day/s, startingTS, length]
	room := c.Data.Rooms[schedule[0]]
	for timeslotRow := schedule[5]; timeslotRow < schedule[5]+schedule[6]; timeslotRow++ {
		day := schedule[4]
		if room[timeslotRow][day] != nil {
			return false
		}
	}
	return true
}

// IsSectionTimeslotAvailable checks if a section timeslot is available
func (c *Chromosome) IsSectionTimeslotAvailable(schedule []int) bool {
	sections := c.Data.Semesters
	for section := range sections {
		for timeslotRow := schedule[5]; timeslotRow < schedule[5]+schedule[6]; timeslotRow++ {
			day := schedule[4]
			if sections[section].Schedule[timeslotRow][day] != nil {
				return false
			}
		}
	}
	return true
}

// IsInstructorTimeslotAvailable checks if an instructor timeslot is available
func (c *Chromosome) IsInstructorTimeslotAvailable(schedule []int) bool {
	// Pass if no instructor is set
	if schedule[3] == 0 {
		return true
	}

	//schedule = []int{9, 1, 99, 22, 1, 13, 2}

	instructorID := schedule[3]
	timeslotStart := schedule[5]
	timeslotLength := schedule[6]
	day := schedule[4]

	instructor := c.Data.Instructors[instructorID]

	if len(instructor) > 0 {
		//fmt.Printf("Instructor Timeslot Length (first row): %d\n", len(instructor[0]))
	}

	// Check if the timeslot is within the valid range
	if timeslotStart < 0 || timeslotStart+timeslotLength > len(instructor) {
		fmt.Println("Error: Timeslot out of range")
		return false
	}

	for timeslotRow := timeslotStart; timeslotRow < timeslotStart+timeslotLength; timeslotRow++ {
		if day < 0 || day >= len(instructor[timeslotRow]) {
			fmt.Println("Error: Day out of range", day)
			return false
		}
		if instructor[timeslotRow][day] != nil {
			return false
		}
	}
	// Check if instructor can still teach
	maxLoad := c.RawData.Instructors[instructorID].Hours * 2
	for _, timeslotRow := range instructor {
		for _, day := range timeslotRow {
			if day != nil && *day != 0 { // Check if the day is not available
				maxLoad--
			}
		}
	}

	if maxLoad < 0 {
		return false
	}

	return true
}

// Helper function to check if an array contains a value
func contains(slice []int, value int) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

// ConvertJSONToSchedule converts the JSON schedule to [][]string
func ConvertJSONToSchedule(scheduleInput datatypes.JSON) ([][]string, error) {
	var schedule [][]string
	err := json.Unmarshal(scheduleInput, &schedule)
	if err != nil {
		return nil, err
	}
	return schedule, nil
}
