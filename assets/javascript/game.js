
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

    // this is the constructor for my MovieEntry object
    function MovieEntry(phrase, title, clue1, clue2, clue3, soundBiteFile) {
        this.phrase = phrase;
        this.title = title;
        this.clue1 = clue1;
        this.clue2 = clue2;
        this.clue3 = clue3;
        this.soundBiteFile = soundBiteFile; 
    }

    // the phraseList is a tuple of the phrase, the answer, 3 clues, and an audio file
    var phraseList = [];

    // initially load movies into the array
    var oneEntry = Object;
    oneEntry = new MovieEntry("Go ahead, make my day", "Sudden Impact - 1983", "Callahan", "Dirty", "Eastwood", "assets/audio/make_my_day.wav");
    phraseList.push(oneEntry);
    oneEntry = new MovieEntry("May the Force be with you", "Star Wars - 1977", "Han", "Skywalker", "Lucas", "assets/audio/starwars.mp3");
    phraseList.push(oneEntry);
    oneEtnry = new MovieEntry("E.T. phone home", "E.T.: THE EXTRA-TERRESTRIAL - 1982", "Finger", "Phone", "Elliott", "assets/audio/et_phone_home.wav");
    phraseList.push(oneEntry);
    oneEntry = new MovieEntry("Show me the money!", "JERRY MAGUIRE - 1996", "Football", "Cruise", "Cuba", "assets/audio/money2.mp3");
    phraseList.push(oneEntry);
    oneEntry = new MovieEntry("I'll be back", "THE TERMINATOR - 1984", "Droid", "Future", "Arnold", "assets/audio/be_back.wav");
    phraseList.push(oneEntry);
    oneEntry = new MovieEntry("There's no crying in baseball!", "A LEAGUE OF THEIR OWN - 1992", "Ladies", "Softball", "Hanks", "assets/audio/league_no_crying.wav");
    phraseList.push(oneEntry);
    oneEntry = new MovieEntry("That's a fact, Jack!", "Stripes - ", "Murray", "Army", "Horrizontal", "assets/audio/stripes_fact_jack.wav");
    phraseList.push(oneEntry);
    oneEntry = new MovieEntry("It's in the hole!", "CaddyShack - ", "Golf", "Murray", "Cinderella story", "assets/audio/in_the_hole.wav");
    phraseList.push(oneEntry);    

    var codedPhrase = "";
    var randomIndexToPhrase = Math.floor(Math.random() * phraseList.length);
    var currentPhrase = "";
    var currentPhraseVisibility = [];
    var remainingGuesses = 6;
    var maxGuesses = 7;
    var numWins = 0;
    var numLosses = 0;
    var soundBiteFile = "";

    function runOnce() {
        for (var key in keysPressedDictionary) {
            // reset each key to a value of not selected - false
            keysPressedDictionary[key] = false;
        }
        
        // reset items
        codedPhrase="";
        remainingGuesses = 6;
        currentPhraseVisibility = [];
        document.querySelector("p.keysGuessed").innerHTML = "";
        document.querySelector("p.phrase").innerHTML = "";

        // let's make a random selection for the next phrase
        randomIndexToPhrase = Math.floor(Math.random() * phraseList.length);
        var currentPhraseAnswer = "";
        oneEntry = phraseList[randomIndexToPhrase];
        currentPhrase = currentPhraseAnswer = oneEntry.phrase;

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
        document.querySelector("p.clue1").innerHTML = oneEntry.clue1;
        document.querySelector("p.clue2").innerHTML = oneEntry.clue2;
        document.querySelector("p.clue3").innerHTML = oneEntry.clue3;

        // from the selection, set the sound bite
        soundBiteFile = oneEntry.soundBiteFile;

        // Set the inner HTML contents of the .phrase p to our html string
        // But, first, replace all answered letters with underscores and populate puncuation
        // One way to replace chars --> currentPhrase = currentPhrase.replace(/[a-zA-Z]/g, '_');
        showThePhrase();
    }    // end runOnce()

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
            remainingGuesses--;
            document.querySelector("a.remainingGuesses").innerHTML = "Remaining guesses: " + remainingGuesses;
        }
        if (remainingGuesses == 0) {
            numLosses++;
            document.querySelector("a.losses").innerHTML = "Losses: " + numLosses;
            alert("sorry, you lost this round!");
            reset();
        }
        if (showThePhrase()) {
            // if showThePhrase returns true it means the phrase has been solved!
            numWins++;
            var audio = new Audio(soundBiteFile);
            audio.play();
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

    document.getElementById("getNextQuote").addEventListener("click", reset);

    function reset() {
        $('#carouselExampleIndicators').carousel(0);   // reset the carousel to default item
        runOnce();
    }
