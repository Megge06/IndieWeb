function updateDateTime() {
  const now = new Date();

  const timeString = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const weekday = now.toLocaleDateString("en-US", {
    weekday: "short",
  });
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dateString = `${weekday} ${day}/${month}`;

  document.getElementById("time").textContent = timeString;
  document.getElementById("date").textContent = dateString;
}

updateDateTime();

setInterval(updateDateTime, 1000);

window.openLightbox = function openLightbox(url, alt) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  lightboxImg.src = url;
  lightboxImg.alt = alt;
  lightbox.style.display = "flex";
  document.body.style.overflow = "hidden";
};

window.closeLightbox = function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
  document.body.style.overflow = "auto";
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.closeLightbox();
});

