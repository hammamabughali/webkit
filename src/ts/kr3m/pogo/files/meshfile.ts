module pogo.files
{
	export abstract class MeshFile
	{
		public vertexData:number[] = [];
		public texelData:number[] = [];
		public elementData:number[] = [];

		public weightsPerBone:number = 0;
		public boneWeightData:number[] = [];

		public abstract parse(code:string):void;
	}
}
