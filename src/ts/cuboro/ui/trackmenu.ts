/// <reference path="../../cuboro/clientmodels/pdf.ts"/>
/// <reference path="../../gf/display/multistyletext.ts"/>
/// <reference path="../../gf/display/slice3.ts"/>
/// <reference path="../../gf/input/form.ts"/>
/// <reference path="../../gf/input/textinput.ts"/>



module cuboro.ui
{
	export class TrackMenu extends gf.display.Container
	{
		public btDetails: cuboro.ui.IconButton;
		public btPrint: cuboro.ui.IconButton;
		public btPublish: cuboro.ui.IconButton;
		public form: gf.input.Form;
		public tfUsed: gf.display.MultiStyleText;
		public tfSaved: gf.display.Text;
		public trackName: gf.input.TextInput;
		public trackNameBg: gf.display.Slice3;

		protected lastName: string;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;

			this.trackNameBg = new gf.display.Slice3(this.game, 10, 10, "sprites", "bg_dropdown");
			this.trackNameBg.width = 180;
			this.trackNameBg.x = cuboro.PADDING;
			this.trackNameBg.y = 21;
			this.addChild(this.trackNameBg);

			this.form = new gf.input.Form(this.game, "login");
			this.addChild(this.form);

			this.trackName = new gf.input.TextInput(this.game, this.form, "trackName");
			this.trackName.x = this.trackNameBg.x + cuboro.PADDING;
			this.trackName.y = 22;
			this.trackName.width = this.trackNameBg.width - cuboro.PADDING * 2;
			this.trackName.value = loc("unnamed_track");
			this.trackName.fontFamily = cuboro.DEFAULT_FONT_HEAVY;
			this.trackName.fontSize = 20;
			this.trackName.inputDom.style.textOverflow = "ellipsis";
			this.trackName.maxLength = 30;
			this.trackName.on(gf.FOCUS, this.onTrackNameFocus, this);
			this.trackName.on(gf.BLUR, this.onTrackNameChange, this);
			this.addChild(this.trackName);

			const styles = {bold: cuboro.TEXT_STYLE_DEFAULT_HEAVY.clone()};
			this.tfUsed = new gf.display.MultiStyleText(this.game, loc("cubes_used",
				{
					total: 0,
					used: 0
				}), cuboro.TEXT_STYLE_DEFAULT.clone(), styles);
			this.tfUsed.x = this.trackName.x;
			this.tfUsed.y = this.trackNameBg.bottom + cuboro.PADDING;
			this.addChild(this.tfUsed);

			this.btDetails = new cuboro.ui.IconButton(this.game, "details", loc("bt_track_details"));
			this.btDetails.on(gf.CLICK, this.onDetails, this);
			this.btDetails.y = cuboro.PADDING;
			this.addChild(this.btDetails);

			this.btPrint = new cuboro.ui.IconButton(this.game, "print", loc("bt_print"));
			this.btPrint.on(gf.CLICK, this.onPrint, this);
			this.btPrint.y = cuboro.PADDING;
			this.addChild(this.btPrint);

			this.btPublish = new cuboro.ui.IconButton(this.game, "publish", loc("bt_publish"));
			this.btPublish.on(gf.CLICK, this.onPublish, this);
			this.btPublish.y = cuboro.PADDING;
			this.addChild(this.btPublish);

			this.tfSaved = new gf.display.Text(this.game, "", cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfSaved.style.align = gf.LEFT;
			this.addChild(this.tfSaved);
		}



		protected trackNameValidation(): boolean
		{
			let valid = false;

			if (this.trackName.value.length >= 3)
			{
				valid = true;
			}
			else
			{
				const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
				message.text = loc("error_input_track_name");
				this.trackName.value = this.lastName;
			}

			return valid;
		}



		protected onDetails(): void
		{
			this.game.overlays.show(cuboro.overlays.TrackDetailsIngame.NAME);
		}



		protected onPrint(): void
		{
			cuboro.ui.TrackPreview.GetBase64(this.game.screens.current.playground, 600, (value: string) =>
			{
				mPdf.printPdf(mTrack.id, value);
			});
		}



		protected onPublish(): void
		{
			this.game.overlays.show(cuboro.overlays.Publish.NAME);
		}



		protected onTrackNameChange(): void
		{
			if (this.trackNameValidation())
			{
				mTrack.name = this.trackName.value;

				const gameScreen: cuboro.screens.Game = this.game.screens.current;
				gameScreen.playground.save();
			}
		}



		protected onTrackNameFocus(): void
		{
			if (this.trackName.value.length >= 3) this.lastName = this.trackName.value;
		}



		public updateCubesUsed(total: number, used: number): void
		{
			this.tfUsed.text = loc("cubes_used", {total: total, used: used});
		}



		public checkPublish(): void
		{
			this.btPublish.isEnabled = false;

			if (!mUser.isLoggedIn()) return;
			if (mTrack.data.evaluation.scoreTotal == 0) return;

			sTrack.isPublished(mTrack.id, (response: boolean) =>
			{
				if (!response) this.btPublish.isEnabled = true;
			});
		}



		public show(): void
		{
			this.visible = true;
			this.form.showDom();
		}



		public hide(): void
		{
			this.visible = false;
			this.form.hideDom();
		}



		public onResize(): void
		{
			super.onResize();

			if (!this.game.stage.header) return;

			this.btDetails.x = this.trackNameBg.right + cuboro.PADDING * 2;
			this.btPrint.x = this.btDetails.right + cuboro.PADDING;
			this.btPublish.x = this.btPrint.right + cuboro.PADDING;
			this.tfSaved.x = this.btPublish.right + cuboro.PADDING * 2;

			this.tfSaved.style.wordWrap = true;
			const wordWrapWidth = this.game.stage.header.btAccount.x - cuboro.PADDING * 2 - this.tfSaved.x;
			this.tfSaved.style.wordWrapWidth = Math.max(100, wordWrapWidth);
			this.tfSaved.y = this.btPublish.y + ((this.btPublish.height - this.tfSaved.height) >> 1);
		}
	}
}
