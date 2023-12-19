package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/middleware"
)

func UserRoute(r *gin.Engine) {
	r.GET("/getusers", controllers.GetUsers)
	r.GET("/:id", middleware.Auth, controllers.ProfilePage)
	r.POST("/signup", controllers.SignUp)
	r.POST("/login", controllers.Login)
	r.POST("/refresh", controllers.RefreshToken)
	r.POST("/logout", controllers.Logout)
	r.DELETE("/:id", controllers.DeleteUser)
	r.PUT("/:id", controllers.UpdateUser)
}
