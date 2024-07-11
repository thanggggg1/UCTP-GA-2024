package route

import (
	"time"

	"utp-ga-2024/backend/api/controller"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/usecase"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewMetricsRouter(env *bootstrap.Env, timeout time.Duration, db gorm.DB, group *gin.RouterGroup) {
	tc := &controller.MetricsController{
		MetricsUsecase: usecase.NewMetricsUsecase(db, timeout),
	}
	group.GET("/metrics", tc.GetMetrics)
	group.GET("/chart-metrics", tc.GetChartMetrics)
}
