package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"utp-ga-2024/backend/domain"
)

type ScheduleController struct {
	ScheduleUsecase domain.ScheduleUsecase
}

func (sc *ScheduleController) CreateSchedule(c *gin.Context) {
	var req struct {
		UniversityID uint `json:"university_id"`
		SemesterID   uint `json:"semester_id"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := sc.ScheduleUsecase.UpsertScheduleTask(req.UniversityID, req.SemesterID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "task enqueued"})
}

func (sc *ScheduleController) ClearEventStream(c *gin.Context) {
	err := sc.ScheduleUsecase.ClearEventStream()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "stream cleared"})
}
