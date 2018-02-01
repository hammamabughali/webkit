/// <reference path="../../../tools/mysqlvogenerator/subgens/subgen.ts"/>
/// <reference path="../../../util/util.ts"/>



module kr3m.tools.mysqlvogenerator.subgens
{
	export class TabGen extends kr3m.tools.mysqlvogenerator.subgens.SubGen
	{
		private tableName:string;
		private propertyTypes:{[name:string]:string} = {};



		constructor(db:kr3m.db.MySqlDb, params:kr3m.tools.mysqlvogenerator.Parameters, tableName:string)
		{
			super(db, params);
			this.tableName = tableName;
		}



		public getTableClassName():string
		{
			return super.getClassName(this.tableName) + "Table";
		}



		public getVOClassName():string
		{
			var name = this.singular(super.getClassName(this.tableName));
			return name + "VO";
		}



		public generateStart():void
		{
			super.generateStart();

			var className = this.getTableClassName();
			this.addLocalReference(this.getVOClassName() + ".ts");
			this.out("module " + this.params.moduleName);
			this.out("{");
			this.out("\texport class " + className);
			this.out("\t{");
		}



		private generateProperties(columns:any[]):void
		{
			for (var i = 0; i < columns.length; ++i)
			{
				var type = this.getPropertyType(columns[i].Type);
				this.propertyTypes[columns[i].Field] = type;
			}
		}



		private generateGenericFunctions(
			columns:any[],
			indexes:any[],
			callback):void
		{
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
			var className = this.params.moduleName + "." + this.getVOClassName();
			var tokens:any =
			{
				className : className,
				tableName : this.tableName,
				columnNames :kr3m.util.Json.encode(kr3m.util.Util.gather(columns, "Field"))
			};
			this.out(templates.TAB_GENERIC_FUNCTIONS, tokens);

			this.out("\n\n");

			var primary = kr3m.util.Util.getBy(indexes, "name", "PRIMARY");
			if (primary && primary.parts.length == 1)
			{
				tokens.key = primary.parts[0];
				tokens.capitalKey = this.capitalKeys([tokens.key])[0];
				this.out(templates.TAB_GENERIC_FUNCTIONS_PRIMARY, tokens);
				this.out("\n\n");
				this.addGlobalReference("kr3m/dojo/gridqueryresponse.ts", []);


				var primaryCol = kr3m.util.Util.getBy(columns, "Field", primary.parts[0]);
				var pattern = /(?:var)char\((\d+)\)/i;
				var matches = primaryCol.Type.match(pattern);
				if (matches)
				{
					tokens.keyLength = matches[1];
					this.out(templates.TAB_GENERIC_INSERTS_UNIQUE_ASSOC, tokens);
				}
				else
				{
					var pattern = /(?:big)int/i;
					var matches = primaryCol.Type.match(pattern);
					if (matches)
					{
						this.out(templates.TAB_GENERIC_INSERTS_UNIQUE_NUMBER, tokens);
					}
					else
					{
						this.out(templates.TAB_GENERIC_INSERTS, tokens);
					}
				}
			}
			else
			{
				this.out(templates.TAB_GENERIC_INSERTS, tokens);
			}
			callback();
		}



		private generateGenerators(columns:any[], indexes:any[], callback:Callback):void
		{
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
			var pattern = /(?:var)char\((\d+)\)/i;
			for (var i = 0; i < indexes.length; ++i)
			{
				if (indexes[i].unique && indexes[i].parts.length == 1)
				{
					var column = kr3m.util.Util.getBy(columns, "Field", indexes[i].parts[0]);
					var matches = column.Type.match(pattern);
					if (matches)
					{
						var keyLength = matches[1];
						var key = indexes[i].parts[0];
						var capitalKey = this.capitalKeys([key])[0];

						this.out("\n\n");
						var tokens = {capitalKey : capitalKey, key : key, keyLength : keyLength};
						this.out(templates.TAB_GENERATORS, tokens);
					}
				}
			}
			callback();
		}



		private generateFinders(indexes:any[], callback:Callback):void
		{
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
			var finderNames:string[] = [];
			for (var k = 0; k < indexes.length; ++k)
			{
				var className = this.params.moduleName + "." + this.getVOClassName();
				if (indexes[k].unique && indexes[k].parts.length == 1)
				{
					var keySingular = indexes[k].parts[0];
					var keyPlural = this.plural(keySingular);
					var capitalKey = this.capitalKeys([keyPlural])[0];
					var finderName = "getBy" + capitalKey;
					if (!kr3m.util.Util.contains(finderNames, finderName))
					{
						finderNames.push(finderName);

						var tokens:any =
						{
							finderName : finderName,
							typedParams : keyPlural + ":" + this.propertyTypes[keySingular] + "[]",
							keyType : this.propertyTypes[keySingular],
							className : className,
							tableName : this.tableName,
							keyPlural : keyPlural,
							keyCapital : this.capitalKeys([keySingular])[0],
							keySingular : keySingular
						};
						this.out("\n\n");
						this.out(templates.TAB_FINDERS_UNIQUE_ASSOC, tokens);
					}
				}

				for (var i = 0; i < indexes[k].parts.length; ++i)
				{
					var isUnique = indexes[k].unique && i == indexes[k].parts.length - 1;

					var keys = indexes[k].parts.slice(0, i + 1);
					var capitalKeys = this.capitalKeys(keys);
					var finderName = "getBy" + capitalKeys.join("");
					if (kr3m.util.Util.contains(finderNames, finderName))
						continue;

					finderNames.push(finderName);

					var typedParams:string[] = [];
					var typedParamsPlural:string[] = [];
					for (var j = 0; j < keys.length; ++j)
					{
						typedParams.push(keys[j] + ":" + this.propertyTypes[keys[j]]);
						typedParamsPlural.push(this.plural(keys[j]) + ":" + this.propertyTypes[keys[j]] + "[]");
					}

					var tokens:any =
					{
						finderName : finderName,
						typedParams : typedParams.join(", "),
						className : className,
						tableName : this.tableName,
						keysComma : keys.join(", "),
						keysSql : keys.join("` = ? AND `")
					};
					this.out("\n\n");
					this.out(isUnique ? templates.TAB_FINDERS_UNIQUE : templates.TAB_FINDERS, tokens);
				}
			}
			callback();
		}



		private generateEnd():void
		{
			this.out("\t}");
			this.out("}\n\n");
			this.out("var t" + this.getTableClassName().slice(0, -5) + " = new " + this.params.moduleName + "." + this.getTableClassName() + "();");
		}



		private getFileName():string
		{
			return this.tableName.toLowerCase().replace(/[^a-z0-9]/g, "") + "table.ts";
		}



		public generate(callback:Callback):void
		{
			if (this.params.verbose)
			{
				this.logSep();
				log("\t" + this.getTableClassName());
				this.logSep();
			}
			else
			{
				log(this.getTableClassName());
			}

			this.generateStart();
			this.db.getTableColumns(this.tableName, (columns:any[]) =>
			{
				kr3m.util.Util.sortBy(columns, "Field");
				this.db.getTableIndexes(this.tableName, (indexes:any[]) =>
				{
					indexes.sort((a, b) => a.parts.join(",").localeCompare(b.parts.join(",")));
					this.generateProperties(columns);
					this.generateGenericFunctions(columns, indexes, () =>
					{
						this.generateGenerators(columns, indexes, () =>
						{
							this.generateFinders(indexes, () =>
							{
								this.generateEnd();
								this.saveToFile(this.params.targetPath + this.getFileName());
								callback();
							});
						});
					});
				});
			});
		}
	}
}
