package route

import (
	"time"

	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewCourseRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	tc := &controller.CourseController{
		CourseUseCase: usecase.NewCourseUseCase(db, timeout),
	}
	group.POST("/courses", tc.Create)
	group.GET("/courses", tc.FetchAll)
	group.GET("/courses/:id", tc.FetchByID)
	group.PUT("/courses/:id", tc.Update)
	group.DELETE("/courses/:id", tc.Delete)
	group.POST("/courses/import", tc.ImportFromXLSX)
}
