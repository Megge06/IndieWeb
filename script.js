const text = [
  `Hi I'm Megge! [normal]`,
  `Welcome to my IndieWeb page. [happy]`,
  `Feel free to explore around! [sad]`,
  `Have a great day! [thinking]`,
];

const dialogueText = document.querySelector(".dialogue-text");
const dialogueBox = document.querySelector(".dialogue-box");

let index = 0;
let isTyping = false;

typewriterEffect(text[index]);

dialogueBox.addEventListener("click", function () {
  //Event listener for clicking the dialogue box to change the text and image

  if (isTyping) return;

  if (index + 1 < text.length) {
    index++;
    typewriterEffect(text[index]);
  } else {
    typewriterEffect("...");
  }
});

function changeImage(text) {
  //Function for changing the character image based on the dialogue
  if (text.includes("[normal]")) {
    document.querySelector(".character").src = "Images/dialogue_normal.webp";
  } else if (text.includes("[happy]")) {
    document.querySelector(".character").src = "Images/dialogue_happy.webp";
  } else if (text.includes("[sad]")) {
    document.querySelector(".character").src = "Images/dialogue_sad.webp";
  } else if (text.includes("[thinking]")) {
    document.querySelector(".character").src = "Images/dialogue_thinking.webp";
  } else {
    document.querySelector(".character").src = "Images/dialogue_normal.webp";
  }
}

function typewriterEffect(fullText) {
  // Function for adding the text gradually
  isTyping = true;

  changeImage(fullText);

  const cleanText = fullText.replace(/\[.*?\]/, "");

  dialogueText.textContent = "";

  let charIndex = 0;
  const typingSpeed = 50;

  function typeNextChar() {
    if (charIndex < cleanText.length) {
      dialogueText.textContent += cleanText.charAt(charIndex);
      charIndex++;
      setTimeout(typeNextChar, typingSpeed);
    } else {
      isTyping = false;
    }
  }
  typeNextChar();
}
