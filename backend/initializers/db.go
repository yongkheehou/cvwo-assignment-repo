package initializers

import (
	"os"

	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	POSTGRES_URL := os.Getenv("POSTGRES_URL")

	db, err := gorm.Open(postgres.Open(POSTGRES_URL), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&models.User{})

	DB = db
}
