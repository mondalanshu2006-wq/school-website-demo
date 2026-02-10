// --- 1. LOADER LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const counter = document.querySelector(".counter");
    const loader = document.querySelector(".loader");
    let count = 0;

    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1;
        if (count > 100) count = 100;
        counter.innerText = count + "%";

        if (count === 100) {
            clearInterval(interval);
            gsap.to(loader, { y: "-100%", duration: 1, ease: "power4.inOut" });
            initApp();
        }
    }, 30);
});

function initApp() {
    // --- 2. THREE.JS PARTICLE WAVE (The "Never Still" Background) ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Alpha true for transparency

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("canvas-container").appendChild(renderer.domElement);

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // Adjust for performance
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Spread particles
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00f2ea, // Cyan Color
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        const elapsedTime = clock.getElapsedTime();

        // Rotate entire system slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.5; // React to mouse Y
        particlesMesh.rotation.y += mouseX * 0.5; // React to mouse X

        // Wavy motion for individual particles
        // Note: For high performance, we rotate the mesh, not individual vertices in JS loop
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- 3. GSAP SCROLL ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".hero h1", {
        y: 100, opacity: 0, duration: 1.5, ease: "power4.out", delay: 0.5
    });

    gsap.from(".bento-box", {
        scrollTrigger: {
            trigger: ".bento-grid",
            start: "top 80%"
        },
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
    });

    // --- 4. 3D TILT EFFECT (Vanilla JS) ---
    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // --- 5. LENIS SMOOTH SCROLL ---
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}