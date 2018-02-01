module gf.utils
{
	export class AlignData
	{
		public hAlignOffset:number = 0;
		public hAlignParent:gf.display.IDisplay | gf.core.Game | number;
		public hAlignValue:string = gf.NONE;
		public vAlignOffset:number = 0;
		public vAlignParent:gf.display.IDisplay | gf.core.Game | number;
		public vAlignValue:string = gf.NONE;
	}
}
