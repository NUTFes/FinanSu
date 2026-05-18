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
func (existing GroupIDs) Diff(requested GroupIDs) (toDeleteIDs []int, toInsertIDs []int) {

	// map の準備
	existMap := make(map[int]struct{}, len(existing))
	requestMap := make(map[int]struct{}, len(requested))

	// 現在の所属グループを map に詰め込む
	for _, id := range existing {
		existMap[id] = struct{}{}
	}

	// リクエストされたグループを map に詰め込む
	for _, id := range requested {
		requestMap[id] = struct{}{}
	}

	// 削除すべきIDを探す
	for id := range existMap {
		if _, ok := requestMap[id]; !ok {
			toDeleteIDs = append(toDeleteIDs, id)
		}
	}

	// 追加すべきIDを探す
	for id := range requestMap {
		if _, ok := existMap[id]; !ok {
			toInsertIDs = append(toInsertIDs, id)
		}
	}

	// 返却
	return toDeleteIDs, toInsertIDs
}
