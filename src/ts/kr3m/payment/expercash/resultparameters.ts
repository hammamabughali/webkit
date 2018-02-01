module kr3m.payment.expercash
{
	export class ResultParameters
	{
		public amount:number;
		public paymentMethod:string;
		public currency:string;
		public exportKey:string;
		// public GuTID:string;
		// public GuTID2:string;
		// public GuTID2Hash:string;
		public transactionId:string;
		public owner:string;
		// public maskedPan:string;
		// public validThru:number;
		// public bankCode:string;
		// public cardScheme:string;
		public paymentStatus:string;
		// public 3dsStatus:number;
		// public hashedPanId:string;
	}
}
