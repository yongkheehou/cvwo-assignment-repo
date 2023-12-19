package models

import "gorm.io/gorm"

type User struct {
	gorm.Model // adds ID, CreatedAt, UpdatedAt, DeletedAt
	// Id         int    `json:"ID" gorm:"primary_key"`
	Username   string `gorm:"not null; unique" json:"username"`
	Password   string `gorm:"not null" json:"password"`
	ProfilePic string `json:"profilePicture"`
	// Posts
	// Comments
	// Likes
}
