if (!Detector.webgl) Detector.addGetWebGLMessage();

var threeCamera, scene, renderer, controls;
var FAR = 3000;

var transferTextureImgDom, oriTextureImgDom;

var objLoader = new THREE.OBJLoader();

const textureSize = "512px";
var canvasContainer, statsContainer;
var styleA, styleB, styleC, styleD, styleE;
var styles = [];
// var styleIndex = Math.floor(Math.random() * 2);

var modelLoadedNum = 0;
const modelNum = 5;

var skyBox;
var stylesSkyboxImgURL = ["assets/mondrian.jpg", "assets/sherman.jpg", "assets/pollock.jpg", "assets/fuchun.jpg"];


var objModel;

var raycaster, mouse = {
  x: 0,
  y: 0
};


var options = {
  TopLight: 0.5,
  RightLight: 0.5,
  LeftLight: 0.5,
  LightMesh: true,
  ShowSkybox: true,
  "Mondrian": function () {
    transfer(0);
  },
  "Sherman": function () {
    transfer(1);
  },
  "Pollock": function () {
    transfer(2);
  },
  "Fuchun": function () {
    transfer(3);
  },
  "CCP Propaganda": function () {
    transfer(4);
  },
  "Mondrian Stack": function () {
    transferStack(0);
  },
  "Sherman Stack": function () {
    transferStack(1);
  },
  "Pollock Stack": function () {
    transferStack(2);
  },
  "Fuchun Stack": function () {
    transferStack(3);
  },
  "CCP Propaganda Stack": function () {
    transferStack(4);
  },
  ResetTexture: function () {
    resetTexture();
  }

};
var light1, light2, light3;




function setup() {
  noCanvas();
  noLoop();

  //Creating Img Element for Style Transfer Image
  transferTextureImgDom = document.createElement("img");
  transferTextureImgDom.style.width = textureSize;
  transferTextureImgDom.style.height = textureSize;
  transferTextureImgDom.style.opacity = "0%";
  document.body.appendChild(transferTextureImgDom);

  //Creating Img Element for Original Texture Image
  oriTextureImgDom = document.createElement("img");
  oriTextureImgDom.style.width = textureSize;
  oriTextureImgDom.style.height = textureSize;
  oriTextureImgDom.style.opacity = "0%";
  document.body.appendChild(oriTextureImgDom);

  transferTextureImgDom.id = "transfer-texture";
  transferTextureImgDom.src = "assets/rabbitDiffuse.jpg";

  oriTextureImgDom.id = "ori-texture";
  oriTextureImgDom.src = "assets/rabbitDiffuse.jpg";



  styleA = ml5.styleTransfer("models/Mondrian", function () {
    console.log("Mondrian Style Model Loaded");
    modelLoadedNum += 1;
  });
  styles.push(styleA);
  styleB = ml5.styleTransfer("models/Sherman", function () {
    console.log("Sherman Style Model Loaded");
    modelLoadedNum += 1;
  });
  styles.push(styleB);

  styleC = ml5.styleTransfer("models/Pollock", function () {
    console.log("Pollock Style Model Loaded");
    modelLoadedNum += 1;
  });
  styles.push(styleC);

  styleD = ml5.styleTransfer("models/Fuchun", function () {
    console.log("Fuchun Style Model Loaded");
    modelLoadedNum += 1;
  });
  styles.push(styleD);

  styleE = ml5.styleTransfer("models/CCP_Propaganda", function () {
    console.log("CCP Propaganda Style Model Loaded");
    modelLoadedNum += 1;
  });
  styles.push(styleE);

  init();
  animate();
}



function init() {
  canvasContainer = document.getElementById('canvasID');
  statsContainer = document.getElementById("statsID");

  //threeCamera
  threeCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, FAR);
  threeCamera.position.set(0, 0, 10);
  threeCamera.lookAt(new THREE.Vector3(0, 0, -10));

  // SCENE
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x040306, 100, FAR);

  // RENDERER

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    // context: document.getElementById("threeCanvas").getContext('webgl')
  });

  renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvasContainer.appendChild(renderer.domElement);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  //RAYCASTER
  raycaster = new THREE.Raycaster();
  renderer.domElement.addEventListener('click', raycast, false);

  // STATS
  stats = new Stats();
  statsContainer.appendChild(stats.dom);


  // CONTROLS
  controls = new THREE.OrbitControls(threeCamera, renderer.domElement);
  // controls.enableZoom = false;
  // controls.enableRotate = false;
  controls.enableDamping = true;


  var skyBoxGeometry = new THREE.CubeGeometry(100, 100, 100);
  var skyBoxMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  skyBoxMaterial.map = new THREE.TextureLoader().load("assets/rabbitDiffuse.jpg");
  skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
  scene.add(skyBox);


  objLoader.load(
    "assets/Rabbit.obj",
    function (object) {
      object.traverse(function (child) { // aka setTexture
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshPhongMaterial();
          child.material.map = new THREE.Texture(transferTextureImgDom);
          child.name = "objModel";
          objModel = child;
          scene.add(objModel);
          objModel.material.map.needsUpdate = true;


          var textureLoader = new THREE.TextureLoader();
          textureLoader.load('assets/rabbitNormal.jpg', (texture) => {
            objModel.material.normalMap = texture;
            objModel.material.normalMap.needsUpdate = true;
            console.log("Normal Map Loaded");
          });
          textureLoader.load('assets/rabbitSpecular.jpg', (texture) => {
            objModel.material.specularMap = texture;
            objModel.material.specularMap.needsUpdate = true;
            console.log("Specular Map Loaded");
          });

        }
      });
    }
  );

  var alight = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(alight);

  var sphere = new THREE.SphereGeometry(0.15, 16, 8);

  light1 = new THREE.PointLight(0xaaaaaa, options.TopLight, 4, 5);
  light1.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: 0xffffff
  })));
  light1.position.set(0, 2, 0);
  scene.add(light1);

  light2 = new THREE.PointLight(0xaaaaaa, options.RightLight, 4, 5);
  light2.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: 0xffffff
  })));
  light2.position.set(1, -0.5, 0);
  scene.add(light2);

  light3 = new THREE.PointLight(0xaaaaaa, options.LeftLight, 4, 5);
  light3.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
    color: 0xffffff
  })));
  light3.position.set(-1, -0.5, 0);
  scene.add(light3);


  //DAT.GUI Stuff
  var gui = new dat.GUI({});
  var sb = gui.addFolder("Skybox");
  sb.add(options, "ShowSkybox");
  sb.open();

  var light = gui.addFolder("Light Control");
  light.add(options, "TopLight", 0, 2);
  light.add(options, "RightLight", 0, 2);
  light.add(options, "LeftLight", 0, 2);
  light.add(options, "LightMesh");
  light.open();

  var styleTransfer = gui.addFolder("Style Transfer");
  styleTransfer.add(options, "Mondrian");
  styleTransfer.add(options, "Sherman");
  styleTransfer.add(options, "Pollock");
  styleTransfer.add(options, "Fuchun");
  // styleTransfer.add(options, "CCP Propaganda");

  styleTransfer.open();

  var styleTransferStack = gui.addFolder("Stack Style Transfer ");
  styleTransferStack.add(options, "Mondrian Stack");
  styleTransferStack.add(options, "Sherman Stack");
  styleTransferStack.add(options, "Pollock Stack");
  styleTransferStack.add(options, "Fuchun Stack");
  // styleTransferStack.add(options, "CCP Propaganda Stack");

  styleTransferStack.open();

  gui.add(options, "ResetTexture");

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  threeCamera.aspect = window.innerWidth / window.innerHeight;
  threeCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

var renderID;

function animate() {
  renderID = requestAnimationFrame(animate);
  animateObjects();
  render();
  stats.update();
}

function animateObjects() {
  light1.intensity = options.TopLight;
  light2.intensity = options.RightLight;
  light3.intensity = options.LeftLight;

  light1.children[0].material.color = new THREE.Color(Math.max(0.5, options.TopLight * 2), Math.max(0.5, options.TopLight * 2), Math.max(0.5, options.TopLight * 2));
  light1.children[0].material.color.needsUpdate = true;
  light1.children[0].visible = options.LightMesh;

  light2.children[0].material.color = new THREE.Color(Math.max(0.5, options.RightLight * 2), Math.max(0.5, options.RightLight * 2), Math.max(0.5, options.RightLight * 2));
  light2.children[0].material.color.needsUpdate = true;
  light2.children[0].visible = options.LightMesh;

  light3.children[0].material.color = new THREE.Color(Math.max(0.5, options.LeftLight * 2), Math.max(0.5, options.LeftLight * 2), Math.max(0.5, options.LeftLight * 2));
  light3.children[0].visible = options.LightMesh;
  light3.children[0].material.color.needsUpdate = true;

  skyBox.visible = options.ShowSkybox;
}

function render() {
  renderer.render(scene, threeCamera);
}

function raycast(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, threeCamera);

  var intersects = raycaster.intersectObjects(scene.children);

  for (var i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name == "objModel") {
      // resetTexture();
    }
  }
}


function transfer(num) {
  if (modelLoadedNum == modelNum && num >= 0 && num < modelNum) {

    skyBox.material.map = new THREE.TextureLoader().load(stylesSkyboxImgURL[num]);
    skyBox.material.map.needsUpdate = true;

    console.log("Transferring\nThe interface will freeze for a few seconds for the process.");
    alert("Transferring\nThe interface will freeze for a few seconds for the process.");


    styles[num].transfer(oriTextureImgDom, function (err, resultImg) {
      transferTextureImgDom.src = resultImg.src;
      console.log("Transferred");
      objModel.material.map.needsUpdate = true;
    });
  }
}

function transferStack(num) {
  if (modelLoadedNum == modelNum && num >= 0 && num < modelNum) {

    skyBox.material.map = new THREE.TextureLoader().load(stylesSkyboxImgURL[num]);
    skyBox.material.map.needsUpdate = true;

    console.log("Transferring\nThe interface will freeze for a few seconds for the process.");
    alert("Transferring\nThe interface will freeze for a few seconds for the process.");


    styles[num].transfer(transferTextureImgDom, function (err, resultImg) {
      transferTextureImgDom.src = resultImg.src;
      console.log("Transferred");
      objModel.material.map.needsUpdate = true;
      // skyBox.material.map = objModel.material.map;
      // skyBox.material.map.needsUpdate = true;

    });
  }
}

function resetTexture() {
  skyBox.material.map = new THREE.TextureLoader().load("assets/rabbitDiffuse.jpg");
  skyBox.material.map.needsUpdate = true;

  transferTextureImgDom.src = oriTextureImgDom.src;
  objModel.material.map.needsUpdate = true;

  console.log("Texture Reset");
}