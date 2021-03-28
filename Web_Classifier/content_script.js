const classifier = ml5.imageClassifier("MobileNet", modelReady);
let imgDom = document.createElement("img");

var myDiv;

imgDom.id = "screenshot";
document.body.appendChild(imgDom);

function setup() {
  noCanvas();
  noLoop();
  myDiv = createDiv("I like pandas.");
  myDiv.style("position", "fixed");
  myDiv.style("top", "0px");
  myDiv.style("left", "0px");
  myDiv.style("z-index", "-100");
  myDiv.style("font-size", "25px");
}

function refreshScreenshot() {
  imgDom.style.opacity = "0";
  console.log("Refreshing Screenshot");
  html2canvas(document.body, { type: "view" }).then(function (canvas) {
    imgDom.src = canvas.toDataURL();
    console.log("Start Detecting");
    detect();
  });
}

function detect() {
  classifier.predict(select("#screenshot"), function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log(results);
    let str = "";
    results.forEach((e) => {
      str += e.className + "\t" + e.probability + "<br>";
    });
    myDiv.html(str);
    setInterval(refreshScreenshot(), 5000);
  });
}

function modelReady() {
  console.log("Model Ready");
  refreshScreenshot();
}

//ml5 library scripts
