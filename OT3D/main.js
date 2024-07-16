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
        let w = 20;
        let h = w / ratio;
        camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
        camera.position.set(10, 10, 10);
    }
    {
        const controls = new OrbitControls(camera, container);
        controls.target.set(0, 0, 0);
        controls.update();
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
    function animate() {
        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );
}
export function setR(rArr) {
    console.log("rArr: ", rArr);
    ROW = rArr.length;

    init(container);

    r = rArr.slice();

    r = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        r[i] = new Cell(rArr[i], 1, ROW - i - 1, 0.5);
    }
    //makeCube(0, 0, 0, MATERIALS[2]);
}

function makeCube(x, y, z, material) {
    const g = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(g, material);
    cube.position.set(x + 0.5, y + 0.5, z + 0.5); // shift
    scene.add(cube);
    return cube;
}

class Cell {
    constructor(v, x, y, z) {
        this.cube = makeCube(x, y, z, MATERIALS[2]);
        this.setV(v);
    }
    setV(v) {
        this.v = v;
        this.cube.visible = (v != undefined);
        this.cube.material = MATERIALS[v || 2]; // 0 1 undefined
    }
}

// export { setR };
