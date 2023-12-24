package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
)

func ThreadRoute(r *gin.Engine) {
	r.GET("/getthreads", controllers.GetAllThreads)
	r.GET("/thread/:id", controllers.GetSingleThread)
	r.POST("/createthread", controllers.CreateThread)
	r.DELETE("/thread/:id", controllers.DeleteThread)
	r.PUT("/thread/:id", controllers.UpdateThread)
}
