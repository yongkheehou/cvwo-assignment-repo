package models

import "gorm.io/gorm"

type Thread struct {
	gorm.Model        // adds ID, CreatedAt, UpdatedAt, DeletedAt
	Title      string `gorm:"type:text"`
	Content    string
	Tag        Tag
	Likes      uint
	UserID     uint // ID of the user who posted this thread
	Comments   []Comment
}
