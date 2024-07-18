import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Text} from 'troika-three-text';

const MATERIALS = [
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xFF0000 }),
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x0000FF }),
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x888888, transparent: true, opacity: 0.02, depthWrite: false }),
];
const WRAPPING_BOX_MATERIALS = [
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xFF8888, transparent: true, opacity: 0.3 }),
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x8888FF, transparent: true, opacity: 0.3 }),
];
export let scene;
export let camera;

function initDisplay(container) {
    let W = container.clientWidth;
    let H = container.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    {
        let ratio = W / H;
        let w = 13;
        let h = w / ratio;
        camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
        camera.position.set(0, 10, 0); // or 10,10,10
        camera.setViewOffset(w, h, 1, -1, w, h);
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
        //scene.add(axesHelper);
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

export let ROW;
export let COL;
export let r;
export let T;
export let T_XOR_r;
export let s;
export let Q;
export let Q_XOR_s;
export let OTText;
export let Target;

export function init(container, row, col) {
    initDisplay(container);

    ROW = row;
    COL = col;
    makeR();
    makeT();
    makeT_XOR_r();
    makeS();
    makeQ();
    makeQ_XOR_s();
    //makeTarget(); // after Q and Q_XOR_s
    makeOTText();

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

export function makeWrappingBox(cell1, cell2, mat) {
    let pos1 = cell1.cube.position;
    let pos2 = cell2.cube.position;
    let g = new THREE.BoxGeometry(pos2.x - pos1.x + 1, pos2.y - pos1.y + 1, pos2.z - pos1.z + 1);
    let OTColumn = new THREE.Mesh(g, mat);
    OTColumn.position.set((pos2.x + pos1.x) / 2, (pos2.y + pos1.y) / 2, (pos2.z + pos1.z) / 2);
    OTColumn.visible = false; // !!
    scene.add(OTColumn);
    return OTColumn;
}
export function makeCube(x, y, z, material) {
    const g = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cube = new THREE.Mesh(g, material);
    cube.position.set(x + 0.5, y + 0.5, z + 0.5); // shift
    scene.add(cube);
    return cube;
}

export function makeR() {
    r = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        r[i] = new Cell(undefined, 0.5, ROW - i - 1, 0.5);
    }
    let pos = r[ROW - 1].cube.position;
    makeText("r", pos.x - 0.08, 0, pos.z + 0.4);
}
export function makeT() {
    T = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        T[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            T[i][j] = new Cell(undefined, 2 + j, ROW - i - 1, 0);
        }
    }
    T.OTColumn = T[ROW - 1].map((cell1, j) => makeWrappingBox(cell1, T[0][j], WRAPPING_BOX_MATERIALS[0]));
    let pos = T[ROW - 1][COL - 1].cube.position;
    makeText("T", pos.x + 0.65, 0, pos.z - 0.3);
}
export function makeT_XOR_r() {
    T_XOR_r = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        T_XOR_r[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            T_XOR_r[i][j] = new Cell(undefined, 2 + j, ROW - i - 1, 1);
        }
    }
    T_XOR_r.OTColumn = T_XOR_r[ROW - 1].map((cell1, j) => makeWrappingBox(cell1, T_XOR_r[0][j], WRAPPING_BOX_MATERIALS[1]));
    let pos = T_XOR_r[ROW - 1][COL - 1].cube.position;
    makeText("T⊕r", pos.x + 0.65, 0, pos.z - 0.35);
}
export function makeS() {
    s = new Array(COL);
    for (let j = 0; j < COL; j++) {
        s[j] = new Cell(undefined, j - COL - 0.4, ROW, -1.5);
    }
    let pos = s[0].cube.position;
    makeText("s", pos.x - 0.9, pos.y - 0.5, pos.z - 0.35);

}
export function makeQ() {
    Q = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        Q[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            Q[i][j] = new Cell(undefined, j - COL - 0.4, ROW - i - 1, 0);
        }
    }
    let pos = Q[ROW - 1][0].cube.position;
    makeText("Q", pos.x - 1, 0, pos.z - 0.3);
}
export function makeQ_XOR_s() {
    Q_XOR_s = new Array(ROW);
    for (let i = 0; i < ROW; i++) {
        Q_XOR_s[i] = new Array(COL);
        for (let j = 0; j < COL; j++) {
            Q_XOR_s[i][j] = new Cell(undefined, j - COL - 0.4, ROW - i - 1, 1);
        }
    }
    let pos = Q_XOR_s[ROW - 1][0].cube.position;
    makeText("Q⊕s", pos.x - 1.64, 0, pos.z - 0.35);
}
export function makeTarget() {
    Target = r.map((_r, i) => {
        let arr = (_r.v == 0) ? Q : Q_XOR_s;
        return makeWrappingBox(arr[i][0], arr[i][COL - 1], WRAPPING_BOX_MATERIALS[_r.v]);
    })
}
export function makeOTText() {
    OTText = new Array(COL);
    for (let j = 0; j < COL; j++) {
        let pos = T_XOR_r[ROW - 1][j].cube.position;
        OTText[j] = makeText("OT", pos.x - 0.34, 0, pos.z + 0.45);
        OTText[j].visible = false;
    }
}
export function randomBit() {
    return Math.random() < 0.5 ? 0 : 1;
}

export function setR(rArr) {
    console.log("setR: ", rArr);
    if (rArr.length != ROW) { throw new Error("array size mismatch"); }
    rArr.forEach((v, j) => r[j].setV(v));
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
export function obliviousTransferQColumn(j) {
    let [src, other] = (s[j].v == 0) ? [T, T_XOR_r] : [T_XOR_r, T];
    //s[j].cube.position.y += 0.2;
    src.OTColumn[j].visible = true;
    other.OTColumn[j].visible = false; // nice to have (when repeating with a different "s")
    OTText[j].color = src.OTColumn[j].material.color;
    OTText[j].visible = true;
    setTimeout(() => {
        for (let i = 0; i < ROW; i++) {
            Q[i][j].setV(src[i][j].v);
        }
        //s[j].cube.position.y -= 0.2;
        OTText[j].visible = false;
    }, 800);
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
export function hideShowTargets(fn) {
    for (let i = 0; i < ROW; i++) {
        Target[i].visible = fn(i);
    }
}
// https://protectwise.github.io/troika/troika-three-text/
export function makeText(str, x, y, z) {
    const myText = new Text();
    scene.add(myText);

    // Set properties to configure:
    myText.text = str;
    myText.fontSize = 0.5;
    myText.position.set(x, y, z);
    myText.color = 0x9966FF;

    myText.rotation.set(-Math.PI / 2, 0, 0);

    // Update the rendering:
    myText.sync();
    return myText;
}
