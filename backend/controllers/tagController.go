package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
)

func GetAllTags(c *gin.Context) {
	tags := []models.Tag{}
	initializers.DB.Model(&models.Tag{}).Find(&tags)
	c.JSON(200, &tags)
}

func GetSingleTag(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32) // base 10, 32 bits

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Tag ID",
		})

		return
	}

	var tag models.Tag

	e := initializers.DB.Model(&models.Tag{}).Where("id=?", id).Find(&tag).Error

	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No such Tag",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"tag": tag,
	})
}

func CreateTag(c *gin.Context) {
	var payload models.Tag
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	// create the tag
	tag := models.Tag{
		Title: payload.Title,
	}

	result := initializers.DB.Model(&models.Tag{}).Create(&tag)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Tag already exists",
		})

		return
	}

	// respond
	c.JSON(200, &tag)
}

func DeleteTag(c *gin.Context) {
	var tag models.Tag
	initializers.DB.Model(&models.Tag{}).Where("id = ?", c.Param("id")).Delete(&tag)
	c.JSON(200, &tag)
}

func UpdateTag(c *gin.Context) {
	var tag models.Tag
	initializers.DB.Model(&models.Tag{}).Where("id = ?", c.Param("id")).First(&tag) // getting tag

	if c.BindJSON(&tag) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	initializers.DB.Save(&tag)

	c.JSON(200, &tag)
}
