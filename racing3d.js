/* Original procedural Three.js scene for the Dhaka highway pursuit. */
(() => {
  const THREE = window.THREE;
  if (!THREE) return; // Keep the 2D fallback available when the CDN is offline.
  const host = document.querySelector('.scene-wrap');
  const mobile = window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: mobile ? 'low-power' : 'high-performance' }); }
  catch (_) { return; }
  renderer.domElement.id = 'racing3dCanvas';
  renderer.domElement.style.visibility = 'hidden';
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? .95 : 1.6));
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  host.insertBefore(renderer.domElement, host.firstChild);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#9fc5d7');
  scene.fog = new THREE.Fog('#b8c7c0', 95, 430);
  const camera = new THREE.PerspectiveCamera(67, 1, .1, 650);
  const sky = new THREE.Group(); camera.add(sky);
  function glowTexture(inner,outer){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,2,64,64,62);r.addColorStop(0,inner);r.addColorStop(.2,inner);r.addColorStop(.58,outer);r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
  const sunPos=new THREE.Vector3(-16,43,-145),sunHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(255,231,180,.75)','rgba(255,199,116,.16)'),transparent:true,depthWrite:false}));sunHalo.position.copy(sunPos);sunHalo.scale.set(17,17,1);sky.add(sunHalo);
  const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(2.15,32,24),new THREE.MeshBasicMaterial({color:0xffe7bd}));sunDisc.position.copy(sunPos);sky.add(sunDisc);
  const dayClouds=new THREE.Group(),stormClouds=new THREE.Group();sky.add(dayClouds,stormClouds);
  function makeSoftCloudTexture(){const c=document.createElement('canvas');c.width=512;c.height=192;const g=c.getContext('2d');g.filter='blur(15px)';for(let i=0;i<46;i++){const x=Math.random()*512,y=48+Math.random()*96,r=12+Math.random()*34,a=.035+Math.random()*.075;const grad=g.createRadialGradient(x,y,0,x,y,r);grad.addColorStop(0,`rgba(255,255,255,${a})`);grad.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grad;g.fillRect(x-r,y-r,r*2,r*2)}g.filter='none';return new THREE.CanvasTexture(c)}
  const cloudTex=makeSoftCloudTexture();for(let i=0;i<5;i++){const geo=new THREE.PlaneGeometry(38+(i%2)*12,10+(i%3)*2);const dayMat=new THREE.MeshBasicMaterial({map:cloudTex,color:0xffffff,transparent:true,opacity:.82,depthWrite:false,side:THREE.DoubleSide});const stormMat=new THREE.MeshBasicMaterial({map:cloudTex,color:0x6c7780,transparent:true,opacity:.93,depthWrite:false,side:THREE.DoubleSide});for(const [group,mat] of [[dayClouds,dayMat],[stormClouds,stormMat]]){const cloud=new THREE.Mesh(geo,mat);cloud.position.set((i-2)*23,(group===stormClouds?25:19)+(i%3)*5,-96-(i%4)*14);group.add(cloud)}}
  const moonPos=new THREE.Vector3(24,36,-145),moonHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture('rgba(222,233,255,.55)','rgba(185,207,255,.09)'),transparent:true,depthWrite:false}));moonHalo.position.copy(moonPos);moonHalo.scale.set(18,18,1);sky.add(moonHalo);const moon=new THREE.Mesh(new THREE.SphereGeometry(1.75,32,24),new THREE.MeshStandardMaterial({color:0xcbd5e6,roughness:1,metalness:0}));moon.position.copy(moonPos);sky.add(moon);
  const starCount=320,starPositions=new Float32Array(starCount*3);for(let i=0;i<starCount;i++){starPositions[i*3]=(Math.random()-.5)*210;starPositions[i*3+1]=-4+Math.random()*70;starPositions[i*3+2]=-82-Math.random()*115}const starGeo=new THREE.BufferGeometry();starGeo.setAttribute('position',new THREE.BufferAttribute(starPositions,3));const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xe6eaf0,size:1.05,transparent:true,opacity:.72,sizeAttenuation:false}));sky.add(stars);
  const boltPoints=[new THREE.Vector3(-2,0,0),new THREE.Vector3(-1.2,-4,-.2),new THREE.Vector3(-2.2,-7,-.4),new THREE.Vector3(.4,-11,-.7),new THREE.Vector3(-.4,-15,-1)];const bolt=new THREE.Line(new THREE.BufferGeometry().setFromPoints(boltPoints),new THREE.LineBasicMaterial({color:0xf5fbff,transparent:true,opacity:.78}));bolt.position.set(5,27,-87);sky.add(bolt);bolt.visible=false;const flashLight=new THREE.PointLight(0xc8e1ff,0,180);flashLight.position.set(0,30,-55);sky.add(flashLight);
  const hemi = new THREE.HemisphereLight(0xd8ebff, 0x48503d, 2.0); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe3b4, 3.2); sun.position.set(-45, 65, -30); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -35; sun.shadow.camera.right = 35; sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -25; scene.add(sun);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x65714f, roughness: 1 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 700), groundMat); ground.rotation.x = -Math.PI / 2; ground.position.set(0, -.16, -260); ground.receiveShadow = true; scene.add(ground);

  function asphaltTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    g.fillStyle = '#353a3c'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < (mobile ? 1400 : 2800); i++) { const v = 45 + Math.random() * 55; g.fillStyle = `rgba(${v},${v},${v},${Math.random() * .20})`; const s = Math.random() * 2.4; g.fillRect(Math.random() * 256, Math.random() * 256, s, s); }
    const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2, 16); tex.colorSpace = THREE.SRGBColorSpace; return tex;
  }
  const roadMaterial = new THREE.MeshPhysicalMaterial({ map: asphaltTexture(), roughness: .94, clearcoat: .02 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(13, 650), roadMaterial);
  road.rotation.x = -Math.PI / 2; road.position.set(0, -.02, -275); road.receiveShadow = true; scene.add(road);
  const laneMarks = [];
  const white = new THREE.MeshStandardMaterial({ color: 0xe8e0c7, roughness: .8 });
  for (const x of [-2.16, 2.16]) for (let i = 0; i < (mobile ? 32 : 45); i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(.10, .018, 4.8), white); m.position.set(x, .005, -i * 14); m.userData.markIndex = i; scene.add(m); laneMarks.push(m); }
  for (const x of [-6.42, 6.42]) { const stripe = new THREE.Mesh(new THREE.BoxGeometry(.13, .025, 650), new THREE.MeshStandardMaterial({ color: 0xe8dfc8 })); stripe.position.set(x, .012, -275); scene.add(stripe); }

  const roadRoughness = new THREE.MeshStandardMaterial({ color: 0xb6aa8e, roughness: .92 });
  const barrierMat = new THREE.MeshStandardMaterial({ color: 0x9c9f99, roughness: .82 });
  for (const x of [-7.5, 7.5]) { const b = new THREE.Mesh(new THREE.BoxGeometry(.48, .72, 650), barrierMat); b.position.set(x, .26, -275); b.castShadow = true; b.receiveShadow = true; scene.add(b); }
  const rainCount = mobile ? 150 : 1100, rainPositions = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) { rainPositions[i * 3] = (Math.random() - .5) * 75; rainPositions[i * 3 + 1] = Math.random() * 24; rainPositions[i * 3 + 2] = Math.random() * 105 - 70; }
  const rainGeometry = new THREE.BufferGeometry(); rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rain = new THREE.Points(rainGeometry, new THREE.PointsMaterial({ color: 0xc8dcef, size: .075, transparent: true, opacity: .63, depthWrite: false })); scene.add(rain); rain.visible = false;
  const buildings = [], trees = [];
  const seeded = (n) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  for (let i = 0; i < (mobile ? 42 : 64); i++) {
    const side = i % 2 ? -1 : 1, z = -24 - Math.floor(i / 2) * 18, x = side * (12 + seeded(i + 4) * 25);
    if (i % 3 === 0) {
      const h = 7 + seeded(i + 99) * 22, w = 5 + seeded(i + 22) * 8;
      const building = new THREE.Group(), depth = 8 + seeded(i) * 9;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, depth), new THREE.MeshStandardMaterial({ color: [0xa3947c, 0x9eab9f, 0xb4a58d, 0x7b8b83][i % 4], roughness: .9 }));
      mesh.position.y = h / 2; mesh.castShadow = true; mesh.receiveShadow = true; building.add(mesh); building.position.set(x, 0, z); scene.add(building); buildings.push({ mesh: building, z, x, h, w });
      for (let row = 0; row < Math.min(5, Math.floor(h / 4)); row++) for (let col = 0; col < 2; col++) { const win = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.25), new THREE.MeshStandardMaterial({ color: 0x71817d, emissive: 0x19201d, roughness: .8 })); win.position.set((col ? 1 : -1) * w * .2, 2.6 + row * 3.1, depth / 2 + .015); building.add(win); }
    } else {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18, .3, 3.5, 7), new THREE.MeshStandardMaterial({ color: 0x604b35, roughness: 1 })); trunk.position.set(x, 1.7, z); scene.add(trunk);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(2.1 + seeded(i + 40), 9, 7), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x496849 : 0x64774f, roughness: 1 })); crown.position.set(x, 4.4, z); crown.castShadow = true; scene.add(crown); trees.push({ trunk, crown, z, x });
    }
  }

  const billboards=[];
  function billboardTexture(kind){const c=document.createElement('canvas');c.width=768;c.height=288;const g=c.getContext('2d'),colors=kind==='radio'?['#12283a','#087987']:kind==='sleek'?['#18211f','#766345']:['#006a4e','#014632'];const grad=g.createLinearGradient(0,0,768,288);grad.addColorStop(0,colors[0]);grad.addColorStop(1,colors[1]);g.fillStyle=grad;g.fillRect(0,0,768,288);g.strokeStyle='rgba(245,231,196,.6)';g.lineWidth=5;g.strokeRect(9,9,750,270);g.textAlign='center';g.textBaseline='middle';if(kind==='radio'){g.fillStyle='#f6d990';g.font='800 30px Arial,sans-serif';g.fillText('DHAKA RADIO',384,72);g.fillStyle='#fff8e7';g.font='900 64px Arial,sans-serif';g.fillText('RADIO FOORTI',384,148);g.fillStyle='#f6d990';g.font='700 37px Arial,sans-serif';g.fillText('88.0 FM  ·  TUNE IN',384,228)}else if(kind==='sleek'){g.fillStyle='#e0bd7d';g.font='700 30px Arial,sans-serif';g.fillText('A DHAKA ROAD RUN',384,72);g.fillStyle='#f5f0e5';g.font='900 76px Arial,sans-serif';g.fillText('MADE BY SLEEK',384,158);g.fillStyle='#e0bd7d';g.font='700 27px Arial,sans-serif';g.fillText('300 FEET  ·  DRIVE SAFE',384,229)}else{g.fillStyle='#f8f4df';g.font='700 26px Arial,sans-serif';g.fillText('BANGLADESH',384,42);g.fillStyle='#006a4e';g.fillRect(164,66,440,165);g.fillStyle='#f42a41';g.beginPath();g.arc(384,148,52,0,Math.PI*2);g.fill();g.fillStyle='#f7f0d8';g.font='700 23px Arial,sans-serif';g.fillText('WELCOME TO DHAKA',384,258)}const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex}
  const billboardTypes=['radio','sleek','flag'];for(let i=0;i<billboardTypes.length;i++){const side=i%2===0?-1:1,group=new THREE.Group(),frameMat=new THREE.MeshStandardMaterial({color:0x343a38,metalness:.55,roughness:.48}),panel=new THREE.Mesh(new THREE.BoxGeometry(7.4,2.85,.24),frameMat),art=new THREE.Mesh(new THREE.PlaneGeometry(7.12,2.57),new THREE.MeshBasicMaterial({map:billboardTexture(billboardTypes[i])}));panel.position.y=5.4;art.position.set(0,5.4,.132);group.add(panel,art);for(const x of [-3.05,3.05]){const post=new THREE.Mesh(new THREE.BoxGeometry(.17,5.2,.18),frameMat);post.position.set(x,2.6,0);group.add(post)}const brace=new THREE.Mesh(new THREE.BoxGeometry(6.3,.12,.16),frameMat);brace.position.set(0,3.8,0);group.add(brace);group.position.set(side*12.2,0,-55-i*105);group.rotation.y=-side*.28;scene.add(group);billboards.push({group,z:group.position.z})}

  const carMat = (color, metal = .22) => new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: .34 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x293b42, metalness: .25, roughness: .18, transparent: true, opacity: .86, clearcoat: .9 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x17191a, roughness: .94 });
  const wheelGeo = new THREE.CylinderGeometry(.39, .39, .25, 18); wheelGeo.rotateZ(Math.PI / 2);
  function makeCar(color = 0x168278, type = 'car', police = false) {
    const root = new THREE.Group(), bus = type === 'bus', cng = type === 'cng', bike = type === 'bike';
    const w = bus ? 2.65 : bike ? 1.05 : cng ? 1.55 : 1.9, length = bus ? 7.7 : bike ? 2.1 : cng ? 2.55 : 4.55, height = bus ? 3 : bike ? 1.35 : cng ? 1.9 : 1.55;
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, height * .52, length), carMat(police ? 0xeee7db : color)); body.position.y = height * .46; body.castShadow = true; body.receiveShadow = true; root.add(body);
    if (!bike) { const cabin = new THREE.Mesh(new THREE.BoxGeometry(w * .78, height * .48, length * (bus ? .72 : .48)), bus ? carMat(police ? 0xe6e2d5 : color) : glassMat); cabin.position.set(0, height * .91, -.05); cabin.castShadow = true; root.add(cabin); }
    for (const sx of [-1, 1]) for (const sz of bus ? [-2.75, 0, 2.75] : [-length * .31, length * .31]) { const wheel = new THREE.Mesh(wheelGeo, tireMat); wheel.position.set(sx * w * .51, .40, sz); wheel.castShadow = true; root.add(wheel); }
    const lamp = (x, z, color, emissive) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.34, .16, .08), new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 1.3 })); m.position.set(x, .72, z); root.add(m); };
    for (const x of [-w * .32, w * .32]) { lamp(x, -length / 2 - .045, 0xffe4b5, 0xffb34d); lamp(x, length / 2 + .045, 0xe34234, 0x8b120b); }
    if (police) { const bar = new THREE.Mesh(new THREE.BoxGeometry(1.15, .14, .32), new THREE.MeshStandardMaterial({ color: 0xeff4f3, emissive: 0x277fff, emissiveIntensity: 2.2 })); bar.position.y = height * 1.17; root.add(bar); }
    root.userData.length = length; return root;
  }
  const player = makeCar(0x127d78); player.position.z = 1; scene.add(player);
  const headlights = [];
  for (const x of [-.62, .62]) { const lamp = new THREE.SpotLight(0xffedc7, 0, 115, .40, .55, 1.25); lamp.position.set(x, .78, -2.15); lamp.target.position.set(x * 1.45, -.5, -85); player.add(lamp, lamp.target); headlights.push(lamp); }
  const cop = makeCar(0xe5e4db, 'car', true); scene.add(cop); cop.visible = false;
  const trafficCars = new Map();
  const cabin = new THREE.Group(); camera.add(cabin); scene.add(camera);
  const cockpitHeadlights=[];for(const x of [-.58,.58]){const lamp=new THREE.SpotLight(0xffe7ba,0,170,.48,.72,1.25);lamp.position.set(x,-.18,-1.28);lamp.target.position.set(x*1.6,-1.25,-110);cabin.add(lamp,lamp.target);cockpitHeadlights.push(lamp)}
  const dashMat = new THREE.MeshStandardMaterial({ color: 0x171d1c, roughness: .72 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x414b47, metalness: .35, roughness: .42 });
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x252c29, roughness: .88 });
  const hoodMat = new THREE.MeshStandardMaterial({ color: 0x126c68, metalness: .28, roughness: .38 });
  // These camera-attached layers make the view read as a windshield without covering the road.
  const wind = new THREE.Mesh(new THREE.PlaneGeometry(3.05, 1.72), new THREE.MeshPhysicalMaterial({ color: 0xa9c8ce, transparent: true, opacity: .055, roughness: .08, side: THREE.DoubleSide })); wind.position.set(0, -.02, -1.7); cabin.add(wind);
  const header = new THREE.Mesh(new THREE.BoxGeometry(3.2, .18, .2), leatherMat); header.position.set(0, .86, -1.58); cabin.add(header);
  const lowerFrame = new THREE.Mesh(new THREE.BoxGeometry(3.05, .13, .16), trimMat); lowerFrame.position.set(0, -.83, -1.58); cabin.add(lowerFrame);
  for (const side of [-1, 1]) { const pillar = new THREE.Mesh(new THREE.BoxGeometry(.16, 1.72, .2), leatherMat); pillar.position.set(side * 1.49, .02, -1.56); pillar.rotation.z = -side * .13; cabin.add(pillar); }
  const dashBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, .28, .86), dashMat); dashBase.position.set(0, -.99, -.84); cabin.add(dashBase);
  const dashPad = new THREE.Mesh(new THREE.BoxGeometry(2.72, .11, .73), leatherMat); dashPad.position.set(0, -.79, -.98); cabin.add(dashPad);
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.88, .12, 1.55), hoodMat); hood.position.set(0, -1.06, -2.15); cabin.add(hood);
  const hoodHighlight = new THREE.Mesh(new THREE.BoxGeometry(1.65, .018, 1.15), new THREE.MeshStandardMaterial({ color: 0x368c83, metalness: .38, roughness: .34 })); hoodHighlight.position.set(0, - .986, -2.22); cabin.add(hoodHighlight);
  for (const side of [-1, 1]) {
    const doorRail = new THREE.Mesh(new THREE.BoxGeometry(.48, .16, 1.55), leatherMat); doorRail.position.set(side * 1.26, -.76, -.2); doorRail.rotation.x = -.08; cabin.add(doorRail);
    const vent = new THREE.Mesh(new THREE.BoxGeometry(.42, .09, .035), trimMat); vent.position.set(side * .83, -.76, -1.24); cabin.add(vent);
    for (let n = 0; n < 4; n++) { const slat = new THREE.Mesh(new THREE.BoxGeometry(.32, .012, .018), dashMat); slat.position.set(side * .83, -.745 + n * .018, -1.263); cabin.add(slat); }
  }
  const console = new THREE.Mesh(new THREE.BoxGeometry(.55, .12, .36), dashMat); console.position.set(0, -.91, -.56); cabin.add(console);
  const mirrorStem = new THREE.Mesh(new THREE.BoxGeometry(.035, .19, .04), trimMat); mirrorStem.position.set(0, .68, -1.49); cabin.add(mirrorStem);
  const mirror = new THREE.Mesh(new THREE.BoxGeometry(.62, .14, .12), dashMat); mirror.position.set(0, .57, -1.55); cabin.add(mirror);
  const mirrorCanvas=document.createElement('canvas');mirrorCanvas.width=192;mirrorCanvas.height=96;const mirrorCtx=mirrorCanvas.getContext('2d'),mirrorGrad=mirrorCtx.createLinearGradient(0,0,0,96);mirrorGrad.addColorStop(0,'#71878a');mirrorGrad.addColorStop(.48,'#394c4e');mirrorGrad.addColorStop(.5,'#333c3d');mirrorGrad.addColorStop(1,'#111a1c');mirrorCtx.fillStyle=mirrorGrad;mirrorCtx.fillRect(0,0,192,96);mirrorCtx.fillStyle='#b0b8a1';mirrorCtx.fillRect(0,45,192,3);mirrorCtx.fillStyle='#5e766a';mirrorCtx.beginPath();mirrorCtx.moveTo(0,96);mirrorCtx.lineTo(69,55);mirrorCtx.lineTo(122,55);mirrorCtx.lineTo(192,96);mirrorCtx.fill();mirrorCtx.fillStyle='#a9b2a6';mirrorCtx.fillRect(26,37,18,13);mirrorCtx.fillRect(141,34,24,16);const mirrorTexture=new THREE.CanvasTexture(mirrorCanvas);mirrorTexture.colorSpace=THREE.SRGBColorSpace;const mirrorGlassMat=new THREE.MeshBasicMaterial({map:mirrorTexture});
  for(const side of [-1,1]){const stem=new THREE.Mesh(new THREE.BoxGeometry(.16,.09,.48),trimMat);stem.position.set(side*1.48,-.08,-1.5);stem.rotation.y=-side*.38;cabin.add(stem);const housing=new THREE.Mesh(new THREE.BoxGeometry(.47,.27,.13),dashMat);housing.position.set(side*1.62,-.06,-1.76);housing.rotation.y=-side*.58;cabin.add(housing);const glass=new THREE.Mesh(new THREE.PlaneGeometry(.39,.19),mirrorGlassMat);glass.position.set(side*1.62,-.055,-1.835);glass.rotation.y=-side*.58;cabin.add(glass)}

  const tmp = new THREE.Vector3(), cameraAim = new THREE.Vector3(), desiredCamera = new THREE.Vector3(); let smoothX = 0, smoothSteer = 0, previousWorld = 0, rainStep = 0;
  function resize() { const r = host.getBoundingClientRect(); if (!r.width || !r.height) return; renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
  window.addEventListener('resize', resize); window.addEventListener('orientationchange', () => setTimeout(resize, 180)); window.visualViewport?.addEventListener('resize', resize); resize();
  function render(state) {
    const laneX = (state.playerLane - 1) * 4.2; smoothX += (laneX - smoothX) * .075; smoothSteer += (state.steer - smoothSteer) * .06;
    const travel = state.world * .065, offset = travel % 14, sceneryTravel = travel % 560;
    for (const m of laneMarks) m.position.z = -m.userData.markIndex * 14 + offset - 5;
    roadMaterial.roughness = state.rainMode ? .24 : .94; roadMaterial.clearcoat = state.rainMode ? .62 : .02; roadMaterial.color.set(state.rainMode ? '#c6d0d3' : '#ffffff');
    roadMaterial.map.offset.y = (travel / 650 * 16) % 1;
    rain.visible = state.rainMode;
    if (state.rainMode) { const p = rainGeometry.attributes.position.array; rainStep += .55; for (let i = 0; i < rainCount; i++) { const k = i * 3 + 1; p[k] -= .42; if (p[k] < 0) p[k] = 22 + (i % 12) * .18; } rainGeometry.attributes.position.needsUpdate = true; rain.position.set(smoothX, 0, 3); }
    for (const o of buildings) { let z = ((o.z + sceneryTravel + 560) % 560); if (z > 80) z -= 560; o.mesh.position.z = z; }
    for (const o of trees) { let z = ((o.z + sceneryTravel + 560) % 560); if (z > 80) z -= 560; o.trunk.position.z = z; o.crown.position.z = z; }
    for(const b of billboards){let z=(b.z+sceneryTravel+560)%560;if(z>80)z-=560;b.group.position.z=z;}
    player.position.x = smoothX; player.rotation.y += (-smoothSteer * .045 - player.rotation.y) * .08; player.visible = !state.cockpitView;
    const visibleIds = new Set();
    for (const v of state.traffic) {
      const key = v.id; visibleIds.add(key); let model = trafficCars.get(key);
      if (!model) { model = makeCar(v.color, v.type); trafficCars.set(key, model); scene.add(model); }
      model.position.set((v.lane - 1) * 4.2, 0, -Math.max(-12, (1 - v.z) * 245)); model.visible = v.z > -.1 && v.z < 1.15;
    }
    for (const [id, model] of trafficCars) if (!visibleIds.has(id)) { scene.remove(model); trafficCars.delete(id); }
    cop.visible = state.policePresent; cop.position.set(smoothX, 0, Math.max(5, Math.min(45, state.policeGap * .22 + 5)));
    dayClouds.visible=!state.nightMode&&!state.rainMode;stormClouds.visible=!!state.rainMode;sunDisc.visible=!state.nightMode&&!state.rainMode;sunHalo.visible=sunDisc.visible;moon.visible=!!state.nightMode;moonHalo.visible=!!state.nightMode;stars.visible=!!state.nightMode;dayClouds.position.x=Math.sin(state.world*.0007)*1.4;stormClouds.position.x=Math.sin(state.world*.0005)*.8;bolt.visible=!!state.rainMode&&!!state.lightningFlash;flashLight.intensity=bolt.visible?210:0;
    sun.intensity = state.nightMode ? .18 : state.rainMode ? 2.25 : 3.2; hemi.intensity = state.nightMode ? .48 : state.rainMode ? 1.35 : 2; scene.background.set(state.nightMode ? '#101b35' : state.rainMode ? '#657989' : '#9fc5d7'); scene.fog.color.set(state.nightMode ? '#263748' : state.rainMode ? '#85949b' : '#b8c7c0'); scene.fog.near = state.rainMode ? 45 : 95; scene.fog.far = state.rainMode ? 220 : 430;
    if (state.nightMode) { sun.color.set('#a5bce0'); sun.position.set(-25, 28, -20); } else { sun.color.set(state.rainMode ? '#c4cfdb' : '#ffe3b4'); sun.position.set(-45, 65, -30); }
    for (const lamp of headlights) lamp.intensity = state.nightMode && state.headlightsOn ? 920 : 0;
    for(const lamp of cockpitHeadlights)lamp.intensity=state.cockpitView&&state.nightMode&&state.headlightsOn?1500:0;
    camera.fov = state.cockpitView ? 74 : 67; camera.updateProjectionMatrix();
    if (state.cockpitView) { desiredCamera.set(smoothX, 1.78, .42); tmp.set(smoothX + smoothSteer * .12, 1.5, -72); }
    else { desiredCamera.set(smoothX, 4.05, 10.6); tmp.set(smoothX, .85, -24); }
    camera.position.lerp(desiredCamera, .12); cameraAim.lerp(tmp, .12); camera.lookAt(cameraAim);
    cabin.visible = state.cockpitView;
    renderer.domElement.style.visibility = 'visible'; document.getElementById('game').style.visibility = 'hidden';
    renderer.render(scene, camera);
  }
  window.racing3D = { render };
})();
