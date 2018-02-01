module gf.utils
{
	export class Align
	{
		public static centerX(
			value: gf.display.IDisplay,
			alignTo?: gf.display.IDisplay | gf.core.Game | number):number
		{
			if (!alignTo) alignTo = value.game;

			let w:number;
			let px:number = 0;

			if (typeof alignTo === "number")
			{
				w = <number>alignTo;
			}
			else if (alignTo instanceof gf.core.Game)
			{
				w = value.game.width;
			}
			else
			{
				px = (<gf.display.IDisplay>alignTo).getLocalBounds().x;
				if ((<gf.display.IDisplay>alignTo).scale)
				{
					w = ((<gf.display.IDisplay>alignTo).width / (<gf.display.IDisplay>alignTo).scale.x) >> 0;
				}
				else
				{
					w = (<gf.display.IDisplay>alignTo).width >> 0;
				}
			}

			return ((w - value.width) >> 1);
		}



		public static centerY(
			value: gf.display.IDisplay,
			alignTo?: gf.display.IDisplay | gf.core.Game | number):number
		{
			if (!alignTo) alignTo = value.game;

			let h:number;
			let py:number = 0;

			if (typeof alignTo === "number")
			{
				h = <number>alignTo;
			}
			else if (alignTo instanceof gf.core.Game)
			{
				h = value.game.height;
			}
			else
			{
				py = (<gf.display.IDisplay>alignTo).getLocalBounds().y;
				if ((<gf.display.IDisplay>alignTo).scale)
				{
					h = ((<gf.display.IDisplay>alignTo).height / (<gf.display.IDisplay>alignTo).scale.y) >> 0;
				}
				else
				{
					h = (<gf.display.IDisplay>alignTo).height >> 0;
				}
			}

			return ((h - value.height) >> 1);
		}



		/*
			Aligns an object horizontally
			@param value Object to align
			@param align Align value @see {@link gf.CENTER, @link gf.LEFT, @link gf.RIGHT, @link gf.NONE}
			@param alignTo Object or number to which this object aligns to. If nothing is specified, gf.core.Game is used
			@param offset Offset value
		*/
		public static hAlign(
			value: gf.display.IDisplay,
			align:string,
			alignTo?: gf.display.IDisplay | gf.core.Game | number,
			offset:number = 0):void
		{
			if (!value.alignData) return;

			if (align == gf.NONE)
			{
				value.alignData.hAlignValue = null;
				value.alignData.hAlignOffset = null;
				value.alignData.hAlignParent = null;
				return;
			}

			value.alignData.hAlignValue = align;
			value.alignData.hAlignOffset = offset;
			if (!alignTo)
				value.alignData.hAlignParent = alignTo = value.game;
			else
				value.alignData.hAlignParent = <gf.display.IDisplay>alignTo;

			let w:number;
			let px:number = 0;

			if (typeof alignTo === "number")
			{
				w = <number>alignTo;
			}
			else if (alignTo instanceof gf.core.Game)
			{
				w = value.game.width;
			}
			else
			{
				px = (<gf.display.IDisplay>alignTo).getLocalBounds().x;
				if ((<gf.display.IDisplay>value.alignData.hAlignParent).scale)
				{
					w = ((<gf.display.IDisplay>value.alignData.hAlignParent).width / (<gf.display.IDisplay>value.alignData.hAlignParent).scale.x) >> 0;
				}
				else
				{
					w = (<gf.display.IDisplay>value.alignData.hAlignParent).width >> 0;
				}
			}

			if (align == gf.LEFT)
			{
				value.position.x = offset;
			}
			else if (align == gf.CENTER)
			{
				value.position.x = ((w - value.width) >> 1) + offset;
			}
			else if (align == gf.RIGHT)
			{
				value.position.x = w - value.width + offset;
			}

			value.position.x += px - value.getLocalBounds().x;
		}



		/*
			Aligns an object vertically
			@param value Object to align
			@param align Align value @see {@link gf.CENTER, @link gf.BOTTOM, @link gf.TOP, @link gf.NONE}
			@param alignTo Object or number to which this object aligns to. If nothing is specified, gf.core.Game is used
			@param offset Offset value
		*/
		public static vAlign(
			value: gf.display.IDisplay,
			align:string,
			alignTo?: gf.display.IDisplay | gf.core.Game | number,
			offset:number = 0):void
		{
			if (!value.alignData) return;

			if (align == gf.NONE)
			{
				value.alignData.vAlignValue = null;
				value.alignData.vAlignOffset = null;
				value.alignData.vAlignParent = null;
				return;
			}

			value.alignData.vAlignValue = align;
			value.alignData.vAlignOffset = offset;
			if (!alignTo)
				value.alignData.vAlignParent = alignTo = value.game;
			else
				value.alignData.vAlignParent = <gf.display.IDisplay>alignTo;

			let h:number;
			let py:number = 0;

			if (typeof alignTo == "number")
			{
				h = <number>alignTo;
			}
			else if (alignTo instanceof gf.core.Game)
			{
				h = value.game.height;
			}
			else
			{
				py = (<gf.display.IDisplay>alignTo).getLocalBounds().y;
				if ((<gf.display.IDisplay>value.alignData.vAlignParent).scale)
				{
					h = ((<gf.display.IDisplay>value.alignData.vAlignParent).height / (<gf.display.IDisplay>value.alignData.vAlignParent).scale.y) >> 0;
				}
				else
				{
					h = (<gf.display.IDisplay>value.alignData.vAlignParent).height >> 0;
				}
			}

			if (align == gf.TOP)
			{
				value.position.y = offset;
			}
			else if (align == gf.CENTER)
			{
				value.position.y = ((h - value.height) >> 1) + offset;
			}
			else if (align == gf.BOTTOM)
			{
				value.position.y = h - value.height + offset;
			}

			value.position.y += py - value.getLocalBounds().y;
		}



		/*
			Resize update function which performs vertical and horizontal align (if specified).
			Also, if the object got children, the onResize of each child is called.
			@param value
		*/
		public static onResize(value: gf.display.IDisplay):void
		{
			if (value.alignData)
			{
				if (value.alignData.hAlignValue && value.alignData.hAlignValue != gf.NONE)
				{
					value.hAlign(value.alignData.hAlignValue, value.alignData.hAlignParent, value.alignData.hAlignOffset);
				}

				if (value.alignData.vAlignValue && value.alignData.vAlignValue != gf.NONE)
				{
					value.vAlign(value.alignData.vAlignValue, value.alignData.vAlignParent, value.alignData.vAlignOffset);
				}
			}

			value.children.forEach((child: PIXI.DisplayObject) =>
			{
				if (typeof child["onResize"] == "function" && child.parent === value)
					child["onResize"]();
			});
		}



		/*
			Get the left position of an object
			@param value Object to get the position of
			@returns {number}
		*/
		public static left(value: gf.display.IDisplay):number
		{
			return value.position.x + value.getLocalBounds().x;
		}



		/*
			Get the right position of an object
			@param value Object to get the position of
			@returns {number}
		*/
		public static right(value: gf.display.IDisplay):number
		{
			return value.left + value.width;
		}



		/*
			Get the top position of an object
			@param value Object to get the position of
			@returns {number}
		*/
		public static top(value: gf.display.IDisplay):number
		{
			return value.position.y + value.getLocalBounds().y;
		}



		/*
			Get the bottom position of an object
			@param value Object to get the position of
			@returns {number}
		*/
		public static bottom(value: gf.display.IDisplay):number
		{
			return value.top + value.height;
		}
	}
}
