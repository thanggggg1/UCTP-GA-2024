package domain

type RoomType string

const (
	LEC RoomType = "LEC"
	LAB RoomType = "LAB"
	ANY RoomType = "ANY"
)

type StatusType string

const (
	ACTIVE   StatusType = "ACTIVE"
	INACTIVE StatusType = "INACTIVE"
)

type UserRole string

const (
	ADMIN      UserRole = "ADMIN"
	INSTRUCTOR UserRole = "INSTRUCTOR"
	//ROOM_MANAGER UserRole = "ROOM_MANAGER"
)
