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
    playerObj = {
        active: true,
        id: currentUserID,
        move: move,
        msg: msg,
        name: name,
        state: state
    }
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
        var displayBoard = (`<div class='board'>
                                <div class='player1'>
                                    <h1>Player 1</h1>
                                    <div class='player1Choice'></div>
                                </div>
                                <div class='vs'>VS</div>
                                <div calss='player2'>
                                    <h1>Player 2</h1>
                                    <div class='player2Choice'></div>
                                </div>
                            </div>`);
        var playerSelection = (`<div class='playerSelection'>
        </div>
        <div class='youChose'></div>
        <div class='fineprint'>${name} you are ${currentUserID}</div>`)

        var rdyButton = (`<button class='rdy'>Ready Up!</button>`);
        $('.enterGame').empty();
        $('.enterGame').append(displayBoard, rdyButton, playerSelection);

}

//simulates game
function rps(input1,input2){
    if (input1 === input2) {
        return 'draw'
    }
    if (input1 === "rock") {
        if (input2 === "scissors"){
            return "rock";
        } else {
            return "paper";
        }
    }
    if (input1 === "paper") {
        if (input2 === "rock") {
            return "paper";
        } else {
    
            return "scissors";
        }
    }
    if (input1 === "scissors") {
        if (input2 === "rock"){
            return 'rock';
        } else {
    
            return "scissors";
        }
    }
}

//timer function if i decided to add one
// function myTimer(timer){
//     console.log('timer');
//     var remaining_time = timer;
//     timerControl = setInterval(function(){
//         if(remaining_time > 0){
//             remaining_time--;
//             $('.timer').text(remaining_time);
//             console.log(remaining_time);
//         } else {
//             console.log('interval cleared')
//             clearInterval(timerControl);
//         }
//     },1000);
// };

function displayResult(result){
    userRef.once('value', snap =>{
        $('.player1Choice').text(snap.val().player1.move);
        $('.player2Choice').text(snap.val().player2.move);
        if(result === 'draw'){
            $('.winner').text('Match was a Draw!');
        } else if(snap.val().player1.move === result){
           if(currentUserID === 'player1'){
           }
            $('.winner').text(`Player 1 Wins!`)
        } else {
            if(currentUserID === 'player2'){
            }
            $('.winner').text(`Player 2 Wins!`)
        }
        state = 'notready';
        updatePlayer(currentUserID);
        $('.playerSelection').empty();
        $('.playerSelection').append('<button class="rdy">Next Round</button>')
        start_game = false;
        // if (snap.val().player1.state === 'ready' && snap.val().player2.state === 'ready'){
        //     console.log('both players r ready');
        //     if(start_game === false){
        //         startGame();
        //         start_game = true;
        // }
    })}



//will run functions to run game
function startGame(){
    $('.rdy').remove();
    $('.playerSelection').empty();
    var buttons = `<button class='choice'><img href = ""/>rock</button>
                   <button class='choice'><img href = ""/>paper</button>
                   <button class='choice'><img href = ""/>scissors</button>
                   `
    $('.playerSelection').append(buttons);
    //myTimer(15);
    userRef.on('value', snap =>{
        if(snap.val().player1.state === 'decided' && snap.val().player2.state === 'decided'){
        var result = rps(snap.val().player1.move, snap.val().player2.move);
        displayResult(result);
        }
    })
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
            $('.player1Choice').text('');
            $('.player2Choice').text('');
            $('.winner').text('');
            if(start_game === false){
                startGame(3);
                start_game = true;
            }
        }
    })

})

//sets your current move
$(document).on('click','.choice',function(){
    move = $(this).text();
    state = 'decided';
    updatePlayer(currentUserID);
    $('.youChose').text('You Chose '+ move);
})

//resets database
// $('.reset').on('click',function(){
//     resetPlayers('player1');
//     resetPlayers('player2');
// })


userRef.on('value', snap => {
})

database.ref().on('value',snap =>{
})
//resets user

window.addEventListener("beforeunload", function(e){
    resetPlayers(currentUserID);
 }, false);