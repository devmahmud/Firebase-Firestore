const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let location = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  location.textContent = doc.data().location;
  cross.textContent = "X";

  li.appendChild(name);
  li.appendChild(location);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // Deleting Data
  cross.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes")
      .doc(id)
      .delete();
  });
}

// Getting Data
function getData() {
  document.querySelector("#loader").style.display = "block";

  db.collection("cafes")
    .orderBy("name")
    .get()
    .then(snapshot => {
      console.log(snapshot.docs);
      document.querySelector("#loader").style.display = "none";
      snapshot.docs.forEach(doc => renderCafe(doc));
    });
}

// getData();

form.addEventListener("submit", e => {
  e.preventDefault();

  db.collection("cafes").add({
    name: form.name.value,
    location: form.location.value
  });
  form.name.value = "";
  form.location.value = "";
});

// Realtime listener
function getRealtimeData() {
  document.querySelector("#loader").style.display = "block";
  db.collection("cafes")
    .orderBy("name")
    .onSnapshot(snapshot => {
      document.querySelector("#loader").style.display = "none";
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === "added") {
          renderCafe(change.doc);
        } else if (change.type === "removed") {
          let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
          cafeList.removeChild(li);
        }
      });
    });
}
getRealtimeData();
