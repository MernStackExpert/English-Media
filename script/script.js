const loadLessions = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};


const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach(btn => btn.classList.remove("active"))
}


const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {

      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");

      displayLevelWOrd(data.data)
    });

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
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>
    `;

    wordContainer.append(card);
  });
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
