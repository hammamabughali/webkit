attribute vec3 aVertex;
attribute vec3 aNormal;
attribute vec2 aTexel0;

uniform mat4 uVM;
uniform mat4 uPVM;
uniform mat4 uN;

varying vec3 vPosition;
varying vec2 vTexel0;
varying vec3 vNormal;



void main(void)
{
	vPosition = (uVM * vec4(aVertex, 1.0)).xyz;
	gl_Position = uPVM * vec4(aVertex, 1.0);
	vNormal = (uN * vec4(aNormal, 1)).xyz;
	vTexel0 = aTexel0;
}
