package controllers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/initializers"
	"github.com/yongkheehou/cvwo-assignment-repo/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func GetUsers(c *gin.Context) {
	users := []models.User{}
	initializers.UserDB.Find(&users)
	c.JSON(200, &users)
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
		Name:     payload.Name,
		Email:    payload.Email,
		Password: string(hashedPassword),
	}
	result := initializers.UserDB.Create(&user)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create user",
		})

		return
	}

	// respond
	c.JSON(200, &user)
}

func Login(c *gin.Context) {
	// get email/pass
	var payload models.User
	if c.BindJSON(&payload) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read payload",
		})

		return
	}

	// fetch user
	var user models.User
	initializers.UserDB.First(&user, "email = ?", payload.Email)

	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create JWT",
		})

		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	// revise cookie settings for production
	c.SetCookie("Auth", tokenString, 3600, "", "", false, true)

	c.JSON(200, gin.H{})
}

func ValidateCookie(c *gin.Context) {
	user, _ := c.Get("user")

	c.JSON(200, gin.H{
		"message": user,
	})
}

func DeleteUser(c *gin.Context) {
	var user models.User
	initializers.UserDB.Where("id = ?", c.Param("id")).Delete(&user)
	c.JSON(200, &user)
}

func UpdateUser(c *gin.Context) {
	var user models.User
	initializers.UserDB.Where("id = ?", c.Param("id")).First(&user) // getting user
	c.BindJSON(&user)
	initializers.UserDB.Save(&user)
	c.JSON(200, &user)
}
