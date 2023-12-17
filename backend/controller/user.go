package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
)

func GetUsers(c *gin.Context) {
	users := []models.User{}
	initializers.DB.Find(&users)
	c.JSON(200, &users)
}

func CreateUser(c *gin.Context) {
	var user models.User
	c.BindJSON(&user)
	initializers.DB.Create(&user)
	c.JSON(200, &user)
}

func DeleteUser(c *gin.Context) {
	var user models.User
	initializers.DB.Where("id = ?", c.Param("id")).Delete(&user)
	c.JSON(200, &user)
}

func UpdateUser(c *gin.Context) {
	var user models.User
	initializers.DB.Where("id = ?", c.Param("id")).First(&user) // getting user
	c.BindJSON(&user)
	initializers.DB.Save(&user)
	c.JSON(200, &user)
}
