module kr3m.db
{
	export class MySqlDbConfig
	{
		public host = "localhost";
		public user = "root";
		public password = "";
		public database = "";

		public multipleStatements = true; // sollen mehrere SQL-Anweisungen pro Query möglich sein (schneller - Batchanweisungen) oder nicht (sicherer - kein Sql-Injection)
		public connectionLimit = 10; // wie viele MySql-Verbindungen können gleichzeitig geöffnet sein?
		public supportBigNumbers = false; // sollte auf true gesetzt werden, wenn BIGINT-Daten verwendet werden
	}
}
