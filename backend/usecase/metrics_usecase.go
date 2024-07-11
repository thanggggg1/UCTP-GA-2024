package usecase

import (
	"context"
	"time"
	"utp-ga-2024/backend/domain"

	"gorm.io/gorm"
)

type metricsUsecase struct {
	db             gorm.DB
	contextTimeout time.Duration
}

func NewMetricsUsecase(db gorm.DB, timeout time.Duration) domain.MetricsUsecase {
	return &metricsUsecase{
		db:             db,
		contextTimeout: timeout,
	}
}

func (mu *metricsUsecase) GetMetrics(ctx context.Context, universityID uint) (domain.DashboardMetrics, error) {
	var metrics domain.DashboardMetrics
	var totalInstructors, totalCourses, totalRooms, totalSchedules int64

	ctx, cancel := context.WithTimeout(ctx, mu.contextTimeout)
	defer cancel()

	// Count total instructors
	if err := mu.db.Model(&domain.Instructor{}).Where("university_id = ?", universityID).Count(&totalInstructors).Error; err != nil {
		return metrics, err
	}
	metrics.TotalInstructors = int(totalInstructors)

	// Count total courses
	if err := mu.db.Model(&domain.Course{}).Where("university_id = ?", universityID).Count(&totalCourses).Error; err != nil {
		return metrics, err
	}
	metrics.TotalCourses = int(totalCourses)

	// Count total rooms
	if err := mu.db.Model(&domain.Room{}).Where("university_id = ?", universityID).Count(&totalRooms).Error; err != nil {
		return metrics, err
	}
	metrics.TotalRooms = int(totalRooms)

	// Count total schedules created
	if err := mu.db.Model(&domain.Result{}).Where("university_id = ?", universityID).Count(&totalSchedules).Error; err != nil {
		return metrics, err
	}
	metrics.TotalSchedules = int(totalSchedules)

	// Performance Metrics
	var results []domain.Result
	if err := mu.db.Model(&domain.Result{}).Where("university_id = ?", universityID).Find(&results).Error; err != nil {
		return metrics, err
	}

	var totalIterations, totalFitness, successCount, totalCount int

	for _, result := range results {
		totalIterations += result.NumIterations
		totalFitness += result.AverageFitness * result.NumIterations
		successCount += result.SuccessCount
		totalCount += result.TotalCount
	}

	if totalIterations > 0 {
		metrics.NumIterations = totalIterations
		metrics.AverageFitness = int(float64(totalFitness) / float64(totalIterations))
	} else {
		metrics.NumIterations = 0
		metrics.AverageFitness = 0
	}

	metrics.SuccessCount = successCount
	metrics.TotalCount = totalCount
	if totalCount > 0 {
		metrics.SuccessRate = float64(successCount) / float64(totalCount) * 100
	} else {
		metrics.SuccessRate = 0
	}

	return metrics, nil
}
func (mu *metricsUsecase) GetChartMetrics(ctx context.Context, universityID uint) ([]domain.ChartMetrics, error) {
	var results []domain.Result
	var chartMetrics []domain.ChartMetrics

	ctx, cancel := context.WithTimeout(ctx, mu.contextTimeout)
	defer cancel()

	if err := mu.db.Model(&domain.Result{}).Where("university_id = ?", universityID).Find(&results).Error; err != nil {
		return chartMetrics, err
	}

	for _, result := range results {
		chartMetrics = append(chartMetrics, domain.ChartMetrics{
			Date:           result.Timestamp.Format("2006-01-02"),
			AverageFitness: result.AverageFitness,
			SuccessRate:    int(result.SuccessRate),
		})
	}

	return chartMetrics, nil
}
