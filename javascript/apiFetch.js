// Accessing what we got from the options
let data = sessionStorage.getItem("fetchInputs");
data = JSON.parse(data);
let numberOfQuestions = data.numberOfQuestions;
let categoryId = data.categoryId;
let quizLevel = data.quizLevel;
sessionStorage.clear();

let score = 0;

// Generating a position for the correct answer
function addStringAtRandomPosition(array, string) {
  // Generate a random index between 0 and the length of the array
  const randomIndex = Math.floor(Math.random() * (array.length + 1));
  array.splice(randomIndex, 0, string);
}
let index = 0;
let chosenAnswer = "";
let possibleAnswers;
let correctAnswer;
let optionClicked;

const displayQuestion = (i, e) => {
  optionClicked = false;
  correctAnswer = e.results[i].correct_answer;
  // We are noe to define a function that Is going to be looping to the browswer
  addStringAtRandomPosition(
    e.results[i].incorrect_answers,
    e.results[i].correct_answer
  );
  possibleAnswers = e.results[i].incorrect_answers;
  $("#question-title").text(
    e.results[i].question
      .replaceAll("&quot;", "'")
      .replaceAll("&#039;", "'")
      .replaceAll("&eacute;", "'")
      .replaceAll("&ouml;", "'")
      .replaceAll("&rsquo;", "'")
  );
  possibleAnswers.forEach((answer) => {
    // Check if an option with the same text already exists
    if ($("#possibles").find(`.option:contains('${answer}')`).length > 0) {
      return; // Skip to the next iteration
    } else {
      $("#possibles").append($(`<div class="option">${answer}</div>`));
    }
  });
  $(".option").on("click", (event) => {
    optionClicked = true;
    $(".option").removeClass("selected-option");
    chosenAnswer = $(event.currentTarget).text();
    $(event.currentTarget).addClass("selected-option");
  });
};

// The API fetch for the question
if (window.location.pathname.split("/").pop() == "questions.html") {
  const raw = await fetch(
    `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${categoryId}&difficulty=${quizLevel}&type=multiple`
  );
  const questionsApi = await raw.json();

  $(".footer-btn").append($(`<button class="btn previous">PREVIOUS</button>`));
  $(".footer-btn").append($(`<button class="btn btn-nxt">NEXT</button>`));
  displayQuestion(index, questionsApi);

  // Adding event listeners for the buttons
  $(".btn-nxt").on("click", () => {
    if (optionClicked == false) {
      Swal.fire("Please select an option to continue");
    } else {
      if (index == numberOfQuestions - 1) {
        localStorage.clear();
        let percentageScore = parseInt((score / numberOfQuestions) * 100);
        let endOfQuiz = { score, numberOfQuestions, percentageScore };
        localStorage.setItem("quizEnded", JSON.stringify(endOfQuiz));
        window.open(
          "../html/results.html",
          "_self"
        ); /************* Now we get to the results*************/
      }
      $("#possibles").empty();
      chosenAnswer == questionsApi.results[index].correct_answer
        ? score++
        : score;
      index == numberOfQuestions - 2
        ? $(".btn-nxt").text("FINISHED")
        : $(".btn-nxt").text("NEXT");
      // Checking if the quiz ended then we get the results

      index++;
      displayQuestion(index, questionsApi);
    }
  });
  $(".previous").on("click", () => {
    $("#possibles").empty();
    $(".btn-nxt").text() == "FINISHED" ? $(".btn-nxt").text("NEXT") : 1;
    if (index == 0) {
      displayQuestion(index, questionsApi);
      Swal.fire(`You are currently on the first page of the question`);
    } else {
      index--;
      displayQuestion(index, questionsApi);
    }
  });
}
