module kr3m.social2
{
	export class SocialNetwork
	{
		public isAvailable():boolean
		{
			return true;
		}


		public getName():string
		{
			//wird in abgeleiteten Klassen überschrieben
			return "";
		}



		public getID():string
		{
			//wird in abgeleiteten Klassen überschrieben
			return "";
		}



		public getSMBUrl(shareText:string, shareUrl:string):string
		{
			//wird in abgeleiteten Klassen überschrieben
			return "";
		}
	}
}
