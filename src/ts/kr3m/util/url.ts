/// <reference path="../util/regex.ts"/>
/// <reference path="../util/stringex.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.util
{
	export class UrlParts
	{
		public protocol = "";
		public user = "";
		public password = "";
		public domain = "";
		public port = "";
		public resource = "";
		public query = "";
		public hash = "";
	}



	/*
		Wie werden Arrays, die als Werte für Parameter übergeben wurden gehandhabt?
	*/
	export enum ArrayHandling
	{
		ToString, // sie werden einfach mit toString() in einen String umgewandelt
		Repeat, // der Parametername wird für jeden Wert wiederholt
		RepeatBrackets // wie Repeat aber es wird "[]" an den Namen angehängt
	}



	export class Url
	{
		public static mergeResource(a:string, b:string):string
		{
			if (!a)
				return b;

			if (!b)
				return a;

			if (b.charAt(0) == "/")
				return b;

			var parts = a.split("/");
			if (parts.length == 0)
				return b;

			if (parts.length > 0)
				parts.pop();

			parts = parts.concat(b.split("/"));

			for (var i = 1; i < parts.length - 1; ++i)
			{
				if (!parts[i])
					parts.splice(i--, 1);
			}

			for (var i = 1; i < parts.length; ++i)
			{
				if (parts[i] == "..")
					parts.splice(--i, 2);
			}

			return parts.join("/");
		}



		public static splitQuery(
			query:string,
			ah:ArrayHandling):{[name:string]:string|Array<string>}
		{
			var result:{[name:string]:string|Array<string>} = {};
			if (!query)
				return result;

			var parts = query.split("&");
			switch (ah)
			{
				case ArrayHandling.ToString:
					for (var i = 0; i < parts.length; ++i)
					{
						var subParts = parts[i].split("=");
						var name = subParts[0];
						var value = decodeURIComponent(subParts[1]);
						result[name] = value;
					}
					break;

				case ArrayHandling.Repeat:
					for (var i = 0; i < parts.length; ++i)
					{
						var subParts = parts[i].split("=");
						var name = subParts[0];
						var value = decodeURIComponent(subParts[1]);
						if (result[name] === undefined)
							result[name] = value;
						else if (typeof result[name] === "string")
							result[name] = [<string> result[name], value];
						else
							(<string[]> result[name]).push(value);
					}
					break;

				case ArrayHandling.RepeatBrackets:
					for (var i = 0; i < parts.length; ++i)
					{
						var subParts = parts[i].split("=");
						var name = subParts[0];
						var value = decodeURIComponent(subParts[1]);
						if (name.slice(-2) == "[]")
						{
							name = name.slice(0, -2);
							if (!result[name])
								result[name] = [];
							(<string[]> result[name]).push(value);
						}
						else
						{
							result[name] = value;
						}
					}
					break;
			}
			return result;
		}



		public static joinQuery(
			params:{[name:string]:any},
			ah:ArrayHandling):string
		{
			var parts:string[] = [];
			for (var name in params)
			{
				if (Array.isArray(params[name]))
				{
					switch (ah)
					{
						case ArrayHandling.ToString:
							parts.push(name + "=" + encodeURIComponent(params[name].toString()));
							break;

						case ArrayHandling.Repeat:
							for (var i = 0; i < params[name].length; ++i)
								parts.push(name + "=" + encodeURIComponent(params[name][i]));
							break;

						case ArrayHandling.RepeatBrackets:
							for (var i = 0; i < params[name].length; ++i)
								parts.push(name + "[]=" + encodeURIComponent(params[name][i]));
							break;
					}
				}
				else if (params[name] === undefined || params[name] === null)
				{
					parts.push(name + "=");
				}
				else
				{
					parts.push(name + "=" + encodeURIComponent(params[name].toString()));
				}
			}
			return parts.join("&");
		}



		public static mergeQuery(
			a:string,
			b:string,
			ah:ArrayHandling = ArrayHandling.ToString):string
		{
			a = a || "";
			b = b || "";

			if (a.charAt(0) == "?")
				a = a.slice(1);

			if (b.charAt(0) == "?")
				b = b.slice(1);

			var aParams = Url.splitQuery(a, ah);
			var bParams = Url.splitQuery(b, ah);
			for (var i in bParams)
				aParams[i] = bParams[i];

			return Url.joinQuery(aParams, ah);
		}



		public static mergeHash(a:string, b:string):string
		{
			a = a || "";
			b = b || "";

			if (a.charAt(0) == "#")
				a = a.slice(1);

			if (b.charAt(0) == "#")
				b = b.slice(1);

			var params:any = {};

			var aParts = a.split("&");
			var aId = "";
			for (var i = 0; i < aParts.length; ++i)
			{
				var subParts = aParts[i].split("=");
				if (subParts.length == 1)
					aId = aId || subParts[0];
				else if (subParts.length == 2)
					params[subParts[0]] = subParts[1];
			}

			var bParts = b.split("&");
			var bId = "";
			for (var i = 0; i < bParts.length; ++i)
			{
				var subParts = bParts[i].split("=");
				if (subParts.length == 1)
					bId = bId || subParts[0];
				else if (subParts.length == 2)
					params[subParts[0]] = subParts[1];
			}

			var id = aId || bId || "";
			var paramsString = Url.joinQuery(params, ArrayHandling.ToString);
			return paramsString ? id + "&" + paramsString : id;
		}



		public static merge(...urls:string[]):string
		{
			var result = new UrlParts();
			for (var i = 0; i < urls.length; ++i)
			{
				var parts = Url.parse(urls[i]);
				result.protocol = parts.protocol || result.protocol;
				if (result.user)
				{
					result.user = parts.user;
					result.password = result.password;
				}
				if (parts.domain)
				{
					result.domain = parts.domain;
					result.port = parts.port;
					result.resource = parts.resource;
				}
				else
				{
					result.resource = Url.mergeResource(result.resource, parts.resource);
				}
				result.query = Url.mergeQuery(result.query, parts.query);
				result.hash = Url.mergeHash(result.hash, parts.hash);
			}
			return Url.format(result);
		}



		public static getPath(parts:UrlParts):string
		{
			var path = parts.resource || "/";
			if (parts.query)
				path += "?" + parts.query;
			if (parts.hash)
				path += "#" + parts.hash;
			return path;
		}



		/*
			Gibt eine relative URL zurück, die von fromUrl zu toUrl
			führt. Es wird ausschließlich der Resource-Path berücksichtigt.
			Sollten die URLs auf unterschiedlichen Domains liegen oder
			sowas gibt es entsprechend unbrauchbare Ergebnisse.
		*/
//# EXPERIMENTAL
		public static getRelative(fromUrl:string, toUrl:string):string
		{
			var fromResource = Url.parse(fromUrl).resource;
			var toResource = Url.parse(toUrl).resource;
			if (fromResource == toResource)
				return "";

			if (!fromResource || fromResource == "/")
				return toResource;

			if (!toResource)
				return "/";

			if (fromResource.slice(0, 1) != "/")
				fromResource = "/" + fromResource;

			if (toResource.slice(0, 1) != "/")
				toResource = "/" + toResource;

			var fromParts = fromResource.split("/");
			var toParts = toResource.split("/");
			while (fromParts.length && fromParts[0] === toParts[0])
			{
				fromParts.shift();
				toParts.shift();
			}

			for (var i = 1; i < fromParts.length; ++i)
				toParts.unshift("..");

			return toParts.join("/");
		}
//# /EXPERIMENTAL



		/*
			Breaks the given url apart into its individual
			components (protocol, domain, resource, etc.). If
			url is not a valid url (and neither a proper part
			of an url) parse will an UrlParts object whose
			properties are all empty strings.
		*/
		public static parse(url:string):UrlParts
		{
			var parts = new UrlParts();
			if (!url)
				return parts;

			var isFile = url.slice(0, 8) == "file:///";
			if (isFile)
				url = url.slice(7);

			var parsed = StringEx.captureNamed(url, kr3m.REGEX_URL, kr3m.REGEX_URL_GROUPS);

			if (isFile)
				parsed["protocol"] = "file";

			for (var i in parsed)
			{
				if (parsed[i] !== undefined)
					parts[i] = parsed[i];
			}

			return parts;
		}



		public static format(parts:UrlParts):string
		{
			var url = "";

			if (parts.protocol)
				url += parts.protocol + "://";

			if (parts.user)
				url += parts.user + ":" + parts.password + "@";

			if (parts.domain)
			{
				url += parts.domain;
				if (parts.port)
					url += ":" + parts.port;
			}

			if (parts.resource)
			{
				if (parts.domain && parts.resource.charAt(0) != "/")
					url += "/";
				url += parts.resource;
			}

			if (parts.query)
				url += "?" + parts.query;

			if (parts.hash)
				url += "#" + parts.hash;

			return url;
		}



		public static getResourceFromUrl(url:string):string
		{
			return Url.parse(url).resource;
		}



		public static getQueryParams(
			url:string,
			ah:ArrayHandling = ArrayHandling.ToString):any
		{
			var parts = Url.parse(url);
			var params = Url.splitQuery(parts.query, ah);
			return params;
		}



		public static setQueryParams(
			url:string,
			params:any,
			ah:ArrayHandling = ArrayHandling.ToString):string
		{
			var parts = Url.parse(url);
			parts.query = Url.joinQuery(params, ah);
			return Url.format(parts);
		}



		public static addParameter(
			url:string,
			key:string,
			value:any,
			ah:ArrayHandling = ArrayHandling.ToString):string
		{
			var params = Url.getQueryParams(url, ah);
			params[key] = value;
			return Url.setQueryParams(url, params, ah);
		}



		public static addParameters(
			url:string,
			params:any,
			ah:ArrayHandling = ArrayHandling.ToString):string
		{
			var old = Url.getQueryParams(url, ah);
			for (var i in params)
				old[i] = params[i];
			return Url.setQueryParams(url, old, ah);
		}



		public static removeParameter(
			url:string,
			key:string,
			ah:ArrayHandling = ArrayHandling.ToString):string
		{
			var params = Url.getQueryParams(url, ah);
			if (typeof params[key] == "undefined")
				return url;

			delete params[key];
			return Url.setQueryParams(url, params, ah);
		}



		public static getMailToUrl(
			to:string|string[],
			subject?:string,
			body?:string,
			cc?:string|string[],
			bcc?:string|string[]):string
		{
			var receivers = typeof to == "string" ? <string> to : (<string[]> to).join(",");
			var headers:string[] = [];

			if (subject)
				headers.push("subject=" + encodeURIComponent(subject));

			if (body)
				headers.push("body=" + encodeURIComponent(body));

			if (cc !== undefined)
				headers.push("cc=" + encodeURIComponent(typeof cc == "string" ? <string> cc : (<string[]> cc).join(",")));

			if (bcc != undefined)
				headers.push("bcc=" + encodeURIComponent(typeof bcc == "string" ? <string> bcc : (<string[]> bcc).join(",")));

			var url = "mailto:" + receivers;
			if (headers.length > 0)
				url += "?" + headers.join("&");

			return url;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var U = kr3m.util.Url;
	var CS = kr3m.unittests.CaseSync;
	var AH = kr3m.util.ArrayHandling;
	new kr3m.unittests.Suite("kr3m.util.Url")

	.add(new CS("parse I", () => U.parse(""), {}))
	.add(new CS("parse II", () => U.parse("http://www.kr3m.com"), {protocol : "http", domain : "www.kr3m.com"}))
	.add(new CS("parse III", () => U.parse("http://www.kr3m.com/img/tn.png"), {protocol : "http", domain : "www.kr3m.com", resource : "/img/tn.png"}))
	.add(new CS("parse IV", () => U.parse("http://www.kr3m.com/img/tn.png?pet=Hamster&name=Hans"), {protocol : "http", domain : "www.kr3m.com", resource : "/img/tn.png", query : "pet=Hamster&name=Hans"}))
	.add(new CS("parse V", () => U.parse("http://localhost:8080"), {protocol : "http", domain : "localhost", port : "8080"}))
	.add(new CS("parse VI", () => U.parse("http://localhost:8080#name=Hans"), {protocol : "http", domain : "localhost", port : "8080", hash : "name=Hans"}))
	.add(new CS("parse VII", () => U.parse("http://localhost:8080?pet=Hamster#name=Hans"), {protocol : "http", domain : "localhost", port : "8080", query : "pet=Hamster", hash : "name=Hans"}))
	.add(new CS("parse VII", () => U.parse("http://localhost:8080/test.html?pet=Hamster#name=Hans"), {protocol : "http", domain : "localhost", port : "8080", resource : "/test.html", query : "pet=Hamster", hash : "name=Hans"}))
	.add(new CS("parse VIII", () => U.parse("//www.kr3m.com"), {domain : "www.kr3m.com"}))
	.add(new CS("parse IX", () => U.parse("https://www.kr3m.com"), {protocol : "https", domain : "www.kr3m.com"}))
	.add(new CS("parse X", () => U.parse("https://www.kr3m.com?pet=Hamster"), {protocol : "https", domain : "www.kr3m.com", query : "pet=Hamster"}))
	.add(new CS("parse XI", () => U.parse("https://www.kr3m.com#pet=Hamster"), {protocol : "https", domain : "www.kr3m.com", hash : "pet=Hamster"}))
	.add(new CS("parse XII", () => U.parse("https://www.kr3m.com?pet=Hamster#name=Hans"), {protocol : "https", domain : "www.kr3m.com", query : "pet=Hamster", hash : "name=Hans"}))
	.add(new CS("parse XIII", () => U.parse("//www.kr3m.com?pet=Hamster#name=Hans"), {domain : "www.kr3m.com", query : "pet=Hamster", hash : "name=Hans"}))
	.add(new CS("parse XIV", () => U.parse("javascript:alert('unsecure')"), {}))
	.add(new CS("parse XV", () => U.parse("steam://www.kr3m.com"), {}))
	.add(new CS("parse XVI", () => U.parse("index.html"), {resource : "index.html"}))
	.add(new CS("parse XVII", () => U.parse("//playground.das-onlinespiel.de/gamePages/1_66/xml/lang_de.xml"), {domain : "playground.das-onlinespiel.de", resource : "/gamePages/1_66/xml/lang_de.xml"}))

	.add(new CS("joinQuery I", () => U.joinQuery({}, AH.ToString), ""))
	.add(new CS("joinQuery II", () => U.joinQuery({pet : "Hamster"}, AH.ToString), "pet=Hamster"))
	.add(new CS("joinQuery III", () => U.joinQuery({pet : "Hamster", age : 7}, AH.ToString), "pet=Hamster&age=7"))
	.add(new CS("joinQuery IV", () => U.joinQuery({pet : "Hamster", age : 7, offspring : ["Hansi", "Bobbi", "Goldi"]}, AH.ToString), "pet=Hamster&age=7&offspring=Hansi%2CBobbi%2CGoldi"))
	.add(new CS("joinQuery V", () => U.joinQuery({pet : "Hamster", age : 7, offspring : ["Hansi", "Bobbi", "Goldi"]}, AH.Repeat), "pet=Hamster&age=7&offspring=Hansi&offspring=Bobbi&offspring=Goldi"))
	.add(new CS("joinQuery VI", () => U.joinQuery({pet : "Hamster", age : 7, offspring : ["Hansi", "Bobbi", "Goldi"]}, AH.RepeatBrackets), "pet=Hamster&age=7&offspring[]=Hansi&offspring[]=Bobbi&offspring[]=Goldi"))

	.add(new CS("splitQuery I", () => U.splitQuery("", AH.ToString), {}))
	.add(new CS("splitQuery II", () => U.splitQuery("pet=Hamster", AH.ToString), {pet : "Hamster"}))
	.add(new CS("splitQuery III", () => U.splitQuery("pet=Hamster&age=7", AH.ToString), <any> {pet : "Hamster", age : "7"}))
	.add(new CS("splitQuery IV", () => U.splitQuery("pet=Hamster&age=7&offspring=Hansi%2CBobbi%2CGoldi", AH.ToString), <any> {pet : "Hamster", age : "7", offspring : "Hansi,Bobbi,Goldi"}))
	.add(new CS("splitQuery V", () => U.splitQuery("pet=Hamster&age=7&offspring=Hansi&offspring=Bobbi&offspring=Goldi", AH.Repeat), <any> {pet : "Hamster", age : "7", offspring : ["Hansi", "Bobbi", "Goldi"]}))
	.add(new CS("splitQuery VI", () => U.splitQuery("pet=Hamster&age=7&offspring[]=Hansi&offspring[]=Bobbi&offspring[]=Goldi", AH.RepeatBrackets), <any> {pet : "Hamster", age : "7", offspring : ["Hansi", "Bobbi", "Goldi"]}))

	.add(new CS("setQueryParams I", () => U.setQueryParams("http://www.kr3m.com", {}), "http://www.kr3m.com"))
	.add(new CS("setQueryParams II", () => U.setQueryParams("http://www.kr3m.com", {pet : "Hamster"}), "http://www.kr3m.com?pet=Hamster"))
	.add(new CS("setQueryParams III", () => U.setQueryParams("http://www.kr3m.com", {pet : "Hamster", age : 7}), "http://www.kr3m.com?pet=Hamster&age=7"))
	.add(new CS("setQueryParams IV", () => U.setQueryParams("http://www.kr3m.com?name=Hans", {}), "http://www.kr3m.com"))
	.add(new CS("setQueryParams V", () => U.setQueryParams("http://www.kr3m.com?name=Hans", {pet : "Hamster"}), "http://www.kr3m.com?pet=Hamster"))
	.add(new CS("setQueryParams VI", () => U.setQueryParams("http://www.kr3m.com?name=Hans", {pet : "Hamster", age : 7}), "http://www.kr3m.com?pet=Hamster&age=7"))
	.add(new CS("setQueryParams VII", () => U.setQueryParams("http://www.kr3m.com", {pets : ["Hansi", "Guggi", "Goldi"]}, AH.ToString), "http://www.kr3m.com?pets=Hansi%2CGuggi%2CGoldi"))
	.add(new CS("setQueryParams VIII", () => U.setQueryParams("http://www.kr3m.com", {pets : ["Hansi", "Guggi", "Goldi"]}, AH.Repeat), "http://www.kr3m.com?pets=Hansi&pets=Guggi&pets=Goldi"))
	.add(new CS("setQueryParams IX", () => U.setQueryParams("http://www.kr3m.com", {pets : ["Hansi", "Guggi", "Goldi"]}, AH.RepeatBrackets), "http://www.kr3m.com?pets[]=Hansi&pets[]=Guggi&pets[]=Goldi"))

	.add(new CS("addParameter I", () => U.addParameter("http://www.kr3m.com", "pet", "Hamster"), "http://www.kr3m.com?pet=Hamster"))
	.add(new CS("addParameter II", () => U.addParameter("http://www.kr3m.com?name=Hans", "pet", "Hamster"), "http://www.kr3m.com?name=Hans&pet=Hamster"))
	.add(new CS("addParameter III", () => U.addParameter("http://www.kr3m.com?pet=Hans", "pet", "Hamster"), "http://www.kr3m.com?pet=Hamster"))

	.add(new CS("addParameters I", () => U.addParameters("http://www.kr3m.com", {}), "http://www.kr3m.com"))
	.add(new CS("addParameters II", () => U.addParameters("http://www.kr3m.com", {pet : "Hamster"}), "http://www.kr3m.com?pet=Hamster"))
	.add(new CS("addParameters III", () => U.addParameters("http://www.kr3m.com", {first : "Hans", last : "Wurst"}), "http://www.kr3m.com?first=Hans&last=Wurst"))
	.add(new CS("addParameters IV", () => U.addParameters("http://www.kr3m.com?pet=Hamster", {first : "Hans", last : "Wurst"}), "http://www.kr3m.com?pet=Hamster&first=Hans&last=Wurst"))
	.add(new CS("addParameters V", () => U.addParameters("http://www.kr3m.com?name=Hans", {pets : ["Hansi", "Guggi", "Goldi"]}, AH.ToString), "http://www.kr3m.com?name=Hans&pets=Hansi%2CGuggi%2CGoldi"))
	.add(new CS("addParameters VI", () => U.addParameters("http://www.kr3m.com?name=Hans", {pets : ["Hansi", "Guggi", "Goldi"]}, AH.Repeat), "http://www.kr3m.com?name=Hans&pets=Hansi&pets=Guggi&pets=Goldi"))
	.add(new CS("addParameters VII", () => U.addParameters("http://www.kr3m.com?name=Hans", {pets : ["Hansi", "Guggi", "Goldi"]}, AH.RepeatBrackets), "http://www.kr3m.com?name=Hans&pets[]=Hansi&pets[]=Guggi&pets[]=Goldi"))

	.add(new CS("removeParameter I", () => U.removeParameter("http://www.kr3m.com", "pet"), "http://www.kr3m.com"))
	.add(new CS("removeParameter II", () => U.removeParameter("http://www.kr3m.com?pet=Hamster", "pet"), "http://www.kr3m.com"))
	.add(new CS("removeParameter III", () => U.removeParameter("http://www.kr3m.com?name=Hans", "pet"), "http://www.kr3m.com?name=Hans"))
	.add(new CS("removeParameter IV", () => U.removeParameter("http://www.kr3m.com?first=Hans&pet=Hamster&last=Wurst", "pet"), "http://www.kr3m.com?first=Hans&last=Wurst"))

	.add(new CS("merge I", () => U.merge("http://www.kr3m.com"), "http://www.kr3m.com"))
	.add(new CS("merge II", () => U.merge("http://localhost:8080", "index.html"), "http://localhost:8080/index.html"))
	.add(new CS("merge III", () => U.merge("http://game-a-lot.de#Mahjong", "#&userId=123&gameId=abc"), "http://game-a-lot.de#Mahjong&userId=123&gameId=abc"))
	.add(new CS("merge IV", () => U.merge("http://spiele.seniorbook.de/spielewelt#Mahjong", "#&userId=123&gameId=abc"), "http://spiele.seniorbook.de/spielewelt#Mahjong&userId=123&gameId=abc"))
	.add(new CS("merge V", () => U.merge("http://www.kr3m.com/public/css/main.css", "reset.css"), "http://www.kr3m.com/public/css/reset.css"))
	.add(new CS("merge VI", () => U.merge("http://www.kr3m.com/public/css/main.css", "../img/main.jpg"), "http://www.kr3m.com/public/img/main.jpg"))
	.add(new CS("merge VII", () => U.merge("http://www.kr3m.com/public/css/", "../img/main.jpg"), "http://www.kr3m.com/public/img/main.jpg"))
	.add(new CS("merge VIII", () => U.merge("", "https://playground2.das-onlinespiel.de/#quizbattle", "#&_chid=229"), "https://playground2.das-onlinespiel.de/#quizbattle&_chid=229"))
	.add(new CS("merge IX", () => U.merge("http://www.senior-book.biz/spielewelt", "http://dev-playground.senior-book.biz/gamePages/8_4/img/tn_large.png?v=1.3.1.84"), "http://dev-playground.senior-book.biz/gamePages/8_4/img/tn_large.png?v=1.3.1.84"))
	.add(new CS("merge X", () => U.merge("https://cas-live.das-onlinespiel.de", "//images.seniorbook.de/datei/nutzer/medium/id/5676c570150ba07b198b45dd.jpg"), "https://images.seniorbook.de/datei/nutzer/medium/id/5676c570150ba07b198b45dd.jpg"))
	.add(new CS("merge XI", () => U.merge("https://vrbankmkb.das-onlinespiel.de/", "https://vrbankmkb.das-onlinespiel.de/", "#&tier=hamster"), "https://vrbankmkb.das-onlinespiel.de/#&tier=hamster"))
	.add(new CS("merge XII", () => U.merge("", "http://www.playboy.de/tippspiel"), "http://www.playboy.de/tippspiel"))
	.add(new CS("merge XIII", () => U.merge("http://clk.tradedoubler.com/click?p=20412&a=1878518&g=16972870&epi=0", "click?p=20412&a=1878518&g=16972870&epi=0&f=0"), "http://clk.tradedoubler.com/click?p=20412&a=1878518&g=16972870&epi=0&f=0"))

	.run();
}, 1);
//# /UNITTESTS
