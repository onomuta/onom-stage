navigator.requestMIDIAccess().then(onMIDISuccess,onMIDIFailure);
var midi = null;
var inputs = [];
var outputs = [];
var output = null;
var chs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var ch = 1;

function onMIDISuccess(m){
  midi = m;
  var it = midi.inputs.values();
  for(var o = it.next(); !o.done; o = it.next()){
    inputs.push(o.value);
  }
  var ot = midi.outputs.values();
  for(var o = ot.next(); !o.done; o = ot.next()){
    outputs.push(o.value);
  }
  
  output = outputs[0];
  outputs.forEach(function(element, index) {
    var option = document.createElement('option');
    option.appendChild(document.createTextNode(element.name));
    option.setAttribute('value', index);
    document.getElementById('select-midi-output-device').appendChild(option);
  });
  document.getElementById('select-midi-output-device').onchange = function() {
    output = outputs[this.value];
  };
  
  for(var cnt=0;cnt < inputs.length;cnt++){
    inputs[cnt].onmidimessage = onMIDIEvent;
  }
}

chs.forEach(function(value, index) {
  var option = document.createElement('option');
  option.appendChild(document.createTextNode(value));
  option.setAttribute('value', index);
  document.getElementById('select-midi-output-ch').appendChild(option);
});
document.getElementById('select-midi-output-ch').onchange = function() {
  ch = chs[this.value];
};



var tone_num = {
  48 : "C2",
  49 : "C#2",
  50 : "D2",
  51 : "D#2",
  52 : "E2",
  53 : "F2",
  54 : "F#2",
  55 : "G2",
  56 : "G#2",
  57 : "A2",
  58 : "A#2",
  59 : "B2",

  60 : "C3",
  61 : "C#3",
  62 : "D3",
  63 : "D#3",
  64 : "E3",
  65 : "F3",
  66 : "F#3",
  67 : "G3",
  68 : "G#3",
  69 : "A3",
  70 : "A#3",
  71 : "B3",

  72 : "C4",
  73 : "C#4",
  74 : "D4",
  75 : "D#4",
  76 : "E4",
  77 : "F4",
  78 : "F#4",
  79 : "G4",
  80 : "G#4",
  81 : "A4",
  82 : "A#4",
  83 : "B4",
  84 : "C5",

}

var midi_note;
var note_val_1 = 0;
var note_val_2 = 0;
var note_val_3 = 0;

function make_note_val(data){
  midi_note = data[1];
  if(data[2]==0){
    note_val_1 = 0;
    note_val_2 = 0;
    note_val_3 = 0;
  }else{
    if(midi_note <= 59){
      note_val_1 = (midi_note-48)/11;
      note_val_2 = 0;
      note_val_3 = 0;
    }else if(midi_note <= 71){
      note_val_1 = 0;
      note_val_2 = (midi_note-60)/11;
      note_val_3 = 0;
    }else{
      note_val_1 = 0;
      note_val_2 = 0;
      note_val_3 = (midi_note-72)/11;
    }
  }
}

function onMIDIEvent(e){
  if(e.data[0] != 248){ //248 is clock message
    console.log(e.data);
    if(e.data[0] == 144){
      make_note_val(e.data);


      console.log("val1 = " + note_val_1);
      console.log("val2 = " + note_val_2);
      console.log("val3 = " + note_val_3);
      if(e.data[2] == 0){
        synth.triggerRelease();
      }else{
        synth.triggerAttack(tone_num[e.data[1]]);
      }
    }
  }
}

var synth = new Tone.Synth({
  "oscillator" : {
    "type" : "square"
  },"envelope" : {
    "attack" : 0.01,
    "decay" : 0.2,
    "sustain" : 0.,
    "release" : 0.05,
  }
}).toMaster()

//play a middle 'C' for the duration of an 8th note
function onMIDIFailure(){
  console.log("munen!");
};






var frame = 0; //更新用
// Renderer =========================================================
  var renderer = new THREE.WebGLRenderer({
    canvas:document.getElementById('myCanvas'),
    antialias: true
  });
  renderer.setClearColor(0xff0000, 1.0); 

  renderer.setSize(window.innerWidth, window.innerHeight);
// Scene ============================================================
  var scene = new THREE.Scene();
  var group = new THREE.Group();

// Camera ============================================================
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight);
      camera.position.set(0, 10, 30);  //カメラを少し後ずさらせます
  var controls = new THREE.OrbitControls(camera);
      controls.autoRotate = true;
      controls.enableDamping = true;

      // to disable zoom
      controls.enableZoom = false;
// LIGHT ============================================================================
  var topLight = new THREE.DirectionalLight(0xffffff);
  scene.add( topLight );
  // 部屋全体を照らすライト
  var ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambient);
//  MIKAN================================================================================
  var HetaMaterial = new THREE.MeshPhongMaterial({color: 0x337700});
  var HetaGeometry = new THREE.SphereGeometry(1,8,4);
  var HetaObject = new THREE.Mesh( HetaGeometry, HetaMaterial);
  HetaObject.scale.set(0.3,0.1,0.3);
  HetaObject.position.set(0,14.2,0);
  group.add(HetaObject); 

  var mikanMaterial = new THREE.MeshPhongMaterial({color: 0xff7700});
  var mikanGeometry = new THREE.SphereGeometry(4,32,16);
  var mikanObject = new THREE.Mesh( mikanGeometry, mikanMaterial);
  mikanObject.scale.set(1,0.8,1);
  mikanObject.position.set(0,11,0);
  group.add(mikanObject); 

//  MOCHI================================================================================
  var mochi1Material = new THREE.MeshPhongMaterial({color: 0xffffff});
  var mochi1Geometry = new THREE.SphereGeometry(4,32,16);
  var mochi1Object = new THREE.Mesh( mochi1Geometry, mochi1Material);
  mochi1Object.scale.set(2,0.8,2);
  mochi1Object.position.set(0,5,0);
  group.add(mochi1Object);

  var mochi2Material = new THREE.MeshPhongMaterial({color: 0xffffff});
  var mochi2Geometry = new THREE.SphereGeometry(4,32,16);
  var mochi2Object = new THREE.Mesh( mochi2Geometry, mochi2Material);
  mochi2Object.scale.set(2.5,0.8,2.5);
  mochi2Object.position.set(0,0,0);
  group.add(mochi2Object); 

//  BASE================================================================================
  var base1Material = new THREE.MeshPhongMaterial({color: 0xbb8833});
  var base1Geometry = new THREE.BoxGeometry(20,3,20);
  var base1Object = new THREE.Mesh( base1Geometry, base1Material);
  base1Object.position.set(0,-3,0);
  group.add(base1Object);

  var base1Material = new THREE.MeshPhongMaterial({color: 0xbb8833});
  var base1Geometry = new THREE.BoxGeometry(15,10,15);
  var base1Object = new THREE.Mesh( base1Geometry, base1Material);
  base1Object.position.set(0,-9,0);
  group.add(base1Object);


//  BASE================================================================================
  var base1Material = new THREE.MeshPhongMaterial({color: 0xbb8833});
  var base1Geometry = new THREE.BoxGeometry(20,3,20);
  var base1Object = new THREE.Mesh( base1Geometry, base1Material);
  base1Object.position.set(0,-3,0);
  group.add(base1Object);


  var roomMaterial = new THREE.MeshBasicMaterial({color: 0xffff00,
      map: new THREE.TextureLoader().load( "https://png.icons8.com/happy/ios7/512/ffffff" ),
      transparent: true,
      side: THREE.DoubleSide
  });
  var roomGeometry = new THREE.BoxGeometry(300, 300,300);
  var roomObject = new THREE.Mesh(roomGeometry,roomMaterial);
  roomObject.position.set(0,0,0);
  group.add(roomObject);


  function roomAnim(){
    roomObject.rotation.x += 0.01;
    roomObject.rotation.y += 0.022;
    roomObject.rotation.z += 0.031;
  }




  



// flower ============================================================================
  // flower
  var flowerGeometry = new THREE.Geometry();
  var flowerNum = 50;
  var flowerS = [];
  // setup
  for (let i = 0; i < flowerNum; i++) {
    var flower = new THREE.Vector3();
    flower.x = THREE.Math.randFloatSpread( 60 );
    flower.y = THREE.Math.randFloatSpread( 60 );
    flower.z = THREE.Math.randFloatSpread( 60 );
    flowerS[i] = Math.random() /10 + 0.01;
    flowerGeometry.vertices.push( flower );
  }

  var flowerMaterial = new THREE.PointsMaterial({
    // color : 0xff3333,
    // map: new THREE.TextureLoader().load( "https://png.icons8.com/spa-flower-filled/ios7/64/ffffff"),
    // size: 10,
    // transparent: true,
    // depthTest : false,
    // blending : THREE.AdditiveBlending
  });
  var flowerPoints = new THREE.Points(flowerGeometry, flowerMaterial);
  scene.add(flowerPoints);

  // animation
  function flowerAnim() {
    for (let i = 0; i < flowerNum; i++) {
      var flower = new THREE.Vector3();
      flower.y = flowerGeometry.vertices[ i ].y - flowerS[i];
      if(flowerGeometry.vertices[ i ].y < -30){
        flowerGeometry.vertices[ i ].y = 30;
        flowerS[i] = Math.random() / 10 + 0.01;
      }else{
        flowerGeometry.vertices[ i ].y = flower.y;
      }
    }
    flowerGeometry.verticesNeedUpdate = true;
  };

function groupAnim(){
  var size1 = 0.2;
  var size2 = 0.2;
  var size3 = 0.2;
  size1 = note_val_1 + 0.2;
  size2 = note_val_2 + 0.2;
  size3 = note_val_3 + 0.2;

  group.scale.set(size1, size2, size3);




  // var rot2 = 0;
  // rot2 = note_val_3 * Math.PI + Math.PI;
  // group.rotation.set(0, 0, rot2);
}



scene.add(group);
// RENDER ==========================================================================
  // ここが何回も実行される
  function update (){
    frame++;
    flowerAnim();
    roomAnim();
    groupAnim();
    controls.update();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
  }
  update();

// リサイズ処理 ==========================================================
window.addEventListener('resize', function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}, false )