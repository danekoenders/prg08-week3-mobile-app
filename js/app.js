const featureExtractor = ml5.featureExtractor('MobileNet', { numLabels: 3 }, modelLoaded);

const startBtn = document.getElementById("startBtn")
const objective = document.getElementById("objective");
const photoTaken = document.getElementById("photoTaken");
const result = document.getElementById("result");
const resultText = document.getElementById("result-text");
const pointsSpan = document.getElementById("points");

let points = 0

if (localStorage.getItem('points') === null) {
    localStorage.setItem('points', 0);
} else {
    points = localStorage.getItem('points');
}

pointsSpan.innerText = "Points: " + points

let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        console.log('still speaking...');
        return;
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    }
}

function modelLoaded() {
    console.log('Model Loaded!');
    classifier = featureExtractor.classification(photoTaken);
    featureExtractor.load("./model/model.json");
}

function startGame() {
    startBtn.remove();
    objective.innerText = "Take a picture of a Ferrari 812 GTS.";
    speak("Take a picture of a Ferrari 812 GTS.")
}

function imageUploaded(event) {
    let uploadedImage = document.getElementById("output");
	uploadedImage.src = URL.createObjectURL(event.target.files[0]);

    let uploadedImageHidden = document.getElementById("output-hidden");
	uploadedImageHidden.src = URL.createObjectURL(event.target.files[0]);
    
    classifier.classify(uploadedImageHidden, (err, result) => {
        if (result) {
            if (result[0]['label'] === "Ferrari 812 GTS") {
                speak("You've taken a photo of a Ferrari 812 GTS, congrats!")
                resultText.innerText = "You've taken a photo of a Ferrari 812 GTS, congrats!"

                points++
                localStorage.setItem('points', points);

                pointsSpan.innerText = "Points: " + points
            } else {
                speak("You've taken a photo of a " + result[0]['label'] + ", try again!")
                resultText.innerText = "You've taken a photo of a " + result[0]['label'] + ", try again!"
            }
        }
    });
}
