function toggleMenu(){
  document.getElementById("nav-menu").classList.toggle("show");
}

window.addEventListener("scroll",function(){
  document.querySelectorAll(".reveal").forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight-100){
      el.classList.add("active");
    }
  });
});

window.addEventListener("scroll",function(){
  const scrollTop=document.documentElement.scrollTop;
  const scrollHeight=document.documentElement.scrollHeight-document.documentElement.clientHeight;
  const progress=(scrollTop/scrollHeight)*100;
  document.getElementById("progressBar").style.width=progress+"%";
});

function toggleLanguage(){
  let current=document.documentElement.getAttribute("lang");
  let newLang=current==="en"?"ar":"en";
  document.documentElement.setAttribute("lang",newLang);
}
