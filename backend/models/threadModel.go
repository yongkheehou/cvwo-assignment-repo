package models

import "gorm.io/gorm"

type Thread struct {
	gorm.Model        // adds ID, CreatedAt, UpdatedAt, DeletedAt
	Title      string `gorm:"type:text"`
	Content    string
	Tags       string
	Likes      uint
	UserID     uint
	Comments   []Comment
}
