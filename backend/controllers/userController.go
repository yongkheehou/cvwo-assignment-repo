package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
)

func GetUsers(c *gin.Context) {
	users := []models.User{}
	initializers.UserDB.Find(&users)
	c.JSON(200, &users)
}

func CreateUser(c *gin.Context) {
	var user models.User
	c.BindJSON(&user)
	initializers.UserDB.Create(&user)
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
