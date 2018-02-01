module kr3m.mail
{
	export class Email2Config
	{
		public transport = "direct";
		public defaultSender = "no-reply@kr3m.com";

		public smtpHost = "localhost";
		public smtpPort = 25;
	}
}
