package controllers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func GetAllUsers(c *gin.Context) {
	users := []models.User{}
	initializers.DB.Model(&models.User{}).Find(&users)
	c.JSON(200, &users)
}

func GetSingleUser(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32) // base 10, 32 bits

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid User ID",
		})

		return
	}

	var user models.User

	e := initializers.DB.Model(&models.User{}).Where("ID=?", id).Find(&user).Error

	if e != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No such User ID",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func SignUp(c *gin.Context) {
	// get email/pass
	var payload models.User
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	// hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to hash password",
		})

		return
	}

	// create the user
	user := models.User{
		Username:   payload.Username,
		Password:   string(hashedPassword),
		ProfilePic: payload.ProfilePic,
	}
	result := initializers.DB.Model(&models.User{}).Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Username already exists",
		})

		return
	}

	// respond
	c.JSON(200, &user)
}

func Login(c *gin.Context) {
	// get email/pass
	var payload models.Payload
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	// fetch user
	var user models.User
	initializers.DB.Model(&models.User{}).First(&user, "username = ?", payload.Username)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid username or password",
		})

		return
	}

	// compare payload pass with saved pass hash
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password is wrong",
		})

		return
	}

	// generate JWT and return it
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create JWT",
		})

		return
	}

	c.SetSameSite(http.SameSiteLaxMode)

	// revise cookie settings for production
	time, err := strconv.Atoi(os.Getenv("ACCESS_TOKEN_DURATION"))

	if err != nil {
		c.JSON(http.StatusInternalServerError, "check environment ACCESS_TOKEN_DURATION")
	}

	c.SetCookie("Auth", tokenString, time, "", "", true, true)

	c.JSON(200, gin.H{
		"login token": tokenString,
	})
}

func Logout(c *gin.Context) {
	c.SetCookie("Auth", "", -1, "", "", true, true)
}

func ProfilePage(c *gin.Context) {
	user, _ := c.Get("user")

	c.JSON(200, gin.H{
		"message": user,
	})
}

func RefreshToken(c *gin.Context) {
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
		// Find user
		var user models.User
		initializers.DB.Model(&models.User{}).First(&user, claims["sub"])

		if user.ID == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "unauthorized user",
			})

			return
		}

		// generate JWT and return it
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": user.ID,
			"exp": time.Now().Add(time.Hour).Unix(),
		})

		tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create JWT",
			})

			return
		}

		c.SetSameSite(http.SameSiteLaxMode)

		// revise cookie settings for production
		time, err := strconv.Atoi(os.Getenv("REFRESH_TOKEN_DURATION"))

		if err != nil {
			c.JSON(http.StatusInternalServerError, "check environment REFRESH_TOKEN_DURATION")
		}

		c.SetCookie("Refresh", tokenString, time, "", "", true, true)

		c.JSON(200, gin.H{
			"refresh token": tokenString,
		})

	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})

		return
	}
}

func DeleteUser(c *gin.Context) {
	var user models.User
	initializers.DB.Model(&models.User{}).Where("id = ?", c.Param("id")).Delete(&user)
	c.JSON(200, &user)
}

func UpdateUser(c *gin.Context) {
	var user models.User
	initializers.DB.Model(&models.User{}).Where("id = ?", c.Param("id")).First(&user) // getting user
	c.BindJSON(&user)
	initializers.DB.Save(&user)
	c.JSON(200, &user)
}
