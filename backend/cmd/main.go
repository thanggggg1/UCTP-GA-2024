package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
	"utp-ga-2024/backend/api/route"
	"utp-ga-2024/backend/bootstrap"
	"utp-ga-2024/backend/domain"
)

func setupLogFile() {
	logFile, err := os.OpenFile("logfile.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("Failed to open log file: %v", err)
	}

	log.SetOutput(logFile)
}

func main() {
	setupLogFile()

	app := bootstrap.App()

	env := app.Env
	//Postgres connection settings
	//load from env
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		env.DBHost, env.DBPort, env.DBUser, env.DBPass, env.DBName)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Migrate the schema
	errDb := db.AutoMigrate(&domain.User{}, &domain.University{}, &domain.Room{}, &domain.Instructor{}, &domain.Course{}, &domain.Semester{}, &domain.Result{}, &domain.Setting{})
	if errDb != nil {
		return
	}
	// Asynq client setup
	redisOpt := asynq.RedisClientOpt{
		Addr: fmt.Sprintf("%s:%d", env.RedisHost, 6379),
	}
	client := asynq.NewClient(redisOpt)
	defer client.Close()

	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: fmt.Sprintf("%s:%d", env.RedisHost, 6379)},
		asynq.Config{
			// Specify how many concurrent workers to use
			Concurrency: 10,
			// Optionally specify multiple queues with different priority.
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
				"low":      1,
			},
			// See the godoc for other configuration options
		},
	)

	// ...register other handlers...

	engine := gin.Default()

	timeout := time.Duration(env.ContextTimeout) * time.Second
	route.Setup(env, timeout, db, engine, client, srv)
	errRun := engine.Run(env.ServerAddress)

	if errRun != nil {
		return
	}

}
