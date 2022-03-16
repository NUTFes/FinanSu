package usecase

import(
	"context"
	rep "github.com/NUTFes/FinanSu/api/externals/repository"
	"github.com/NUTFes/FinanSu/api/internals/domain"
)

type sponsorUseCase struct{
	rep rep.SPo
}