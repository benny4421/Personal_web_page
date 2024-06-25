const sound = {
    65: "http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
    87: "http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
    83: "http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
    69: "http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
    68: "http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
    70: "http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
    84: "http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
    71: "http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
    89: "http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
    72: "http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
    85: "http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
    74: "http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
    75: "http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
    79: "http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
    76: "http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
    80: "http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
    186: "http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"
};

const playSound = (url) => {
    const audio = new Audio(url);
    audio.play();
};

const pianoKeys = document.querySelectorAll(".piano-keys .key");
const volumeSlider = document.querySelector(".volume-slider input");
const keysCheckbox = document.querySelector(".keys-checkbox input");

const sequence = "weseeyou";
let sequenceIndex = 0;

let allKeys = [];
let audio = new Audio(); 

audio.src = sound[65]; 

const playTune = (key) => {
    const keycode = key.toUpperCase().charCodeAt(0);

    // Log the keycode and the pressed key
    console.log(keycode);
    console.log(key);

    const audioUrl = sound[keycode];
    if (audioUrl) {
        playSound(audioUrl);
    }
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    clickedKey.classList.add("active");
    setTimeout(() => {
        clickedKey.classList.remove("active");
    }, 30);

    if (key === sequence[sequenceIndex]) {
        console.log("***",sequenceIndex);
        sequenceIndex++;
        if (sequenceIndex === sequence.length) {
            // Play creepy audio
            const audio = document.getElementById("creepy-audio");
            audio.play();

             // Fade out piano
             const piano = document.querySelector(".piano-keys");
             piano.style.transition = "opacity 2s ease-out"; // Apply transition
             piano.style.opacity = 0;
 
             // Disable further key presses
             pianoKeys.forEach(key => {
                 key.removeEventListener("click", () => playTune(key.dataset.key));
             });
             document.removeEventListener("keydown", pressedKey);

            // Display the image of the great old one
            const greatOldOne = document.querySelector(".great-old-one");
            greatOldOne.style.opacity = 1; // Fade in the element
            greatOldOne.style.zIndex = 0; // Adjust z-index to bring it to the front

            // Select the h2 element with the class "great-old-one-title"
            const greatOldOneTitle = document.querySelector(".great-old-one-title");

            // Update the text content of the h2 element
            greatOldOneTitle.style.zIndex = 10; 
            greatOldOneTitle.style.opacity = 1; // Fade in the element

            greatOldOneTitle.textContent = "I have Awoken";

        }
    } else {
        // Reset sequence index if a wrong key is pressed
        sequenceIndex = 0;
    }

}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
    audio.volume = e.target.value;
}

const showHideKeys = () => {
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

const pressedKey = (e) => {
    if (allKeys.includes(e.key)) playTune(e.key);
}

// Event listeners for checkboxes and sliders
keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);

// Event listener for keydown event
document.addEventListener("keydown", pressedKey);
