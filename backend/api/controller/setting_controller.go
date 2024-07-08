package controller

import (
	"net/http"
	"strconv"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/domain"

	"github.com/gin-gonic/gin"
)

type SettingController struct {
	SettingUsecase domain.SettingUsecase
	Env            *bootstrap.Env
}

func (sc *SettingController) CreateSetting(c *gin.Context) {
	var setting domain.Setting
	if err := c.ShouldBindJSON(&setting); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	if err := sc.SettingUsecase.Create(c.Request.Context(), &setting); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, setting)
}

func (sc *SettingController) UpdateSetting(c *gin.Context) {
	var setting domain.Setting
	if err := c.ShouldBindJSON(&setting); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: err.Error()})
		return
	}

	if err := sc.SettingUsecase.Update(c.Request.Context(), &setting); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, setting)
}

func (sc *SettingController) DeleteSetting(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid ID"})
		return
	}

	if err := sc.SettingUsecase.Delete(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

func (sc *SettingController) FetchSetting(c *gin.Context) {
	universityID, err := strconv.ParseUint(c.Query("university_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid university ID"})
		return
	}

	setting, err := sc.SettingUsecase.Fetch(c.Request.Context(), uint(universityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, setting)
}
