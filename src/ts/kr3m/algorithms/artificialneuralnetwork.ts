/// <reference path="../math/matrix.ts"/>



//# EXPERIMENTAL
module kr3m.algorithms
{
	export class ArtificialNeuralNetwork
	{
		public layers:kr3m.math.Matrix[] = [];
		public learnFactor = 1;



		constructor(...layerSizes:number[])
		{
			var l = layerSizes.length - 1;
			for (var i = 0; i < l; ++i)
			{
				var matrix = new kr3m.math.Matrix(layerSizes[i], layerSizes[i + 1]);
				for (var j = 0; j < matrix.v.length; ++j)
					matrix.v[j] = Math.random();
				this.layers.push(matrix);
			}
		}



		protected activate(value:number):number
		{
			return 1 / (1 + Math.exp(-value));
		}



		protected activatePrime(value:number):number
		{
			var f = 1 / (1 + Math.exp(-value));
			return f * (1 - f);
		}



		public train(rawInput:number[], expected:number[]):number[]
		{
			var inputs:kr3m.math.Matrix[] = [];
			var primes:kr3m.math.Matrix[] = [];

			var rawMatrix = new kr3m.math.Matrix(1, rawInput.length);
			rawMatrix.v = rawInput;
			inputs.push(rawMatrix);

			for (var i = 0; i < this.layers.length; ++i)
			{
				var net = inputs[i].concated(this.layers[i]);
				inputs.push(net.cwCalled(this.activate));
				primes.push(net.cwCalled(this.activatePrime));
			}

			var last = this.layers.length - 1;
			var target = new kr3m.math.Matrix(1, expected.length);
			target.v = expected;
			var output = inputs[inputs.length - 1];
			var errors = primes[last].times(target.minus(output));
			for (var i = last; i >= 0; --i)
			{
				//# FIXME: irgendwie stimmt die Backpropagation hier noch nicht so ganz
				var deltas = inputs[i].transposed().concated(errors).scaled(this.learnFactor);
				errors = this.layers[i].concated(errors.transposed()).transposed();
				this.layers[i].add(deltas);
			}
			return output.v;
		}



		public guess(rawInput:number[]):number[]
		{
			var values = new kr3m.math.Matrix(1, rawInput.length);
			values.v = rawInput;
			for (var i = 0; i < this.layers.length; ++i)
			{
				values = values.concated(this.layers[i]);
				values.v = values.v.map(this.activate);
			}
			return values.v;
		}
	}
}
//# /EXPERIMENTAL
