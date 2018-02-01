/// <reference path="../../async/criticalsection.ts"/>
/// <reference path="../../async/delayed.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../constants.ts"/>
/// <reference path="../../lib/fb/sdk.ts"/>
/// <reference path="../../lib/fb/types.ts"/>
/// <reference path="../../util/ajax.ts"/>
/// <reference path="../../util/browser.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/trysafe.ts"/>
/// <reference path="../../util/util.ts"/>



module kr3m.fb
{
	/*
		Eine Wrapper- bzw. Bequemlichkeitsklasse
		zum einfacheren Arbeiten mit Facebook.
	*/
	export class Wrapper
	{
		private static needsInit:boolean = true;
		private static delayed = new kr3m.async.Delayed();
		private static permissionCritSec = new kr3m.async.CriticalSection();

		private appId:string;
		private namespace:string;
		private languageId:string;

		private eventListeners:{[eventName:string]:Array<(data:any) => void>} = {};



		constructor(appId:string, namespace?:string, languageId?:string)
		{
			this.appId = appId;
			this.namespace = namespace;
			this.languageId = languageId;
		}



		private callDelayed(func:() => void):void
		{
			Wrapper.delayed.call(func);
			if (Wrapper.needsInit)
			{
				Wrapper.needsInit = false;
				if (!this.appId)
				{
					kr3m.util.Log.logError("no facebook app ID found");
					return;
				}

				kr3m.fb.initFacebook(this.appId, () =>
				{
					Wrapper.delayed.execute();
				}, null, this.languageId);
			}
		}



		public isConnected(
			callback:(isConnected:boolean) => void):void
		{
			this.callDelayed(() =>
			{
				FB.getLoginStatus((statusResponse:any) =>
				{
					callback(statusResponse.status == "connected");
				});
			});
		}



		/*
			Überprüft ob der User in Facebook eingeloggt ist und
			die App freigegeben hat.

			Falls beides erfüllt ist, wird callback mit true als
			Parameter aufgerufen.

			Ist er eingeloggt aber hat die App nicht freigegeben,
			wird der entsprechende Freigabedialog von Facebook
			angezeigt.

			Ist er nicht eingeloggt wird der Facebook-Login-Dialog
			angezeigt.

			Sobald irgendein Dialog angezeigt wird, wird der Aufruf
			der Callback-Funktion so lange hinausgezögert bis der
			User sich eingeloggt und die App freigegeben hat. In
			diesem Fall wird callback(true) aufgerufen. Bricht der
			User bei irgendeinem der Schritte ab, so wird statt
			dessen callback(false) aufgerufen.

			Über permissions können optional noch weitere erforderliche
			Permissions übergeben werden, die beim Login dann gleich mit
			abgefragt werden. Die Permissions müssen mit Komma getrennt
			als String angegeben werden.
		*/
		public connect(
			callback:(isLoggedIn:boolean) => void,
			permissions?:string):void
		{
			this.callDelayed(() =>
			{
				this.isConnected((isConnected:boolean) =>
				{
					if (isConnected)
						return callback(true);

					var options:Object;
					if (permissions && permissions != "")
						options = {scope : permissions};

					FB.login((loginResponse:any) =>
					{
						callback(!!loginResponse.authResponse);
					}, options);
				});
			});
		}



		public logout(
			callback?:() => void):void
		{
			this.callDelayed(() =>
			{
				FB.logout(callback)
			});
		}



		public on(
			eventName:string,
			listener:(result:any) => void):void
		{
			this.callDelayed(() =>
			{
				var listeners = this.eventListeners[eventName];
				if (!listeners)
				{
					listeners = [];
					this.eventListeners[eventName] = listeners;
					FB.Event.subscribe(eventName, this.handleEvent.bind(this, eventName));
				}
				listeners.push(listener);
			});
		}



		public off(
			eventName:string,
			listener:(result:any) => void):void
		{
			var listeners = this.eventListeners[eventName];
			if (!listeners)
				return;

			kr3m.util.Util.remove(listeners, listener);
		}



		private handleEvent(eventName:string, response:any):void
		{
			var listeners = this.eventListeners[eventName];
			if (!listeners)
				return;

			for (var i = 0; i < listeners.length; ++i)
				kr3m.util.trySafe(listeners[i], response);
		}



		/*
			Gibt das Userprofil des aktuell eingeloggten Users zurück.
		*/
		public getUser(
			callback:(user:kr3m.fb.User) => void):void
		{
			this.callDelayed(() =>
			{
				FB.api("/me", {fields: "locale,first_name,last_name,gender,email"}, callback);
			});
		}



		/*
			Gibt den Status der gewünschten Permissions des aktuell
			eingeloggten Users zurück.
		*/
		public getPermissionsStatus(
			callback:(statusByPermission:any) => void):void
		{
			this.callDelayed(() =>
			{
				FB.api("/me/permissions", "get", {}, (response:any) =>
				{
					if (!response.data || !response.data.length)
						return callback({});

					var statusByPermission:any = {};
					for (var i = 0; i < response.data.length; ++i)
						statusByPermission[response.data[i].permission] = response.data[i].status;
					callback(statusByPermission);
				});
			});
		}



		/*
			Erbittet die gegebenen Permissions vom aktuellen eingeloggten
			User, egal ob er sie schon gegeben hat oder nicht. Idealer Weise
			sollte requrePermissions benutzt werden weil dieses nur die
			erbittet, die er tatsächlich nicht gegeben hat.
		*/
		private requestPermissions(
			permissions:string[], isReRequest:boolean,
			callback:(allGranted:boolean) => void):void
		{
			var options:any =
			{
				scope : permissions.join(","),
				return_scopes : true
			};

			if (isReRequest)
				options.auth_type = "rerequest";

			FB.login((loginResponse:any) =>
			{
				var allGranted = true;
				var grantedPermissions = loginResponse.grantedScopes ? loginResponse.grantedScopes.split(",") : [];
				for (var i = 0; i < permissions.length; ++i)
				{
					if (!kr3m.util.Util.contains(grantedPermissions, permissions[i]))
						allGranted = false;
				}
				callback(allGranted);
			}, options);
		}



		/*
			Überprüft ob der User alle Permissions in permissions hat und
			gibt true zurück falls dies der Fall ist. Ist dies nicht der
			Fall, wird false zurückgegeben und alle fehlenden Permissions
			in missingPermissions.
		*/
		public hasPermissions(
			permissions:string[],
			callback:(hasAll:boolean, missingPermissions:string[]) => void):void
		{
			this.callDelayed(() =>
			{
				Wrapper.permissionCritSec.enter((exit:() => void) =>
				{
					this.getPermissionsStatus((statusByPermission:string[]) =>
					{
						var missing:string[] = [];
						for (var i = 0; i < permissions.length; ++i)
						{
							var status = statusByPermission[permissions[i]];
							if (status != "granted")
								missing.push(permissions[i]);
						}
						callback(missing.length == 0, missing);
						exit();
					});
				});
			});
		}



		/*
			Überprüft ob der User die angegebenen Permissions hat. Falls
			nicht wird der User um die Permissions gebeten. Anschließend
			wird zurück gegeben, ob er die Permissions gewährt hat oder
			nicht.
		*/
		public requirePermissions(
			permissions:string[],
			callback:(allGranted:boolean) => void):void
		{
			this.callDelayed(() =>
			{
				Wrapper.permissionCritSec.enter((exit:() => void) =>
				{
					this.getPermissionsStatus((statusByPermission:string[]) =>
					{
						var reRequest = false;
						var missing:string[] = [];
						for (var i = 0; i < permissions.length; ++i)
						{
							var status = statusByPermission[permissions[i]];
							if (status != "granted")
								missing.push(permissions[i]);
							reRequest = reRequest || (status == "declined");
						}
						if (missing.length == 0)
						{
							callback(true);
							return exit();
						}

						this.requestPermissions(missing, reRequest, (allGranted:boolean) =>
						{
							callback(allGranted);
							exit();
						});
					});
				});
			});
		}



		/*
			Widerruft die gewünschten erteilten Permissions für den aktuell
			eingeloggten User. Kann z.B. verwendet werden, wenn der User bei
			seinen Kontoeinstellungen die Facebook-Notifications abschalten
			möchte oder etwas in der Art. Alternativ auch sehr hilfreich beim
			Debuggen von Permissions-Anfragen-Dialogen.
		*/
		public revokePermissions(
			permissions:string[],
			callback:(allRevoked:boolean) => void):void
		{
			this.callDelayed(() =>
			{
				kr3m.async.Loop.forEach(permissions, (permission:string, next:() => void) =>
				{
					FB.api("/me/permissions/" + permission, "delete", (response:any) =>
					{
						if (!response)
							callback(false);
						else
							next();
					});
				}, () =>
				{
					callback(true);
				});
			});
		}



		/*
			Hebt die Freigabe der App für den aktuell eingeloggten User völlig
			auf. Nach dem Aufruf dieser Methode wird der User behandelt als
			würde er zum ersten Mal auf die Webanwendung kommen - zumindest aus
			Sicht von Facebook. Er kann sie dann erneut freigeben oder auch
			nicht.
		*/
		public unregister(
			callback:(success:boolean) => void):void
		{
			this.callDelayed(() =>
			{
				FB.api("/me/permissions", "delete", (response:any) =>
				{
					callback(!!response);
				});
			});
		}



		/*
			Teilt (share) den angegebenen Text auf der Wall des aktuell
			eingeloggten Users.
		*/
		public share(
			message:string, url:string,
			callback:(status?:string, error?:any) => void):void
		{
			this.callDelayed(() =>
			{
				this.requirePermissions([kr3m.fb.P_PUBLISH], (allGranted:boolean) =>
				{
					if (!allGranted)
						return callback(kr3m.ERROR_DENIED);

					FB.api("/me/feed", "post", {message : message, link : url}, (response:any) =>
					{
						if (!response || response.error)
							return callback(kr3m.ERROR_EXTERNAL, response ? response.error : undefined);

						callback(kr3m.SUCCESS);
					});
				});
			});
		}



		private paginate(
			firstResponse:any,
			callback:(allResponses:any[]) => void):void
		{
			if (!firstResponse)
				return callback([]);

			var allResponses = [firstResponse];
			if (!firstResponse.paging || !firstResponse.paging.next)
				return callback(allResponses);

			var url = firstResponse.paging.next;
			kr3m.async.Loop.loop((next:(again:boolean) => void) =>
			{
				kr3m.util.Ajax.call(url, (response:any) =>
				{
					if (!response)
						return callback(allResponses);

					allResponses.push(response);

					if (!response.paging || !response.paging.next)
						return callback(allResponses);

					url = response.paging.next;
					next(true);
				}, "json", () => callback(allResponses));
			});
		}



		/*
			Gibt die Freunde des Users zurück, welche die App auch schon
			zugelassen haben. Gegebenenfalls wird die Permission für diese
			Abfrage automatisch abgefragt. Wird die Permission verweigert
			wird einfach ein leeres Ergebnis zurück gegeben.
		*/
		public getFriends(
			callback:(friends:kr3m.fb.Friend[]) => void):void
		{
			this.callDelayed(() =>
			{
				this.requirePermissions([kr3m.fb.P_FRIENDS], (allGranted:boolean) =>
				{
					if (!allGranted)
						return callback([]);

					FB.api("/me/friends", (response:any) =>
					{
						if (!response || response.error)
							return callback([]);

						this.paginate(response, (allResponses:any[]) =>
						{
							var friends:any[] = [];
							for (var i = 0; i < allResponses.length; ++i)
								friends = friends.concat(allResponses[i].data);

							for (var i = 0; i < friends.length; ++i)
							{
								if (typeof friends[i].picture == "object")
									friends[i].picture = friends[i].picture.data.url;
							}
							callback(friends);
						});
					});
				});
			});
		}



		/*
			Gibt die Freunde des Users zurück, welche die App noch nicht
			zugelassen haben. Gegebenenfalls wird die Permission für diese
			Abfrage automatisch abgefragt. Wird die Permission verweigert
			wird einfach ein leeres Ergebnis zurück gegeben.

			Funktioniert nur für Apps, die in FB als Game klassifiziert sind.
		*/
		public getInvitableFriends(
			callback:(friends:kr3m.fb.Friend[]) => void):void
		{
			this.callDelayed(() =>
			{
				this.requirePermissions([kr3m.fb.P_FRIENDS], (allGranted:boolean) =>
				{
					if (!allGranted)
						return callback([]);

					FB.api("/me/invitable_friends", (response:any) =>
					{
						if (!response || response.error)
							return callback([]);

						this.paginate(response, (allResponses:any[]) =>
						{
							var friends:any[] = [];
							for (var i = 0; i < allResponses.length; ++i)
								friends = friends.concat(allResponses[i].data);

							for (var i = 0; i < friends.length; ++i)
							{
								if (typeof friends[i].picture == "object")
									friends[i].picture = friends[i].picture.data.url;
							}
							callback(friends);
						});
					});
				});
			});
		}



		/*
			Ermittelt ob der User aktuell über einen Request-Link in die
			Anwendung gekommen ist und falls ja, welche Requests er damit
			praktisch angenommen hat.
		*/
		public getRequestIds(
			callback:(requestIds:string[]) => void):void
		{
			var raw = kr3m.util.Browser.getQueryValue("request_ids");
			var requestIds:string[] = raw ? raw.split(",") : [];
			callback(requestIds);
		}



		public deleteRequest(
			requestId:string,
			callback?:(status:string) => void):void
		{
			this.callDelayed(() =>
			{
				FB.api(requestId, "delete", (response:any) =>
				{
					if (callback)
						callback(response.success ? kr3m.SUCCESS :kr3m.ERROR_EXTERNAL);
				});
			});
		}



		public request(message:string, callback:(fbRequestId:string, fbFriendIds:string[]) => void):void;
		public request(message:string, customData:any, callback:(fbRequestId:string, fbFriendIds:string[]) => void):void;
		public request(message:string, type:string, obj:string, callback:(fbRequestId:string, fbFriendIds:string[]) => void):void;
		public request(message:string, type:string, obj:string, customData:any, callback:(fbRequestId:string, fbFriendIds:string[]) => void):void;
		public request(message:string, type:string, obj:string, customData:any, inviteIds:string[], callback:(fbRequestId:string, fbFriendIds:string[]) => void):void;

		public request():void
		{
			var message = <string> arguments[0];
			var callback = <(fbRequestId:string, fbFriendIds:string[]) => void> arguments[arguments.length - 1];

			switch (arguments.length)
			{
				case 3:
					var customData = arguments[1];
					break;

				case 4:
					var type = <string> arguments[1];
					var obj = <string> arguments[2];
					break;

				case 5:
					var type = <string> arguments[1];
					var obj = <string> arguments[2];
					var customData = arguments[3];
					break;

				case 6:
					var type = <string> arguments[1];
					var obj = <string> arguments[2];
					var customData = arguments[3];
					var inviteIds = <string[]>arguments[4];
					break;
			}

			this.callDelayed(() =>
			{
				var options =
				{
					method : "apprequests",
					to : inviteIds ? inviteIds.join(",") : undefined,
					message : message.slice(0, 255),
					action_type : type,
					object_id : obj,
					data : customData ? kr3m.util.Json.encode(customData) : undefined
				};
				FB.ui(options, (response:any) =>
				{
					if (!response || response.error)
						return callback(null, []);

					callback(response.request, response.to);
				});
			});
		}



		public buyProduct(
			transactionId:string, productUrl:string,
			callback:(status:string, data?:kr3m.fb.PaymentResult) => void):void
		{
			this.callDelayed(() =>
			{
				var options =
				{
					method : "pay",
					action : "purchaseitem",
					product : productUrl,
					request_id: transactionId
				};
				FB.ui(options, (response:kr3m.fb.PaymentResult) =>
				{
					if (!response || response.error || response.error_code)
					{
						if (response.error_code == 1383010)
							return callback(kr3m.ERROR_CANCELLED);

						return callback(kr3m.ERROR_EXTERNAL);
					}

					callback(kr3m.SUCCESS, response);
				});
			});
		}
	}
}
