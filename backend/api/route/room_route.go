package route

import (
	"time"

	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRoomRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	tc := &controller.RoomController{
		RoomUsecase: usecase.NewRoomUseCase(db, timeout),
	}
	// group.GET("/task", tc.Fetch)
	group.POST("/rooms", tc.Create)
	group.GET("/rooms", tc.FetchAll)
	group.GET("/rooms/:id", tc.FetchByID)
	group.PUT("/rooms/:id", tc.Update)
	group.DELETE("/rooms/:id", tc.Delete)
	group.POST("/rooms-delete", tc.DeleteMany)
	group.POST("/rooms/import", tc.ImportFromXLSX)
}
