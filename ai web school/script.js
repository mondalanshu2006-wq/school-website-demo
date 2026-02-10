// --- 1. SETUP SCENE ---
const scene = new THREE.Scene();
// Deep blue fog to match background
scene.fog = new THREE.FogExp2(0x020b1c, 0.03);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- 2. CREATE THE "ACADEMIC GYROSCOPE" ---
const gyroGroup = new THREE.Group();

// Materials
const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb700,
    metalness: 0.8,
    roughness: 0.2,
});

const steelMaterial = new THREE.MeshStandardMaterial({
    color: 0x445566,
    metalness: 0.9,
    roughness: 0.1,
});

const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});

// Rings
const r1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.05, 16, 100), goldMaterial);
const r2 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.05, 16, 100), steelMaterial);
const r3 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.05, 16, 100), goldMaterial);

gyroGroup.add(r1);
gyroGroup.add(r2);
gyroGroup.add(r3);

// Core
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), glowMaterial);
gyroGroup.add(core);

// Particles
const pGeo = new THREE.BufferGeometry();
const pCount = 300;
const pArray = new Float32Array(pCount * 3);
for(let i=0; i<pCount*3; i++) pArray[i] = (Math.random() - 0.5) * 8;
pGeo.setAttribute('position', new THREE.BufferAttribute(pArray, 3));
const pMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffb700 });
const particles = new THREE.Points(pGeo, pMat);
gyroGroup.add(particles);

scene.add(gyroGroup);

// --- 3. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const blueLight = new THREE.PointLight(0x00d2ff, 2, 50);
blueLight.position.set(-10, 5, 5);
scene.add(blueLight);

const goldLight = new THREE.PointLight(0xffb700, 2, 50);
goldLight.position.set(10, -5, 5);
scene.add(goldLight);

// --- 4. ANIMATION LOGIC ---
let scrollY = 0;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('scroll', () => { scrollY = window.scrollY; });
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Rotate Object
    r1.rotation.x = time * 0.3;
    r1.rotation.y = time * 0.1;
    r2.rotation.y = time * 0.4;
    r3.rotation.z = time * 0.5;
    
    core.rotation.y -= 0.01;
    particles.rotation.y = time * 0.05;

    // SCROLL INTERACTION (Orbital Camera)
    // 1. Calculate Scroll %
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / maxScroll;

    // 2. Move Camera in a circle around the object
    const angle = scrollPercent * Math.PI * 0.5; // Rotate 90 degrees max
    const radius = 8;
    
    // We keep x positive so object stays on right/center, text on left
    camera.position.x = Math.sin(0.5 + angle) * radius; 
    camera.position.z = Math.cos(0.5 + angle) * radius;
    camera.position.y = scrollPercent * -2; // Move down slightly
    
    camera.lookAt(0, 0, 0);

    // Mouse Parallax
    gyroGroup.rotation.x += mouseY * 0.01;
    gyroGroup.rotation.y += mouseX * 0.01;

    renderer.render(scene, camera);
}

animate();

// --- 5. RESIZE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});