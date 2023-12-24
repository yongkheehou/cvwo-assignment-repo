package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
)

func GetAllComments(c *gin.Context) {
	comments := []models.Comment{}
	initializers.DB.Model(&models.Comment{}).Find(&comments)
	c.JSON(200, &comments)
}

func GetSingleComment(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32) // base 10, 32 bits

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Comment ID",
		})

		return
	}

	var comment models.Comment

	e := initializers.DB.Model(&models.Comment{}).Where("ID=?", id).Find(&comment).Error

	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No such Comment ID",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Comment": comment,
	})
}

func CreateComment(c *gin.Context) {
	var payload models.Comment
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	// create the Comment
	comment := models.Comment{
		Content:  payload.Content,
		ThreadID: payload.ThreadID,
		UserID:   payload.UserID,
	}

	result := initializers.DB.Model(&models.Comment{}).Create(&comment)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Comment already exists",
		})

		return
	}

	// respond
	c.JSON(200, &comment)
}

func DeleteComment(c *gin.Context) {
	var comment models.Comment
	initializers.DB.Model(&models.Comment{}).Where("id = ?", c.Param("id")).Delete(&comment)
	c.JSON(200, &comment)
}

func UpdateComment(c *gin.Context) {
	var comment models.Comment
	initializers.DB.Model(&models.Comment{}).Where("id = ?", c.Param("id")).First(&comment) // getting Comment
	c.BindJSON(&comment)
	initializers.DB.Save(&comment)
	c.JSON(200, &comment)
}
