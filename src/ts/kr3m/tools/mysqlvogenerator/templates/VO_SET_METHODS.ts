		public get##setNameCapital##():string[]
		{
			return this.##setName##.split(",").filter(p => p);
		}



		public has##setNameSingularCapital##(
			##setNameSingularLower##:string):boolean
		{
			if (##resultClassName##.##setValuesArray##.indexOf(##setNameSingularLower##) < 0)
				throw new Error("invalid flag name: " + ##setNameSingularLower##);

			var ##setName## = this.##setName##.split(",").filter(p => p);
			return ##setName##.indexOf(##setNameSingularLower##) >= 0;
		}



		public set##setNameSingularCapital##(
			##setNameSingularLower##:string):void
		{
			if (##resultClassName##.##setValuesArray##.indexOf(##setNameSingularLower##) < 0)
				throw new Error("invalid flag name: " + ##setNameSingularLower##);

			var ##setName## = this.##setName##.split(",").filter(p => p);
			##setName##.push(##setNameSingularLower##);
			this.##setName## = ##setName##.join(",");
		}



		public clear##setNameSingularCapital##(
			##setNameSingularLower##:string):void
		{
			if (##resultClassName##.##setValuesArray##.indexOf(##setNameSingularLower##) < 0)
				throw new Error("invalid flag name: " + ##setNameSingularLower##);

			var ##setName## = this.##setName##.split(",").filter(p => p);
			##setName## = ##setName##.filter(p => p != ##setNameSingularLower##);
			this.##setName## = ##setName##.join(",");
		}
