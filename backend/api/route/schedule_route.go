package route

import (
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
	"log"
	"time"
	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/domain"
	"utp-ga-2024/backend/usecase"
)

func NewScheduleRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup, client *asynq.Client, srv *asynq.Server) {
	sc := &controller.ScheduleController{
		ScheduleUsecase: usecase.NewScheduleUsecase(db, timeout, client),
	}
	// mux maps a type to a handler
	mux := asynq.NewServeMux()
	mux.HandleFunc(domain.ScheduleTask, sc.ScheduleUsecase.HandleScheduleTask)

	go func() {
		if err := srv.Run(mux); err != nil {
			log.Fatalf("could not run server: %v", err)
		}
	}()
	group.POST("/schedule", sc.CreateSchedule)
	group.GET("/schedule", sc.ClearEventStream)
}
