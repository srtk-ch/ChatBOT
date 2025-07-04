document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const chatLog = document.getElementById("chat-log");
  const userInput = document.getElementById("user-input");
  const historyList = document.getElementById("chat-history");

  const typingHeader = document.getElementById("typing-header");
  typingHeader.textContent = "Hello Human! SrtkBOT reporting for duty";

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;
    const userEl = addMessage(message, "user");
    userInput.value = "";

    const botEl = addMessage("Typing...", "bot");

    const res = await fetch("/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    botEl.textContent = data.response || "Error";
    addButtons(botEl, false);
  });

  function addMessage(msg, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    msgDiv.textContent = msg;
    chatLog.appendChild(msgDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
    addButtons(msgDiv, sender === "user");
    return msgDiv;
  }

  function addButtons(msgDiv, isUser) {
    const btns = document.createElement("div");
    btns.className = "message-buttons";

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.textContent = "Copy";
    copyBtn.onclick = () => navigator.clipboard.writeText(msgDiv.textContent);

    btns.appendChild(copyBtn);

    if (isUser) {
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        document.getElementById("user-input").value = msgDiv.textContent;
        msgDiv.remove();
      };
      btns.appendChild(editBtn);
    }

    msgDiv.appendChild(btns);
  }
});

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("closed");
}

function startNewChat() {
  document.getElementById("chat-log").innerHTML = "";
}
