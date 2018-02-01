/// <reference path="../../payment/expercash/popupparameters.ts"/>
/// <reference path="../../util/stringex.ts"/>



module kr3m.payment.expercash
{
	export const FRAME_URL = "https://epi.expercash.net/epi_popup2.php";

	export const PAYMENT_METHOD_CREDIT_CARD = "cc_buy";
	export const PAYMENT_METHOD_DEBIT = "elv_buy";
	export const PAYMENT_METHOD_GIROPAY = "giropay";
	export const PAYMENT_METHOD_SOFORTUEBERWEISUNG = "sofortueberweisung";

	export const PAYMENT_METHODS =
	[
		"elv_buy", "elv_authorize", "cc_buy", "cc_authorize", "invoice", "prepayment",
		"cash_on_delivery", "giropay", "abonnement_change", "sofortueberweisung",
		"ideal", "barzahlen"
	];

//# SERVER
	export const POPUP_KEY_PARTS =
	[
		"popupId", "jobId", "functionId", "transactionId", "amount", "currency",
		"paymentMethod", "returnUrl", "errorUrl", "notifyUrl", "profile",
		"customerGender", "customerPrename", "customerName", "customerAddress1",
		"customerAddress2", "customerAddress3", "customerZip", "customerCity",
		"customerCountry", "customerTelephone", "customerEmail", "customerDateOfBirth",
		"customerOrderDate", "reference", "updateUrl"
	];
//# /SERVER

//# SERVER
	export const EXPORT_KEY_PARTS =
	[
		"amount", "currency", "paymentMethod", "transactionId", "GuTID", "paymentStatus"
	];
//# /SERVER



	export function buildUrl(
		popupParams:kr3m.payment.expercash.PopupParameters,
		skipProviderResult:boolean = true,
		targetWindow:string = "self"):string
	{
		var query = kr3m.util.StringEx.joinAssoc(popupParams, "&", "=", encodeURIComponent);
		query += "&force_forwarding=" + (skipProviderResult ? 1 : 0) + "&returnUrlTarget=" + targetWindow + "&errorUrlTarget=" + targetWindow;
		return kr3m.payment.expercash.FRAME_URL + "?" + query;
	}
}
