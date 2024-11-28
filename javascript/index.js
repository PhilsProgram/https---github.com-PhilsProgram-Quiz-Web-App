let categoryId = "0";
let quizLevel = "easy";
let numberOfQuestions 
let currentPage
// let chosenAnswer = "";

(async function categotyFetch(){
    // try {
        const data = await fetch("https://opentdb.com/api_category.php")
        const response = await data.json()
        let lastValue
        for (let i = 0; i < response.trivia_categories.length; i++) {
            lastValue = response.trivia_categories[i].name
            lastValue = lastValue.split(":")
            $('#category').append($(`<option value=${response.trivia_categories[i].id}>${lastValue[lastValue.length - 1]}</option>`))
        }
    // } catch (error) {
    //     console.log("ERROR:", error);
    // }
})()

// Accessing the details on the page
$('#category').on("change", ()=>{
    categoryId = $("#category").val()
})
$("#difficulty").on("change", ()=>{
    quizLevel = $("#difficulty").val()
})
$("#question-number").on("input", ()=>{
    numberOfQuestions = $("#question-number").val()
    let lead = true
    if (lead === true) {
        setTimeout(()=>{
            let comp = $("#question-number").val()
            if (comp <= 20) {
                numberOfQuestions = $("#question-number").val()
            }
            else{
                Swal.fire("Try to request 20 number of questions and below")
            }
        }, 2000)
    } lead = false
})

// Accessing the reset button on the page 
$("#reset").on("click", ()=>{
    $("#question-number").val(10)
    $("#difficulty").val("easy")
    $("#category").prop("selectedIndex", 1)
    categoryId = 1
    quizLevel = "easy"
    numberOfQuestions = 5
    let data = {categoryId, quizLevel, numberOfQuestions}
    sessionStorage.clear()
    sessionStorage.setItem("fetchInputs", JSON.stringify(data))
    window.open("../html/questions.html", "_self")
})

// Defining the code for the st\rt button
$("#start").on("click", ()=>{
    if($("#question-number").val() == ""){
        Swal.fire("Provide the number of questions")
    } else {
    let data = {categoryId, quizLevel, numberOfQuestions}
    sessionStorage.clear()
    sessionStorage.setItem("fetchInputs", JSON.stringify(data))
    window.open("../html/questions.html", "_self")
    }   
})



currentPage = window.location.pathname.split("/").pop()
if (currentPage == "results.html") {
    let recieved = localStorage.getItem("quizEnded")
    recieved = JSON.parse(recieved)
    let userScore = recieved.score
    let userPercentage = recieved.percentageScore
    let totalQuestions = recieved.numberOfQuestions
    $("#message").text(`You had ${userScore} questions correct out of the ${totalQuestions}`)
    $(".percentage-score").text(`${userPercentage}%`)
    localStorage.clear()
}
$(".btn-close").on("click", ()=>{
    Swal.fire({
        title: "Are you sure?",
        text: "This action will exit you from the site",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "pink",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, close!"
      }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = ("https://google.com")
        }
      });
})