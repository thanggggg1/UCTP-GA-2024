package domain

import (
	"context"
)

type DashboardMetrics struct {
	TotalInstructors int     `json:"total_instructors"`
	TotalCourses     int     `json:"total_courses"`
	TotalRooms       int     `json:"total_rooms"`
	TotalSchedules   int     `json:"total_schedules"`
	NumIterations    int     `json:"num_iterations"`
	AverageFitness   int     `json:"average_fitness"`
	SuccessCount     int     `json:"success_count"`
	TotalCount       int     `json:"total_count"`
	SuccessRate      float64 `json:"success_rate"`
}
type ChartMetrics struct {
	Date           string `json:"date"`
	AverageFitness int    `json:"average_fitness"`
	SuccessRate    int    `json:"success_rate"`
}

type MetricsUsecase interface {
	GetMetrics(c context.Context, universityID uint) (DashboardMetrics, error)
	GetChartMetrics(ctx context.Context, universityID uint) ([]ChartMetrics, error)
}
