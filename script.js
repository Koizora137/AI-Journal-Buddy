async function sendToAI() {
    const entry = document.getElementById("entry").value;
    const responseBox = document.getElementById("response");
    const submitBtn = document.getElementById("submitBtn");
    // Prevent empty submissions
    if (!entry.trim()) {
      responseBox.innerText = "Please write something before asking the AI.";
      return;
  }
     // Show thinking message and disable button
    responseBox.innerText = "🤔 Thinking...";
    submitBtn.disabled = true;
    submitBtn.innerText = "Thinking...";
 


try {
    const res = await fetch("http://localhost:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entry })
    });

    const data = await res.json();
    responseBox.innerText = data.response;
    // Save the entry and response to localStorage
let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

entries.push({
  entry: entry,
  response: data.response,
  date: new Date().toLocaleString()
});

localStorage.setItem("journalEntries", JSON.stringify(entries));
displayEntries(); // show them on the screen

  } catch (error) {
    console.error("Error talking to the backend:", error);
  
    responseBox.innerHTML = `
      <p>😕 Oops! The AI couldn’t respond right now.</p>
      <p>🔁 Please check your internet and try again in a few seconds.</p>
    `;
  }
  // Re-enable the button after response
  submitBtn.disabled = false;
  submitBtn.innerText = "Get Advice";
}

function displayEntries() {
  const list = document.getElementById("entryList");
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

  list.innerHTML = ""; // clear list

  // Show newest first
  entries.reverse().forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.date}</strong><br><em>${item.entry}</em><br>💬 ${item.response}<hr>`;
    list.appendChild(li);
  });
}
displayEntries();

function clearEntries() {
  if (confirm("Are you sure you want to delete all journal entries?")) {
    localStorage.removeItem("journalEntries");
    displayEntries(); // Refresh the list
  }
}