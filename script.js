window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.classList.add("splash-done");
  }, 5040);
});

function positionTriangle(button) {
  const triangle = document.querySelector(".triangle-indicator");
  const container = document.querySelector(".buttons");

  const buttonRect = button.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Get root font size to convert em to px
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  );

  // Read triangle dimensions in em
  const triangleWidthEm = parseFloat(
    getComputedStyle(triangle)
      .getPropertyValue("--triangle-width")
      .replace("vh", "")
  );
  const triangleHeightEm = parseFloat(
    getComputedStyle(triangle)
      .getPropertyValue("--triangle-height")
      .replace("vh", "")
  );

  // Convert em to px for calculation
  const triangleWidthPx = triangleWidthEm * rootFontSize;
  const triangleHeightPx = triangleHeightEm * rootFontSize;

  // Center triangle horizontally under button
  const left =
    buttonRect.left +
    buttonRect.width * 1.8 -
    containerRect.left -
    triangleWidthPx / 3;

  // Place below button (convert offset from px to em in CSS if needed)
  const top = buttonRect.bottom - containerRect.top + triangleHeightPx * 6;

  // Convert back to em for setting position
  triangle.style.left = `${left / rootFontSize}vh`;
  triangle.style.top = `${top / rootFontSize}vh`;
}

const startButton = document.getElementById("startButton");
const settingsButton = document.getElementById("settingsButton");
const menuButton = document.getElementById("menuButton");
const exitButton = document.getElementById("exitButton");

window.addEventListener("load", () => {
  positionTriangle(startButton);
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
  const buttons = document.querySelectorAll(".btn");
  const lastHovered =
    Array.from(buttons).find((btn) => btn.matches(":hover")) || startButton;
  positionTriangle(lastHovered);
});
