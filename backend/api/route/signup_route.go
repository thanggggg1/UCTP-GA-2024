package route

import (
	"gorm.io/gorm"
	"time"
	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
)

func NewSignupRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	sc := controller.SignupController{
		SignupUsecase: usecase.NewSignupUsecase(db, timeout),
		Env:           env,
	}
	group.POST("/signup", sc.Signup)
}
