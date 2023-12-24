package models

import "gorm.io/gorm"

type Comment struct {
	gorm.Model // adds ID, CreatedAt, UpdatedAt, DeletedAt
	Content    string
	ThreadID   uint
	UserID     uint
}
