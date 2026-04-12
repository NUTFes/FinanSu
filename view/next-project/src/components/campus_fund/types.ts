// トップ画面のカード表示用
export interface CampusFundBuildingSummary {
  buildingName: string;
  totalPrice: number;
}

// DB/API寄りの建物情報
export interface CampusFundBuildingUnit {
  buildingId: string;
  buildingName: string;
  unitNumber: number;
}

// 教員一覧モーダル一行分の情報
export interface CampusFundTeacher {
  teacherId: string;
  buildingId: string;
  teacherName: string;
  roomName: string;
  floorNumber: string;
  unitNumber: number;
  price: number | null;
  isBlack: boolean;
}

// 階ごとの教員グループ
export interface CampusFundFloorGroup {
  floorNumber: string;
  teachers: CampusFundTeacher[];
}

// フォーム入力中のstate用
export interface CampusFundFormData {
  receivedAt: Date | null;
  price: string;
}

// APIに送る用
export interface CreateCampusDonationPayload {
  userId: number;
  teacherId: number;
  yearId: number;
  price: number;
  receivedAt: string;
}
