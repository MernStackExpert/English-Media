
// speak function 

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


// synonyms

const createElement = (arr) => {
  const element = arr.map((el) => `<span class="btn">${el}</span>`);
  return element.join(" ");
};

const manageSpineer = (status) => {
  if (status == true) {
    document.getElementById("spineer").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spineer").classList.add("hidden");
  }
};

const loadLessions = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  manageSpineer(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); // Remove All Active Class!

      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");

      displayLevelWOrd(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();

  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
   <div class="">

    <h2 class="text-2xl font-bold">${
      word.word
    } (<i class="fa-solid fa-microphone-lines"></i> : ${
    word.pronunciation
  } )</h2>

  </div>
  <div class="">

    <h2 class="font-bold">Meaning</h2>
    <p>${word.meaning}</p>

  </div>
    <div class="">

    <h2 class="font-bold">Example</h2>
    <p>${word.sentence}</p>

  </div>
    <div class="">

    <h2 class="font-bold">Synonyms </h2>
     <div class="">${createElement(word.synonyms)}</div>
  </div>
  `;

  document.getElementById("my_modal").showModal();
};

const displayLevelWOrd = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="text-center col-span-full rounded-xl py-10 space-y-6">
        <img class="mx-auto" src="./assets/alert-error.png"/>
        <p class="text-xl font-medium text-gray-400 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-bold text-4xl font-bangla">নেক্সট Lesson এ যান</h2>
      </div>`;
    manageSpineer(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl text-center shadow-sm py-10 px-5 space-y-4">
        <h2 class="font-bold text-2xl ">${
          word.word ? word.word : "শব্দ পাওয়া যাইনি"
        }</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>
        <p class="font-bangla text-2xl font-semibold">${
          word.meaning ? word.meaning : "অর্থ পাওয়া যাইনি"
        } / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যাইনি"
    }</p>

        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `;

    wordContainer.append(card);
  });

  manageSpineer(false);
};

const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");

    btnDiv.innerHTML = `
     <button id="lesson-btn-${lesson.level_no}" onclick = loadLevelWord(${lesson.level_no}) class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> lesson - ${lesson.level_no}</button>
    `;

    levelContainer.append(btnDiv);
  }
};

loadLessions();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );

      displayLevelWOrd(filterWords);
    });
});
