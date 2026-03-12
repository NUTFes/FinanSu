package domain

import (
	"sort"
	"testing"
)

func TestSponsorStyleLinks_Diff(t *testing.T) {
	// テスト用ヘルパー: SponsorStyleLinkID 付きのリンクを生成
	existingLink := func(linkID, sponsorStyleID int, category string) SponsorStyleLink {
		return SponsorStyleLink{
			SponsorStyleLinkID: linkID,
			Category:           category,
			Style:              SponsorStyle{ID: sponsorStyleID},
		}
	}

	tests := []struct {
		name            string
		existing        SponsorStyleLinks
		requested       SponsorStyleLinks
		wantDeleteIDs   []int
		wantCreateCount int
		wantCreateLinks SponsorStyleLinks
	}{
		{
			name:            "既存・リクエストともに空",
			existing:        SponsorStyleLinks{},
			requested:       SponsorStyleLinks{},
			wantDeleteIDs:   nil,
			wantCreateLinks: nil,
		},
		{
			name:            "既存なし・リクエストあり → 全件追加",
			existing:        SponsorStyleLinks{},
			requested:       SponsorStyleLinks{NewSponsorStyleLink(1, "money")},
			wantDeleteIDs:   nil,
			wantCreateLinks: SponsorStyleLinks{NewSponsorStyleLink(1, "money")},
		},
		{
			name:            "既存あり・リクエストなし → 全件削除",
			existing:        SponsorStyleLinks{existingLink(10, 1, "money")},
			requested:       SponsorStyleLinks{},
			wantDeleteIDs:   []int{10},
			wantCreateLinks: nil,
		},
		{
			name:            "完全一致 → 差分なし",
			existing:        SponsorStyleLinks{existingLink(10, 1, "money")},
			requested:       SponsorStyleLinks{NewSponsorStyleLink(1, "money")},
			wantDeleteIDs:   nil,
			wantCreateLinks: nil,
		},
		{
			name: "一部削除・一部追加",
			existing: SponsorStyleLinks{
				existingLink(10, 1, "money"),
				existingLink(11, 2, "goods"),
			},
			requested: SponsorStyleLinks{
				NewSponsorStyleLink(1, "money"),
				NewSponsorStyleLink(3, "goods"),
			},
			wantDeleteIDs:   []int{11},
			wantCreateLinks: SponsorStyleLinks{NewSponsorStyleLink(3, "goods")},
		},
		{
			name: "同一キーが複数件 → 件数分マッチ・超過分削除",
			existing: SponsorStyleLinks{
				existingLink(10, 1, "money"),
				existingLink(11, 1, "money"),
			},
			requested: SponsorStyleLinks{
				NewSponsorStyleLink(1, "money"),
			},
			wantDeleteIDs:   []int{11},
			wantCreateLinks: nil,
		},
		{
			name: "同一キーが複数件 → リクエスト超過分追加",
			existing: SponsorStyleLinks{
				existingLink(10, 1, "money"),
			},
			requested: SponsorStyleLinks{
				NewSponsorStyleLink(1, "money"),
				NewSponsorStyleLink(1, "money"),
			},
			wantDeleteIDs:   nil,
			wantCreateLinks: SponsorStyleLinks{NewSponsorStyleLink(1, "money")},
		},
		{
			name: "同一キーが複数件 → 完全一致",
			existing: SponsorStyleLinks{
				existingLink(10, 1, "money"),
				existingLink(11, 1, "money"),
			},
			requested: SponsorStyleLinks{
				NewSponsorStyleLink(1, "money"),
				NewSponsorStyleLink(1, "money"),
			},
			wantDeleteIDs:   nil,
			wantCreateLinks: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotDeleteIDs, gotCreate := tt.existing.Diff(tt.requested)

			// toDeleteIDs の検証（順序不定のため sort して比較）
			sort.Ints(gotDeleteIDs)
			sort.Ints(tt.wantDeleteIDs)
			if !equalIntSlices(gotDeleteIDs, tt.wantDeleteIDs) {
				t.Errorf("toDeleteIDs = %v, want %v", gotDeleteIDs, tt.wantDeleteIDs)
			}

			// toCreate の検証
			if len(gotCreate) != len(tt.wantCreateLinks) {
				t.Errorf("toCreate len = %d, want %d", len(gotCreate), len(tt.wantCreateLinks))
				return
			}
			for i := range gotCreate {
				if gotCreate[i].Style.ID != tt.wantCreateLinks[i].Style.ID ||
					gotCreate[i].Category != tt.wantCreateLinks[i].Category {
					t.Errorf("toCreate[%d] = {StyleID:%d, Category:%s}, want {StyleID:%d, Category:%s}",
						i,
						gotCreate[i].Style.ID, gotCreate[i].Category,
						tt.wantCreateLinks[i].Style.ID, tt.wantCreateLinks[i].Category,
					)
				}
			}
		})
	}
}

func equalIntSlices(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}
