module cuboro.utils
{
	export class Maths
	{
		public static isVector3Equal(v1: THREE.Vector3, v2: THREE.Vector3): boolean
		{
			return v1.x == v2.x && v1.y == v2.y && v1.z == v2.z;
		}
	}
}
