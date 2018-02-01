module cuboro.core
{
	export class ControlsSettings
	{
		public camera: THREE.PerspectiveCamera;
		public interaction: cuboro.core.Interaction;
		public lookAt: THREE.Vector3;
		public panAngle:number = 0;
		public tiltAngle:number = 10;
		public distance:number = 30;
		public minDistance:number = 8;
		public maxDistance:number = 30;
		public minTiltAngle:number = 5;
		public maxTiltAngle:number = 89;
		public minPanAngle:number = -Infinity;
		public maxPanAngle:number = Infinity;
		public steps:number = 8;
		public yFactor:number = 2
	}
}
