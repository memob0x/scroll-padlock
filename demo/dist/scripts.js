"use strict";var $console=document.querySelector(".console"),log=function(){for(var o,l=arguments.length,e=new Array(l),c=0;c<l;c++)e[c]=arguments[c];console.log&&(o=console).log.apply(o,e);var t=$console.querySelector("ol");t||((t=document.createElement("ol")).classList.add("console__list"),$console.appendChild(t));var n=document.createElement("li");n.classList.add("console__list__item"),n.innerHTML=e,t.appendChild(n),t.scrollTo(0,t.scrollHeight)};document.querySelector(".toggle-scroll-lock").addEventListener("click",function(){return bodyScroll.toggle()}),document.querySelector("button.toggle-custom-scrollbar").addEventListener("click",function(){log("toggling custom scrollbars"),document.body.classList.toggle("custom-scrollbar")}),window.addEventListener("bodyScrollLock",function(){return log("body scroll locked")}),window.addEventListener("bodyScrollUnlock",function(){return log("body scroll unlocked")});
//# sourceMappingURL=scripts.js.map