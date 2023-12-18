package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
)

func UserRoute(r *gin.Engine) {
	r.GET("/", controllers.GetUsers)
	r.POST("/", controllers.CreateUser)
	r.DELETE("/:id", controllers.DeleteUser)
	r.PUT("/:id", controllers.UpdateUser)
}
