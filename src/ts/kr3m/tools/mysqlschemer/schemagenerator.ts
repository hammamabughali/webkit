/// <reference path="fieldoptions.ts"/>



module kr3m.tools.mysqlschemer
{
	export class SchemaGenerator
	{
		private schema:any = {};
		private currentTable:string;
		private currentColumn:string;



		public addTable(name:string):SchemaGenerator
		{
			if (this.schema[name])
				throw new Error("table " + name + " already exists in schema");

			this.schema[name] =
			{
				columns : {},
				indexes : [],
				constraints : {},
				defaultItems : []
			};
			this.currentTable = name;
			this.currentColumn = null;
			return this;
		}



		public addDefaultItem(item:any):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for default item " + item);

			this.schema[this.currentTable].defaultItems.push(item);
			return this;
		}



		public addString(
			name:string,
			options?:StringOptions):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for column " + name);

			options = options || {};
			options["jsonType"] = "string";
			options.maxLength = options.maxLength || 64;
			options.defaultValue = options.defaultValue !== undefined ? options.defaultValue : "";
			options["after"] = this.currentColumn;

			this.schema[this.currentTable].columns[name] = options;
			this.currentColumn = name;
			return this;
		}



		public addNumber(
			name:string,
			options?:NumberOptions):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for column " + name);

			options = options || {};
			options["jsonType"] = "number";
			options.float = options.float === undefined ? false : options.float;
			options.unsigned = options.unsigned === undefined ? !options.float : options.unsigned;
			options.big = options.big || false;
			options.defaultValue = options.defaultValue !== undefined ? options.defaultValue : 0;
			options["after"] = this.currentColumn;

			this.schema[this.currentTable].columns[name] = options;
			this.currentColumn = name;
			return this;
		}



		public addBoolean(
			name:string,
			options?:BooleanOptions):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for column " + name);

			options = options || {};
			options["jsonType"] = "boolean";
			options.defaultValue = options.defaultValue || false;
			options["after"] = this.currentColumn;

			this.schema[this.currentTable].columns[name] = options;
			this.currentColumn = name;
			return this;
		}



		public addDate(
			name:string,
			options?:DateOptions):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for column " + name);

			options = options || {onUpdateCurrent:false};
			options["jsonType"] = "date";
			options.onUpdateCurrent = options.onUpdateCurrent || false;
			options.defaultValue = options.defaultValue !== undefined ? options.defaultValue : "0000-00-00 00:00:00";
			options["after"] = this.currentColumn;

			this.schema[this.currentTable].columns[name] = options;
			this.currentColumn = name;
			return this;
		}



		public addEnum(
			name:string,
			options:EnumOptions):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for column " + name);

			options["jsonType"] = "enum";
			options["after"] = this.currentColumn;

			this.schema[this.currentTable].columns[name] = options;
			this.currentColumn = name;
			return this;
		}



		public addSet(
			name:string,
			options:SetOptions):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for column " + name);

			options["jsonType"] = "set";
			options["after"] = this.currentColumn;

			this.schema[this.currentTable].columns[name] = options;
			this.currentColumn = name;
			return this;
		}



		public makePrimaryKey():SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for primary key");

			if (!this.currentColumn)
				throw new Error("no column added in schema for primary key");

			this.schema[this.currentTable].indexes.push({ type : "PRIMARY", parts : [this.currentColumn]});
			return this;
		}



		public addPrimaryKey(
			columnNames:string[]):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for primary key");

			this.schema[this.currentTable].indexes.push({ type : "PRIMARY", parts : columnNames });
			return this;
		}



		public makeKey(
			options:{unique:boolean}):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for key");

			if (!this.currentColumn)
				throw new Error("no column added in schema for key");

			this.schema[this.currentTable].indexes.push(
			{
				type : options.unique ? "UNIQUE" : "INDEX",
				parts : [this.currentColumn]
			});
			return this;
		}



		public addKey(
			columnNames:string[],
			options:{unique:boolean}):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for key");

			this.schema[this.currentTable].indexes.push(
			{
				type : options.unique ? "UNIQUE" : "INDEX",
				parts : columnNames
			});
			return this;
		}



		public makeForeignKey(
			tableName:string,
			columnName:string,
			onUpdate:string = "CASCADE",
			onDelete:string = "CASCADE"):SchemaGenerator
		{
			if (!this.currentTable)
				throw new Error("no table added in schema for foreign key");

			if (!this.currentColumn)
				throw new Error("no column added in schema for foreign key");

			this.schema[this.currentTable].constraints[this.currentColumn] =
			{
				column : this.currentColumn,
				foreignTable : tableName,
				foreignColumn : columnName,
				onUpdate : onUpdate,
				onDelete : onDelete
			};
			return this;
		}



		public flush():any
		{
			var schema = this.schema;
			this.schema = {};
			this.currentTable = null;
			this.currentColumn = null;
			return schema;
		}
	}
}
