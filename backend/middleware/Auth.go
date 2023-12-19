package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
)

func Auth(c *gin.Context) {
	// Get Cookie
	tokenString, err := c.Cookie("Auth")

	if err != nil {
		if err == http.ErrNoCookie {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No cookies",
			})

			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Bad request",
		})

		return
	}

	// Validate cookie
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// check for correct signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET_KEY")), nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid JWT signature",
			})

			return
		}

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "bad request",
		})

		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Check exp
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "expired JWT",
			})

			return
		}

		// Find user
		var user models.User
		initializers.UserDB.First(&user, claims["sub"])

		if user.ID == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "unauthorized user",
			})

			return
		}

		// Attach to req
		c.Set("user", user)

		// Continue
		c.Next()
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})

		return
	}
}
