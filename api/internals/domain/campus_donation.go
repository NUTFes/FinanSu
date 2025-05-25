package domain

type CampusDonationBuilding struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}

// CampusDonationRecord は、１行分のフラットな寄付データを表します
type CampusDonationRecord struct {
	BuildingId   int     `json:"building_id"`
	BuildingName *string `json:"building_name,omitempty"`
	FloorId      *int    `json:"floor_id,omitempty"`
	FloorNumber  string  `json:"floor_number"`
	TeacherId    int     `json:"teacher_id"`
	TeacherName  string  `json:"teacher_name"`
	RoomName     string  `json:"room_name"`
	Price        int     `json:"price"`
	IsBlack      *bool   `json:"is_black,omitempty"`
}
