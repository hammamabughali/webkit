/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/screen.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>

//# DEPRECATED_1_4_14_8
/// <reference path="../async/delayed.ts"/>
/// <reference path="../util/deeplinking.ts"/>
//# /DEPRECATED_1_4_14_8



module kr3m.ui
{
	/*
		Allgemeine Klassen zum Verwalten und Anzeigen von
		Screens.

		Screens können über ihren Namen angezeigt werden
		oder alternativ über Positionen. Positionen sind
		eine (interne) Beschreibung aller Screens, die
		in der Anwendung sichtbar sein müssen, damit der
		gewünschte Screen tatsächlich sichtbar ist.
		Positionen sind String-Arrays und können für
		Dinge wie Deeplinking oder Breadcrumbs verwendet
		werden.

//# DEPRECATED_1_4_14_8
		Weil das hier verwendete Deeplinking nicht 100%
		zuverlässig funktioniert und mit SEO sehr viele
		Probleme macht, sollte es nicht mehr verwendet
		werden.
//# /DEPRECATED_1_4_14_8
	*/
	export class ScreenManager extends kr3m.ui.Element
	{
		private currentScreen:kr3m.ui.Screen;
		private history:kr3m.ui.Screen[] = [];
		private shownScreens:{[screenName:string]:boolean} = {};
		private changeListeners:Array<(screenName:string) => void> = [];
		private subManagers:kr3m.ui.ScreenManager[] = [];

//# DEPRECATED_1_4_14_8
		private delay = new kr3m.async.Delayed();
//# /DEPRECATED_1_4_14_8

		public maxHistorySize = 20;

//# DEPRECATED_1_4_14_8
		private static deeplinkingEnabled = false;
		private static pendingDeeplink:string;

		private static getDeeplinkScreen = function(link:string){return link;};
		private static getScreenDeeplink = function(screen:string){return screen;};
//# /DEPRECATED_1_4_14_8



		constructor(parent:kr3m.ui.Element, className:string = "screenManager")
		{
			super(parent, null, "div", {"class": className});
		}



		public addChild(child:kr3m.ui.Element):void
		{
//# DEBUG
			if (child instanceof kr3m.ui.Screen)
			{
				var childName = (<kr3m.ui.Screen> child).getName();
				for (var i = 0; i < this.children.length; ++i)
				{
					if (this.children[i] instanceof kr3m.ui.Screen)
					{
						if (childName == (<kr3m.ui.Screen> this.children[i]).getName())
						{
							kr3m.util.Log.logError("Warning: screen with name " + childName + " already exists");
						}
					}
				}
			}
//# /DEBUG
			super.addChild(child);
			if (child instanceof kr3m.ui.Screen)
				child.hide();
		}



//# DEPRECATED_1_4_14_8
		public enableDeeplinking(
			getDeeplinkScreenFunc?:(link:string) => string,
			getScreenDeeplinkFunc?:(screen:string) => string):void
		{
			if (kr3m.ui.ScreenManager.deeplinkingEnabled)
				return;

			if (getDeeplinkScreenFunc)
				kr3m.ui.ScreenManager.getDeeplinkScreen = getDeeplinkScreenFunc;
			if (getScreenDeeplinkFunc)
				kr3m.ui.ScreenManager.getScreenDeeplink = getScreenDeeplinkFunc;

			kr3m.ui.ScreenManager.deeplinkingEnabled = true;
			kr3m.util.Deeplinking.addLinkChangeListener((link) =>
			{
				var screenName = kr3m.ui.ScreenManager.getDeeplinkScreen(link);
				this.showScreenRecursive(screenName);
			});

			this.callDelayed(() =>
			{
				var link = kr3m.util.Deeplinking.getCurrentLink();
				if (link)
				{
					var screenName = kr3m.ui.ScreenManager.getDeeplinkScreen(link);
					if (screenName)
					{
						var pos = this.findPositionOfScreen(screenName);
						if (pos.length > 0)
						{
							kr3m.util.Deeplinking.setPassiveMode(true);
							this.showScreenRecursive(screenName);
							kr3m.util.Deeplinking.setPassiveMode(false);
						}
						else
						{
							kr3m.ui.ScreenManager.pendingDeeplink = link;
						}
					}
				}
			});
		}
//# /DEPRECATED_1_4_14_8



		public onAddedToStage():void
		{
			super.onAddedToStage();

			var parentManager = <kr3m.ui.ScreenManager> this.getParentOfClass(kr3m.ui.ScreenManager);
			if (parentManager)
				parentManager.subManagers.push(this);
		}



		public onRemovedFromStage():void
		{
			var parentManager = <kr3m.ui.ScreenManager> this.getParentOfClass(kr3m.ui.ScreenManager);
			if (parentManager)
				kr3m.util.Util.remove(parentManager.subManagers, this);

			super.onRemovedFromStage();
		}



//# DEPRECATED_1_4_14_8
		public callDelayed(func:() => void):void
		{
			this.delay.call(func);
		}
//# /DEPRECATED_1_4_14_8



		public allScreensAdded():void
		{
//# !DEPRECATED_1_4_14_8
			kr3m.util.Log.log("ScreenManager.allScreensAdded is deprecated and obsolete");
//# /!DEPRECATED_1_4_14_8
//# DEPRECATED_1_4_14_8
			this.delay.execute();

			if (kr3m.ui.ScreenManager.pendingDeeplink)
			{
				var screenName = kr3m.ui.ScreenManager.getDeeplinkScreen(kr3m.ui.ScreenManager.pendingDeeplink);
				if (screenName && this.hasScreenWithName(screenName))
				{
					kr3m.util.Deeplinking.setPassiveMode(true);
					this.showScreenRecursive(screenName);
					kr3m.util.Deeplinking.setPassiveMode(false);
					kr3m.ui.ScreenManager.pendingDeeplink = null;
				}
			}
//# /DEPRECATED_1_4_14_8
		}



		public getScreenNames():string[]
		{
			var result:string[] = [];
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof kr3m.ui.Screen)
				{
					var childScreen:kr3m.ui.Screen = <kr3m.ui.Screen> this.children[i];
					result.push(childScreen.getName());
				}
			}
			return result;
		}



		private updateHistory():void
		{
			if (this.currentScreen)
			{
				this.history.push(this.currentScreen);
				while (this.history.length > this.maxHistorySize)
					this.history.shift();
			}
		}



		/*
			Zeigt einfach den ersten Screen an, der
			dem Screenmanager hinzugefügt wurde.
		*/
		public showFirstScreen():void
		{
//# DEPRECATED_1_4_14_8
			this.callDelayed(() =>
			{
//# /DEPRECATED_1_4_14_8
				if (this.children.length > 0)
					this.showScreen(<kr3m.ui.Screen> this.children[0]);
//# DEPRECATED_1_4_14_8
			});
//# /DEPRECATED_1_4_14_8
		}



		public getFirstScreen():kr3m.ui.Screen
		{
			if (this.children.length > 0)
				return <kr3m.ui.Screen> this.children[0];
			return null;
		}



		/*
			Zeigt den Screen an, der vor dem aktuellen
			Screen sichtbar war. Falls kein Screen in
			der Historie enthalten ist, passiert nichts.
		*/
		public showPreviousScreen():void
		{
//# DEPRECATED_1_4_14_8
			this.callDelayed(() =>
			{
//# /DEPRECATED_1_4_14_8
				if (this.history.length > 0)
				{
					this.showScreen(this.history.pop());
					this.history.pop();
				}
//# DEPRECATED_1_4_14_8
			});
//# /DEPRECATED_1_4_14_8
		}



		/*
			Gibt den Screen zurück, der vor dem aktuellen
			Screen sichtbar war, oder null, falls in der
			Historie kein Screen enthalten ist.
			Der zurückgegebene Screen wird nicht aus der
			Historie gelöscht.
		*/
		public getPreviousScreen():kr3m.ui.Screen
		{
			if (this.history.length > 0)
				return this.history[this.history.length - 1];
			else
				return null;
		}



		/*
			Gibt den Screen zurück, der vor dem aktuellen
			Screen sichtbar war, oder null, falls in der
			Historie kein Screen enthalten ist.
			Der zurückgegebene Screen wird aus der Historie
			gelöscht.
		*/
		public popPreviousScreen():kr3m.ui.Screen
		{
			if (this.history.length > 0)
				return this.history.pop();
			else
				return null;
		}



		public showScreen(screen:kr3m.ui.Screen, data?:any):void
		{
//# DEPRECATED_1_4_14_8
			this.callDelayed(() =>
			{
//# /DEPRECATED_1_4_14_8
				if (this.currentScreen && this.currentScreen == screen)
				{
					this.currentScreen.onRefresh(data);
					return;
				}

				if (this.currentScreen)
					this.currentScreen.hide();

				var screenName = screen.getName();
				var found = false;
				for (var i = 0; i < this.children.length; ++i)
				{
					var child = this.children[i];
					if (child == screen)
					{
						this.updateHistory();
						this.currentScreen = <kr3m.ui.Screen> child;
						if (!this.shownScreens[screenName])
							this.currentScreen.onInitialRefresh(data);
						this.shownScreens[screenName] = true;
						this.currentScreen.show();
						this.currentScreen.onRefresh(data);
						found = true;
						break;
					}
				}
				if (!found)
					kr3m.util.Log.logError("screen", screenName, "not found");
				else
					this.notifyChangeListeners();
//# DEPRECATED_1_4_14_8
			});
//# /DEPRECATED_1_4_14_8
		}



		public removeAllChildren(
			removeHtmlToo = true):void
		{
			this.currentScreen = null;
			super.removeAllChildren(removeHtmlToo);
		}



		public showScreenByName(screenName:string, data?:any):void
		{
				var screen = this.getScreenByName(screenName);
				if (screen)
					this.showScreen(screen, data);
				else
					kr3m.util.Log.logError("screen " + screenName + " not found");
		}



		/*
			Diese Methode funktioniert im Prinzip genau so wie
			showScreenByName, aber mit dem wichtigen Unterschied,
			dass wenn im aktuellen ScreenManager kein Screen mit
			dem Namen screenName gefunden wird, alle anderen
			ScreenManager ebenfalls aufgerufen werden können.
			Es wird zuerst in den Screens des aktuellen ScreenManagers
			nach weiteren ScreenManagern gesucht und gegebenfalls
			deren Screen angezeigt. Falls immer noch kein Screen
			gefunden wurde, werden dann die Parents des aktuellen
			ScreenManagers nach ScreenManagern durchsucht und deren
			Screens dann wird recursiv nach unten.

			Anders gesagt: diese Funktion zeigt den gewünschten
			Screen an, wenn es ihn irgendwo in Baumstruktur der
			Elemente gibt.
		*/
		public showScreenRecursive(screenName:string, data?:any):void
		{
//# DEPRECATED_1_4_14_8
			this.callDelayed(() =>
			{
//# /DEPRECATED_1_4_14_8
				if (this.currentScreen && this.currentScreen.getName() == screenName)
					return;

				var pos = this.findPositionOfScreen(screenName);
				if (pos.length > 0)
				{
					this.showPosition(pos, data);
//# DEPRECATED_1_4_14_8
					if (kr3m.ui.ScreenManager.deeplinkingEnabled)
					{
						var link = kr3m.ui.ScreenManager.getScreenDeeplink(screenName);
						if (link)
							kr3m.util.Deeplinking.addDeeplink(link);
					}
//# /DEPRECATED_1_4_14_8
				}
//# DEPRECATED_1_4_14_8
			});
//# /DEPRECATED_1_4_14_8
		}



		private getParentScreenName():string
		{
			var screen = <kr3m.ui.Screen> this.getParentOfClass(kr3m.ui.Screen);
			return screen ? screen.getName() : null;
		}



		private getSubManagerByScreenName(
			screenName:string):kr3m.ui.ScreenManager
		{
			for (var i = 0; i < this.subManagers.length; ++i)
				if (this.subManagers[i].getParentScreenName() == screenName)
					return this.subManagers[i];

			return null;
		}



		public getCurrentPosition():string[]
		{
			var pos:string[] = [];
			var temp = <kr3m.ui.ScreenManager> this.getRootOfClass(kr3m.ui.ScreenManager) || this;
			while (temp)
			{
				var screen = temp.getCurrentScreen();
				if (!screen)
					break;

				var name = screen.getName();
				pos.push(name);
				temp = this.getSubManagerByScreenName(name);
			}
			return pos;
		}



		public findPositionOfScreen(screenName:string):string[]
		{
			var pos:string[] = [];
			var root = <kr3m.ui.ScreenManager> this.getRootOfClass(kr3m.ui.ScreenManager) || this;
			var workset:kr3m.ui.ScreenManager[] = [root];
			while (workset.length > 0)
			{
				var temp = workset.shift();
				if (temp.hasScreenWithName(screenName))
				{
					pos.unshift(screenName);
					while (temp)
					{
						var screenName = temp.getParentScreenName();
						if (!screenName)
							break;

						pos.unshift(screenName);
						temp = <kr3m.ui.ScreenManager> temp.getParentOfClass(kr3m.ui.ScreenManager);
					}
				}
				else
				{
					workset = workset.concat(temp.subManagers);
				}
			}
			return pos;
		}



		public showPosition(position:string[], data?:any):void
		{
//# DEPRECATED_1_4_14_8
			this.callDelayed(() =>
			{
//# /DEPRECATED_1_4_14_8
				var temp = <kr3m.ui.ScreenManager> this.getRootOfClass(kr3m.ui.ScreenManager) || this;
				while (temp && position.length > 0)
				{
					var screenName = position.shift();
					var isLast = position.length == 0;
					temp.showScreenByName(screenName, isLast ? data : null);
					temp = temp.getSubManagerByScreenName(screenName);
				}
//# DEPRECATED_1_4_14_8
			});
//# /DEPRECATED_1_4_14_8
		}



		public hasScreenWithName(name:string):boolean
		{
			return !!this.getScreenByName(name);
		}



		public getScreenByName(name:string):kr3m.ui.Screen
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				var child = this.children[i];
				if (child instanceof kr3m.ui.Screen)
				{
					var childScreen = <kr3m.ui.Screen> child;
					if (childScreen.getName() == name)
						return childScreen;
				}
			}
			return null;
		}



		public getScreenByNameRecursive(name:string):kr3m.ui.Screen
		{
			var pos = this.findPositionOfScreen(name);
			if (pos.length == 0)
				return null;

			var temp = <kr3m.ui.ScreenManager> this.getRootOfClass(kr3m.ui.ScreenManager) || this;
			while (temp && pos.length > 0)
			{
				var screenName = pos.shift();
				if (pos.length == 0)
					return temp.getScreenByName(screenName);
				temp = temp.getSubManagerByScreenName(screenName);
			}
			return null;
		}



		public getCurrentScreen():kr3m.ui.Screen
		{
			return this.currentScreen;
		}



		public getCurrentScreenName():string
		{
			return this.currentScreen ? this.currentScreen.getName() : null;
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			super.removeChild(child);
			for (var i = 0; i < this.history.length; ++i)
			{
				if (this.history[i] == child)
				{
					this.history.splice(i, 1);
					--i;
				}
			}
		}



		public addChangeListener(listener:(screenName:string) => void):void
		{
			this.changeListeners.push(listener);
		}



		private notifyChangeListeners():void
		{
			if (!this.currentScreen)
				return;

			var screenName = this.currentScreen.getName();
			for (var i = 0; i < this.changeListeners.length; ++i)
				this.changeListeners[i](screenName);
		}
	}
}
