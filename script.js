window.addEventListener("DOMContentLoaded", () => {
  // Load Loop after Splash
  setTimeout(() => {
    document.body.classList.add("splash-done");
  }, 5100);
});

function positionTriangle(button) {
  const triangles = document.querySelectorAll(".triangle-indicator"); //Triangles in array
  if (!triangles.length || !button) return; // Safety check
  //Save all the relevant stuff in variables
  const container = document.querySelector(".buttons");
  const containerRect = container.getBoundingClientRect();
  const btnRect = button.getBoundingClientRect();

  // Use first triangle as reference for red triangle
  const ref = triangles[0];
  const tStyles = getComputedStyle(ref);
  const triangleWidth =
    parseFloat(tStyles.borderLeftWidth) + parseFloat(tStyles.borderRightWidth);
  const triangleHeight = parseFloat(tStyles.borderTopWidth);

  // Base Triangle Position

  const baseLeft =
    btnRect.left -
    containerRect.left +
    (btnRect.width - triangleWidth) / 2 +
    20;
  const baseTop = btnRect.bottom - containerRect.top - 100;

  // Base randomization for Triangles
  const baseScale = 1 + (Math.random() * 0.1 - 0.05);
  const baseRot = Math.random() * 20 - 10;

  triangles.forEach((tri, idx) => {
    // Slight deterministic offsets per index (second triangle = red)
    const offsetDir = idx === 0 ? 1 : 1.5;
    const offsetMag = idx === 0 ? 0 : 5; // px shift for red shadow
    const leftPx = baseLeft + offsetDir * (offsetMag * 0.6);
    const topPx = baseTop + offsetDir * (offsetMag * 0.4);

    tri.style.left = leftPx + "px";
    tri.style.top = topPx + "px";

    const scale = baseScale * (idx === 0 ? 1 : 1.05 + Math.random() * 0.05);
    const rot = baseRot + (idx === 0 ? 0 : 1 + Math.random());

    tri.style.setProperty("--scale", scale.toFixed(3));
    tri.style.setProperty("--rot", rot.toFixed(2) + "deg");
  });

  // Active Button Highlight
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
