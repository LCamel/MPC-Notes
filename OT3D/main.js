import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export let container;
export let scene;
const MATERIALS = [
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xFF0000 }),
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x0000FF }),
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x888888, transparent: true, opacity: 0.05 }),
];

export let ROW;
export let r;
export let COL = 3;
export let T;
export let T_XOR_r;
export let s;
export let Q;
export let Q_XOR_s;

export function setContainer(c) {
    container = c;
}

function init(container) {
    let W = container.clientWidth;
    let H = container.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

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
        // ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_clipping.html
        scene.add( new THREE.AmbientLight( 0xcccccc ) );

        const spotLight = new THREE.SpotLight( 0xffffff, 100 );
        spotLight.angle = Math.PI / 5;
        spotLight.penumbra = 0.2;
        spotLight.position.set( 10, 15, 15 );
        scene.add(spotLight);

        const dirLight = new THREE.DirectionalLight( 0x55505a, 20 );
        dirLight.position.set( 0, 3, 0 );
        scene.add(dirLight);
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

    makeR(rArr);
    makeT();
    makeT_XOR_r();
    makeS();
    makeQ();
    makeQ_XOR_s();

}
export function makeWireframe(cell1, cell2, color) {
    let pos1 = cell1.cube.position;
    let pos2 = cell2.cube.position;
    let g = new THREE.EdgesGeometry(new THREE.BoxGeometry(pos2.x - pos1.x + 1, pos2.y - pos1.y + 1, pos2.z - pos1.z + 1));
    let mat = new THREE.LineBasicMaterial( { color: color } );
    let wireframe = new THREE.LineSegments( g, mat );
    wireframe.position.set((pos2.x + pos1.x) / 2, (pos2.y + pos1.y) / 2, (pos2.z + pos1.z) / 2);
    wireframe.visible = false; // !!
    scene.add(wireframe);
    return wireframe;
}
function makeCube(x, y, z, material) {
    const g = new THREE.BoxGeometry(0.8, 0.8, 0.8);
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
        this.cube.material = MATERIALS[(v != undefined) ? v : 2]; // 0 1 undefined
    }
}

export function makeR(rArr) {
    r = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        r[i] = new Cell(rArr[i], 0.5, ROW - i - 1, 0.5);
    }
}
export function makeT() {
    T = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        T[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            T[i][j] = new Cell(undefined, 2 + j, ROW - i - 1, 0);
        }
    }
    T.columnWireframe = T[ROW - 1].map((cell1, j) => makeWireframe(cell1, T[0][j], MATERIALS[0].color));
}
export function makeT_XOR_r() {
    T_XOR_r = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        T_XOR_r[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            T_XOR_r[i][j] = new Cell(undefined, 2 + j, ROW - i - 1, 1);
        }
    }
    T_XOR_r.columnWireframe = T_XOR_r[ROW - 1].map((cell1, j) => makeWireframe(cell1, T_XOR_r[0][j], MATERIALS[1].color));
}
export function makeS() {
    s = new Array(COL);
    for (let j = 0; j < COL; j++) {
        s[j] = new Cell(undefined, j - COL, ROW, -1.5);
    }
}
export function makeQ() {
    Q = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        Q[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            Q[i][j] = new Cell(undefined, j - COL, ROW - i - 1, 0);
        }
    }
}
export function makeQ_XOR_s() {
    Q_XOR_s = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        Q_XOR_s[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            Q_XOR_s[i][j] = new Cell(undefined, j - COL, ROW - i - 1, 1);
        }
    }
}

export function randomBit() {
    return Math.random() < 0.5 ? 0 : 1;
}
export function generateT() {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            T[i][j].setV(randomBit());
        }
    }
}
export function computeT_XOR_r() {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            T_XOR_r[i][j].setV(T[i][j].v ^ r[i].v);
        }
    }
}
export function generateS() {
    for (let j = 0; j < COL; j++) {
        s[j].setV(randomBit());
    }
}
export function obliviousTransferQ() {
    for (let j = 0; j < COL; j++) {
        let src = (s[j].v == 0) ? T : T_XOR_r;
        for (let i = 0; i < ROW; i++) {
            Q[i][j].setV(src[i][j].v);
        }
        let selected = (s[j].v == 0) ? T : T_XOR_r;
        selected.columnWireframe[j].visible = true;
    }
}
export function obliviousTransferQColumn(j) {
    let src = (s[j].v == 0) ? T : T_XOR_r;
    s[j].cube.position.y += 0.2;
    src.columnWireframe[j].visible = true;
    setTimeout(() => {
        for (let i = 0; i < ROW; i++) {
            Q[i][j].setV(src[i][j].v);
        }
        s[j].cube.position.y -= 0.2;
    }, 500);
}
export function computeQ_XOR_s() {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            Q_XOR_s[i][j].setV(Q[i][j].v ^ s[j].v);
        }
    }
}
export function hideShowRows(fn) {
    for (let i = 0; i < ROW; i++) {
        var show = fn(i);
        for (let j = 0; j < COL; j++) {
            r[i].cube.visible =
            T[i][j].cube.visible =
            T_XOR_r[i][j].cube.visible =
            Q[i][j].cube.visible =
            Q_XOR_s[i][j].cube.visible = show;
        }
    }
}
