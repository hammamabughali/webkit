module kr3m
{
	export const REGEX_CRON = /((\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)(?:\s+(\S+))?)\s+(.+)/;
	export const REGEX_CRON_GROUPS = ["pattern", "minute", "hour", "dayOfMonth", "month", "dayOfWeek", "year", "command"];
	export const REGEX_DATA_URL = /^data:([^;]+)(?:;(base64)),(.+)$/;
	export const REGEX_DATA_URL_GROUPS = ["mimeType", "encoding", "payload"];
	export const REGEX_DEVICE_ID = /^[A-Z]+:/;
	export const REGEX_EMAIL = /^[0-9a-zA-Z\._\-]+@[0-9a-zA-Z][0-9a-zA-Z\-\.]+\.[a-zA-Z]+$/;
	export const REGEX_FLOAT = /^\-?\d+[,\.]?\d*$/;
	export const REGEX_INTEGER = /^\-?\d+$/;
	export const REGEX_LOCALE = /^([a-z][a-z])[_\-]?([A-Z][A-Z])$/;
	export const REGEX_LOCALE_GROUPS = ["languageId", "countryId"];
	export const REGEX_URL = /^(?:(http|https|ftp)\:)?(?:\/\/(?:(\w+):(\w+)@)?([^\/:#?]+)(?::(\d+))?)?([^\?#"':]*)(?:\?([^#"':]*))?(?:#(.*))?$/; // for security reasons we limit the allowed protocols
	export const REGEX_URL_GROUPS = ["protocol", "user", "password", "domain", "port", "resource", "query", "hash"];
	export const REGEX_USERNAME = /^[^<>"'&;\/]+$/;
	export const REGEX_WORD_SEPERATORS = /[\s!§*@$%\/\(\)\{\}=\#\[\]\\\?´`\"\'+\:;,\.<>|€\u0000]+/;
	export const REGEX_TIMESTAMP = /^(\d\d\d\d)\-(\d\d)\-(\d\d)(?:T| )(\d\d)\:(\d\d)(?:\:(\d\d)(?:\.(\d\d\d))?)?(Z|[\+\-]\d\d\:\d\d)?$/;
	export const REGEX_TIMESTAMP_GROUPS = ["year", "month", "day", "hours", "minutes", "seconds", "milliseconds", "timezone"];
}
