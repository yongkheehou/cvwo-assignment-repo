package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
)

func CommentRoute(r *gin.Engine) {
	r.GET("/getcomments", controllers.GetAllThreads)
	r.GET("/comment/:id", controllers.GetSingleThread)
	r.POST("/createcomment", controllers.CreateThread)
	r.DELETE("/comment/:id", controllers.DeleteThread)
	r.PUT("/comment/:id", controllers.UpdateThread)
}
