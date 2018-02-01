module kr3m.net2
{
	export const HTTP_SUCCESS = 200;
	export const HTTP_MOVED_PERMANENTLY = 301;
	export const HTTP_MOVED_TEMPORARILY = 302;
	export const HTTP_NOT_MODIFIED = 304;
	export const HTTP_ERROR_INVALID_HTTP_REQUEST = 400;
	export const HTTP_ERROR_AUTH = 401;
	export const HTTP_ERROR_DENIED = 403;
	export const HTTP_ERROR_NOT_FOUND = 404;
	export const HTTP_ERROR_INTERNAL = 500;
	export const HTTP_ERROR_CURRENTLY_UNAVAILABLE = 503;

	export const PORT_HTTP = 80;
	export const PORT_HTTPS = 443;

	export type HttpMethod = "POST"|"GET"|"DELETE";

//# SERVER
	export const RELAY_PASSWORD = "Hamster";
//# /SERVER
}
