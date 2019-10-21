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


  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var userRef = database.ref('users'); 
var player1 = database.ref('users/player1');
var player2 = database.ref('users/player2');

var currentUserID;
var move = '';
var msg = '';
var name = '';
var state = '';
var start_game = false;
// var currentUserInfo = database.ref(`/users/${currentUserID}`);
function getPlayerID(){
    userRef.once('value', snap =>{
        if(snap.val().player1.active === false){
            currentUserID = 'player1';
        } else if (snap.val().player2.active === false){
            currentUserID = 'player2';
        }
    })
}
 //removes start and transitions into entering name
function enterName(){
    $('.enterGame').empty();
    $('.enterGame').html(
        `<h1>Enter a Name</h1>
         <input id='nameInput'></input>
         <button class='submit'>Start</button>`
    )
}
//function to create/update a player;
function updatePlayer(player){
    console.log(player);
    playerObj = {
        active: true,
        id: currentUserID,
        move: move,
        msg: msg,
        name: name,
        state: state
    }
    console.log(playerObj);
    var updates = {}   
    if(player === 'player1'){
        updates['/users/player1'] = playerObj;
        return database.ref().update(updates);
    } else if (player === 'player2'){
        updates['/users/player2'] = playerObj;
        return database.ref().update(updates);
    } else {
        console.log('error in updatePlayer function');
    }

}

//resets player
function resetPlayers(player){
    console.log(player);
    playerObj1 = {
        active: false,
        id: 'player1',
        move: "",
        msg: "",
        name: "",
        state: ""
    }
    playerObj2 = {
        active: false,
        id: 'player2',
        move: "",
        msg: "",
        name: "",
        state: ""
    }
    var updates = {}   
    if(player === 'player1'){
        updates['/users/player1'] = playerObj1;
        return database.ref().update(updates);
    } else if (player === 'player2'){
        updates['/users/player2'] = playerObj2;
        return database.ref().update(updates);
    } else {

    }

}
//checks if lobby is full
function isLobbyFull(){
    var returnValue;
    userRef.once('value', snap =>{
        if(snap.val().player1.active === true && snap.val().player2.active === true){
            returnValue = true;
        } else if (snap.val().player1.active === false){
                returnValue = 'player1';
        } else if (snap.val().player2.active === false){
            returnValue = 'player2';
        }
    })
    return returnValue;
}
//tells player games is full if theres already to users playing;
function gameIsFull(name){
    var full = `<div id='full'>Sry ${name} the Game is currently full!</div>
                <button class='tryAgain'>Try Again</button>`
    $('.enterGame').html(full)
}

//directs user to gamepage
function gameDisplay(){
    var displayBoard = (`<div class=timer>timer Here></ 1div>
                        <div class='board'>
                            <div class='player1'>Player 2</div>
                            <div class='vs'>VS</div>
                            <div calss='player2'>Player 2</div>
                        </div>`);

    var playerSelection = (`<div class='playerSelection'>
                            </div>
                            <div>${name} you are ${currentUserID}.</div>`)

    var rdyButton = (`<button class='rdy'>Ready Up!</button>`);
    $('.enterGame').empty();
    $('.enterGame').append(displayBoard, playerSelection, rdyButton);
}
//will run functions to run game
//1. check if both players are ready
//2. when both players are ready will start player selection & timer
function startGame(){
    $('.rdy').remove();
    var buttons = `<button class='choice'><img href = ""/>rock</button>
                   <button class='choice'><img href = ""/>paper</button>
                   <button class='choice'><img href = ""/>scissors</button>
                   <div class='youChose'></div>`
    $('.playerSelection').append(buttons);
}



//sets up player and into the database
$('.start').on('click',function(){
    enterName();
})

//submits user into database if not full
$(document).on('click','.submit',function(){
    name = $('#nameInput').val().trim();
    var inactiveSpot = isLobbyFull();

    if(inactiveSpot === true){
        console.log('lobby is full');
        gameIsFull(name);
    } else {
        console.log('empty seat at '+ inactiveSpot);
        getPlayerID();
        updatePlayer(inactiveSpot);
        gameDisplay();
    }
})
//try again button when lobby is currently full
$(document).on('click','.tryAgain',function(){
    enterName();
})

//changes players state to rdy if both r rdy games starts
$(document).on('click','.rdy', function(){
    state = 'ready';
    $('.rdy').text('You are Ready!');
    updatePlayer(currentUserID);
    userRef.on('value',snap =>{
        if (snap.val().player1.state === 'ready' && snap.val().player2.state === 'ready'){
            if(start_game === false){
                startGame();
                start_game = true;
            }
        }
    })

})

//sets your current move
$(document).on('click','.choice',function(){
    move = $(this).text();
    updatePlayer(currentUserID);
    $('.youChose').text('You Chose '+ move);
})

//resets database
$('.reset').on('click',function(){
    resetPlayers('player1');
    resetPlayers('player2');
})



userRef.on('value', snap => {

})

// database.ref().on('value', snap =>{
//     if(isLobbyFull()){
//         console.log('lobby is full')
//     } else {
//         console.log('waiting on players to join');
//     }
// })
database.ref().on('value',snap =>{


})