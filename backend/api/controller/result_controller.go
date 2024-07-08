package controller

import (
	"net/http"
	"strconv"
	"utp-ga-2024/backend/domain"

	"github.com/gin-gonic/gin"
)

type ResultController struct {
	ResultUsecase domain.ResultUsecase
}

func (rc *ResultController) FetchBySemesterAndUniversity(c *gin.Context) {
	semesterIDStr := c.Query("semester_id")
	universityIDStr := c.Query("university_id")

	semesterID, err := strconv.ParseUint(semesterIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid semester ID format"})
		return
	}

	universityID, err := strconv.ParseUint(universityIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid university ID format"})
		return
	}

	results, err := rc.ResultUsecase.FetchBySemesterAndUniversity(c, uint(semesterID), uint(universityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, results)
}
