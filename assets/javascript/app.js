//initializes Database
var firebaseConfig = {
    apiKey: "AIzaSyCs5Cu-LWQ66LhPZqUxe1UPpBjC27t4UEw",
    authDomain: "rock-paper-scissors-c64b4.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-c64b4.firebaseio.com",
    projectId: "rock-paper-scissors-c64b4",
    storageBucket: "rock-paper-scissors-c64b4.appspot.com",
    messagingSenderId: "379179824145",
    appId: "1:379179824145:web:ddde3e4940ee9669302db0",
    measurementId: "G-3Z4BTYGHF5"
  };

var amountOfPlayers = 0;
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var userRef = database.ref('users');


// database.ref().push(users);
 //removes start and transitions into entering name
function enterName(){
    $('.enterGame').empty();
    $('.enterGame').html(
        `<h1>Enter a Name</h1>
         <input id='nameInput'></input>
         <button class='submit'>Start</button>`
    )
}
//function to create a player;
function createPlayer(name,msg,move,state){
    player = {
        name: name,
        msg: msg,
        move: move,
        state: state
    }
    return player;
}
//checks if lobby is full, aka if database holds 2 objects alrdy.
function isLobbyFull(){
    var returnValue;
    userRef.once('value', snap => {
       if(snap.numChildren() >= 2){
           returnValue = true;
       } else returnValue = false;
    })
    return returnValue;
}
//tells player games is full if theres already to users playing;
function gameIsFull(name){
    var full = `<div id='full'>Sry ${name} the Game is currently full!</div>
                <button class='tryAgain'>Try Again</button>`
    $('.enterGame').html(full)
}
function gameScene(){

}
function gameDisplay(){
    var display = $()
}
//will run functions to run game
//1. check if both players are ready
//2. when both players are ready will start player selection & timer
function startGame(){

}



//sets up player and into the database
$('.start').on('click',function(){
    enterName();
})

//submits user into database if not full
$(document).on('click','.submit',function(){
    var userName = $('#nameInput').val().trim();

    if(isLobbyFull()){
        console.log('lobby is full');
        gameIsFull(userName);
    } else {
        var user = createPlayer(userName,'','none','ready');
        userRef.push(user);
        // startGame();
    }
})
//try again button when lobby is currently full
$(document).on('click','.tryAgain',function(){
    enterName();
})

userRef.on('value', snap => {
    console.log(snap.numChildren());
    console.log(snap.val());
})