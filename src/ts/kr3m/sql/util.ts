module kr3m.sql
{
	/*
		Filtert ungültige SQL-Anweisungen aus dem gegebenen SQL-Skript,
		z.B. Anweisungen eine Datenbank anzulegen oder eine andere Datenbank
		zu verwenden als die aktuelle.
	*/
	export function clean(sql:string):string
	{
		sql = sql
			.replace(/CREATE\s+SCHEMA\s[^;]*;?/gi, "")
			.replace(/\bUSE\s+[^;]*;?/gi, "")
			.replace(/`[^`]+`.(`[^`]+`)/g, "$1");
		return sql;
	}



	/*
		Entfernt alle Kommentarzeilen aus der SQL-Anweisung
	*/
	export function stripComments(sql:string):string
	{
		sql = sql
			.replace(/\/\*!.*?\*\//g, "")
			.replace(/\r?\n\-\-.*?\r?\n/g, "")
			.replace(/^\-\-\s.*?\r?\n/, "")
			.replace(/\-\-\s.*?$/, "");
		return sql;
	}
}
