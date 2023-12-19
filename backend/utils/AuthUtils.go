package utils

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func getAndValidateCookies(c *gin.Context) (*jwt.Token, error) {
	// Get Cookie
	tokenString, err := c.Cookie("Auth")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "No cookies",
		})

		return nil, http.ErrNoCookie
	}

	// Validate cookie
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// check for correct signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET_KEY")), nil
	})
}
