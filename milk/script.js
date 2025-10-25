const text = [
  `Hi I'm Megge! Welcome to my page. [normal]`,
  `I'm so excited you're here! [happy]`,
  `Oh no... I think I forgot to update my blog again... [sad]`,
  `Hmm, let me think about what to show you first... [thinking]`,
  `*yawns* Sorry, I've been coding all night... [horror]`,
  `WAIT. Did you just see that glitch?! [normal]`,
  `Ugh, my CSS isn't working AGAIN. [dissatisfied]`,
  `I figured it out! I'm basically a genius. [smug]`,
  `I... I can't remember why I started this project... [mentallyabsent]`,
  `This code is perfect. Nothing can go wrong now. [selfassured]`,
  `Is someone... watching my localhost? That's impossible... [paranoid]`,
  `THE BUILD FAILED. EVERYTHING IS BROKEN. [horror]`,
  `But hey, that's web development for you! [happy]`,
  `Thanks for visiting! Come back soon! [normal]`,
];
const emotionMap = {
  "[dissatisfied]": "dissatisfied.webp",
  "[happy]": "happy.webp",
  "[horror]": "horror.webp",
  "[mentallyabsent]": "mentally_absent.webp",
  "[normal]": "normal.webp",
  "[paranoid]": "paranoid.webp",
  "[sad]": "sad.webp",
  "[selfassured]": "self_assured.webp",
  "[shocked]": "shocked.webp",
  "[smug]": "smug.webp",
  "[thinking]": "thinking.webp",
  "[tired]": "tired.webp",
};

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

  const characterImg = document.querySelector(".character");

  // Find matching emotion tag in text
  for (const [tag, filename] of Object.entries(emotionMap)) {
    if (text.includes(tag)) {
      characterImg.src = `../assets/${filename}`;
      return;
    } else {
      characterImg.src = "../assets/normal.webp";
    }
  }
  characterImg.src = "../assets/normal.webp";
}

function typewriterEffect(fullText) {
  // Function for adding the text gradually
  isTyping = true;

  changeImage(fullText);

  const cleanText = fullText.replace(/\[.*?\]/, "");

  dialogueText.textContent = "";

  let charIndex = 0;
  const typingSpeed = 20;

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
