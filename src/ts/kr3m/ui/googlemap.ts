/// <reference path="../lib/googlemaps.ts"/>
/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class GoogleMap extends kr3m.ui.Element
	{
		private map:google.maps.Map;
		private markers:google.maps.Marker[];



		constructor(parent:any)
		{
			super(parent);
			this.markers = [];
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.initMap();
		}



		private initMap():void
		{
			//# TODO: es funktioniert noch nicht ganz zuverlässig mit dem dynamischen
			//# TODO: Anlegen der Map, da müsste noch ein bisschen Zeit investiert werden
			//# TODO: damit das immer richtig angezeigt wird - siehe auch forceRedraw()
			var options:any = {};
			options.center = new google.maps.LatLng(-34.397, 150.644);
			options.zoom = 8;
			options.disableDefaultUI = true;
			this.map = new google.maps.Map(this.dom.get(0), options);
		}



		public forceRedraw():void
		{
			//# TODO: es ist hässlich, dass wir das hier brauchen, es wäre schöner
			//# TODO: wenn es tatsächlich nur dann aufgerufen werden würde, wenn sich
			//# TODO: das entsprechende Canvas-Element verändert (Größe, visible, usw.)
			google.maps.event.trigger(this.map, "resize");
		}



		public clearMarkers():void
		{
			for (var i = 0; i < this.markers.length; ++i)
				this.markers[i].setMap(null);
			this.markers = [];
		}



		public addMarker(latitude:number, longitude:number, caption:string):void
		{
			var options =
			{
				map:this.map,
				position:new google.maps.LatLng(latitude, longitude),
				title:caption
			};
			var marker = new google.maps.Marker(options);
			this.markers.push(marker);
		}



		public showArea(
			latitude1:number,
			longitude1:number,
			latitude2:number,
			longitude2:number):void
		{
			var sw = new google.maps.LatLng(latitude1, longitude1);
			var ne = new google.maps.LatLng(latitude2, longitude2);
			var bounds = new google.maps.LatLngBounds(sw, ne);
			this.map.fitBounds(bounds);
			this.forceRedraw();
		}
	}
}
