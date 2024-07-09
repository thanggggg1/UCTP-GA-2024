package controller

import (
	"github.com/gin-gonic/gin"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"utp-ga-2024/backend/domain"
)

type CourseController struct {
	CourseUseCase domain.CourseUsecase
}

func (tc *CourseController) Create(c *gin.Context) {
	var Course domain.Course

	err := c.ShouldBind(&Course)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.CourseUseCase.Create(c, &Course)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Course)
}

func (tc *CourseController) FetchAll(c *gin.Context) {
	filter := make(map[string]interface{})
	if code := c.Query("code"); code != "" {
		filter["code"] = code
	}
	if name := c.Query("name"); name != "" {
		filter["name"] = name
	}
	if status := c.Query("status"); status != "" {
		filter["status"] = status
	}

	courses, err := tc.CourseUseCase.FetchAll(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, courses)
}

func (tc *CourseController) FetchByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64) // Base 10, assume 64-bit uint for safety
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid ID format"})
		return
	}
	uintID := uint(id)
	Course, err := tc.CourseUseCase.FetchByID(c, uintID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Course)
}

func (tc *CourseController) Update(c *gin.Context) {
	var Course domain.Course
	err := c.ShouldBind(&Course)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.CourseUseCase.Update(c, &Course)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, Course)

}
func (tc *CourseController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64) // Base 10, assume 64-bit uint for safety
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid ID format"})
		return
	}
	uintID := uint(id)
	err = tc.CourseUseCase.Delete(c, uintID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Course deleted"})
}
func (tc *CourseController) ImportFromXLSX(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "File upload error"})
		return
	}

	universityIDStr := c.PostForm("university_id")
	if universityIDStr == "" {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "university_id is required"})
		return
	}
	universityID, err := strconv.ParseUint(universityIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid university_id format"})
		return
	}

	// Open the uploaded file
	fileContent, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	defer fileContent.Close()

	// Create a temporary file to read the content
	tempFile, err := ioutil.TempFile("", "upload-*.xlsx")
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	defer tempFile.Close()

	_, err = io.Copy(tempFile, fileContent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	// Call the use case to import from XLSX
	err = tc.CourseUseCase.ImportFromXLSX(c, tempFile.Name(), uint(universityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, nil)
}
