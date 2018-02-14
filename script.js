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
      note_val_1 = (midi_note-47)/12;
      note_val_2 = 0;
      note_val_3 = 0;
    }else if(midi_note <= 71){
      note_val_1 = 0;
      note_val_2 = (midi_note-59)/12;
      note_val_3 = 0;
    }else{
      note_val_1 = 0;
      note_val_2 = 0;
      note_val_3 = (midi_note-71)/12;
    }
  }
}

function onMIDIEvent(e){
  if(e.data[0] != 248){ //248 is clock message
    console.log(e.data);
    // if(e.data[0] == 144){
      make_note_val(e.data);


      console.log("val1 = " + note_val_1);
      console.log("val2 = " + note_val_2);
      console.log("val3 = " + note_val_3);
      if(e.data[2] == 0){
        synth.triggerRelease();
      }else{
        synth.triggerAttack(tone_num[e.data[1]]);
      }
    // }
  }
}

var synth = new Tone.Synth({
  "oscillator" : {
    "type" : "square"
  },"envelope" : {
    "attack" : 0.01,
    "decay" : 0.2,
    "sustain" : 0.1,
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
  renderer.setClearColor(0x000000, 1.0); 

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

// CUBE=================================================================
  var baseMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
  var baseGeometry = new THREE.BoxGeometry(3,3,3);
  var baseObject = new THREE.Mesh( baseGeometry, baseMaterial);


  // baseObject.position.set(0,-3,0);
  group.add(baseObject);




// Ring ==========================================
  var ringGeometry;
  var ringMaterial;
  var ringCount;
  var ring = [];
  updateRing();

  function updateRing(){
    ringGeometry = new THREE.TorusBufferGeometry( 10, 1, 4, 8 );
    ringMaterial = new THREE.MeshPhongMaterial( {color: "#00aaff", flatShading:true});
    ringMaterial.needsUpdate = true;
    for(var i = 0; i < ringCount; i++) {
      scene.remove(ring[i]);
    }
    ringCount = 10;　// particleの数を更新
    for(var i = 0; i < ringCount; i++) {
      ring[i] = new THREE.Mesh( ringGeometry, ringMaterial );
      ring[i].rotation.z = 0.1 * Math.PI;
      ring[i].position.z = i * 10 - 50;
      scene.add(ring[i]);
    }
  }



//  ROOM================================================================================
  var roomMaterial = new THREE.MeshBasicMaterial({color: 0xffffff,
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
  var flowerNum = 500;
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
    size: 0.4,
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

  var noteVal1 = 0;
  var noteVal2 = 0;
  var noteVal3 = 0;

// ============================================================================
// noteCTRL ===================================================================
// ============================================================================

  function noteCtrl(){
    
    noteVal1 = note_val_1;
    noteVal2 = note_val_2;
    noteVal3 = note_val_3;


    flowerMaterial.size = noteVal1 *5;

    roomObject.scale.set(0.001+ noteVal2,0.001+ noteVal2,0.001+ noteVal2);
    roomObject.rotation.set(noteVal2,noteVal2,noteVal2 *2);


    baseObject.scale.set(1,1,1+noteVal3*20);
    baseObject.rotation.set(noteVal3,0,noteVal3 *2);


    for(var i = 0; i < ringCount; i++) {
      ring[i].position.z = i * 10 * noteVal1 - 5 * 10 * noteVal1;

    }
    
  }



scene.add(group);
// RENDER ==========================================================================
  // ここが何回も実行される
  function update (){
    frame++;
    flowerAnim();
    roomAnim();
    noteCtrl();
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