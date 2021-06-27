let camera, scene, renderer;
let plane, material, texture;
let controls, axesHelper;

function getWorldDims() {
    const world = document.getElementById('world');

    return {
        w: world.clientWidth,
        h: world.clientHeight
    };
}

function init() {
    const world = document.getElementById('world');
    const dims = getWorldDims();
    camera = new THREE.PerspectiveCamera(70, dims.w / dims.h, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();
    scene.position.set(0, 0, 0);

    axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // const textureLoader = new THREE.TextureLoader();
    // texture = textureLoader.load('assets/textures/keith-misner-h0Vxgz5tyXA-unsplash.jpg');
    // console.log(texture);
    // // // assuming you want the texture to repeat in both directions:
    // // texture.wrapS = THREE.RepeatWrapping;
    // // texture.wrapT = THREE.RepeatWrapping;
    // material = new THREE.MeshBasicMaterial({ map : texture });
    // plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    // plane.material.side = THREE.DoubleSide;
    // // plane.position.x = 100;
    // plane.rotation.z = Math.PI / 2;
    // scene.add(plane)

    const video = document.getElementById('myVideo');
    texture = new THREE.VideoTexture(video);
    texture.needsUpdate = true;
    material = new THREE.MeshBasicMaterial({map: texture, side: THREE.FrontSide});
    material.needsUpdate = true;
    plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), material);
    plane.rotation.z = Math.PI / 2;
    scene.add(plane)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    world.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.minDistance = 0.5;
    // controls.maxDistance = 2;

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('click', playVideo, false);
}

function playVideo() {
    const video = document.getElementById('myVideo');
    if (video.muted) {
        video.muted = false;
    }

    if (video.paused) {
        video.play()
    }
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
