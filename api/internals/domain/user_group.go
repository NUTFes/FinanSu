package domain

import (
	"time"
)

type UserGroup struct {
	ID        int       `json:"id"`
	UserID    int       `json:"userId"`
	GroupID   int       `json:"groupId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type GroupIDs []int

// 現在の所属グループと、リクエストされたグループを比較し、削除すべきIDリストと、追加すべきIDリストを計算して返す
func (existingGroupIDs GroupIDs) Diff(requestedGroupIDs GroupIDs) (groupIDsToDelete []int, groupIDsToInsert []int) {

	// map の準備
	existGroupIDMap := make(map[int]struct{}, len(existingGroupIDs))
	requestGroupIDMap := make(map[int]struct{}, len(requestedGroupIDs))

	// 現在の所属グループを map に詰め込む
	for _, id := range existingGroupIDs {
		existGroupIDMap[id] = struct{}{}
	}
	// リクエストされたグループを map に詰め込む
	for _, id := range requestedGroupIDs {
		requestGroupIDMap[id] = struct{}{}
	}

	// 削除すべきIDを探す
	for id := range existGroupIDMap {
		if _, ok := requestGroupIDMap[id]; !ok {
			groupIDsToDelete = append(groupIDsToDelete, id)
		}
	}
	// 追加すべきIDを探す
	for id := range requestGroupIDMap {
		if _, ok := existGroupIDMap[id]; !ok {
			groupIDsToInsert = append(groupIDsToInsert, id)
		}
	}

	// 返却
	return groupIDsToDelete, groupIDsToInsert
}
