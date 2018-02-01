/// <reference path="../display/idisplay.ts"/>
/// <reference path="../utils/align.ts"/>
/// <reference path="../utils/aligndata.ts"/>
/// <reference path="../utils/angle.ts"/>
/// <reference path="../utils/scale.ts"/>



module gf.display
{
	export class MultiStyleText extends gf.display.Text
	{
		private _verticalAlign:string;
		private _lastLineAlign:string;  //allignment of last line if style.align==gf.JUSTIFY;
		private _textStyles: {[key:string]: PIXI.TextStyle};



		constructor(game: gf.core.Game, text?:string, style?: PIXI.TextStyle, styles?: {[key:string]: PIXI.TextStyle})
		{
			super(game, text, style);

			this._textStyles = {};

			if (styles) this.createTextStyles(styles);
		}



		protected createTextStyles(styles:{[key:string]: PIXI.TextStyle}):void
		{
			if (!styles) return;

			this._textStyles = {};

			for (let styleId in styles)
			{
				this._textStyles[styleId] = this._style["clone"]();
				for (let style in styles[styleId])
				{
					this._textStyles[styleId][style] = styles[styleId][style]
				}
			}

			this.dirty = true;
		}



		protected createTextData(text:string, style: PIXI.TextStyle):any
		{
			return {
				text: text,
				style: style,
				width: 0,
				height: 0,
				fontProperties: null
			};
		}



		protected getTextDataPerLine(lines:string[]):any[]
		{
			let outputTextData = [];

			if (!this._textStyles) this._textStyles = {};

			let tags = Object.keys(this._textStyles).join('|');
			let re = new RegExp("<\/?(" + tags + ")>", "g");

			let currentStyle = this.style;

			// determine the group of word for each line
			for (let i = 0; i < lines.length; i++)
			{
				let lineTextData = [];

				// find tags inside the string
				let matches = [];
				let matchArray;
				while ((matchArray = re.exec(lines[i])) !== null && matches.push(matchArray));

				// if there is no match, we still need to add the line with the default style
				if (!matches.length)
				{
					lineTextData.push(this.createTextData(lines[i], currentStyle));
				}
				else
				{
					// We got a match! add the text with the needed style
					let currentSearchIdx = 0;
					for (let j = 0; j < matches.length; j++)
					{
						// if index > 0, it means we have characters before the match,
						// so we need to add it with the default style
						if (matches[j].index > currentSearchIdx)
						{
							lineTextData.push(this.createTextData(
								lines[i].substring(currentSearchIdx, matches[j].index),
								currentStyle
							));
						}

						// reset the style if end of tag
						if (matches[j][0][1] == '/') currentStyle = this.style;
						// set the current style
						else currentStyle = this._textStyles[matches[j][1]] || this.style;

						// update the current search index
						currentSearchIdx = matches[j].index + matches[j][0].length;
					}

					// is there any character left?
					if (currentSearchIdx < lines[i].length)
					{
						lineTextData.push(
						{
							text: lines[i].substring(currentSearchIdx),
							style: currentStyle
						});
					}
				}

				outputTextData.push(lineTextData);
			}

			return outputTextData;
		}

/*
		protected getFont(style: PIXI.TextStyle):string
		{
			let fontSizeString = (typeof style.fontSize === 'number') ? style.fontSize + 'px' : style.fontSize;
			return style.fontStyle + ' ' + style.fontVariant + ' ' + style.fontWeight + ' ' + fontSizeString + ' ' + style.fontFamily;
		}
*/
		protected getFont( style: PIXI.TextStyle ):string
		{
			// build canvas api font setting from individual components. Convert a numeric style.fontSize to px
			const fontSizeString = ( typeof style.fontSize === 'number' ) ? `${style.fontSize}px` : style.fontSize;

			// Clean-up fontFamily property by quoting each font name
			// this will support font names with spaces

			var fontFamilies:string[];
			if ( !Array.isArray( style.fontFamily ) )
			{
				fontFamilies = style.fontFamily.split( ',' );
			}
			else
			{
				fontFamilies = style.fontFamily;
			}

			for ( let i :number = fontFamilies.length - 1; i >= 0; i-- )
			{
				// Trim any extra white-space
				let fontFamily = fontFamilies[i].trim();
				// Check if font already contains strings
				if ( !( /([\"\'])[^\'\"]+\1/ ).test( fontFamily ) )
				{
					fontFamily = `"${fontFamily}"`;
				}
				fontFamilies[i] = fontFamily;
			}
			return `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${fontSizeString} ${fontFamilies.join( ',' )}`;
		}

		protected updateText(respectDirty?:boolean):void
		{
			// check if style has changed..
			if (this.localStyleID !== this._style.styleID)
			{
				this.dirty = true;
				this.localStyleID = this._style.styleID;
			}

			if (!this.dirty && respectDirty)
			{
				return;
			}

			// word wrap
			// preserve original text
			let outputText = this._style.wordWrap ? this.wordWrap(this._text) : this._text;

			// split text into lines
			let lines = outputText.split(/(?:\r\n|\r|\n)/);

			// calculate text width
			let lineWidths = new Array(lines.length);
			let lineHeights = new Array(lines.length);   //heigh of thw whole line
			let maxLineWidth = 0;

			// get the text data with specific styles
			let outputTextData = this.getTextDataPerLine(lines);

			let i:number, j:number;
			let lineWidth:number, lineHeight:number;
			let fontProperties;

			for (i = 0; i < lines.length; i++)
			{
				lineWidth = 0;
				lineHeight = 0;

				for (j = 0; j < outputTextData[i].length; j++)
				{
					this.context.font = this.getFont( outputTextData[i][j].style );
					/*
					Fixed by Roman Lut:
					MultiStyleText was broken due to incorect call to PIXI.Text.calculateFontProperties()
					It always got font properties for 12px font.
					This has been 'fixed' but adding line height at the start of the cycle to
					avoid clipping of larger fonts which is incorrect obviously.
					May affect existing projects.
					*/
					fontProperties = outputTextData[i][j].fontProperties = PIXI.Text.calculateFontProperties( this.getFont( outputTextData[i][j].style ) );
					outputTextData[i][j].width = this.context.measureText(outputTextData[i][j].text).width;
					outputTextData[i][j].height = Math.max(outputTextData[i][j].fontProperties.fontSize, outputTextData[i][j].style.fontSize + outputTextData[i][j].style.strokeThickness, outputTextData[i][j].style.lineHeight);

					lineWidth += outputTextData[i][j].width;

					if (outputTextData[i][j].style.lineHeight != 0)
					{
						lineHeight = Math.max(lineHeight, outputTextData[i][j].style.lineHeight);
					}
					else
					{
						lineHeight = Math.max(lineHeight, outputTextData[i][j].height);
					}
				}

				lineWidths[i] = lineWidth;
				lineHeights[i] = lineHeight;
				maxLineWidth = Math.max(maxLineWidth, lineWidth);
			}

			if (this.style.wordWrap && this.style.wordWrapWidth)
			{
				maxLineWidth = Math.max(maxLineWidth, this.style.wordWrapWidth);
			}

			let stylesArray: PIXI.TextStyle[] = Object.keys(this._textStyles).map((k) =>
			{
				return this._textStyles[k];
			});

			let maxStrokeThickness:number = stylesArray.reduce((prev, curr) =>
			{
				return Math.max(prev, curr.strokeThickness);
			}, 0);

			let maxDropShadowDistance:number = stylesArray.reduce((prev, curr) =>
			{
				let value = curr.dropShadow ? curr.dropShadowDistance : 0;
				return Math.max(prev, value);
			}, 0);

			let maxPadding:number = stylesArray.reduce((prev, curr) =>
			{
				return Math.max(prev, curr.padding);
			}, 0);

			let width:number = maxLineWidth + maxDropShadowDistance;
			width += maxPadding * 2;

			this.canvas.width = Math.ceil(( width + this.context.lineWidth ) * this.resolution);

			let height:number = ( Math.max.apply( null, lineHeights ) * lines.length ) + maxDropShadowDistance;
			height += maxPadding * 2;

			this.canvas.height = height * this.resolution;

			this.context.scale(this.resolution, this.resolution);

			this.context.textBaseline = this._style.textBaseline;
			this.context.lineJoin = this._style.lineJoin;
			this.context.miterLimit = this._style.miterLimit;

			let linePositionX:number, linePositionY:number;
			let totalLineHeight:number = 0;

			//draw lines line by line
			for (i = 0; i < outputTextData.length; i++)
			{
				let line:any[] = outputTextData[i];

				let spacesCount:number = 0;
				let wordsWidth:number = 0;
				let justifySpacing:number = 0;  //extra pixels to add after each "space"

				let doJustify:boolean = (this.style.align === gf.JUSTIFY) && (i < (outputTextData.length - 1));  //do not justify last line

				if (doJustify)
				{
					//calculate spacesCount and wordsWidth
					for (j = 0; j < line.length; j++)
					{
						let textStyle = line[j].style;
						let text = line[j].text;

						this.context.font = textStyle.font;
						this.context.strokeStyle = textStyle.stroke;
						this.context.lineWidth = textStyle.strokeThickness;
						this.context.fillStyle = <any>this._generateFillStyle(textStyle.fill, [line[j].text]);

						let words:string[] = text.split(' ');
						for (let k:number = 0; k < words.length; k++)
						{
							if (k < (words.length - 1))
							{
								wordsWidth += this.context.measureText(words[k] + " ").width;
								spacesCount++;
							}
							else
							{
								wordsWidth += this.context.measureText(words[k]).width;
							}
						}
					}

					if (spacesCount > 0)
					{
						justifySpacing = (maxLineWidth - wordsWidth) / spacesCount;
					}
				}

				linePositionX = 0;

				for (j = 0; j < line.length; j++)
				{
					let textStyle = line[j].style;
					let text = line[j].text;
					let fontProperties = line[j].fontProperties;

					this.context.font = textStyle.font;
					this.context.strokeStyle = textStyle.stroke;
					this.context.lineWidth = textStyle.strokeThickness;

					linePositionX += maxStrokeThickness * 0.5;

					linePositionY = (maxStrokeThickness * 0.5 + totalLineHeight) + fontProperties.ascent;
					linePositionY -= lineHeights[i] - line[j].height - (maxStrokeThickness - textStyle.strokeThickness) * 0.5;

					var doJustifyLine:boolean = doJustify;

					var alg:string = this.style.align;
					if (alg == gf.JUSTIFY)
					{
						if (i == (outputTextData.length - 1))
						{
							doJustifyLine = false;
							alg = this._lastLineAlign;
						}

						if (spacesCount == 0)
						{
							doJustifyLine = false;
							alg = this._lastLineAlign;   //one-word lines should be aligned line last line
						}
					}

					if (alg == gf.RIGHT && linePositionX === 0)
					{
						linePositionX += maxLineWidth - lineWidths[i];
					}
					else if (alg == gf.CENTER && linePositionX === 0)
					{
						linePositionX += (maxLineWidth - lineWidths[i]) * 0.5;
					}

					if (this._verticalAlign == gf.BOTTOM)
					{
						linePositionY += (lineHeights[i] - line[j].height) * 2 - (maxStrokeThickness - textStyle.strokeThickness) * 0.5;
					}
					else if (this._verticalAlign == gf.CENTER)
					{
						linePositionY += (lineHeights[i] - line[j].height) * 0.5 - (maxStrokeThickness - textStyle.strokeThickness) * 0.5;
					}

					this.context.fillStyle = <any>this._generateFillStyle(textStyle, [line[j].text]);

					// draw shadow
					if (textStyle.dropShadow)
					{
						this.context.fillStyle = textStyle.dropShadowColor;

						let xShadowOffset = Math.sin(textStyle.dropShadowAngle) * textStyle.dropShadowDistance;
						let yShadowOffset = Math.cos(textStyle.dropShadowAngle) * textStyle.dropShadowDistance;

						if (textStyle.fill)
						{
							this.drawLetterSpacing(text, linePositionX + xShadowOffset, linePositionY + yShadowOffset);
						}
					}

					// set canvas text styles
					this.context.fillStyle = <any>this._generateFillStyle(textStyle.fill, [line[j].text]);

					if (doJustifyLine)
					{
						// draw lines
						if (textStyle.stroke && textStyle.strokeThickness)
						{
							line[j].width = this.drawLetterSpacingJustify(text, linePositionX, linePositionY, true, justifySpacing);
						}

						if (textStyle.fill)
						{
							line[j].width = this.drawLetterSpacingJustify(text, linePositionX, linePositionY, false, justifySpacing);
						}
					}
					else
					{
						// draw lines
						if (textStyle.stroke && textStyle.strokeThickness)
						{
							this.drawLetterSpacing(text, linePositionX, linePositionY, true);
						}

						if (textStyle.fill)
						{
							this.drawLetterSpacing(text, linePositionX, linePositionY);
						}
					}

					// set Position X to the line width
					// remove the strokeThickness otherwise the text will be to far from the previous group
					linePositionX += line[j].width;
					linePositionX -= maxStrokeThickness * 0.5;
				}

				totalLineHeight += lineHeights[i];
			}

			this.updateTexture();
			this.onResize();
		}


		protected drawLetterSpacingJustify(
			text:string,
			x:number,
			y:number,
			isStroke:boolean,
			justifySpacing:number):number
		{
			let width:number = 0;

			let words:string[] = text.split(' ');

			for (let i:number = 0; i < words.length; i++)
			{
				this.drawLetterSpacing(words[i], Math.floor(x + width + 0.5), y, isStroke);

				if (i < (words.length - 1))
				{
					width += this.context.measureText(words[i] + " ").width + justifySpacing;
				}
				else
				{
					width += this.context.measureText(words[i]).width;
				}
			}

			return width;
		}


		protected stripTags(text:string):string
		{
			for (let styleId in this._textStyles)
			{
				text = text.replace(new RegExp("<\/?(" + styleId + ")>", "g"), "")
			}

			return text;
		}



		protected wordWrap(text:string):string
		{
			// Greedy wrapping algorithm that will wrap words as the line grows longer
			// than its horizontal bounds.
			let result = '';
			let lines = text.split('\n');
			let wordWrapWidth = this._style.wordWrapWidth;

			//build array or all words
			var allwords:string[] = [];
			for (let i = 0; i < lines.length; i++)
			{
				let words = lines[i].split(' ');
				allwords = allwords.concat(words);
			}

			//reuse getTextDataPerLine() to get style for every word
			let outputTextData = this.getTextDataPerLine(allwords);

			let wordStyleIndex = 0;

			for (let i = 0; i < lines.length; i++)
			{
				let spaceLeft = wordWrapWidth;
				let words = lines[i].split(' ');
				for (let j = 0; j < words.length; j++)
				{
					//Fixed by Roman Lut:
					//Word wrapping was broken because incorrect font style was used during word wrap process.

					if (outputTextData[wordStyleIndex].length == 0)
					{
						//line contains a tag only, f.e <bold>
					}
					else
					{
						//set correct style before measuring text!
						this.context.font = this.getFont(outputTextData[wordStyleIndex][0].style);

						//fixme: remove all tags from word before measuring!
						let wordWidth = this.context.measureText(this.stripTags(words[j])).width;

						if (this._style.breakWords && wordWidth > wordWrapWidth)
						{
							// Word should be split in the middle
							let characters = words[j].split('');
							for (let c = 0; c < characters.length; c++)
							{
								let characterWidth = this.context.measureText(characters[c]).width;
								if (characterWidth > spaceLeft)
								{
									result += '\n' + characters[c];
									spaceLeft = wordWrapWidth - characterWidth;
								}
								else
								{
									if (c === 0)
									{
										result += ' ';
									}
									result += characters[c];
									spaceLeft -= characterWidth;
								}
							}
						}
						else
						{
							let wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;
							if (j === 0 || wordWidthWithSpace > spaceLeft)
							{
								// Skip printing the newline if it's the first word of the line that is
								// greater than the word wrap width.
								if (j > 0)
								{
									result += '\n';
								}
								result += words[j];
								spaceLeft = wordWrapWidth - wordWidth;
							}
							else
							{
								spaceLeft -= wordWidthWithSpace;
								result += ' ' + words[j];
							}
						}
					}

					wordStyleIndex++;
				}

				if (i < lines.length-1)
				{
					result += '\n';
				}
			}

			return result;
		}



		public get textStyles(): {[key:string]: PIXI.TextStyle}
		{
			return this._textStyles;
		}



		public set textStyles(value: {[key:string]: PIXI.TextStyle})
		{
			this.createTextStyles(value);
		}



		public get verticalAlign():string
		{
			return this._verticalAlign;
		}



		public set verticalAlign(value:string)
		{
			if (value == this._verticalAlign) return;

			this._verticalAlign = value;
			this.dirty = true;
		}

		public get lastLineAlign():string
		{
			return this._lastLineAlign;
		}



		public set lastLineAlign(value:string)
		{
			if (value == this._lastLineAlign) return;

			this._lastLineAlign = value;
			this.dirty = true;
		}
	}
}
