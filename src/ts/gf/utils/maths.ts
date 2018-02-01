module gf.utils
{
	export class Maths
	{
		public static TWO_PI:number = Math.PI * 2;

		private static degreeToRadiansFactor:number = Math.PI / 180;
		private static radianToDegreesFactor:number = 180 / Math.PI;



		public static intersectRectRect(r1: PIXI.Rectangle, r2: PIXI.Rectangle):boolean
		{
			if (r1.x < r2.x + r2.width && r2.x < r1.x + r1.width && r1.y < r2.y + r2.height)
			{
				return r2.y < r1.y + r1.height;
			}
			else
			{
				return false;
			}
		}



		public static intersectCircleRect(
			cx:number,
			cy:number,
			radius:number,
			r: PIXI.Rectangle):boolean
		{
			let closestX = (cx < r.x ? r.x : (cx > r.x + r.width ? r.x + r.width : cx));
			let closestY = (cy < r.y ? r.y : (cy > r.y + r.height ? r.y + r.height : cy));
			let dx = closestX - cx;
			let dy = closestY - cy;

			return ( dx * dx + dy * dy ) <= radius * radius;
		}



		public static intersectCircleCircle(
			x1:number,
			y1:number,
			r1:number,
			x2:number,
			y2:number,
			r2:number):boolean
		{
			const dx = x1 - x2;
			const dy = y1 - y2;
			const len = Math.sqrt(dx * dx + dy * dy);

			return len < r1 + r2;
		}


		/*
			Returns the distance between the two given set of coordinates.
				@param {number} x1
			@param {number} y1
			@param {number} x2
			@param {number} y2
			@return {number} The distance between the two sets of coordinates.
		*/
		public static distance(
			p1: PIXI.Point,
			p2: PIXI.Point):number
		public static distance(x1:number, y1:number, x2:number, y2:number):number
		public static distance(value1:any, value2:any, x2?:number, y2?:number):number
		{
			let dx;
			let dy;

			if (isNaN(value1))
			{
				dx = value1.x - value2.x;
				dy = value1.y - value2.y;
			}
			else
			{
				dx = value1 - x2;
				dy = value2 - y2;
			}

			return Math.sqrt(dx * dx + dy * dy);
		}



		/*
				@param pt1
			@param pt2
			@param f
			@returns {{x:number, y:number}}
		*/
		public static lerp(pt1: { x:number, y:number }, pt2: { x:number, y:number }, f:number): { x:number, y:number }
		{
			let x:number = f * pt1.x + (1 - f) * pt2.x;
			let y:number = f * pt1.y + (1 - f) * pt2.y;

			return {x: x, y: y};
		}



		/*
			Convert degrees to radians.
				@param degrees
			@returns {number}
		*/
		public static degToRad(degrees:number):number
		{
			return degrees * this.degreeToRadiansFactor;
		}



		/*
			Convert radians to degrees.
				@param radians
			@returns {number}
		*/
		public static radToDeg(radians:number):number
		{
			return radians * this.radianToDegreesFactor;
		}



		/*
			Round up to the nearest multiple of whatever factor you provide.
				@param value
			@param factor
			@returns {number}
		*/
		public static round(value:number, factor:number):number
		{
			return value - (value % factor) + ( (value % factor > 0 || value == 0) && factor);
		}



		/*
			Force a value within the boundaries by clamping `value` to the range `[min, max]`.
				@param {number} value
			@param {number} min
			@param {number} max
			@return {number}
		*/
		public static clamp(value:number, min:number, max:number):number
		{
			return (value < min) ? min : ((value > max) ? max : value);
		}



		/*
			Keeps an angle value between -180 and +180.
				@param {number} angle - The angle value to check
			@param {boolean} radians - Set to `true` if the angle is given in radians, otherwise degrees is expected.
			@return {number} The new angle value, returns the same as the input angle if it was within bounds.
		*/
		public static wrapAngle(angle:number, radians:boolean = false):number
		{
			let radianFactor = (radians) ? Math.PI / 180 : 1;
			return this.wrap(angle, -180 * radianFactor, 180 * radianFactor);
		}



		/*
			Moves a radian angle into the range [-PI, +PI], while keeping the direction intact.
				@param {number} angle - The angle to normalize.
			@return {number} The ranged angle.
		*/
		public static normalizeAngle(angle:number): Number
		{
			// move to equivalent value in range [0 deg, 360 deg] without a loop
			angle = angle % gf.utils.Maths.TWO_PI;

			// move to [-180 deg, +180 deg]
			if (angle < -Math.PI) angle += gf.utils.Maths.TWO_PI;
			if (angle > Math.PI) angle -= gf.utils.Maths.TWO_PI;

			return angle;
		}



		/*
			Ensures that the value always stays between min and max, by wrapping the value around.
			max should be larger than min, or the function will return 0.
				@param {number} value - The value to wrap.
			@param {number} min - The minimum the value is allowed to be.
			@param {number} max - The maximum the value is allowed to be.
			@return {number} The wrapped value.
		*/
		public static wrap(value:number, min:number, max:number):number
		{
			let range:number = max - min;

			if (range <= 0)
			{
				return 0;
			}

			let result:number = (value - min) % range;

			if (result < 0)
			{
				result += range;
			}

			return result + min;
		}



		/*
			Returns a random integer between min (inclusive) and max (inclusive)
				@param {number} min - The minimum the value is allowed to be.
			@param {number} max - The maximum the value is allowed to be.
			@returns {number} The random integer
		*/
		public static random(min:number, max:number):number
		{
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}



		/*
			Returns a random float between min (inclusive) and max (inclusive)
				@param {number} min - The minimum the value is allowed to be.
			@param {number} max - The maximum the value is allowed to be.
			@returns {number} The random float
		*/
		public static randomFloat(min:number, max:number):number
		{
			return Math.random() * (max - min) + min;
		}



		public static randomElement<T>(array: T[], except?: T[]): T
		{
			if (!array)
				return undefined;

			if (array.length == 0)
				return undefined;

			if (array.length == 0)
				return undefined;

			const result = array[gf.utils.Maths.random(0, array.length - 1)];

			let found = false;
			if (except && except.length > 0)
			{
				if (except.indexOf(result) != -1) found = true;
			}

			if (found)
				return this.randomElement(array, except);

			return result;
		}



		public static shuffle<T>(array: T[]): T[]
		{
			let j:number, x: T, i:number;
			for (i = array.length; i; --i)
			{
				j = Math.floor(Math.random() * i);
				x = array[i - 1];
				array[i - 1] = array[j];
				array[j] = x;
			}

			return array;
		}



		/*
			Returns an array of shuffled numbers from 0 (inclusive)
			to count (exclusive) in random order.
			@param count
			@returns {number[]}
		*/
		public static shuffledInts(count:number):number[]
		{
			let result:number[] = [];
			for (let i = 0; i < count; ++i)
				result.push(i);

			return gf.utils.Maths.shuffle(result);
		}
	}
}
