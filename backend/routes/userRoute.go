package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
)

func UserRoute(r *gin.Engine) {
	r.GET("/getusers", controllers.GetUsers)
	r.POST("/signup", controllers.SignUp)
	r.DELETE("/:id", controllers.DeleteUser)
	r.PUT("/:id", controllers.UpdateUser)
}
