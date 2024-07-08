package route

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
	"time"
	"utp-ga-2024/backend/api/middleware"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/sse"
)

func Setup(env *bootstrap.Env, timeout time.Duration, db *gorm.DB, router *gin.Engine, client *asynq.Client, srv *asynq.Server) {
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Update with your frontend's origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	publicRouter := router.Group("")
	// All Public APIs
	NewSignupRouter(env, timeout, *db, publicRouter)
	NewLoginRouter(env, timeout, *db, publicRouter)
	NewRefreshTokenRouter(env, timeout, *db, publicRouter)

	protectedRouter := router.Group("")
	//Middleware to verify AccessToken
	protectedRouter.Use(middleware.JwtAuthMiddleware(env.AccessTokenSecret))
	// All Private APIs
	// NewProfileRouter(env, timeout, *db, protectedRouter)
	// NewTaskRouter(env, timeout, *db, protectedRouter)
	NewRoomRouter(env, timeout, *db, protectedRouter)
	NewInstructorRouter(env, timeout, *db, protectedRouter)
	NewCourseRouter(env, timeout, *db, protectedRouter)
	NewSemesterRouter(env, timeout, *db, protectedRouter)
	NewResultRouter(env, timeout, *db, protectedRouter)
	NewSettingRouter(env, timeout, *db, protectedRouter)
	NewUserRouter(env, timeout, *db, protectedRouter)
	NewScheduleRouter(env, timeout, *db, publicRouter, client, srv)
	// SSE endpoint
	router.GET("/events", func(c *gin.Context) {
		sse.SSEHandler(c.Writer, c.Request)
	})
}
