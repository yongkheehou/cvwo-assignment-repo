package models

import "gorm.io/gorm"

type Tag struct {
	gorm.Model        // adds ID, CreatedAt, UpdatedAt, DeletedAt
	Title      string `gorm:"type:text"`
}
