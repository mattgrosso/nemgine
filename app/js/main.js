/*jshint esversion: 6 */
const db = firebase.firestore();
const log = db.collection("log");

const input = document.querySelector(".input");

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    log.doc(new Date().toGMTString()).set({
      message: input.value
    })
  }
});
