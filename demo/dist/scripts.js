"use strict";var $log=document.querySelector("#console"),log=function(){for(var o,e=arguments.length,l=new Array(e),t=0;t<e;t++)l[t]=arguments[t];if((o=console).log.apply(o,l),!$log.hasChildNodes()){var n=document.createElement("ol");$log.append(n)}var c=$log.querySelector("ol"),r=document.createElement("li");r.innerHTML=l,c.append(r),$log.scrollTop=c.offsetHeight},$html=document.documentElement;document.querySelector(".toggle-scroll-lock").addEventListener("click",function(){return bodyScroll.toggle()}),document.querySelector("button.toggle-custom-scrollbar").addEventListener("click",function(){log("toggling custom scrollbars"),$html.classList.toggle("custom-scrollbar")}),document.querySelector("button.toggle-horizontal-orientation").addEventListener("click",function(){log("toggling page orientation"),$html.classList.toggle("horizontal")}),window.addEventListener("bodyScrollLock",function(){return log("body scroll locked")}),window.addEventListener("bodyScrollUnlock",function(){return log("body scroll unlocked")});
//# sourceMappingURL=scripts.js.map
