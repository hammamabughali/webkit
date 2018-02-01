/// <reference path="../../math/quaternion.ts"/>
/// <reference path="../../pogo/files/meshfile.ts"/>
/// <reference path="../../util/stringex.ts"/>



module pogo.files
{
	export class Md5Mesh extends MeshFile
	{
		private stringsToNumbers(data:any[]):void
		{
			for (var i = 0; i < data.length; ++i)
			{
				for (var id in data[i])
				{
					var newValue = parseFloat(data[i][id]);
					if (!isNaN(newValue))
						data[i][id] = newValue;
				}
			}
		}



		public parse(code:string):void
		{
			//# TODO: Parser statt RegEx verwenden für Performance

			var jointBlocks = code.match(/joints {[\s\S]+?}/g);
			for (var i = 0; i < jointBlocks.length; ++i)
			{
				var jointRegEx = (/"([^"]+)"\s+([\-\d\.]+)\s+\(\s*([\-\d\.]+)\s+([\-\d\.]+)\s+([\-\d\.]+)\s*\)\s+\(\s*([\-\d\.]+)\s+([\-\d\.]+)\s+([\-\d\.]+)\s*\)/g);
				var jointGroups = ["name", "parentId", "x", "y", "z", "rx", "ry", "rz"];
				var rawJoints = kr3m.util.StringEx.captureNamedGlobal(jointBlocks[i], jointRegEx, jointGroups);
				this.stringsToNumbers(rawJoints);

				for (k = 0; k < rawJoints.length; ++k)
				{
					rawJoints[k].p = new kr3m.math.Vector3d(rawJoints[k].x, rawJoints[k].y, rawJoints[k].z);
					rawJoints[k].q = new kr3m.math.Quaternion();
					rawJoints[k].q.setUnit(rawJoints[k].rx, rawJoints[k].ry, rawJoints[k].rz);
				}
			}

			var meshes = code.match(/mesh {[\s\S]+?}/g);
			var elementOffset = 0;

			for (var k = 0; k < meshes.length; ++k)
			{
				var vertRegEx = /vert (\d+) \( ([\d\.]+) ([\d\.]+) \) (\d+) (\d+)/g;
				var vertGroups = ["id", "s", "t", "weightOffset", "weightCount"];
				var rawVerts = kr3m.util.StringEx.captureNamedGlobal(meshes[k], vertRegEx, vertGroups);
				this.stringsToNumbers(rawVerts);

				var triRegEx = /tri (\d+) (\d+) (\d+) (\d+)/g;
				var triGroups = ["id", "a", "b", "c"];
				var rawTris = kr3m.util.StringEx.captureNamedGlobal(meshes[k], triRegEx, triGroups);
				this.stringsToNumbers(rawTris);

				var weightRegEx = /weight (\d+) (\d+) ([\-\d\.]+) \( ([\-\d\.]+) ([\-\d\.]+) ([\-\d\.]+) \)/g;
				var weightGroups = ["id", "joint", "bias", "x", "y", "z"];
				var rawWeights = kr3m.util.StringEx.captureNamedGlobal(meshes[k], weightRegEx, weightGroups);
				this.stringsToNumbers(rawWeights);

				for (var i = 0; i < rawVerts.length; ++i)
				{
					var v = rawVerts[i];
					var pos = new kr3m.math.Vector3d();

					this.weightsPerBone = Math.max(this.weightsPerBone, v.weightCount);

					for (var j = 0; j < v.weightCount; ++j)
					{
						var w = rawWeights[v.weightOffset + j];
						var joint = rawJoints[w.joint];
						var jointRot = <kr3m.math.Quaternion> joint.q;
						var jointPos = <kr3m.math.Vector3d> joint.p;
						var weightPos = new kr3m.math.Vector3d(w.x, w.y, w.z);
						pos.add(jointPos.plus(jointRot.applied(weightPos)).scaled(w.bias));
					}

					this.vertexData.push(pos.x, pos.z, -pos.y);
					this.texelData.push(v.s, v.t);
				}

				for (var i = 0; i < rawTris.length; ++i)
				{
					var t = rawTris[i];
					this.elementData.push(elementOffset + t.a, elementOffset + t.c, elementOffset + t.b);
				}
				elementOffset += rawVerts.length;
			}

			//# FIXME: boneWeightData noch befüllen
		}
	}
}
