/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../pogo/entity.ts"/>
/// <reference path="../webgl/program.ts"/>



module pogo
{
	export interface CameraOptions extends EntityOptions
	{
	}



	export abstract class Camera extends Entity
	{
		protected options:CameraOptions;

		protected perspectiveMatrix:kr3m.math.Matrix4x4;
		protected perspectiveMatrixDirty = false;

		protected viewMatrix:kr3m.math.Matrix4x4;
		protected viewMatrixDirty = false;



		constructor(
			canvas:Canvas,
			options?:CameraOptions)
		{
			super(canvas, options);

			this.perspectiveMatrix = new kr3m.math.Matrix4x4();
			this.perspectiveMatrix.setIdentity();

			this.viewMatrix = new kr3m.math.Matrix4x4();
			this.viewMatrix.setIdentity();
		}



		protected abstract updatePerspectiveMatrix():void;



		public getPerspectiveMatrix():kr3m.math.Matrix4x4
		{
			if (this.perspectiveMatrixDirty)
			{
				this.perspectiveMatrixDirty = false;
				this.updatePerspectiveMatrix();
			}
			return this.perspectiveMatrix;
		}



		protected abstract updateViewMatrix():void;



		public getViewMatrix():kr3m.math.Matrix4x4
		{
			if (this.viewMatrixDirty)
			{
				this.viewMatrixDirty = false;
				this.updateViewMatrix();
			}
			return this.viewMatrix;
		}



		public setWorldPosition(worldX:number, worldY:number, worldZ:number):void
		{
			//# TODO: NYI setWorldPosition
			throw new Error("NYI setWorldPosition");
		}



		public updateMatrix():void
		{
			// don't do anything
		}
	}
}
