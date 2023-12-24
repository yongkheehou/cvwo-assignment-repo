package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func GetAllThread(c *gin.Context) {
	threads := []models.Thread{}
	initializers.DB.Model(&models.Thread{}).Find(&threads)
	c.JSON(200, &threads)
}

func GetSingleThread(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32) // base 10, 32 bits

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Thread ID",
		})

		return
	}

	var thread models.Thread

	e := initializers.DB.Model(&models.Thread{}).Where("ID=?", id).Find(&id).Error

	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No such Thread ID",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"thread": thread,
	})
}

func CreateThread(c *gin.Context) {
	// get email/pass
	var payload models.User
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
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
		Username:   payload.Username,
		Password:   string(hashedPassword),
		ProfilePic: payload.ProfilePic,
	}
	result := initializers.DB.Model(&models.User{}).Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Username already exists",
		})

		return
	}

	// respond
	c.JSON(200, &user)
}

func DeleteThread(c *gin.Context) {
	var thread models.User
	initializers.DB.Model(&models.Thread{}).Where("id = ?", c.Param("id")).Delete(&thread)
	c.JSON(200, &thread)
}

func UpdateThread(c *gin.Context) {
	var thread models.User
	initializers.DB.Model(&models.Thread{}).Where("id = ?", c.Param("id")).First(&thread) // getting user
	c.BindJSON(&thread)
	initializers.DB.Save(&thread)
	c.JSON(200, &thread)
}
