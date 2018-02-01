attribute vec3 aVertex;
attribute vec2 aTexel0;

uniform mat4 uPVM;

varying vec2 vTexel0;



void main(void)
{
	gl_Position = uPVM * vec4(aVertex, 1.0);
	vTexel0 = aTexel0;
}
