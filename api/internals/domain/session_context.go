package domain

// AuthenticatedUserContextKey is the echo.Context key under which the
// session-authenticated user is stored by the session auth middleware.
//
// This lives in domain (not in drivers/server) so that handlers can read it
// without creating a handler -> server -> handler import cycle
// (drivers/server already imports externals/handler).
const AuthenticatedUserContextKey = "authenticatedUser"
