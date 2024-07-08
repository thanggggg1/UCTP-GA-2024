package route

import (
	"time"

	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewInstructorRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	tc := &controller.InstructorController{
		InstructorUseCase: usecase.NewInstructorUsecase(db, timeout),
	}
	// group.GET("/task", tc.Fetch)
	group.POST("/instructors", tc.Create)
	group.GET("/instructors", tc.FetchAll)
	group.GET("/instructors/:id", tc.FetchByID)
	group.PUT("/instructors/:id", tc.Update)
	group.DELETE("/instructors/:id", tc.Delete)
	group.POST("/instructors/import", tc.ImportFromXLSX)
}
