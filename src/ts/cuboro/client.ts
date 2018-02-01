/// <reference path="../cuboro/clientmodels/comment.ts"/>
/// <reference path="../cuboro/clientmodels/mail.ts"/>
/// <reference path="../cuboro/clientmodels/tests.ts"/>
/// <reference path="../cuboro/clientmodels/user.ts"/>
/// <reference path="../cuboro/config.ts"/>
/// <reference path="../cuboro/constants.ts"/>
/// <reference path="../cuboro/core/loader.ts"/>
/// <reference path="../cuboro/stubs/competition.ts"/>
/// <reference path="../cuboro/ui/hint.ts"/>
/// <reference path="../cuboro/version.ts"/>
/// <reference path="../gf/client.ts"/>
/// <reference path="../gf/core/game.ts"/>
/// <reference path="../gf/utils/debug.ts"/>
/// <reference path="../gf/utils/fps.ts"/>
/// <reference path="../kr3m/lib/greensock.ts"/>
/// <reference path="../kr3m/lib/howler.ts"/>
/// <reference path="../kr3m/lib/jquery.ts"/>
/// <reference path="../kr3m/lib/pixi.ts"/>
/// <reference path="../kr3m/lib/three.ts"/>
/// <reference path="../kr3m/lib/webfontloader.ts"/>
/// <reference path="../kr3m/tracking3/track.ts"/>
/// <reference path="../kr3m/util/browser.ts"/>
/// <reference path="../kr3m/util/localization.ts"/>
/// <reference path="../kr3m/util/validator.ts"/>



class Client extends gf.Client
{
	public config: cuboro.Config;
	public game: gf.core.Game;
	public hint: cuboro.ui.Hint;
	public track: cuboro.vo.Track;

	protected clientReady: boolean;
	protected popupData: any;
	protected popupEmailReminder: boolean;



	constructor()
	{
		super();

		kr3m.loading.Loader2.getInstance().loadFile("js/data/config.json", (content: any) =>
		{
			this.config = $.extend({}, new cuboro.Config(), content);

			this.config.language = kr3m.util.Browser.getQueryValue("lang") || this.config.language;

			this.game = new gf.core.Game(this);
			this.game.loader.on(gf.LOAD_PROGRESS, this.onLoadProgress, this);
			this.game.loader.once(gf.LOAD_COMPLETE, this.onLoadComplete, this);
			this.config.addAssets(this);
			this.game.loader.start();

			casClient.on(cas.POPUP_EMAIL_VALIDATED, (data: any) =>
			{
				log(cas.POPUP_EMAIL_VALIDATED, data);
			});

			casClient.on(cas.POPUP_RESET_PASSWORD, (data: any) =>
			{
				log(cas.POPUP_RESET_PASSWORD, data);
			});

			casClient.on(cas.POPUP_EMAIL_REMINDER, (data: any) =>
			{
				log(cas.POPUP_EMAIL_REMINDER, data);
				this.popupEmailReminder = true;
				this.popupData = data;
				if (this.clientReady) this.showPopEmailReminder();
			});
		});
	}



	private onLoadProgress(): void
	{
		$("#progress").text(this.game.loader.progress + "%");
		$("#bar").width(this.game.loader.progress + "%");
	}



	private onLoadComplete(): void
	{
		this.game.loader.off(gf.LOAD_PROGRESS, this.onLoadProgress);

		$("#loader").remove();

		kr3m.util.Localization.fallback = this.config.language;
		kr3m.util.Localization.language = this.config.language;
		kr3m.util.Localization.addJSONModule(this.game.cache.getJSON("language"), this.config.language);

		setToken("pixi", PIXI.VERSION);
		setToken("three", THREE.REVISION);
		setToken("renderer", this.game.renderer.type == PIXI.RENDERER_TYPE.CANVAS ? "Canvas" : "WebGL");

		log(loc("say_hello", {name: loc("app_title"), version: cuboro.VERSION}));

		this.game.once(gf.RUNNING, this.onRun, this);
		this.game.start();
	}



	private onRun(): void
	{
		log(this.game);

		this.hint = new cuboro.ui.Hint(this.game);
		this.game.stage.addChild(this.hint);

		const trackId = parseInt(kr3m.util.Browser.getQueryValue("tid"), 10);
		if (trackId)
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);
			sTrack.load(trackId, (track: cuboro.vo.Track) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				if (track)
				{
					cuboro.core.Loader.loadTrack(this.game, track, false);
				}
				else
				{
					this.game.screens.show("start");
				}
			});
		}
		else
		{
			this.game.screens.show("start");
		}

		this.clientReady = true;

		if (this.popupEmailReminder) this.showPopEmailReminder();

		if (!PIXI.utils.isWebGLSupported() || this.game.renderer.type == PIXI.RENDERER_TYPE.CANVAS)
			this.hint.show(loc("hint_webgl_title"), loc("hint_webgl"));

		if (!this.game.storage.isSupported)
			this.hint.show(loc("hint_cookies_title"), loc("hint_cookies"));
	}



	protected showPopEmailReminder(): void
	{
		this.popupEmailReminder = false;

		const overlay = this.game.overlays.show(cuboro.overlays.FinishRegister.NAME);
		overlay.email = this.popupData.email;
	}
}



new Client();
