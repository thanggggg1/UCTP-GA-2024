package route

import (
	"time"
	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewSettingRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	sc := &controller.SettingController{
		SettingUsecase: usecase.NewSettingUsecase(db, timeout),
		Env:            env,
	}
	group.POST("/settings", sc.CreateSetting)
	group.PUT("/settings/:id", sc.UpdateSetting)
	group.DELETE("/settings/:id", sc.DeleteSetting)
	group.GET("/settings", sc.FetchSetting)
}
