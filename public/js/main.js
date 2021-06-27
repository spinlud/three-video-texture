let camera, scene, renderer;
let controls, axesHelper;

function getWorldDims() {
    const world = document.getElementById('world');

    return {
        w: world.clientWidth,
        h: world.clientHeight
    };
}

function createRoom() {
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load('assets/textures/keith-misner-h0Vxgz5tyXA-unsplash.jpg');
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    const woodMaterial = new THREE.MeshBasicMaterial({
        map: woodTexture,
        side: THREE.BackSide
    });

    const video = document.getElementById('myVideo');
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.needsUpdate = true;
    const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.BackSide
    });
    videoMaterial.needsUpdate = true;

    const boxGeometry = new THREE.BoxGeometry(16, 9, 16, 1, 1, 1);

    const materials = [
        woodMaterial,
        woodMaterial,
        woodMaterial,
        woodMaterial,
        woodMaterial,
        videoMaterial,
    ];

    const room = new THREE.Mesh(boxGeometry, materials);
    scene.add(room);
}

function init() {
    const world = document.getElementById('world');
    const dims = getWorldDims();
    camera = new THREE.PerspectiveCamera(70, dims.w / dims.h, 0.01, 100);
    camera.position.z = 1;

    scene = new THREE.Scene();
    scene.position.set(0, 0, 0);

    axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    createRoom();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    world.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.1;
    controls.maxDistance = 20;
    camera.position.set(0, 0, 10);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', start, false);
}

function start() {
    // Unmute and start video
    const video = document.getElementById('myVideo');
    if (video.muted) {
        video.muted = false;
    }

    if (video.paused) {
        video.play()
    }

    // Remove overlay
    document.getElementById('overlay').style.display = 'none';
}

function onWindowResize() {
    const dims = getWorldDims();
    camera.aspect = dims.w / dims.h;
    camera.updateProjectionMatrix();
    renderer.setSize(dims.w, dims.h);
}

function animation(time) {
    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;
