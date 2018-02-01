/// <reference path="../../async/polling.ts"/>
/// <reference path="../../constants.ts"/>
/// <reference path="../../payment/constants.ts"/>
/// <reference path="../../payment/expercash/expercash.ts"/>
/// <reference path="../../payment/expercash/pollparams.ts"/>
/// <reference path="../../payment/expercash/pollresult.ts"/>
/// <reference path="../../payment/expercash/popupparameters.ts"/>
/// <reference path="../../ui/iframe.ts"/>
/// <reference path="../../util/ajax.ts"/>



module kr3m.payment.expercash
{
	export class ECFrame extends kr3m.ui.IFrame
	{
		private polling:kr3m.async.Polling;
		private params:kr3m.payment.expercash.PopupParameters;
		private callback:StatusCallback;



		constructor(parent:kr3m.ui.Element)
		{
			super(parent);
			this.addClass("paymentFrame");
			this.addClass("expercash");
			this.hide();

			this.polling = new kr3m.async.Polling(1, this.onPoll.bind(this), false);
		}



		private onPoll():void
		{
			var params = new kr3m.payment.expercash.PollParams();
			params.transactionId = this.params.transactionId;
			kr3m.util.Ajax.postCall(this.params.pollUrl, (pollResult:kr3m.payment.expercash.PollResult) =>
			{
				if (pollResult.status != kr3m.TRANSACTION_STATUS_PENDING)
				{
					this.polling.stop();
					var status = (pollResult.status == kr3m.TRANSACTION_STATUS_SETTLED) ? kr3m.SUCCESS :kr3m.ERROR_CANCELLED;
					this.callback && this.callback(status);
				}
			}, params);
		}



		public onRemovedFromStage():void
		{
			super.onRemovedFromStage();
			this.polling.stop();
		}



		public pay(
			popupParams:kr3m.payment.expercash.PopupParameters,
			callback:StatusCallback):void
		{
			this.callback = callback;
			this.params = popupParams;

			var url = kr3m.payment.expercash.buildUrl(popupParams, true, "self");
			this.setUrl(url);
			this.show();

			this.polling.start();
		}



		public cancelPayment():void
		{
			this.polling.stop();
			this.callback && this.callback(kr3m.ERROR_CANCELLED);
		}
	}
}
