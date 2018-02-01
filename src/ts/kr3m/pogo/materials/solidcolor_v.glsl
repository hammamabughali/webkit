attribute vec3 aVertex;

uniform mat4 uPVM;



void main(void)
{
	gl_Position = uPVM * vec4(aVertex, 1.0);
}
