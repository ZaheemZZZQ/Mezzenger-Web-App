const socket = io();

var Username;
var chats = document.querySelector(".chats");
var User_List = document.querySelector(".users-list");
var User_Count = document.querySelector(".User-Count");
var Msg_Send = document.querySelector(".send-button");
var User_Msg = document.querySelector("#User-Msg");



do {
    Username = prompt("Enter Your Name: ")
} while (!Username);


// It will Call when User will Join
socket.emit("New-User-Joined", Username);

// Notifying that User is Joined
socket.on('User-Connected', (Socket_Name) => {
    UserJoinLeft(Socket_Name, 'joined');

});

// Function to Create Joined/Left Status div
function UserJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add("user-join");
    let content = `<p><b>${name} </b>${status} the Chat</p>`
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

// Notifying when User is Disconnected
socket.on('User-Disconnected', (User) => {
    UserJoinLeft(User, 'Left');
});


// For Updating Users List and Users Count
socket.on('User-List', (Users) => {
    User_List.innerHTML = "";
    Users_Arr = Object.values(Users);
    for (i = 0; i < Users_Arr.length; i++) {
        let P = document.createElement('p');
        P.innerText = Users_Arr[i];
        User_List.appendChild(P);
    }
    User_Count.innerHTML = Users_Arr.length;


});


// For Sending Messages
Msg_Send.addEventListener('click', () => {
    let Data = {
        User: Username,
        Msg: User_Msg.value
    };

    if (User_Msg.value != '') {
        appendMessage(Data, 'Outgoing');
        socket.emit('message', Data);
        User_Msg.value = '';
    }
});

function appendMessage(Data, Status) {
    let div = document.createElement('div');
    div.classList.add('message', Status);
    let content = `
    <h5>${Data.User}</h5>
    <p>${Data.Msg}</p>
    `;

    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (Data) => {
    appendMessage(Data, 'Incoming');
});
