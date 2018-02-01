/// <reference path="../social2/facebook.ts"/>
/// <reference path="../social2/googleplus.ts"/>
/// <reference path="../social2/socialnetwork.ts"/>
/// <reference path="../social2/twitter.ts"/>
/// <reference path="../social2/whatsapp.ts"/>
/// <reference path="../ui/anchor.ts"/>



module kr3m.social2
{
	export class SocialMediaBar extends kr3m.ui.Element
	{
		private shareText:string = "";
		private shareUrl:string = window.location.toString();
		private anchors:kr3m.ui.Anchor[] = [];
		private networks:kr3m.social2.SocialNetwork[] = [];



		constructor(parent:kr3m.ui.Element)
		{
			super(parent, null, "div", {"class":"socialMediaBar"});
		}



		public addAllNetworks():void
		{
			var networks =
			[
				kr3m.social2.Facebook,
				kr3m.social2.GooglePlus,
				kr3m.social2.Twitter,
				kr3m.social2.WhatsApp
			];
			for (var i = 0; i < networks.length; ++i)
				this.addNetwork(networks[i]);
		}



		public addNetwork(networkClass:any):void
		{
			var network = <kr3m.social2.SocialNetwork> new networkClass();
			if (network.isAvailable())
			{
				var name = network.getName();
				var anchor = new kr3m.ui.Anchor(this, null, network.getSMBUrl(this.shareText, this.shareUrl), {target:"_blank",alt:name,title:name});
				new kr3m.ui.Element(anchor, null, "div", {"class":network.getID()});
				this.networks.push(network);
				this.anchors.push(anchor);
			}
		}



		private updateLinks():void
		{
			for (var i = 0; i < this.anchors.length; ++i)
				this.anchors[i].setUrl(this.networks[i].getSMBUrl(this.shareText, this.shareUrl));
		}



		public setShareText(text:string):void
		{
			this.shareText = text;
			this.updateLinks();
		}



		public setShareUrl(url:string):void
		{
			this.shareUrl = url;
			this.updateLinks();
		}
	}
}
