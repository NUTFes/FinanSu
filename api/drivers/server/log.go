package server

func logFormat() string {
	var format string
	format += "time:${time_rfc3339} "
	// format += "host:${remote_ip} "
	// format += "forwardedfor:${header:x-forwarded-for} "
	// format += "req:- "
	format += "status:${status} "
	format += "method:${method} "
	format += "uri:${uri} "
	format += "size:${bytes_out} "
	format += "referer:${referer} "
	format += "ua:${user_agent} "
	format += "reqtime_ns:${latency} "
	// format += "cache:- "
	// format += "runtime:- "
	// format += "apptime:- "
	format += "vhost:${host} "
	format += "reqtime_human:${latency_human} "
	format += "x-request-id:${id} "
	format += "host:${host} \n"

	return format
}
