module kr3m.fb
{
	export const API_VERSION = "v2.8";

	export const REQUEST_TYPE_ASKFOR = "ASKFOR";
	export const REQUEST_TYPE_GIFT = "GIFT";
	export const REQUEST_TYPE_INVITE = "INVITE";
	export const REQUEST_TYPE_SEND = "SEND";
	export const REQUEST_TYPE_TURN = "TURN";

	export const P_EMAIL = "email";
	export const P_FRIENDS = "user_friends";
	export const P_LIKES = "user_likes";
	export const P_PROFILE = "public_profile";
	export const P_PUBLISH = "publish_actions";
	export const PERMISSIONS = ["email", "user_friends", "user_likes", "public_profile", "publish_actions"];


	export class User
	{
		public id:string;
		public locale:string;
		public first_name:string;
		public last_name:string;
		public gender:string; // "male" oder "female"
		public email:string;
	}



	export class Friend
	{
		public id:string;
		public name:string;
		public picture:string;
	}



	export class PaymentResult
	{
		public payment_id:number;
		public amount:string;
		public currency:string;
		public quantity:string;
		public request_id:string;
		public status:string;
		public error:string;
		public error_code:number;
		public signed_request:string;
	}
}
