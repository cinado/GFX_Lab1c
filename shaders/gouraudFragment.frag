precision mediump float;

uniform sampler2D u_texture;

varying vec4 fragmentColor;
varying vec2 texCoordinates;

void main() {
    //gl_FragColor = fragmentColor;
    vec4 colorOfTexture = texture2D(u_texture, texCoordinates);

    /*if(fragmentColor.a > 0.5){
        gl_FragColor = fragmentColor; 
    }
    else{*/
        gl_FragColor = colorOfTexture;
    //}
    
}