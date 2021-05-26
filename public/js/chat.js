const chatPopup = document.getElementById("chat_area");
const chatPopupClose = document.getElementById("toggleChatBtn");
const msgBtn = document.getElementById("msg_btn");

chatPopupClose.addEventListener("click", () => {
  chatPopup.style.display = "none";
});

msgBtn.addEventListener("click", () => {
  if (chatPopup.style.display === "flex") {
    chatPopup.style.display = "none";
  } else {
    chatPopup.style.display = "flex";
  }
});

////CHAT FUNCTIONALITY
//
//
//

/*
 *
 * a user is directed to the url
 * if user is signed in
 * a cookie is sent to the server
 * the server interprets it to get the username
 * the server then creates a group for the user & the admin
 * as messages are sent it is stored in the database as chats under a chat id
 * if the user is anonymous it is store temporarily and the persons email is required before chat begins
 *
 *
 *
 * */

const clientMsg = (msg) => {
  return `

            <div class="chat_msg-client_title ">
              <h5 class="h6">${msg.username}</h5>
                <p class="h7">${msg.time}</p>
            </div>
            <p>${msg.text}</p>

`;
};
const masterMsg = (msg) => `

            <div class="chat_msg-support_title ">
                <h5 class="h6">${msg.username}</h5>
                <p class="h7">${msg.time}</p>
            </div>
            <p>${msg.text}</p>
       
`;

///CHART BODY
const chat_area = document.getElementById("chat_area-body");
const socket = io();
///SOCKET CONNECTION
const chat_form = document.getElementById("chat_form");

const chatMsg = document.querySelector(".chat_msg-support");

socket.on("message", (msg) => {
  //create div
  if (msg.username === "Admin") {
    const div = document.createElement("div");
    div.setAttribute("class", "chat_msg-support");
    div.innerHTML = masterMsg(msg);
    chat_area.appendChild(div);
    chat_area.scrollTop = chat_area.scrollHeight;
  } else {
    const div = document.createElement("div");
    div.setAttribute("class", "chat_msg-client");
    div.innerHTML = clientMsg(msg);
    chat_area.appendChild(div);
    chat_area.scrollTop = chat_area.scrollHeight;
  }
});

chat_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = {
    username: "okechukwu",
    text: e.target.elements.message.value,
  };

  socket.emit("userMessage", message);

  e.target.elements.message.value = "";
  e.target.elements.message.focus();
});
