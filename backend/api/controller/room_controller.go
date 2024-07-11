package controller

import (
	"io"
	"io/ioutil"
	"net/http"
	"strconv"

	"utp-ga-2024/backend/domain"

	"github.com/gin-gonic/gin"
)

type RoomController struct {
	RoomUsecase domain.RoomUsecase
}

func (tc *RoomController) Create(c *gin.Context) {
	var room domain.Room

	err := c.ShouldBind(&room)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.RoomUsecase.Create(c, &room)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, room)
}

func (tc *RoomController) FetchAll(c *gin.Context) {
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
	if universityIDStr := c.Query("university_id"); universityIDStr != "" {
		universityID, err := strconv.ParseUint(universityIDStr, 10, 64)
		if err == nil {
			filter["university_id"] = uint(universityID)
		}
	}

	rooms, err := tc.RoomUsecase.FetchAll(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

func (tc *RoomController) FetchByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid ID format"})
		return
	}
	uintID := uint(id)
	room, err := tc.RoomUsecase.FetchByID(c, uintID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, room)
}

func (tc *RoomController) Update(c *gin.Context) {
	var room domain.Room
	err := c.ShouldBind(&room)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}
	err = tc.RoomUsecase.Update(c, &room)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, room)
}

func (tc *RoomController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid ID format"})
		return
	}
	uintID := uint(id)
	err = tc.RoomUsecase.Delete(c, uintID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}
	c.JSON(http.StatusOK, nil)
}
func (tc *RoomController) DeleteMany(c *gin.Context) {
	var ids struct {
		IDs []uint `json:"ids" binding:"required"`
	}

	if err := c.ShouldBindJSON(&ids); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid request"})
		return
	}

	if err := tc.RoomUsecase.DeleteMany(c, ids.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rooms deleted successfully"})
}

func (tc *RoomController) ImportFromXLSX(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "File upload error"})
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

	// Extract university ID from the request
	universityIDStr := c.PostForm("university_id")
	universityID, err := strconv.ParseUint(universityIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid university ID format"})
		return
	}

	// Call the use case to import from XLSX
	err = tc.RoomUsecase.ImportFromXLSX(c, tempFile.Name(), uint(universityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, nil)
}
