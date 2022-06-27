varying vec2 vUv;
attribute float speed;
varying float vSpeed;
attribute float offset;
uniform float uTime;
void main()
{
    vSpeed=speed;
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    vec3 newpos=position;
    newpos.xy-=-2.+speed*mod(uTime+offset*4.,6.);
    gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(newpos,1.);
    
    vUv=uv;
}