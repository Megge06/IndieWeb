namesToLetters();
function namesToLetters() {
  //Search for all names to split them into letters
  const nameElements = document.querySelectorAll("p.name");

  nameElements.forEach((nameEl, nameIndex) => {
    const fullName = nameEl.textContent;

    nameEl.setAttribute("aria-label", fullName);
    nameEl.textContent = "";

    const words = fullName.split(" ");

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.setAttribute("aria-hidden", "true");
      wordSpan.className = "word-container";
      wordSpan.id = `name-${nameIndex}-word-${wordIndex}`;

      wordSpan.style.display = "inline-block";
      wordSpan.style.whiteSpace = "nowrap";

      const letters = word.split("");

      letters.forEach((letter, letterIndex) => {
        const letterSpan = document.createElement("span");
        letterSpan.textContent = letter;
        letterSpan.className = "individual-letter";
        letterSpan.id = `name-${nameIndex}-word-${wordIndex}-letter-${letterIndex}`;

        const randomRotation = getRandom(-3, 3);
        const randomSize = getRandom(0.95, 1.15);
        const randomYShift = getRandom(-2, 2);

        letterSpan.style.display = "inline-block";
        letterSpan.style.transform = `rotate(${randomRotation}deg)`;
        letterSpan.style.fontSize = `${randomSize}rem`;
        letterSpan.style.translate = `0px ${randomYShift}px`;

        wordSpan.appendChild(letterSpan);
      });

      nameEl.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.innerHTML = "&nbsp;";
        spaceSpan.setAttribute("aria-hidden", "true");
        spaceSpan.className = "letter-space";
        spaceSpan.id = `name-${nameIndex}-space-${wordIndex}`;
        spaceSpan.style.display = "inline-block";

        nameEl.appendChild(spaceSpan);
      }
    });
  });
}

let currentAvatar = 0;

const avatarColors = {
  phantom: "#959595",
  alibaba: "#959595",
  caroline: "#959595",
  justine: "#959595",
  chihaya: "#f87b0d",
  hifumi: "#f87b0d",
  mishima: "#f87b0d",
  ohya: "#f87b0d",
  shinya: "#f87b0d",
  sojiro: "#f87b0d",
  takemi: "#f87b0d",
  yoshida: "#f87b0d",
  munehisa: "#f87b0d",
  kawakami: "#f87b0d",
  akechi: "#a98a5e",
  ann: "#ff6dd6",
  ryuji: "#ffe000",
  makoto: "#3f2ccf",
  yusuke: "#00f2ff",
  futaba: "#80ff23",
  haru: "#9c44ff",
  yoshizawa: "#ff0053",
};

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

const avatarList = Object.keys(avatarColors);

function setAvatarSelection(avatarName) {
  if (!Object.prototype.hasOwnProperty.call(avatarColors, avatarName)) return;
  const avatar = document.querySelector("#avatar-preview");
  avatar.src = "../assets/guestbook/chat_icons/" + avatarName + ".webp";
  avatar.alt = avatarName;
  avatar.style.backgroundColor = avatarColors[avatarName];
  document.querySelector("#form-avatar").value = avatarName;
}

function changeAvatar(upDown) {
  switch (upDown) {
    case "up":
      currentAvatar =
        currentAvatar < avatarList.length - 1 ? currentAvatar + 1 : 0;
      break;
    case "down":
      currentAvatar =
        currentAvatar > 0 ? currentAvatar - 1 : avatarList.length - 1;
      break;
    default:
      break;
  }
  setAvatarSelection(avatarList[currentAvatar]);
}

document
  .querySelector("#avatar-prev")
  .addEventListener("click", () => changeAvatar("down"));

document
  .querySelector("#avatar-next")
  .addEventListener("click", () => changeAvatar("up"));

let currentPage = 1;

async function loadEntries(page) {
  try {
    const response = await fetch(`/api/guestbook?page=${page}&limit=10`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const entries = await response.json();
    renderEntries(entries);
    document.querySelector("#page-display").textContent = `Page ${page}`;
    document.querySelector("#prev").disabled = page <= 1;
    document.querySelector("#next").disabled = entries.length < 10;
  } catch (err) {
    console.error("Failed to load entries:", err);
  }
}

function renderEntries(entries) {
  //Actually add messages to HTML
  const section = document.querySelector("#entries");
  section.innerHTML = "";

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "entry";

    const avatarWrap = document.createElement("div");
    avatarWrap.className = "avatar-wrap";
    avatarWrap.style.backgroundColor = avatarColors[entry.avatar] ?? "#959595";
    const img = document.createElement("img");
    img.className = "avatar";
    img.src = `../assets/guestbook/chat_icons/${entry.avatar}.webp`;
    img.alt = entry.avatar;
    avatarWrap.appendChild(img);

    const name = document.createElement("p");
    name.className = "name";
    name.textContent = entry.name;

    const message = document.createElement("p");
    message.className = "message";
    message.textContent = entry.message;

    const date = document.createElement("span");
    date.className = "message-date";
    const d = new Date(entry.date);
    date.textContent = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    article.appendChild(avatarWrap);
    article.appendChild(name);
    article.appendChild(message);
    article.appendChild(date);
    section.appendChild(article);
  });

  namesToLetters();
}

document.querySelector("#prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadEntries(currentPage);
  }
});

document.querySelector("#next").addEventListener("click", () => {
  currentPage++;
  loadEntries(currentPage);
});

setAvatarSelection("phantom");
loadEntries(currentPage);

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedAvatar = document.querySelector("#form-avatar").value;
  if (!Object.prototype.hasOwnProperty.call(avatarColors, selectedAvatar)) {
    console.error("Invalid avatar selected:", selectedAvatar);
    return;
  }

  const body = {
    name: document.querySelector("#form-name").value,
    message: document.querySelector("#form-message").value,
    avatar: selectedAvatar,
  };

  try {
    const response = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      document.querySelector("#form-error").hidden = true;
      document.querySelector("form").reset();
      currentAvatar = 0;
      setAvatarSelection("phantom");
      currentPage = 1;
      loadEntries(currentPage);
    } else {
      const text = await response.text();
      const errorEl = document.querySelector("#form-error");
      errorEl.textContent = text.trim();
      errorEl.hidden = false;
      console.error("Post failed:", text);
    }
  } catch (err) {
    const errorEl = document.querySelector("#form-error");
    errorEl.textContent = "Something went wrong. Try again.";
    errorEl.hidden = false;
    console.error("Post failed:", err);
  }
});

// Poll Functionality
async function loadPollStats() {
  try {
    const res = await fetch("/api/poll");
    if (!res.ok) return;
    const stats = await res.json();
    updatePollUI(stats);
  } catch (err) {
    console.error("Failed to load poll stats:", err);
  }
}

function updatePollUI(stats) {
  const barFill = document.querySelector("#poll-bar-fill");
  const pctText = document.querySelector("#poll-pct");
  if (barFill && pctText) {
    barFill.style.width = `${stats.yes_pct}%`;
    pctText.textContent = `${stats.yes_pct.toFixed(1)}%`;
  }
}

async function handleVote(voteType) {
  const msgEl = document.querySelector("#poll-msg");
  if (msgEl) msgEl.hidden = true;

  try {
    const res = await fetch("/api/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote: voteType }),
    });

    if (res.ok) {
      const stats = await res.json();
      updatePollUI(stats);
      if (msgEl) {
        msgEl.textContent = "Vote recorded!";
        msgEl.style.color = "var(--p-white)";
        msgEl.hidden = false;
      }
    } else {
      const errText = await res.text();
      if (msgEl) {
        msgEl.textContent = errText.trim() || "Rate limited or error.";
        msgEl.style.color = "var(--p-red)";
        msgEl.hidden = false;
      }
    }
  } catch (err) {
    if (msgEl) {
      msgEl.textContent = "Something went wrong.";
      msgEl.style.color = "var(--p-red)";
      msgEl.hidden = false;
    }
    console.error("Vote failed:", err);
  }
}

document
  .querySelector("#vote-yes")
  ?.addEventListener("click", () => handleVote("yes"));
document
  .querySelector("#vote-no")
  ?.addEventListener("click", () => handleVote("no"));

loadPollStats();
