/// <reference path="../lib/external/nodemailer1/nodemailer.d.ts"/>
/// <reference path="../lib/node.ts"/>

/*
	Benötigt das nodemailer Modul und das SMTP Transport
	Modul, zu installieren über

		npm install nodemailer
		npm install nodemailer-smtp-transport

	siehe auch: https://github.com/andris9/Nodemailer

	Aktuell ist keine .d.ts Datei eingebunden weil keine
	aktuelle existiert. Es gibt nur eine für die alte
	nodemailer Version 0.7
*/

const nodemailerLib = require("nodemailer");
const smtpTransportLib = require("nodemailer-smtp-transport");



interface NodemailerAttachmentOptions
{
	filename?:string; // filename to be reported as the name of the attached file. Use of unicode is allowed.
	content?:string|Buffer; // String, Buffer or a Stream contents for the attachment
	path?:string; // path to the file if you want to stream the file instead of including it (better for larger attachments)
	href?:string; // an URL to the file (data uris are allowed as well)
	contentType?:string; // optional content type for the attachment, if not set will be derived from the filename property
	contentDisposition?:string; // optional content disposition type for the attachment, defaults to ‘attachment’
	cid?:string; // optional content id for using inline images in HTML message source
	encoding?:string; // If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: ‘base64’, ‘hex’, ‘binary’ etc. Useful if you want to use binary attachments in a JSON formatted email object.
	headers?:any; // custom headers for the attachment node. Same usage as with message headers
	raw?:string; // is an optional special value that overrides entire contents of current mime node including mime headers. Useful if you want to prepare node contents yourself
}



interface NodemailerOptions
{
	from:string; // The email address of the sender. All email addresses can be plain ‘sender@server.com’ or formatted ’“Sender Name” sender@server.com‘, see Address object for details
	to:string; // Comma separated list or an array of recipients email addresses that will appear on the To: field
	cc?:string; // Comma separated list or an array of recipients email addresses that will appear on the Cc: field
	bcc?:string; // Comma separated list or an array of recipients email addresses that will appear on the Bcc: field
	subject:string; // The subject of the email
	text?:string|Buffer|NodemailerAttachmentOptions; // The plaintext version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘/var/data/…’})
	html?:string|Buffer|NodemailerAttachmentOptions // The HTML version of the message as an Unicode string, Buffer, Stream or an attachment-like object ({path: ‘http://…‘})
	attachments:NodemailerAttachmentOptions[]; // An array of attachment objects (see Using attachments for details). Attachments can be used for embedding images as well.
}
