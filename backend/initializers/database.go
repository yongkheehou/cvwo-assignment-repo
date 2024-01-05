package initializers

import (
	"os"

	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	POSTGRES_URL := os.Getenv("POSTGRES_URL")

	db, err := gorm.Open(postgres.Open(POSTGRES_URL), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	DB = db
}

func MigrateDB() {
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Tag{})
	DB.AutoMigrate(&models.Thread{})
	DB.AutoMigrate(&models.Comment{})
}
