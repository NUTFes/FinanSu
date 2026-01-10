//go:build wireinject
// +build wireinject

package handler

import (
	"github.com/google/wire"
)

// HandlerProviderSet - Handler層のProviderセット
var HandlerProviderSet = wire.NewSet(
	NewHandler,
)
