varying vec3 vPosition;
varying vec2 vTexel0;
varying vec3 vNormal;

uniform mat4 uV;
uniform sampler2D uDiffuseMap;
uniform vec3 uAmbientLight;
uniform vec3 uLightPositions[##maxLightCount##];
uniform vec3 uLightColors[##maxLightCount##];



vec4 calculateLighting(vec3 p, vec3 n)
{
	float f;
	vec3 diffuse = vec3(0, 0, 0);
	vec3 toLight;
	vec4 lightViewPos;
	for (int i = 0; i < ##maxLightCount##; ++i)
	{
		lightViewPos = uV * vec4(uLightPositions[i], 1.0);
		toLight = normalize(lightViewPos.xyz - p);
		f = dot(n, toLight);
		diffuse = diffuse + f * uLightColors[i];
	}
	return min(vec4(1, 1, 1, 1), vec4(uAmbientLight + f * diffuse, 1));
}



void main(void)
{
	vec4 textureColor = texture2D(uDiffuseMap, vTexel0);
	vec4 lighting = calculateLighting(vPosition, normalize(vNormal));
	gl_FragColor = lighting * textureColor;
}
