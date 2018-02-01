/// <reference path="../src/ts/kr3m/async/loop.ts"/>
/// <reference path="../src/ts/kr3m/lib/node.ts"/>
/// <reference path="../src/ts/kr3m/util/log.ts"/>

/// <reference path="../src/ts/kr3m/services/paramshelper.ts"/>
/// <reference path="../src/ts/kr3m/util/file.ts"/>
/// <reference path="../src/ts/kr3m/mail/email2.ts"/>

log(" START SCRIPT");

var emailConfig = new kr3m.mail.Email2Config();

//emailConfig.transport = "smtp";
log(" emailConfig : ", emailConfig);
kr3m.mail.Email2.init(emailConfig);
var emailHammam = new kr3m.mail.Email2("hammam.abu.ghali@mailinator.com", "test test email");
emailHammam.setTemplate("public/cas/email/default.html");
emailHammam.send(function (status)
{
    log(" send mail fertig", status);
});

/**
var emailJanReichert = new kr3m.mail.Email2("jan.reichert@kr3m.com", "test test email", "hammam.abu.ghali@kr3m.com");
emailJanReichert.setTemplate("../bin/public/cas/email/default.html");
emailJanReichert.send(function (status)
{
    log(" send mail fertig", status);
});


 var emailNathalie = new kr3m.mail.Email2("nathalie.reichert@kr3m.com", "test cuboro email", "hammam.abu.ghali@kr3m.com");
 emailNathalie.setTemplate("templates/mail/default.html");
 emailNathalie.send(function (status)
 {
     log(" send mail fertig", status);
 });

 var emailRobert = new kr3m.mail.Email2("robert.krasky@kr3m.com", "test cuboro email", "hammam.abu.ghali@kr3m.com");
 emailRobert.setTemplate("templates/mail/default.html");
 emailRobert.send(function (status)
 {
     log(" send mail fertig", status);
 });

 **/




