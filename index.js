let notes = [
  {
    title: "The flooded library",
    content:
      "The water was knee-deep and warm. Books floated like lily pads, and every page I opened was blank except one line in my own handwriting. I could not read it before the shelves began to hum.",
    id: 1,
    lastUpdated: 1793688000000,
  },
  {
    title: "Gladiolus stairs",
    content:
      "A staircase grew out of a single dried gladiolus. Each step was a petal, purple and papery. At the top a door was open and the room behind it smelled like my grandmother's kitchen.",
    id: 2,
    lastUpdated: 1793603700000,
  },
  {
    title: "Train without a driver",
    content:
      "I rode a night train through a forest of glass trees. Nobody was driving, and nobody seemed worried. When I got off, the station sign had my name on it.",
    id: 3,
    lastUpdated: 1793339400000,
  },
  {
    title: "Teeth like pearls",
    content:
      "All of my teeth loosened at once and turned into pearls. I kept them in my hands and felt strangely calm, as if I had been waiting for it to happen.",
    id: 4,
    lastUpdated: 1793082000000,
  },
  {
    title: "The house with extra rooms",
    content:
      "I found a door in my flat that had never been there. Behind it were six more rooms, all lit by a low gold light. One was full of watercolor paper, still wet.",
    id: 5,
    lastUpdated: 1792829100000,
  },
];

function loadNotesFromStorage() {
  const stored = localStorage.getItem("notes");
  if (stored) {
    notes = JSON.parse(stored);
  }
}

function saveNotesToStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderInitialNotes() {
  loadNotesFromStorage();
  for (const [index, value] of notes.entries()) {
    renderNote(index);
  }
}

function renderNote(index) {
  const noteDiv = document.getElementById("saved-notes");
  const noteCard = document.createElement("div");
  noteCard.classList.add("saved-note");
  noteCard.addEventListener("click", () => showSelectedNote(index));

  const title = document.createElement("p");
  const content = document.createElement("p");
  const date = document.createElement("p");

  title.innerHTML = notes[index].title;
  content.innerHTML = notes[index].content;

  date.innerHTML = new Date(notes[index].lastUpdated).toLocaleString("de-DE");

  noteCard.append(title, content, date);
  noteDiv.appendChild(noteCard);
}

function saveNote() {
  notes.push({
    title: document.getElementById("add-note-title").value,
    content: document.getElementById("add-note-input").value,
    id: crypto.randomUUID,
    lastUpdated: Date.now(),
  });

  saveNotesToStorage();
  renderNote(notes.length - 1);
}

function showSelectedNote(index) {
  document.getElementById("add-note-title").value = notes[index].title;
  document.getElementById("add-note-input").value = notes[index].content;
}

function createNewNote() {
  document.getElementById("add-note-title").value = "";
  document.getElementById("add-note-input").value = "";
}

renderInitialNotes();
