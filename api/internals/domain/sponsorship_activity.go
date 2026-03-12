package domain

import "time"

type SponsorshipActivity struct {
	ID                int       `json:"id"`
	YearPeriodsID     int       `json:"yearPeriodsId"`
	SponsorID         int       `json:"sponsorId"`
	UserID            int       `json:"userId"`
	ActivityStatus    string    `json:"activityStatus"`
	FeasibilityStatus string    `json:"feasibilityStatus"`
	DesignProgress    string    `json:"designProgress"`
	Remarks           string    `json:"remarks"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`

	Sponsor       Sponsor            `json:"sponsor"`
	User          User               `json:"user"`
	SponsorStyles []SponsorStyleLink `json:"sponsorStyles"`
}

type SponsorStyleLink struct {
	SponsorStyleLinkID int          `json:"sponsorStyleLinkId"`
	Category           string       `json:"category"`
	Style              SponsorStyle `json:"style"`
}

type SponsorStyleLinks []SponsorStyleLink

func NewSponsorStyleLink(sponsorStyleID int, category string) SponsorStyleLink {
	return SponsorStyleLink{
		Category: category,
		Style:    SponsorStyle{ID: sponsorStyleID},
	}
}

func NewSponsorStyleLinks() SponsorStyleLinks {
	return make(SponsorStyleLinks, 0)
}

// Diff は既存リンク(receiver)とリクエストリンクを比較し、
// 削除すべき SponsorStyleLinkID リストと、新規追加すべきリンクリストを返す
func (existing SponsorStyleLinks) Diff(requested SponsorStyleLinks) (toDeleteIDs []int, toCreate SponsorStyleLinks) {
	// 既存リンクのマッチ済みフラグ（インデックス対応）
	consumed := make([]bool, len(existing))

	// リクエストの各リンクに対し、未マッチの既存リンクと照合する
	for _, req := range requested {
		matched := false
		for i, ex := range existing {
			// 同一の (sponsorStyleID, category) で未マッチのものを探す
			if !consumed[i] && ex.Style.ID == req.Style.ID && ex.Category == req.Category {
				consumed[i] = true
				matched = true
				break
			}
		}
		// 対応する既存リンクがなければ新規追加対象
		if !matched {
			toCreate = append(toCreate, req)
		}
	}

	// マッチしなかった既存リンクは削除対象
	for i, ex := range existing {
		if !consumed[i] {
			toDeleteIDs = append(toDeleteIDs, ex.SponsorStyleLinkID)
		}
	}

	return toDeleteIDs, toCreate
}
