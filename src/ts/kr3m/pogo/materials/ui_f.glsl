varying vec3 vPosition;
varying vec2 vTexel0;

uniform sampler2D uDiffuseMap;



void main(void)
{
	gl_FragColor = texture2D(uDiffuseMap, vTexel0);
}
