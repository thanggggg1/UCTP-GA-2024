package route

import (
	"time"

	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewSemesterRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	tc := &controller.SemesterController{
		SemesterUsecase: usecase.NewSemesterUseCase(db, timeout),
	}
	// group.GET("/task", tc.Fetch)
	group.POST("/semesters", tc.Create)
	group.GET("/semesters", tc.FetchAll)
	group.GET("/semesters/:id", tc.FetchByID)
	group.PUT("/semesters/:id", tc.Update)
	group.DELETE("/semesters/:id", tc.Delete)
	group.POST("/semesters/assign-courses", tc.AssignCourses)
}
