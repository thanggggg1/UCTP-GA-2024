package controller

import (
	"net/http"
	"strconv"

	"utp-ga-2024/backend/domain"

	"github.com/gin-gonic/gin"
)

type SemesterController struct {
	SemesterUsecase domain.SemesterUsecase
}

func (tc *SemesterController) Create(c *gin.Context) {
	var Semester domain.Semester

	err := c.ShouldBind(&Semester)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.SemesterUsecase.Create(c, &Semester)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Semester)
}

func (tc *SemesterController) FetchAll(c *gin.Context) {
	Semesters, err := tc.SemesterUsecase.FetchAll(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Semesters)
}

func (tc *SemesterController) FetchByID(c *gin.Context) {
	var Semester domain.Semester
	err := c.ShouldBind(&Semester)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	Semester, err = tc.SemesterUsecase.FetchByID(c, Semester.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Semester)
}

func (tc *SemesterController) Update(c *gin.Context) {
	var Semester domain.Semester
	err := c.ShouldBind(&Semester)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.SemesterUsecase.Update(c, &Semester)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Semester)
}

func (tc *SemesterController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64) // Base 10, assume 64-bit uint for safety
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid ID format"})
		return
	}
	uintID := uint(id)
	err = tc.SemesterUsecase.Delete(c, uintID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, nil)
}

func (tc *SemesterController) AssignCourses(c *gin.Context) {
	var req struct {
		SemesterID uint   `json:"semester_id"`
		CourseIDs  []uint `json:"course_ids"`
	}
	err := c.ShouldBind(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.SemesterUsecase.AssignCourses(c, req.SemesterID, req.CourseIDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, nil)
}
