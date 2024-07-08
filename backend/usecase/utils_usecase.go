package usecase

import (
	"utp-ga-2024/backend/domain"
)

// Data represents the raw data for the algorithm
type DataS struct {
	Rooms       map[int]Room
	Instructors map[int]Instructor
	Sections    map[int]Section
	Subjects    map[int]Subject
}

// Room represents a room in the algorithm
type Room struct {
	ID       int
	Name     string
	Type     string
	Schedule [][]string
}

// Instructor represents an instructor in the algorithm
type Instructor struct {
	ID       int
	Name     string
	Hours    int
	Schedule [][]string
}

// Section represents a section in the algorithm
type Section struct {
	ID       int
	Name     string
	Schedule [][]string
	Subjects []int
	Stay     int
}

// Subject represents a subject in the algorithm
type Subject struct {
	ID          int
	Name        string
	Hours       float64
	Code        string
	Description string
	Instructors []int
	Divisible   int
	Type        string
}

var defaultSchedule = [][]string{
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
	{"Available", "Available", "Available", "Available", "Available", "Available"},
}

func exampleData() DataS {
	return DataS{
		Instructors: map[int]Instructor{
			1: {
				ID:    1,
				Name:  "Emma Johnson",
				Hours: 30,
				Schedule: [][]string{
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Available"},
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Available"},
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Available"},
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Available"},
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Available"},
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Available"},
					{"Available", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
					{"Unavailable", "Unavailable", "Unavailable", "Unavailable", "Available", "Unavailable"},
				},
			},
			13: {
				ID:    13,
				Name:  "Laura Yamamoto",
				Hours: 30,
				Schedule: [][]string{
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
					{"Unavailable", "Available", "Available", "Available", "Unavailable", "Unavailable"},
				},
			},
			// Add more instructors here...
		},
		Sections: map[int]Section{
			1: {
				ID:   1,
				Name: "Main",
				Schedule: [][]string{
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
				},
				Subjects: []int{2, 98, 99},
				Stay:     0,
			},
			// Add more sections here...
		},
		Subjects: map[int]Subject{
			2: {
				ID:          2,
				Name:        "Bugatti",
				Hours:       3.0,
				Code:        "HAC-2",
				Description: "",
				Instructors: []int{1, 35, 36},
				Divisible:   0,
				Type:        "lec",
			},
			98: {
				ID:          98,
				Name:        "Luxurious Metal Chips",
				Hours:       3.0,
				Code:        "DPL-1",
				Description: "",
				Instructors: []int{21},
				Divisible:   0,
				Type:        "lec",
			},
			99: {
				ID:          99,
				Name:        "Generic Frozen Table",
				Hours:       2.0,
				Code:        "AE-4",
				Description: "",
				Instructors: []int{13, 22, 24},
				Divisible:   0,
				Type:        "lec",
			},
			// Add more subjects here...
		},
		Rooms: map[int]Room{
			8: {
				ID:   8,
				Name: "A213",
				Type: "lec",
				Schedule: [][]string{
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
				},
			},
			9: {
				ID:   9,
				Name: "A209",
				Type: "lec",
				Schedule: [][]string{
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
					{"Available", "Available", "Available", "Available", "Available", "Available"},
				},
			},
			// Add more rooms here...
		},
	}
}

// Define the default configuration
var DefaultConfig = domain.Setting{
	ID:                            99,
	MaximumGenerations:            70,
	MinimumPopulation:             61,
	ElitePercent:                  0.05,
	EndingTime:                    15,
	GenerationTolerance:           20,
	DeviationTolerance:            57,
	LunchBreak:                    false,
	StartingTime:                  0,
	IdleTime:                      0,
	SubjectPlacement:              93,
	MutationRateAdjustmentTrigger: 3.26,
	MutationRateBase:              4.5,
	MutationRateStep:              5.2,
	MaximumPopulation:             112,
	MaximumFitness:                97,
}
