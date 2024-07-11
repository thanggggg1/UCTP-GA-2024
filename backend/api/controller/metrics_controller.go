package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"utp-ga-2024/backend/domain"
)

type MetricsController struct {
	MetricsUsecase domain.MetricsUsecase
}

func NewMetricsController(mu domain.MetricsUsecase) *MetricsController {
	return &MetricsController{
		MetricsUsecase: mu,
	}
}

func (mc *MetricsController) GetMetrics(c *gin.Context) {
	universityIDStr := c.Query("university_id")
	universityID, err := strconv.ParseUint(universityIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid university ID"})
		return
	}

	metrics, err := mc.MetricsUsecase.GetMetrics(c, uint(universityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, metrics)
}
func (mc *MetricsController) GetChartMetrics(c *gin.Context) {
	universityID, err := strconv.ParseUint(c.Query("university_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid university_id"})
		return
	}

	chartMetrics, err := mc.MetricsUsecase.GetChartMetrics(c, uint(universityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, chartMetrics)
}
