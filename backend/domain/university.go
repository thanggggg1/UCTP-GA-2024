package domain

type University struct {
	ID      uint   `gorm:"primaryKey;autoIncrement"`
	Name    string `gorm:"size:255"`
	Address string `gorm:"size:255"`
}
