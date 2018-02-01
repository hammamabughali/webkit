/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../math/quaternion.ts"/>
/// <reference path="../math/vector3d.ts"/>
/// <reference path="../util/objectpool.ts"/>
/// <reference path="../webgl/color.ts"/>



module pogo
{
	//# TODO: verify whether object pools are actually more efficient for simple types like these
	export var pColors = new kr3m.util.ObjectPool<kr3m.webgl.Color>(kr3m.webgl.Color);
	export var pMatrices = new kr3m.util.ObjectPool<kr3m.math.Vector3d>(kr3m.math.Vector3d);
	export var pQuaternions = new kr3m.util.ObjectPool<kr3m.math.Vector3d>(kr3m.math.Vector3d);
	export var pVectors = new kr3m.util.ObjectPool<kr3m.math.Vector3d>(kr3m.math.Vector3d);
}
