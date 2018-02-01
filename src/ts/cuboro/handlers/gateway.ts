/// <reference path="../../cuboro/services/comment.ts"/>
/// <reference path="../../cuboro/services/competition.ts"/>
/// <reference path="../../cuboro/services/gallery.ts"/>
/// <reference path="../../cuboro/services/mail.ts"/>
/// <reference path="../../cuboro/services/pdf.ts"/>
/// <reference path="../../cuboro/services/track.ts"/>
/// <reference path="../../cuboro/services/user.ts"/>
/// <reference path="../../kr3m/net2/handlers/ajaxgateway.ts"/>



module cuboro.handlers
{
	export class Gateway extends kr3m.net2.handlers.AjaxGateway
	{
		constructor()
		{
			super(/^\/gateway$/);
			this.registerObject(new cuboro.services.Comment());
			this.registerObject(new cuboro.services.Competition());
			this.registerObject(new cuboro.services.Gallery());
			this.registerObject(new cuboro.services.Mail());
			this.registerObject(new cuboro.services.Pdf());
			this.registerObject(new cuboro.services.Track());
			this.registerObject(new cuboro.services.User());
		}
	}
}
