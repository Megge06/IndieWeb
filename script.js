function updateVideoSources() {
  const splashVideo = document.querySelector(".bg-splash");
  const loopVideo = document.querySelector(".bg-loop");
  const isVertical = window.matchMedia("(max-aspect-ratio: 1/1)").matches;

  if (isVertical) {
    splashVideo.querySelector("source").src =
      "assets/home/persona_3_splash_vertical.mp4";
    loopVideo.querySelector("source").src =
      "assets/home/persona_3_loop_vertical.mp4";
  } else {
    splashVideo.querySelector("source").src =
      "assets/home/persona_3_splash.mp4";
    loopVideo.querySelector("source").src = "assets/home/persona_3_loop.mp4";
  }

  splashVideo.load();
  loopVideo.load();
}

window.addEventListener("DOMContentLoaded", () => {
  updateVideoSources();

  const splashVideo = document.querySelector(".bg-splash");

  splashVideo.addEventListener("ended", () => {
    document.body.classList.add("splash-done");
  });

  setTimeout(() => {
    document.body.classList.add("splash-done");
  }, 3100);
});

window.addEventListener("resize", () => {
  const currentSrc = document.querySelector(".bg-splash source").src;
  const isVertical = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
  const shouldBeVertical = currentSrc.includes("vertical");

  if (isVertical !== shouldBeVertical) {
    updateVideoSources();
  }
});

function positionTriangle(button) {
  const triangles = document.querySelectorAll(".triangle-indicator");
  if (!triangles.length || !button) return;
  const container = document.querySelector(".buttons");
  const containerRect = container.getBoundingClientRect();
  const btnRect = button.getBoundingClientRect();

  const ref = triangles[0];
  const tStyles = getComputedStyle(ref);
  const triangleWidth =
    parseFloat(tStyles.borderLeftWidth) + parseFloat(tStyles.borderRightWidth);
  const triangleHeight = parseFloat(tStyles.borderTopWidth);

  const topOffset = parseFloat(tStyles.getPropertyValue("--top")) || 100;

  const baseLeft =
    btnRect.left - containerRect.left + (btnRect.width - triangleWidth) / 2;
  const baseTop = btnRect.bottom - containerRect.top - topOffset;

  const baseScale = 1 + (Math.random() * 0.1 - 0.05);
  const baseRot = Math.random() * 10 - 5;

  triangles.forEach((tri, idx) => {
    const offsetDir = idx === 0 ? 1 : 1.5;
    const offsetMag = idx === 0 ? 0 : 5;
    const leftPx = baseLeft + offsetDir * (offsetMag * 0.6);
    const topPx = baseTop + offsetDir * (offsetMag * 0.4);

    tri.style.left = leftPx + "px";
    tri.style.top = topPx + "px";

    const scale = baseScale * (idx === 0 ? 1 : 1.05 + Math.random() * 0.05);
    const rot = baseRot + (idx === 0 ? 0 : 1 + Math.random());

    tri.style.setProperty("--scale", scale.toFixed(3));
    tri.style.setProperty("--rot", rot.toFixed(2) + "deg");
  });

  document
    .querySelectorAll(".btn")
    .forEach((b) => b.classList.toggle("is-active", b === button));
}

const startButton = document.getElementById("startButton");
const settingsButton = document.getElementById("settingsButton");
const menuButton = document.getElementById("menuButton");
const exitButton = document.getElementById("exitButton");

window.addEventListener("load", () => {
  positionTriangle(startButton);
  if (document.fonts) {
    document.fonts.ready.then(() =>
      positionTriangle(document.querySelector(".btn:hover") || startButton)
    );
  }
});

startButton.addEventListener("mouseenter", () => {
  positionTriangle(startButton);
});

settingsButton.addEventListener("mouseenter", () => {
  positionTriangle(settingsButton);
});

menuButton.addEventListener("mouseenter", () => {
  positionTriangle(menuButton);
});

exitButton.addEventListener("mouseenter", () => {
  positionTriangle(exitButton);
});

window.addEventListener("resize", () => {
  positionTriangle(document.querySelector(".btn:hover") || startButton);
});
