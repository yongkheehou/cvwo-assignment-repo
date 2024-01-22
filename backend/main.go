package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/routes"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
	initializers.MigrateDB()
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://0.0.0.0", "http://localhost:3000", "http://www.kheehou-cvwo.com.s3-website-ap-southeast-1.amazonaws.com", "http://www.kheehou-cvwo.com/"},
		AllowHeaders:     []string{"Content-Type,access-control-allow-origin, access-control-allow-headers"},
		AllowCredentials: true,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
	}))

	routes.UserRoute(r)
	routes.TagRoute(r)
	routes.ThreadRoute(r)
	routes.CommentRoute(r)

	r.Run(":4000") // listen and serve on 0.0.0.0:4000
}
