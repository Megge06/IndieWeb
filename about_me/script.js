const text = [
  `Cloud lint marble static fork neon drift. [normal]`,
  `Bubble prism waffle comet jitter sprout. [happy]`,
  `Rust echo hollow cardboard drizzle fragment. [sad]`,
  `Quartz parse swivel blueprint delta noodle. [thinking]`,
  `Velvet glitch tungsten ember kale phantom. [horror]`,
  `Axis wobble checksum moth lantern splice. [dissatisfied]`,
  `Cipher haze lattice orbit ginger polaroid. [smug]`,
  `Canvas blur semaphore whisper basil satellite. [mentallyabsent]`,
  `Titanium kernel lucid palindrome vector paprika. [selfassured]`,
  `Static radar velvet thistle corkscrew midnight. [paranoid]`,
  `Granite lullaby buffer oat spiral koi. [tired]`,
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
      characterImg.src = `../assets/about_me/${filename}`;
      return;
    }
  }
  characterImg.src = "../assets/about_me/normal.webp";
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
