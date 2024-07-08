package controller

import (
	"net/http"
	"strconv"
	"utp-ga-2024/backend/domain"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	UserUsecase domain.UserUsecase
}

func (uc *UserController) GetCurrentUser(c *gin.Context) {
	userIDStr, exists := c.Get("x-user-id")
	if !exists {
		c.JSON(http.StatusUnauthorized, domain.ErrorResponse{Message: "User ID not found in context"})
		return
	}

	userID, err := strconv.ParseUint(userIDStr.(string), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{Message: "Invalid user ID"})
		return
	}

	user, err := uc.UserUsecase.GetByID(c.Request.Context(), uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{Message: err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}
