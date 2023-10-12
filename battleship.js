var view = {
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit")

    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");

    }
};



view.displayMessage("Ready. Aim. Shoot!")

var model = {
    boardSize: 7, 
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    
    generateShipLocations: function(){
        var locations;
        for (var i = 0; i < this.numShips; i++){
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }

    },

    generateShip: function (){
        var direction = Math.floor(Math.random() * 2 );
        var row;
        var col;
        if (direction ===1){
            //Generate starting loc for horiz. ship
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength +1)));
        } else {
            //generate starting loc for vertical ship 
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength +1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = []
        for (var i = 0; i < this.shipLength; i++) {
            if (direction ===1){
                // add loc for horiz. ship
                newShipLocations.push(row + "" + (col + i));
             

            } else {
                // add loc for vert. ship 
                newShipLocations.push((row + i) + "" + col);
                
            }
        } 
        return newShipLocations;

    },

    collision: function(locations){
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0){
                    return true
                }
            }

        }
        return false;
    },

    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""] },
        {locations: [0, 0, 0], hits: ["", "", ""] },
        {locations: [0, 0, 0], hits: ["", "", ""] }],

    fire: function(guess){
        for (var i =0; i< this.numShips; i++) {
            var ship = this.ships[i];
            /* Utilize chaining to make code less verbose
            var locations = ship.locations;
            var index = locations.indexOf(guess);
            */
           var index = ship.locations.indexOf(guess);
            if (index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!")
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my ship!")
                    this.shipsSunk++;
                }
                return true;
            }
        } 
        view.displayMiss(guess);
        view.displayMessage("You missed!");
        
        return false;
    } ,

    isSunk: function(ship){
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        } 
        return true;

    }
};




function parseGuess(guess){
            var alphabet = ["A", "B", "C", "D", "E", "F", "G"]

            if (guess ===null || guess.length !== 2){
                alert("Choose a letter and number that are actually on the board, goofy.");
            } else {
                var firstChar = guess.charAt(0);
                var row = alphabet.indexOf(firstChar);
                var column = guess.charAt(1);

                if (isNaN(row) || isNaN(column)) {
                    alert("Enter valid coordinations");
                } else if (row < 0  || row >=model.boardSize || column < 0 || column >=model.boardSize) {
                    alert("Is that even on the board? ");
                } else {
                    return row + column
                }
            }
            return null;
        }


var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location){
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage ("You sank my battleships, in " + this.guesses + " guesses.");
            }
        }
        
    }
}



function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
    
}

function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode ===13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton(){
    
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);
    guessInput.value="";

}

window.onload = init;




