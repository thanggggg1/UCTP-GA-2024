package route

import (
	"time"
	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewResultRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	rc := &controller.ResultController{
		ResultUsecase: usecase.NewResultUsecase(db, timeout),
	}

	group.GET("/result", rc.FetchBySemesterAndUniversity)
}
