package route

import (
	"time"
	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewUserRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	userUsecase := usecase.NewUserUsecase(db, timeout)
	uc := &controller.UserController{
		UserUsecase: userUsecase,
	}
	group.GET("/users/info", uc.GetCurrentUser)
}
