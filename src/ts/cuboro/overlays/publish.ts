/// <reference path="../../cuboro/input/textinput.ts"/>
/// <reference path="../../cuboro/overlays/overlay.ts"/>
/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/input/form.ts"/>



module cuboro.overlays
{
	export class Publish extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "publish";

		private _step: number;

		public btBack: cuboro.ui.TextButton;
		public btNext: cuboro.ui.TextButton;
		public btPublish: cuboro.ui.TextButton;
		public trackName: cuboro.input.TextInput;
		public form: gf.input.Form;
		public progress: gf.display.Sprite;
		public tfInfo: gf.display.Text;
		public tfReview: gf.display.Text;
		public tfReviewTitle: gf.display.Text;
		public tfReviewValues: gf.display.Text;
		public tfTrackNameValid: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("publish_title");
			this.bg.width = 400;

			this.form = new gf.input.Form(this.game, "forgotPassword");
			this.form.onSubmit = () => this.onNext();
			this.addChild(this.form);

			this.progress = new gf.display.Sprite(this.game, "sprites", "progress_1");
			this.progress.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.progress);

			this.trackName = new cuboro.input.TextInput(this.game, this.form, "trackName");
			this.trackName.maxLength = 30;
			this.trackName.placeholder = loc("placeholder_track");
			this.trackName.tabIndex = 1;
			this.trackName.tfTitle.text = loc("placeholder_track");
			this.trackName.y = this.progress.bottom + cuboro.PADDING * 2;
			this.trackName.validation = (value: string) => this.trackNameValidation(value);
			this.trackName.on(gf.BLUR, this.onTrackName, this);
			this.form.addChild(this.trackName);

			this.tfTrackNameValid = new gf.display.Text(this.game, loc("publish_trackname_accepted"), cuboro.TEXT_STYLE_INPUT_SUCCESS.clone());
			this.tfTrackNameValid.style.wordWrapWidth = this.trackName.tfError.style.wordWrapWidth;
			this.tfTrackNameValid.x = this.trackName.tfError.x;
			this.tfTrackNameValid.y = this.trackName.tfError.y;
			this.tfTrackNameValid.visible = false;
			this.trackName.addChild(this.tfTrackNameValid);

			const btWidth = (this.trackName.width >> 1) - cuboro.PADDING * 2;

			this.btBack = new cuboro.ui.TextButton(this.game, loc("bt_back"), false);
			this.btBack.on(gf.CLICK, this.onBack, this);
			this.btBack.setWidth(btWidth);
			this.addChild(this.btBack);

			this.btNext = new cuboro.ui.TextButton(this.game, loc("bt_next"), true);
			this.btNext.on(gf.CLICK, this.onNext, this);
			this.btNext.setWidth(btWidth);
			this.addChild(this.btNext);

			this.btPublish = new cuboro.ui.TextButton(this.game, loc("bt_publish2"), true);
			this.btPublish.on(gf.CLICK, this.onPublish, this);
			this.btPublish.autoFit();
			this.btPublish.y = this.btBack.y;
			this.addChild(this.btPublish);

			this.tfReviewTitle = new gf.display.Text(this.game, loc("publish_review_title"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfReviewTitle.style.fontFamily = cuboro.DEFAULT_FONT_HEAVY;
			this.tfReviewTitle.y = this.progress.bottom + cuboro.PADDING * 2;
			this.addChild(this.tfReviewTitle);

			this.tfReview = new gf.display.Text(this.game, loc("publish_review"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfReview.style.lineHeight = 16;
			this.tfReview.y = this.tfReviewTitle.bottom + cuboro.PADDING;
			this.addChild(this.tfReview);

			this.tfReviewValues = new gf.display.Text(this.game, loc("publish_review_values"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfReviewValues.style.lineHeight = 16;
			this.tfReviewValues.y = this.tfReview.y;
			this.addChild(this.tfReviewValues);

			this.tfInfo = new gf.display.Text(this.game, loc("publish_info"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfInfo.style.wordWrap = true;
			this.tfInfo.style.wordWrapWidth = this.bg.width - 44;
			this.tfInfo.y = this.tfReview.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfInfo);

			this.step = 1;
		}



		protected update(): void
		{
			this.tfReviewValues.text = mTrack.name + "\n" +
				locDate("publish_date", mTrack.lastSavedWhen) + "\n" +
				mTrack.data.evaluation.scoreTotal.toString();
		}



		protected trackNameValidation(value: string): boolean
		{
			this.trackName.hideError();

			let valid = false;

			if (value.length >= 3)
				valid = true;
			else
				this.trackName.showError(loc("error_input_track_name"));

			return valid;
		}



		protected onTrackName(cb?: (isUnique: boolean) => void): void
		{
			if (this.form.validate())
			{
				this.trackName.hideError();
				this.tfTrackNameValid.visible = false;

				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				sTrack.isNameUnique(mTrack.id, this.trackName.value, (isUnique: boolean) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);

					if (isUnique)
					{
						this.tfTrackNameValid.visible = true;
						mTrack.name = this.trackName.value;
						this.game.stage.header.trackMenu.trackName.value = this.trackName.value;
						this.update();
						if (cb) cb(true);
					}
					else
					{
						this.trackName.showError(loc("error_track_name_taken"));
						if (cb) cb(false);
					}
				});
			}
		}



		protected onBack(): void
		{
			this.step--;
		}



		protected onNext(): void
		{
			if (this._step == 1)
			{
				this.onTrackName((isUnique: boolean) =>
				{
					console.log("isUnique " + isUnique)
					if (isUnique) this.step++;
				});
			}
		}



		protected onClose(): void
		{
			track("Publish-Close");
			this.game.overlays.hide(cuboro.overlays.Publish.NAME);
		}



		protected onPublish(): void
		{
			if (mTrack.id)
			{
				this.game.overlays.show(cuboro.overlays.Loader.NAME);

				sTrack.publish(mTrack.id, mTrack.name, (status: string) =>
				{
					this.game.overlays.hide(cuboro.overlays.Loader.NAME);
					this.game.overlays.hide(cuboro.overlays.Publish.NAME);

					if (status == kr3m.SUCCESS)
					{
						this.game.stage.header.trackMenu.checkPublish();
						const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
						message.text = loc("track_published");
					}
					else
					{
						const message = this.game.overlays.show(cuboro.overlays.Message.NAME);
						message.text = loc("error_track_publish");
					}
				});
			}
		}



		public onResize(): void
		{
			super.onResize();

			this.btBack.x =
				this.tfInfo.x =
					this.tfReview.x =
						this.tfReviewTitle.x = this.bg.x + 22;

			this.trackName.x = this.bg.x + ((this.bg.width - this.trackName.width) >> 1);

			this.tfReviewValues.x = this.tfReview.right + cuboro.PADDING;

			this.progress.x = this.bg.x + ((this.bg.width - this.progress.width) >> 1);
			this.btNext.x = this.bg.right - this.btNext.width - 22;
			this.btPublish.x = this.bg.right - this.btPublish.width - 22;
		}



		public transitionIn(): void
		{
			super.transitionIn();

			this.step = 1;
			this.trackName.value = mTrack.name;
			this.update();
			this.onTrackName();
		}



		public transitionOut(): void
		{
			super.transitionOut();

			this.form.hideDom();
		}



		public get step(): number
		{
			return this._step;
		}



		public set step(value: number)
		{
			this._step = Math.min(2, Math.max(1, value));

			this.progress.frameName = "progress_" + this._step;

			this.btPublish.visible = this._step == 2;
			this.tfInfo.visible = this.btPublish.visible;
			this.tfReview.visible = this.btPublish.visible;
			this.tfReviewValues.visible = this.btPublish.visible;
			this.tfReviewTitle.visible = this.btPublish.visible;

			this.btNext.visible = this._step == 1;

			if (this.step == 1)
			{
				this.form.showDom();
				this.trackName.visible = true;

				this.btBack.y =
					this.btNext.y = this.trackName.bottom + cuboro.PADDING * 4;

				this.bg.height = this.btNext.bottom - this.bg.y + cuboro.PADDING * 4;
			}
			else
			{
				this.form.hideDom();
				this.trackName.visible = false;

				this.btBack.y =
					this.btPublish.y = this.tfInfo.bottom + cuboro.PADDING * 4;

				this.bg.height = this.btPublish.bottom - this.bg.y + cuboro.PADDING * 4;
			}

			this.btBack.visible = this.step == 2;
		}
	}
}
