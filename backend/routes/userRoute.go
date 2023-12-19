package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/middleware"
)

func UserRoute(r *gin.Engine) {
	r.GET("/getusers", controllers.GetUsers)
	r.POST("/signup", controllers.SignUp)
	r.POST("/login", controllers.Login)
	r.GET("/validate", middleware.Auth, controllers.ValidateCookie)
	r.DELETE("/:id", controllers.DeleteUser)
	r.PUT("/:id", controllers.UpdateUser)
}
