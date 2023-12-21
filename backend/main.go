package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/routes"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectUserDB()
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://0.0.0.0"},
		AllowHeaders:     []string{"Content-Type,access-control-allow-origin, access-control-allow-headers"},
		AllowCredentials: true,
	}))

	routes.UserRoute(r)

	r.Run(":4000") // listen and serve on 0.0.0.0:4000
}
