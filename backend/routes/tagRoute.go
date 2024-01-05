package routes

import (
	"github.com/gin-gonic/gin"
	controllers "github.com/yongkheehou/cvwo-assignment-repo/backend/controllers"
)

func TagRoute(r *gin.Engine) {
	r.GET("/gettags", controllers.GetAllTags)
	r.GET("/tag/:id", controllers.GetSingleTag)
	r.POST("/createtag", controllers.CreateTag)
	r.DELETE("/tag/:id", controllers.DeleteTag)
	r.PUT("/tag/:id", controllers.UpdateTag)
}
