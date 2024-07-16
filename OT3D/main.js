import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export let container;
export let scene;
const MATERIALS = [
    new THREE.MeshPhongMaterial({ color: 0xFF0000, transparent: true, opacity: 0.6, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x0000FF, transparent: true, opacity: 0.6, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x888888, transparent: true, opacity: 0.6, shininess: 100 }),
];

export let ROW;
export let r;
export let COL = 6;


export function setContainer(c) {
    container = c;
}

function init(container) {
    let W = container.clientWidth;
    let H = container.clientHeight;

    scene = new THREE.Scene();

    let camera;
    {
        let ratio = W / H;
        let w = 40;
        let h = w / ratio;
        camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
        camera.position.set(20, 20, 20);
    }

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(W, H);
    container.appendChild( renderer.domElement );

    {
        let axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
    }
    {
        const skyColor = 0xB1E1FF;  // light blueconst intensity = 1;
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 5;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }
    {
        const controls = new OrbitControls(camera, container);
        //controls.target.set(0, 0, 0);
        controls.target.set(0, 10, 0);
        controls.update();
    }
    function animate() {
        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );
}
export function setR(rArr) {
    console.log("rArr: ", rArr);
    ROW = rArr.length;
    r = rArr.slice();

    init(container);

    makeCube(1, 1, 1, MATERIALS[0]);
    makeCube(2, 1, 1, MATERIALS[1]);
}

function makeCube(x, y, z, material) {
    const g = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(g, material);
    cube.position.set(x, y, z);
    scene.add(cube);
    return cube;
}

// export { setR };