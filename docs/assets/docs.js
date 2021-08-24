(()=>{"use strict";(()=>{var e=function(e,t,n){var l,i,r,o='\n    <div data-dialog-backdrop tabindex="-1" hidden>\n        <div\n            data-dialog="{type}"\n            tabindex="-1"\n            role="dialog"\n            aria-labelledby="{titleId}"\n            aria-describedby="{descriptionId}"\n            aria-modal="true"\n            aria-live="assertive"\n        >\n            <form role="presentation">\n                <header role="presentation">\n                    <span id="{titleId}">{title}</span>\n                </header>\n                <section class="message">\n                    <span id="{descriptionId}">{message}</span>\n                </section>\n                <section class="prompt" data-role="prompt-section">\n                    <input type="text"\n                        value=""\n                    >\n                </section>\n                <footer role="presentation">\n                    <button type="button" data-role="cancel">{cancelText}</button>\n                    <button type="submit" data-role="ok">{okText}</button>\n                </footer>\n            </form>\n        </div>\n    </div>\n',u=null!==(l=n.title)&&void 0!==l?l:null,a=null!==(i=n.cancelText)&&void 0!==i?i:"Cancel",c=null!==(r=n.okText)&&void 0!==r?r:"Ok",d=String(Date.now()),p="dialog-"+d+"-title",s="dialog-"+d+"-description";o=(o=(o=(o=(o=(o=(o=o.replace(/\{titleId\}/g,p)).replace(/\{descriptionId\}/g,s)).replace("{type}",e)).replace("{message}",t)).replace("{title}",null!=u?u:"")).replace("{cancelText}",a)).replace("{okText}",c);var v=document.createElement("div");return v.insertAdjacentHTML("afterbegin",o),null===u&&(v.querySelector("header").remove(),v.querySelector("[aria-describedby]").removeAttribute("aria-describedby"),v.querySelector("[aria-labelledby]").setAttribute("aria-labelledby",s)),v.firstElementChild},t=function(e){var t;null===(t=e.querySelector('section[data-role="prompt-section"]'))||void 0===t||t.remove()},n=[],l=function(e,t,n){var l="dialogBackdrop"in e.dataset?e:e.querySelector("[data-dialog-backdrop]");null==l||l.addEventListener("click",(function(e){e.stopPropagation(),e.target===l&&n.apply(null)})),null==l||l.addEventListener("keydown",(function(e){"Escape"===e.key&&(e.preventDefault(),n.apply(null))})),i("keydown",(function(e){"Escape"===e.key&&n.apply(null)})),window.setTimeout((function(){i("click",(function(e){n.apply(null)}))}));var o=e.querySelector("form"),u=e.querySelector('[data-role="cancel"]'),a=e.querySelector('[data-role="ok"]');p(e),null==u||u.addEventListener("click",(function(e){n.apply(null)})),o.addEventListener("submit",(function(e){e.preventDefault(),t.apply(null)})),null!==u&&null!==a&&[u,a].forEach((function(e){e.addEventListener("keydown",(function(e){("ArrowLeft"===e.key||"ArrowRight"===e.key)&&(e.preventDefault(),(e.target===a?u:a).focus())}))})),r(e)},i=function(e,t){document.addEventListener(e,t),n.push({type:e,listener:t})},r=function(e){var t=Array.from(e.querySelectorAll("a, button, input")).filter((function(e){var t=window.getComputedStyle(e);return"none"!==t.display&&"hidden"!==t.visibility&&(!["button","input"].includes(e.tagName)||!0!==e.disabled)}));if(0!==t.length){var n=t[0],l=t[t.length-1];i("focusin",(function(t){e.contains(t.target)||(t.preventDefault(),n.focus())})),n.addEventListener("keydown",(function(e){"Tab"===e.key&&e.shiftKey&&(e.preventDefault(),l.focus())})),l.addEventListener("keydown",(function(e){"Tab"===e.key&&!e.shiftKey&&(e.preventDefault(),n.focus())}))}},o=function(e,t,n){var l;(null!==(l=t.container)&&void 0!==l?l:a()).appendChild(e),e.hidden=!1,e.firstElementChild.style.display="block",n.apply(null)},u=null,a=function(){return null===u&&(u=document.createElement("div")),null===u.parentElement&&document.body.appendChild(u),u},c=function(e){e.remove(),function(){for(var e;void 0!==(e=n.shift());)document.removeEventListener(e.type,e.listener)}()},d=function(e){e.querySelector('button[data-role="ok"]').focus()},p=function(e){return e.querySelector("input")},s={alert:function(n,i){return void 0===i&&(i={}),new Promise((function(r,u){var a=function(n,l){var i=e("alert",n,l);return t(i),function(e){var t;null===(t=e.querySelector('footer > button[data-role="cancel"]'))||void 0===t||t.remove()}(i),i}(null!=n?n:"",i);l(a,(function(){c(a),r()}),(function(){c(a),r()})),o(a,i,(function(){d(a)}))}))},confirm:function(n,i){return void 0===i&&(i={}),new Promise((function(r,u){var a=function(n,l){var i=e("confirm",n,l);return t(i),i}(null!=n?n:"",i);l(a,(function(){c(a),r(!0)}),(function(){c(a),r(!1)})),o(a,i,(function(){"cancel"===i.focus?function(e){e.querySelector('button[data-role="cancel"]').focus()}(a):d(a)}))}))},prompt:function(t,n,i){return void 0===i&&(i={}),new Promise((function(r,u){var a=function(t,n,l){var i,r=e("prompt",t,l),o=p(r);o.value=n;var u=null!==(i=l.input)&&void 0!==i?i:null;return null!==u&&function(e,t){var n,l,i,r,o,u,a,c,d,p,s,v,m,f,y;e.type=null!==(n=t.type)&&void 0!==n?n:e.type,null!==(null!==(l=t.required)&&void 0!==l?l:null)&&(e.required=t.required),null!==(null!==(i=t.placeholder)&&void 0!==i?i:null)&&(e.placeholder=t.placeholder),null!==(null!==(r=t.multiple)&&void 0!==r?r:null)&&(e.multiple=t.multiple),null!==(null!==(o=t.minLength)&&void 0!==o?o:null)&&(e.minLength=t.minLength),null!==(null!==(u=t.maxLength)&&void 0!==u?u:null)&&(e.maxLength=t.maxLength),null!==(null!==(a=t.min)&&void 0!==a?a:null)&&(e.min=String(t.min)),null!==(null!==(c=t.max)&&void 0!==c?c:null)&&(e.max=String(t.max)),null!==(null!==(d=t.max)&&void 0!==d?d:null)&&(e.max=String(t.max)),null!==(null!==(p=t.step)&&void 0!==p?p:null)&&(e.step=String(t.step)),null!==(null!==(s=t.pattern)&&void 0!==s?s:null)&&(e.pattern=t.pattern),null!==(null!==(v=t.title)&&void 0!==v?v:null)&&(e.title=t.title),null!==(null!==(m=t.list)&&void 0!==m?m:null)&&e.setAttribute("list",t.list),null!==(null!==(f=t.inputMode)&&void 0!==f?f:null)&&(e.inputMode=t.inputMode),null!==(null!==(y=t.spellcheck)&&void 0!==y?y:null)&&(e.spellcheck=t.spellcheck)}(o,u),r}(null!=t?t:"",null!=n?n:"",i);l(a,(function(){c(a);var e=function(e){var t,n;return null!==(n=null===(t=p(e))||void 0===t?void 0:t.value)&&void 0!==n?n:""}(a);r(e)}),(function(){c(a),r(null)})),o(a,i,(function(){var e=p(a);e.focus(),e.select()}))}))}},v=function(e,t,n,l){return new(n||(n=Promise))((function(i,r){function o(e){try{a(l.next(e))}catch(e){r(e)}}function u(e){try{a(l.throw(e))}catch(e){r(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,u)}a((l=l.apply(e,t||[])).next())}))};const m={"#alert-with-title":["Your changes have been saved.",{title:"Saved"}],"#alert-with-custom-button-text":["Your changes have been saved.",{title:"Saved",okText:"Alright!"}]},f={"#confirm-with-custom-buttons":['Delete the file "passwords.txt"?',{title:"Delete",okText:"Yes",cancelText:"No"}],"#confirm-with-prefocused-cancel-button":['Delete the file "passwords.txt"?',{title:"Delete",focus:"cancel"}]},y={"#prompt-with-default-value":["Glory?","Hammer!"],"#prompt-with-placeholder":["Enter your name","",{title:"Your name",input:{placeholder:"Your full name please"}}],"#prompt-with-required-input":["Enter your name","",{title:"Your name",input:{required:!0}}],"#prompt-with-custom-buttons":["Please give us your name","",{title:"Your name",okText:"Sure",cancelText:"No, it's a secret"}],"#prompt-with-email-input":["Enter your email","",{title:"Your Email",input:{type:"email",required:!0}}],"#prompt-with-date-input":["Enter your birthday","",{title:"Your Birthday",input:{type:"date"}}],"#prompt-with-number-input-natural-between-50-99":["Enter a natural number between 50 and 99","",{title:"Natural numbers",input:{type:"number",required:!0,min:50,max:99,step:1}}],"#prompt-with-minimum-and-maximum-length-requirements":["Enter a single word with a length between 4 and 9 letters.","",{title:"A single word",input:{type:"text",placeholder:"Letters only (a-z), no other characters.",required:!0,minLength:4,maxLength:9,pattern:"[a-z]+"}}]};Object.keys(m).forEach((e=>{var t;null===(t=document.querySelector(e))||void 0===t||t.addEventListener("click",(t=>v(void 0,void 0,void 0,(function*(){yield s.alert.apply(null,m[e])}))))})),Object.keys(f).forEach((e=>{var t;null===(t=document.querySelector(e))||void 0===t||t.addEventListener("click",(t=>v(void 0,void 0,void 0,(function*(){const n=yield s.confirm.apply(null,f[e]),l=document.querySelector("#"+t.target.id+" + code");null!==l&&(l.innerText=!0===n?"true":"false")}))))})),Object.keys(y).forEach((e=>{var t;null===(t=document.querySelector(e))||void 0===t||t.addEventListener("click",(t=>v(void 0,void 0,void 0,(function*(){const n=yield s.prompt.apply(null,y[e]),l=document.querySelector("#"+t.target.id+" + code");null!==l&&(l.innerText=null!==n?`"${n}"`:"null")}))))})),hljs.highlightAll(),window.setTimeout((()=>{Array.from(document.querySelectorAll("code.color-highlight")).forEach((e=>{["blue","yellow","orange","darkorange"].forEach((t=>{const n=new RegExp(`(?<=: )${t}`,"g"),l=`<span style="border-bottom: 2px solid ${t};">${t}</span>`;e.innerHTML=e.innerHTML.replace(n,l)}))}))}),200)})()})();