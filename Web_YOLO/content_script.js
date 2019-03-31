let yolo;
let objects = [];
let cnv;
let imgDom =  document.createElement("img"); 
imgDom.id = "screenshot";
document.body.appendChild(imgDom);

function setup(){
    yolo = ml5.YOLO(modelReady);
    cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    cnv.style('position', 'fixed');
    cnv.style('top', '0px');
    cnv.style('left', '0px');
    cnv.style('z-index', '100');
    cnv.attribute("data-html2canvas-ignore","true");
    select('#screenshot').attribute("data-html2canvas-ignore","true");
    pixelDensity(1);
    
}

function draw(){
	for (let i = 0; i < objects.length; i++) {
		noStroke();
		fill(0, 255, 0);
		text(objects[i].className, objects[i].x * width, objects[i].y * height - 5);
		noFill();
		strokeWeight(4);
		stroke(0, 255, 0);
		rect(objects[i].x * width, objects[i].y * height, objects[i].w * width, objects[i].h * height);
	}
}

function refreshScreenshot() {
    imgDom.style.opacity = "0";
    console.log("Refreshing Screenshot");
	html2canvas(document.body,{type:'view'}).then(function (canvas) {
        
        // var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        // var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // var offset = $(window).scrollTop();

        // var cropX=0;
        // var cropY=offset;
        // var cropWidth=w;
        // var cropHeight=h;

        // var cropped = document.createElement('canvas');
        // cropped.width=cropWidth;
        // cropped.height=cropHeight;
        // var ctxCropped=cropped.getContext('2d');
        // ctxCropped.drawImage(canvas,cropX,cropY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);

        imgDom.src =  canvas.toDataURL('image/jpeg');
        // imgDom.style.width = "640px";
        // imgDom.style.width = "480px";

        
		console.log("Start Detecting");
		detect();
	});
}

function detect() {
	yolo.detect(select('#screenshot'), function(err,results){
        if(err){
            console.log(err);
        }
        console.log(results);
		objects = results;
        setInterval( refreshScreenshot(), 5000);
       
    });

}

function modelReady() {
    console.log("Model Ready");
    refreshScreenshot();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
//ml5 library scripts