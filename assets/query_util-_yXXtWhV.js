import{d as i,p as d,q as u,f as o,c as a,B as m,i as p,l as c,e as f,F as v,m as g,t as _}from"./index-xFizMusB.js";import{b as V}from"./validation-Cv0neZFQ.js";const B=["value"],k=i({__name:"DropdownSelect",props:d({options:{}},{modelValue:{},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const s=u(e,"modelValue"),l=e;return(n,r)=>(o(),a("label",null,[m(n.$slots,"default"),p(f("select",{"onUpdate:modelValue":r[0]||(r[0]=t=>s.value=t)},[(o(!0),a(v,null,g(l.options,t=>(o(),a("option",{key:t.id,value:t.value},_(t.label),9,B))),128))],512),[[c,s.value]])]))}});function D(e,s){if(e){if(V(e,s))return e;console.error(`${s} must have a single value`)}}export{k as _,D as g};
