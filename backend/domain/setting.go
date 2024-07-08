package domain

import (
	"context"
	"gorm.io/datatypes"
)

// Setting represents the configuration for the genetic algorithm
type Setting struct {
	ID                            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	MaximumGenerations            int            `json:"maximum_generations"`
	MinimumPopulation             int            `json:"minimum_population"`
	ElitePercent                  float64        `json:"elite_percent"`
	EndingTime                    int            `json:"ending_time"`
	GenerationTolerance           int            `json:"generation_tolerance"`
	DeviationTolerance            int            `json:"deviation_tolerance"`
	LunchBreak                    bool           `json:"lunchbreak"`
	StartingTime                  int            `json:"starting_time"`
	IdleTime                      float64        `json:"idle_time"`
	SubjectPlacement              float64        `json:"subject_placement"`
	MutationRateAdjustmentTrigger float64        `json:"mutation_rate_adjustment_trigger"`
	MutationRateBase              float64        `json:"mutation_rate_base"`
	MutationRateStep              float64        `json:"mutation_rate_step"`
	MaximumPopulation             int            `json:"maximum_population"`
	MaximumFitness                float64        `json:"maximum_fitness"`
	UniversityID                  uint           `json:"university_id"`
	University                    University     `gorm:"foreignKey:UniversityID"`
	Timeslots                     datatypes.JSON `json:"timeslots"`
}

type SettingUsecase interface {
	Create(c context.Context, setting *Setting) error
	Update(c context.Context, setting *Setting) error
	Delete(c context.Context, id uint) error
	Fetch(c context.Context, universityID uint) (Setting, error)
}
