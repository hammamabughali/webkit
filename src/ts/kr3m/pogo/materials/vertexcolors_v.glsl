attribute vec3 aVertex;
attribute vec4 aColor;

uniform mat4 uPVM;

varying vec4 vColor;



void main(void)
{
	gl_Position = uPVM * vec4(aVertex, 1.0);
	vColor = aColor;
}
