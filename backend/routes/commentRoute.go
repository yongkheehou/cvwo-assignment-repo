package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
)

func CommentRoute(r *gin.Engine) {
	r.GET("/getcomments", controllers.GetAllComments)
	r.GET("/comment/:id", controllers.GetSingleComment)
	r.POST("/createcomment", controllers.CreateComment)
	r.DELETE("/comment/:id", controllers.DeleteComment)
	r.PUT("/comment/:id", controllers.UpdateComment)
}
