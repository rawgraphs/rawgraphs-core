(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{79:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return o})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return p}));var a=n(3),r=n(7),i=(n(0),n(91)),c={id:"example-npm",title:"Quick example (npm)",sidebar_label:"Quick example (npm)",slug:"/example-npm"},o={unversionedId:"example-npm",id:"example-npm",isDocsHomePage:!1,title:"Quick example (npm)",description:"Here's a super-quick example of using the rawgraphs from javascript code.",source:"@site/docs/example-npm.md",slug:"/example-npm",permalink:"/docs/example-npm",editUrl:"https://github.com/rawgraphs/rawgraphs-core/edit/master/website/docs/example-npm.md",version:"current",sidebar_label:"Quick example (npm)",sidebar:"docs",previous:{title:"Installation",permalink:"/docs/installation"},next:{title:"Quick example (direct script inclusion)",permalink:"/docs/example-script"}},l=[{value:"Installation",id:"installation",children:[]},{value:"Install some charts",id:"install-some-charts",children:[]},{value:"Rendering a bubblechart",id:"rendering-a-bubblechart",children:[]},{value:"Live demo",id:"live-demo",children:[]}],s={toc:l};function p(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Here's a super-quick example of using the rawgraphs from javascript code."),Object(i.b)("p",null,"In this case we'll assume we're using ",Object(i.b)("inlineCode",{parentName:"p"},"yarn")," to install the package from npm. Refer to\n",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"/docs/installation"}),"installation")," for other options."),Object(i.b)("p",null,"See the ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"#live-demo"}),"live demo")," at the end of the page for a complete example."),Object(i.b)("h2",{id:"installation"},"Installation"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"yarn add @rawgraphs/rawgraphs-core\n")),Object(i.b)("h2",{id:"install-some-charts"},"Install some charts"),Object(i.b)("p",null,"To do something useful with rawgraphs-core, we'll need some charts as well.\nLet's use the charts from the rawgraphs-charts package."),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-bash"}),"yarn add @rawgraphs/rawgraphs-charts\n")),Object(i.b)("h2",{id:"rendering-a-bubblechart"},"Rendering a bubblechart"),Object(i.b)("p",null,"In this example we'll build a bubblechart from the @rawgraphs/rawgraphs-core repository.\nWe'll assume a basic html structure like the following"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-html"}),'<!DOCTYPE html>\n<html>\n\n<body>\n  \x3c!-- this is the "target" of the rawgraphs chart --\x3e\n    <div id="app"></div>\n  \n  \x3c!-- this is the script where we\'ll do the rendering --\x3e\n  <script src="src/index.js">\n    <\/script>\n</body>\n\n</html>\n')),Object(i.b)("p",null,"The chart will be renderend by javascript code in the ",Object(i.b)("inlineCode",{parentName:"p"},"index.js"),": "),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-js"}),'import { chart } from "@rawgraphs/rawgraphs-core"\nimport { bubblechart } from "@rawgraphs/rawgraphs-charts"\n\n\n// defining some data.\nconst userData = [\n  { size: 10, price: 2, cat: "a" },\n  { size: 12, price: 1.2, cat: "a" },\n  { size: 1.3,pricey: 2, cat: "b" },\n  { size: 1.5,pricey: 2.2, cat: "c" },\n  { size: 10, price: 4.2, cat: "b" },\n  { size: 10, price: 6.2, cat: "c" },\n  { size: 12, price: 2.2, cat: "b" },\n]\n\n// getting the target HTML node\nconst root = document.getElementById("app")\n\n\n// define a mapping between dataset and the visual model\nconst mapping = {\n  x: { value: "size" },\n  y: { value: "price" },\n  color: { value: "cat" },\n}\n\n//instantiating the chart\nconst viz = chart(bubblechart, {\n  data: userData,\n  mapping,\n})\n\n//rendering into the HTML node\nviz.renderToDOM(root)\n')),Object(i.b)("h2",{id:"live-demo"},"Live demo"),Object(i.b)("p",null,"Here's a live demo of the code shown above running in codesandbox"),Object(i.b)("iframe",{src:"https://codesandbox.io/embed/rawgraphs-at-a-glance-mlu50?fontsize=14&hidenavigation=1&theme=light&view=preview",style:{width:"100%",height:700,border:0},title:"rawgraphs at a glance",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"}))}p.isMDXComponent=!0},91:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=r.a.createContext({}),p=function(e){var t=r.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},b=function(e){var t=p(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=p(n),u=a,d=b["".concat(c,".").concat(u)]||b[u]||m[u]||i;return n?r.a.createElement(d,o(o({ref:t},s),{},{components:n})):r.a.createElement(d,o({ref:t},s))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,c=new Array(i);c[0]=u;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var s=2;s<i;s++)c[s]=n[s];return r.a.createElement.apply(null,c)}return r.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);