/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net/subserver2.ts"/>
/// <reference path="../../payment/constants.ts"/>
/// <reference path="../../payment/expercash/expercash.ts"/>
/// <reference path="../../payment/expercash/pollparams.ts"/>
/// <reference path="../../payment/expercash/pollresult.ts"/>
/// <reference path="../../payment/expercash/popupparameters.ts"/>
/// <reference path="../../payment/expercash/resultparameters.ts"/>
/// <reference path="../../services/paramshelper.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/stringex.ts"/>



module kr3m.payment.expercash
{
	export class ECSubServer extends kr3m.net.SubServer2
	{
		private securityKey:string;
		private baseUrl:string;

		protected transactionStati:any = {};



		constructor(securityKey:string, baseUrl:string)
		{
			super();
			this.securityKey = securityKey;
			this.baseUrl = baseUrl;
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			context.getRequestBody((requestContent:string) =>
			{
				var parts = kr3m.util.StringEx.getBefore(context.uri, "?").split("/");
				if (parts.length < 3)
				{
					context.setResponseContent("Internal Error");
					context.flushResponse(500);
					return callback(true);
				}

				if (parts[2] == "poll")
					return this.onPoll(context);

				var params = <any> context.getRequestQuery();
				if (!this.verifyExportKey(params, this.securityKey))
				{
					context.setResponseContent("Internal Error");
					context.flushResponse(500);
					return callback(true);
				}

				var flushFunc = this.flushResult.bind(this, context);
				switch (parts[2])
				{
					case "error":
						this.onError(params, flushFunc);
						break;

					case "update":
						this.onUpdate(params, flushFunc);
						break;

					case "notify":
						this.onNotify(params, flushFunc);
						break;

					case "return":
						this.onReturn(params, flushFunc);
						break;

					default:
						context.setResponseContent("Internal Error");
						context.flushResponse(500);
						break;
				}

				callback(true);
			});
		}



		protected getTransactionStatus(
			transactionId:string,
			callback:StatusCallback):void
		{
			var status = this.transactionStati[transactionId] || kr3m.TRANSACTION_STATUS_PENDING;
			callback(status);
		}



		protected onPoll(
			context:kr3m.net.RequestContext):void
		{
			context.getPostValues((postValues:any) =>
			{
				var helper = new kr3m.services.ParamsHelper(postValues);
				if (!helper.validateVO(new kr3m.payment.expercash.PollParams()))
				{
					context.setResponseContent("internal error");
					context.flushResponse(500);
					return;
				}

				var transactionId = postValues.transactionId;
				this.getTransactionStatus(transactionId, (status:string) =>
				{
					var result = new kr3m.payment.expercash.PollResult();
					result.status = status || kr3m.TRANSACTION_STATUS_PENDING;
					context.setResponseContent(kr3m.util.Json.encode(result));
					context.flushResponse(200);
				});
			});
		}



		protected flushResult(
			context:kr3m.net.RequestContext,
			resultMessage:string,
			resultCode?:number):void
		{
			resultCode = resultCode || 200;
			context.setResponseContent(resultMessage, "text/html; charset=utf-8", "utf8");
			context.flushResponse(resultCode);
		}



		/*
			Wird aufgerufen, wenn ein Kunde seinen Zahlungsvorgang
			abgeschlossen hat.

			Die Notify-Benachrichtigungen kommen vom Expercash-Server
			und nicht vom Browser des Kunden, d.h. sie sind vom Verhalten
			des Kunden unabhängiger, können aber etwas länger brauchen,
			bis sie ankommen.

			Siehe auch onReturn.
		*/
		protected onNotify(
			params:kr3m.payment.expercash.ResultParameters,
			callback:(resultContent:string, resultCode?:number) => void):void
		{
			// wird in abgeleiteten Klassen überschrieben
			callback("NYI");
		}



		/*
			Wird aufgerufen, wenn sich der Status einer Zahlung nach
			deren Abschluß noch ändert. Wird bei Zahlungen, die länger
			dauern, z.B. Barzahlungen.
		*/
		protected onUpdate(
			params:kr3m.payment.expercash.ResultParameters,
			callback:(resultContent:string, resultCode?:number) => void):void
		{
			// wird in abgeleiteten Klassen überschrieben
			callback("NYI");
		}



		/*
			Wird aufgerufen, wenn ein Kunde seinen Zahlungsvorgang
			abgebrochen hat (auf "abbrechen" geklickt hat).
		*/
		protected onError(
			params:kr3m.payment.expercash.ResultParameters,
			callback:(resultContent:string, resultCode?:number) => void):void
		{
			this.transactionStati[params.transactionId] = kr3m.TRANSACTION_STATUS_CANCELLED;
			callback("OK");
		}



		/*
			Wird aufgerufen, wenn ein Kunde seinen Zahlungsvorgang
			abgeschlossen hat.

			Die Notify-Benachrichtigungen kommen vom Browser des des
			Kunden und nicht vom Expercash-Server, d.h. sie sind
			weniger verlässlich aber kommen sehr zügig.

			Siehe auch onNotify.
		*/
		protected onReturn(
			params:kr3m.payment.expercash.ResultParameters,
			callback:(resultContent:string, resultCode?:number) => void):void
		{
			this.transactionStati[params.transactionId] = kr3m.TRANSACTION_STATUS_SETTLED;
			callback("OK");
		}



		private generatePopupKey(
			params:kr3m.payment.expercash.PopupParameters,
			securityKey:string):string
		{
			var parts = kr3m.payment.expercash.POPUP_KEY_PARTS;
			var data = "";
			for (var i = 0; i < parts.length; ++i)
			{
				if (params[parts[i]])
					data += params[parts[i]];
			}
			data += securityKey;
			return getMd5Hex(data);
		}



		private verifyExportKey(
			params:kr3m.payment.expercash.ResultParameters,
			securityKey:string):boolean
		{
			var parts = kr3m.payment.expercash.EXPORT_KEY_PARTS;
			var data = "";
			for (var i = 0; i < parts.length; ++i)
			{
				if (params[parts[i]])
					data += params[parts[i]];
			}
			data += securityKey;
			var hex = getMd5Hex(data);
			return hex == params.exportKey;
		}



		public fillPopupParameters(
			popupParams:kr3m.payment.expercash.PopupParameters):void
		{
			popupParams.jobId = popupParams.jobId || popupParams.transactionId;
			popupParams.returnUrl = popupParams.returnUrl || this.baseUrl + "return";
			popupParams.errorUrl = popupParams.errorUrl || this.baseUrl + "error";
			popupParams.notifyUrl = popupParams.notifyUrl || this.baseUrl + "notify";
			popupParams.popupKey = this.generatePopupKey(popupParams, this.securityKey);
			popupParams.pollUrl =  popupParams.pollUrl || this.baseUrl + "poll";

			if (popupParams.transactionId)
				this.transactionStati[popupParams.transactionId] = kr3m.TRANSACTION_STATUS_PENDING;
		}
	}
}
