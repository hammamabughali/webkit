/// <reference path="../../geom/point2d.ts"/>



module kr3m.images.outlines
{
	export function arrow(positions:number[], width:number):kr3m.geom.Point2d[]
	{
		if (positions.length < 4 || positions.length % 2 != 0)
			throw new Error("invalid positions parameter for arrow function");

		var input:kr3m.geom.Point2d[] = [];
		for (var i = 0; i < positions.length; i += 2)
			input.push(new kr3m.geom.Point2d(positions[i], positions[i + 1]));

		var half = width / 2;

		var output:kr3m.geom.Point2d[] = [];

		var f = input.shift();
		var t = input.shift();
		var dir = t.minus(f).normalized();
		var diag = new kr3m.geom.Point2d(half, half);
		diag.rotate(dir.rotationAngle());

		output.push(f.plus(diag.rotated(90)), f.plus(diag.rotated(180)));

		while (input.length > 0)
		{
			f = t;
			t = input.shift();
			var oldDir = dir;
			dir = t.minus(f).normalized();

			var p1 = f.plus(dir.scaled(half)).minus(oldDir.scaled(half));
			var p2 = f.minus(dir.scaled(half)).plus(oldDir.scaled(half));
			if (dir.dot(oldDir.ortho()) >= 0)
				output.splice(output.length / 2, 0, p1, p2);
			else
				output.splice(output.length / 2, 0, p2, p1);
		}

		var tail = output.slice(output.length / 2);
		output = output.slice(0, output.length / 2);

		var ortho = dir.ortho().scaled(half);
		var back = dir.scaled(width * 2);

		output.push(t.minus(back).plus(ortho));
		output.push(t.minus(back).plus(ortho).plus(ortho));
		output.push(t);
		output.push(t.minus(back).minus(ortho).minus(ortho));
		output.push(t.minus(back).minus(ortho));
		output = output.concat(tail);

		return output;
	}
}
