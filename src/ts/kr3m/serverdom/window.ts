//# EXPERIMENTAL

//# CLIENT
//# ERROR: this file must never be compiled into a client side script!
//# /CLIENT
module kr3m.serverdom
{
	export class Window
	{
		public getComputedStyle(node:any, pseudoElement?:string):any
		{
			//# FIXME: NYI getComputedStyle
			return {};
		}
	}
}



window = <any> new kr3m.serverdom.Window();
getComputedStyle = <any> window.getComputedStyle.bind(window);
//# /EXPERIMENTAL
