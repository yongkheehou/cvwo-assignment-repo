package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
)

func GetAllThreads(c *gin.Context) {
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

	e := initializers.DB.Model(&models.Thread{}).Where("ID=?", id).Find(&thread).Error

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
	var payload models.Thread
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	// create the thread
	thread := models.Thread{
		Title:    payload.Title,
		Content:  payload.Content,
		Tag:      payload.Tag,
		Likes:    payload.Likes,
		UserID:   payload.UserID,
		Comments: nil,
	}

	result := initializers.DB.Model(&models.Thread{}).Create(&thread)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Thread already exists",
		})

		return
	}

	// respond
	c.JSON(200, &thread)
}

func DeleteThread(c *gin.Context) {
	var thread models.Thread
	initializers.DB.Model(&models.Thread{}).Where("id = ?", c.Param("id")).Delete(&thread)
	c.JSON(200, &thread)
}

func UpdateThread(c *gin.Context) {
	var thread models.Thread
	initializers.DB.Model(&models.Thread{}).Where("id = ?", c.Param("id")).First(&thread) // getting thread

	if c.BindJSON(&thread) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	initializers.DB.Save(&thread)

	c.JSON(200, &thread)
}
