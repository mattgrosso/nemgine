/*jshint esversion: 6 */
const db = firebase.firestore();

const input = document.querySelector(".input");

let answerPending = false;

input.addEventListener("keyup", (event) => {
  clearMessage();

  if (event.key === "Enter") {
    document.activeElement.blur();

    clearInput();
    logToDB(input.value);
    checkAnswer(input.dataset.queryId, input.value);

    answerPending = true;
  }
});

function logToDB(value) {
  const log = db.collection("log");

  log.doc(new Date().toGMTString()).set({
    message: value
  })
}

function checkAnswer(queryId, value) {
  const docRef = db.collection("key").doc(queryId);

  docRef.get().then((doc) => {
    const data = doc.data();

    if (data.answer.toLowerCase() === value.toLowerCase()) {
      nextQuestion(data.next);
    } else {
      incorrect();
    }
  })
}

function nextQuestion(queryId) {
  const docRef = db.collection("key").doc(queryId);

  input.setAttribute("data-query-id", queryId);

  setMessage("Well done");

  setTimeout(function () {
    docRef.get().then((doc) => {
      const data = doc.data();

      setMessage(data.question);
    })
  }, 2000);
}

function incorrect() {
  answerPending = false;

  setMessage("Incorrect.");
}

function setMessage(message) {
  const messageElement = document.querySelector(".message");

  messageElement.innerText = message;
}

function clearMessage() {
  setMessage("");
}

function clearInput() {
  input.classList.add("clearing");

  setTimeout(function () {
    input.value = "";
    input.classList.remove("clearing");
  }, 250);
}
