package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	users := []models.User{}
	initializers.UserDB.Find(&users)
	c.JSON(200, &users)
}

func SignUp(c *gin.Context) {
	// get email/pass off req body
	var payload models.User
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read user",
		})

		return
	}

	// hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	// create the user
	user := models.User{
		Name:     payload.Name,
		Email:    payload.Email,
		Password: string(hashedPassword),
	}
	result := initializers.UserDB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create user",
		})

		return
	}

	// respond
	c.JSON(200, &user)
}

func DeleteUser(c *gin.Context) {
	var user models.User
	initializers.UserDB.Where("id = ?", c.Param("id")).Delete(&user)
	c.JSON(200, &user)
}

func UpdateUser(c *gin.Context) {
	var user models.User
	initializers.UserDB.Where("id = ?", c.Param("id")).First(&user) // getting user
	c.BindJSON(&user)
	initializers.UserDB.Save(&user)
	c.JSON(200, &user)
}
