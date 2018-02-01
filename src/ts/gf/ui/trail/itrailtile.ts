/// <reference path="../../vo/tilevo.ts"/>



module gf.ui.trail
{
	export interface ITrailTile extends gf.display.Container
	{
		tfLevel:gf.display.Text;
		tileVO:gf.vo.TileVO;

		update():void;
	}
}
