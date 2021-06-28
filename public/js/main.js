let camera, scene, renderer;
let controls, axesHelper;

function getWorldDims() {
    const world = document.getElementById('world');

    return {
        w: world.clientWidth,
        h: world.clientHeight
    };
}

function addLights() {
    // const ambientColor = 0xFFFFFF;
    const ambientColor = 0x81acf0;
    const ambientLight = new THREE.AmbientLight(ambientColor, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(ambientColor, 1.1);
    pointLight1.position.set(0, 0, 0);
    scene.add(pointLight1);

    // const pointLightHelper = new THREE.PointLightHelper(pointLight1);
    // scene.add(pointLightHelper);
}

async function createRoom() {
    const textureLoader = new THREE.TextureLoader();

    // // Texture
    // const woodTexture = await textureLoader.loadAsync('assets/textures/keith-misner-h0Vxgz5tyXA-unsplash.jpg');
    // woodTexture.wrapS = THREE.RepeatWrapping;
    // woodTexture.wrapT = THREE.RepeatWrapping;
    // const woodMaterial = new THREE.MeshBasicMaterial({
    //     map: woodTexture,
    //     side: THREE.BackSide
    // });

    // Concrete
    const standardMaterial = new THREE.MeshStandardMaterial({
        aoMap: await textureLoader.loadAsync('assets/textures/concrete/007/Concrete_Blocks_007_ambientOcclusion.jpg'),
        map: await textureLoader.loadAsync('assets/textures/concrete/007/Concrete_Blocks_007_basecolor.jpg'),
        // normalMap: await textureLoader.loadAsync('assets/textures/concrete/007/Concrete_Blocks_007_height.png'),
        roughnessMap: await textureLoader.loadAsync('assets/textures/concrete/007/Concrete_Blocks_007_roughness.jpg'),
        metalness: 0.5,
        side: THREE.BackSide,
    });

    // First video
    const video1 = document.getElementById('video1');
    const videoTexture1 = new THREE.VideoTexture(video1);
    videoTexture1.needsUpdate = true;
    const videoMaterial1 = new THREE.MeshBasicMaterial({
        map: videoTexture1,
        side: THREE.BackSide
    });
    videoMaterial1.needsUpdate = true;

    // Second video
    const video2 = document.getElementById('video2');
    const videoTexture2 = new THREE.VideoTexture(video2);
    videoTexture2.needsUpdate = true;
    const videoMaterial2 = new THREE.MeshBasicMaterial({
        map: videoTexture2,
        side: THREE.BackSide
    });
    videoMaterial2.needsUpdate = true;

    const boxGeometry = new THREE.BoxGeometry(16, 9, 16, 1, 1, 1);

    const materials = [
        videoMaterial2,
        standardMaterial,
        standardMaterial,
        standardMaterial,
        standardMaterial,
        videoMaterial1,
    ];

    const room = new THREE.Mesh(boxGeometry, materials);
    scene.add(room);
}

async function init() {
    const world = document.getElementById('world');
    const dims = getWorldDims();
    camera = new THREE.PerspectiveCamera(70, dims.w / dims.h, 0.01, 100);
    camera.position.z = 1;

    scene = new THREE.Scene();
    scene.position.set(0, 0, 0);

    // axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);

    await createRoom();
    addLights();

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

    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', start, false);
    overlay.addEventListener('touchend', start, false);
    overlay.textContent = 'Click anywhere to start!';
}

function start() {
    const videoFiles = [
        {
            id: 'video1',
            unmute: true,
        },
        {
            id: 'video2',
            unmute: false,
        },
    ];

    for (const {id, unmute} of videoFiles) {
        const video = document.getElementById(id);

        if (video.muted && unmute) {
            video.muted = false;
        }

        if (video.paused) {
            video.play()
        }
    }

    // Disable overlay
    const overlay = document.getElementById('overlay');
    overlay.removeEventListener('click', start);
    overlay.removeEventListener('touchend', start);
    overlay.style.display = 'none';
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

(async () => {
    window.onload = async () => {
        await init();
    };
})();

