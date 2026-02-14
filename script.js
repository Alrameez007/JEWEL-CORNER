function toggleMenu(){
  document.getElementById("navMenu").classList.toggle("show");
}

function toggleLanguage(){
  const heroTitle=document.getElementById("hero-title");
  const heroDesc=document.getElementById("hero-desc");
  const aboutTitle=document.getElementById("about-title");
  const aboutText=document.getElementById("about-text");

  if(heroTitle.innerHTML==="Luxury. Elegance. Timeless Beauty."){
    heroTitle.innerHTML="الفخامة. الأناقة. الجمال الخالد.";
    heroDesc.innerHTML="مجوهرات وساعات وعطور وهدايا فاخرة في صلالة.";
    aboutTitle.innerHTML="من نحن";
    aboutText.innerHTML="جويل كورنر بوتيك فاخر في صلالة يقدم مجوهرات وساعات وعطور وهدايا مميزة.";
  }else{
    heroTitle.innerHTML="Luxury. Elegance. Timeless Beauty.";
    heroDesc.innerHTML="Premium jewellery, watches, perfumes & souvenirs in Salalah.";
    aboutTitle.innerHTML="About Us";
    aboutText.innerHTML="Jewel Corner is a premium boutique in Salalah offering elegant artificial jewellery, watches, perfumes and souvenirs with affordable luxury.";
  }
}

/* SCROLL ANIMATION */
const faders=document.querySelectorAll(".fade-in");
window.addEventListener("scroll",()=>{
  faders.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight-100){
      el.classList.add("visible");
    }
  });
});
// Navbar scroll effect
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});

// Scroll reveal animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold: 0.2});

document.querySelectorAll(".collection-card, .branch-card").forEach(el => {
  observer.observe(el);
});
