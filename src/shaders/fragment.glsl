uniform float uTime;
uniform sampler2D uSprite;

varying vec2 vUv;

void main()
{
    
    vec2 offset=vec2(
        mod(floor(uTime),5.),
        4.-floor(mod(uTime/5.,5.))
    );
    vec2 uv1=vUv/5.+offset/5.;
    
    vec4 color=texture2D(uSprite,uv1);
    
    gl_FragColor=vec4(vUv,1.,1.);
    gl_FragColor=color;
}