package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/controller"
)

func UserRoute(r *gin.Engine) {
	r.GET("/", controller.GetUsers)
	r.POST("/", controller.CreateUser)
	r.DELETE("/:id", controller.DeleteUser)
	r.PUT("/:id", controller.UpdateUser)
}
