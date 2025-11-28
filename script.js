document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.getElementById("askBtn");
  const questionInput = document.getElementById("questionInput");
  const resultCard = document.getElementById("resultCard");
  const answerText = document.getElementById("answerText");
  const resultImage = document.getElementById("resultImage");
  const placeholderIcon = document.querySelector(".placeholder-content .icon");
  const placeholderText = document.querySelector(".placeholder-content p");

  const funnyLoaders = [
    "Consulting the spirits...",
    "Rolling the cosmic dice...",
    "Asking my mom...",
    "Calculating probability of failure...",
    "Reading the tea leaves...",
    "Decoding the matrix...",
    "Flipping a coin (it landed on its side)...",
  ];

  askBtn.addEventListener("click", getAnswer);
  questionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") getAnswer();
  });

  async function getAnswer() {
    const question = questionInput.value.trim();

    if (!question) {
      questionInput.classList.add("shake");
      setTimeout(() => questionInput.classList.remove("shake"), 500);
      placeholderText.innerText = "ASK SOMETHING, YOU COWARD!";
      return;
    }

    // Reset state
    askBtn.disabled = true;
    resultCard.classList.remove("flipped");

    // Wait for flip back if needed
    if (resultCard.classList.contains("flipped")) {
      await new Promise((r) => setTimeout(r, 400));
    }

    // Loading state
    let loaderInterval = setInterval(() => {
      placeholderText.innerText =
        funnyLoaders[Math.floor(Math.random() * funnyLoaders.length)];
    }, 500);
    placeholderIcon.innerText = "⏳";

    try {
      const response = await fetch("https://yesno.wtf/api");
      const data = await response.json();

      // Preload image
      const img = new Image();
      img.src = data.image;

      img.onload = () => {
        clearInterval(loaderInterval);
        showResult(data.answer, data.image);
      };
    } catch (error) {
      clearInterval(loaderInterval);
      placeholderText.innerText = "The Oracle is broken. Blame the dev.";
      askBtn.disabled = false;
    }
  }

  function showResult(answer, imageUrl) {
    answerText.innerText = answer;
    resultImage.src = imageUrl;

    // Color coding
    if (answer === "yes") {
      answerText.style.color = "#00ffcc"; // Green/Cyan
      answerText.style.textShadow = "0 0 20px #00ffcc";
    } else {
      answerText.style.color = "#ff0055"; // Red/Pink
      answerText.style.textShadow = "0 0 20px #ff0055";
    }

    // Flip the card
    resultCard.classList.add("flipped");

    // Reset button
    askBtn.disabled = false;
    placeholderIcon.innerText = "🔮";
    placeholderText.innerText = "The Oracle has spoken.";
  }
});
