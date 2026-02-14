function openMap(url) {
    document.getElementById("mapModal").style.display = "flex";
    document.getElementById("mapFrame").src = url;
}

function closeMap() {
    document.getElementById("mapModal").style.display = "none";
    document.getElementById("mapFrame").src = "";
}

document.getElementById("contactForm")
.addEventListener("submit", function(e){
    e.preventDefault();
    alert("Thank you! We will contact you soon.");
    this.reset();
});
