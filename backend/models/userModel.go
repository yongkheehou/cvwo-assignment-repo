package models

import "gorm.io/gorm"

type User struct {
	gorm.Model // adds ID, CreatedAt, UpdatedAt, DeletedAt
	// Id         int    `json:"ID" gorm:"primary_key"`
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"password"`
	// AvatarImage
}
