// $(document).ready(function() {

    var keysPressedDictionary = { 
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
        f: false,
        g: false,
        h: false,
        i: false,
        j: false,
        k: false,
        l: false,
        m: false,
        n: false,
        o: false,
        p: false,
        q: false,
        r: false,
        s: false,
        t: false,
        u: false,
        v: false,
        w: false,
        x: false,
        y: false,
        z: false
    };

    // the phraseList is a tuple of the phrase, the answer, and 3 clues
    var phraseList = [
        ["Go ahead, make my day", "Sudden Impact - 1983", "Callahan", "Dirty", "Eastwood"],
        ["May the Force be with you", "Star Wars - 1977", "Han", "Skywalker", "Lucas"],
        ["E.T. phone home", "E.T.: THE EXTRA-TERRESTRIAL - 1982", "Finger", "Phone", "Elliott"],
        ["Show me the money!", "JERRY MAGUIRE - 1996", "Football", "Cruise", "Cuba"],
        ["I'll be back", "THE TERMINATOR - 1984", "Droid", "Future", "Arnold"],
        ["There's no crying in baseball!", "A LEAGUE OF THEIR OWN - 1992", "Ladies", "Softball", "Hanks"]
    ];

    var codedPhrase = "";
    var randomIndexToPhrase = Math.floor(Math.random() * phraseList.length);
    var currentPhrase = "";
    var currentPhraseVisibility = [];
    var numGuessesWrong = 0;
    var maxGuesses = 7;
    var numWins = 0;
    var numLosses = 0;

    function runOnce() {
        for (var key in keysPressedDictionary) {
            // reset each key to a value of not selected - false
            keysPressedDictionary[key] = false;
        }
        
        // reset items
        codedPhrase="";
        numGuessesWrong = 0;
        currentPhraseVisibility = [];
        document.querySelector("p.keysGuessed").innerHTML = "";
        document.querySelector("p.phrase").innerHTML = "";

        // let's make a random selection for the next phrase
        randomIndexToPhrase = Math.floor(Math.random() * phraseList.length);
        var currentPhraseAnswer = "";
        currentPhrase = currentPhraseAnswer = phraseList[randomIndexToPhrase][0];

        for (i = 0; i < currentPhrase.length; i++) {
            var codedChar = [currentPhrase[i], false];
            if ((currentPhrase.charCodeAt(i) >= 65 && currentPhrase.charCodeAt(i) <= 90) ||
                (currentPhrase.charCodeAt(i) >= 97 && currentPhrase.charCodeAt(i) <= 122)) {   
                codedChar = [currentPhrase[i], false];
            } else {
                codedChar = [currentPhrase[i], true];
            }
            currentPhraseVisibility.push(codedChar);
        }

        // from that selection, get the 3 clues and set them on the carrousel
        document.querySelector("p.clue1").innerHTML = phraseList[randomIndexToPhrase][2];
        document.querySelector("p.clue2").innerHTML = phraseList[randomIndexToPhrase][3];
        document.querySelector("p.clue3").innerHTML = phraseList[randomIndexToPhrase][4];

        // Set the inner HTML contents of the .phrase p to our html string
        // But, first, replace all answered letters with underscores and populate puncuation
        // One way to replace chars --> currentPhrase = currentPhrase.replace(/[a-zA-Z]/g, '_');
        showThePhrase();
    }    // end runOnce()
  
    // function showThePhrase() {
    //     for (i = 0; i < currentPhrase.length; i++) {
    //         if ((currentPhrase.charCodeAt(i) >= 65 && currentPhrase.charCodeAt(i) <= 90) ||
    //             (currentPhrase.charCodeAt(i) >= 97 && currentPhrase.charCodeAt(i) <= 122)) {
    //                 codedPhrase += "_ ";
    //         } else if (currentPhrase.charCodeAt(i) == 32) {
    //             codedPhrase += "  ";
    //         } else {
    //         // whether it is a space or a puncuation, leave it as is and do nothing to expose it
    //             codedPhrase += currentPhrase.charAt(i) + " ";
    //         }
    //     }
    // }

    function showThePhrase() {
        var exposedPhrase = "";
        var solved = true;
        for (i = 0; i < currentPhraseVisibility.length; i++) {
            if (currentPhraseVisibility[i][1]) {  // if the char has been exposed/visible
                exposedPhrase += currentPhraseVisibility[i][0] + " ";
            } else {
                // some char has not been exposed yet so the phase is not solved yet!
                solved = false;
                exposedPhrase += "_ ";
            }
        }
        codedPhrase = exposedPhrase;
        document.querySelector("p.phrase").innerHTML = codedPhrase;
        return solved;
    }

    function checkIfLetterIsInPhrase(userGuess) {
        var goodGuess = false;
        for (i = 0; i < currentPhraseVisibility.length; i++) {
            if (currentPhraseVisibility[i][0] === userGuess ||
                currentPhraseVisibility[i][0] === userGuess.toUpperCase()) {
                currentPhraseVisibility[i][1] = true;
                goodGuess = true;
            }
        }

        // after checking all the letters in the phrase, if not found, count it against the userGuess
        if (!goodGuess) {
            numGuessesWrong++;
        }
        if (numGuessesWrong >= maxGuesses) {
            alert("sorry, you lost this round!");
            numLosses++;
            document.querySelector("a.losses").innerHTML = "Losses: " + numLosses;
        }
        if (showThePhrase()) {
            // if showThePhrase returns true it means the phrase has been solved!
            numWins++;
            var audio = new Audio("assets/audio/money2.mp3");
            audio.play();
            alert("solved!!");
            document.querySelector("a.wins").innerHTML = "Wins: " + numWins;
        }
    }

    runOnce();
    
    document.querySelector("p.phrase").innerHTML = codedPhrase;

    document.onkeyup = function(event) {

        // Determines which key was pressed.
        var userGuess = event.key.toLowerCase();

        // make sure the key pressed was a letter between a - z
        if (event.keyCode >= 65 && event.keyCode <= 90) {
            keysPressedDictionary[userGuess] = true;
            checkIfLetterIsInPhrase(userGuess);
            var keysGuessSofar = "";
            for(var key in keysPressedDictionary) {
                // if the value in the dictionary was set to true this letter was selected
                if (keysPressedDictionary[key]) {  
                    keysGuessSofar += key;
                    if (key != "z") {
                        keysGuessSofar += ", ";
                    } 
                }
            }
            document.querySelector("p.keysGuessed").innerHTML = keysGuessSofar;
        }
    };

    document.getElementById("getNextQuote").addEventListener("click", myFunction);

    function myFunction() {
        $('#carouselExampleIndicators').carousel(0);   // reset the carousel to default item
        runOnce();
    }