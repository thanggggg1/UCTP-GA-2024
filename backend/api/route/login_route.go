package route

import (
	"gorm.io/gorm"
	"time"
	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
)

func NewLoginRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	lc := &controller.LoginController{
		LoginUsecase: usecase.NewLoginUsecase(db, timeout),
		Env:          env,
	}
	group.POST("/login", lc.Login)
}
