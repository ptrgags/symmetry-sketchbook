var y=Object.defineProperty;var w=(e,i,t)=>i in e?y(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var _=(e,i,t)=>(w(e,typeof i!="symbol"?i+"":i,t),t);import{S as u,T as k,_ as x}from"./Sketch-v-RCqe1c.js";import{S as b,c as o,F as T}from"./common_glsl-CF-Ah18z.js";import{R as I}from"./PolynomialShader-DRdb8B3X.js";import{d as C,r as E,c as $,a as p,b as m,F as A,f as F,g as c,e as n,s as l,h as d,x as R,y as D,_ as N}from"./index-tZqL7VPW.js";const S=`
${o.defines}
attribute vec3 aPosition;
attribute vec2 aTexCoord;

${o.uniforms}
${o.uniforms_coefficients}

// Value from 0 to 1 indicating how much to "tie" the fabric
uniform float tie;

varying vec2 uv;
varying vec2 warped_pos;

${o.funcs_polar}
${o.funcs_view}

${I}

void main() {
    uv = aTexCoord;
    uv.y = 1.0 - uv.y;
    
    vec2 grid_position = aPosition.xy;
    vec2 z = to_complex(uv);
    
    warped_pos = compute(z);
    
    float t = clamp(tie, 0.0, 1.0);
    vec2 pos = mix(grid_position, warped_pos, t);
    
    gl_Position = vec4(pos, 0.0, 1.0); 
}
`,V=`
precision highp float;
${o.defines}
#define GRID_WIDTH 40.0

varying vec2 uv;
varying vec2 warped_pos;

${o.uniforms}
${o.uniforms_coefficients}

// Value from 0 to 1 indicating how much to color the fabric
uniform float dye;

${o.funcs_view}
${o.funcs_polar}


vec3 palette(vec2 z) {
    vec2 square_id = floor(2.0 * z);
    float checkerboard = mod(square_id.x + square_id.y, 2.0);
    return vec3(checkerboard, 0.0, 0.0);
}

void main() {
    vec3 color = palette(warped_pos);

    vec3 grid_lines = vec3(1.0);
    float t = clamp(dye, 0.0, 1.0);
    color = mix(grid_lines, color, t); 
    
    vec2 cell_uv = fract(GRID_WIDTH * uv);
    vec2 from_center = 2.0 * abs(cell_uv - 0.5);
    float dist_from_center = max(from_center.x, from_center.y);
    float mask = 1.0 - step(dist_from_center, 0.8);
    if (mask == 0.0) {
        discard;
    }
    
    gl_FragColor = vec4(mask * color, 1.0);
}
`;class P extends b{constructor(){super(...arguments);_(this,"grid_model")}preload(t){this.grid_model=t.loadModel("/symmetry-sketchbook/grid.obj")}init(t){super.init(t,S,V)}draw(){const t=this.sketch;!t||!this.grid_model||(this.update_time(),this.enable(),t.fill(0,0,0,0),t.model(this.grid_model),this.disable())}}var r=(e=>(e[e.Initial=0]="Initial",e[e.Tying=1]="Tying",e[e.Dyeing=2]="Dyeing",e[e.Untying=3]="Untying",e))(r||{}),g=(e=>(e[e.Pausing=0]="Pausing",e[e.Animating=1]="Animating",e))(g||{});const f=120,G=60;function U(e,i){switch(e){case 0:return i;case 1:return 1;case 2:return 1-i;case 3:return 0}}function z(e,i){switch(e){case 0:return 0;case 1:return i;case 2:return 1;case 3:return 1-i}}class B extends u{constructor(t){super(t);_(this,"shader");this.shader=new P}preload(t){this.shader.preload(t)}setup(t){const s=t.createCanvas(500,700,t.WEBGL);u.show_canvas(s.elt),this.shader.init(t),this.shader.set_coefficients(T.from_tuples([[1,0,1,0],[3,1,.5,0]])),this.shader.disable()}update_animation(t){const s=this.state,a=t-s.reference_frame;s.animation_state===0?(s.transition_percent=0,a>=G&&(s.animation_state=1,s.reference_frame=t,this.events.dispatchEvent(new CustomEvent("tie_dye_step",{detail:(s.tie_dye_state+1)%4})))):s.animation_state===1&&(s.transition_percent=a/f,a>=f&&(s.transition_percent=0,s.tie_dye_state=(s.tie_dye_state+1)%4,s.animation_state=0,s.reference_frame=t))}draw(t){this.update_animation(t.frameCount);const{tie_dye_state:s,transition_percent:a}=this.state;this.shader.set_uniform("tie",U(s,a)),this.shader.set_uniform("dye",z(s,a)),t.background(0),this.shader.draw()}}const v=e=>(R("data-v-d432a5ba"),e=e(),D(),e),H=v(()=>n("h2",null,"Tie-Dye Analogy",-1)),M=v(()=>n("p",null," The symmetric patterns used in this website are functions of complex numbers. I find the easiest way to explain this is with the following analogy of tie-dyeing a t-shirt: ",-1)),q=C({__name:"TieDyeAnalogyView",setup(e){const i=new B({tie_dye_state:r.Initial,animation_state:g.Pausing,reference_frame:0,transition_percent:0}),t=E(r.Initial);i.events.addEventListener("tie_dye_step",a=>{const h=a.detail;t.value=h});function s(a){return t.value===a?["highlight-step"]:[]}return(a,h)=>(F(),$(A,null,[H,p(k,null,{left:m(()=>[p(x,{sketch:c(i),is_card:!0},null,8,["sketch"])]),right:m(()=>[M,n("ol",null,[n("li",null,[n("span",{class:l(s(c(r).Initial))},"Setup",2),d(" — Start with an uncolored complex plane. This is like a blank t-shirt. ")]),n("li",null,[n("span",{class:l(s(c(r).Tying))},"Tying",2),d(" — Next, apply a complex polynomial to warp the plane. This is like tying up the t-shirt. ")]),n("li",null,[n("span",{class:l(s(c(r).Dyeing))},"Dyeing",2),d(" — Color the points based on where they land. This is like dyeing the t-shirt. Notice that wherever the pattern overlaps itself, multiple points will have the same color. Careful choice of overlap is how symmetry is produced. ")]),n("li",null,[n("span",{class:l(s(c(r).Untying))},"Untying",2),d(" — Finally, return the points to where they came while keeping the colors. This is like untying the t-shirt to see the pattern. ")])])]),_:1})],64))}}),K=N(q,[["__scopeId","data-v-d432a5ba"]]);export{K as default};
