const a = document.currentScript.src;
const b = new URL(a);
const c = b.pathname.split('/');
const d = c.pop();
const e = d + ' loaded succesfully!';

console.log(e);