package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
)

func init() {
	initializers.LoadEnvVariables()
}

func main() {
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.Run(":4000") // listen and serve on 0.0.0.0:4000
}
