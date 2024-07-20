import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Text} from 'troika-three-text';

const MATERIALS = {
    0: new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xFF0000 }),
    1: new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x0000FF }),
    undefined: new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x888888, transparent: true, opacity: 0.02, depthWrite: false }),
};
const WRAPPING_BOX_MATERIALS = [
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0xFF8888, transparent: true, opacity: 0.3 }),
    new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: 0x8888FF, transparent: true, opacity: 0.3 }),
];

// A Cell contains a value and a cube.
// When the value is set, it also changes the material of the cube.
class Cell {
    constructor(cube) {
        this.v = undefined;
        this.cube = cube;
    }
    setV(v) {
        this.v = v;
        this.cube.material = MATERIALS[v]; // 0 1 undefined
    }
}

class Main {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.ROW = null;
        this.COL = null;
        this.r = null;
        this.T = null;
        this.T_XOR_r = null;
        this.s = null;
        this.Q = null;
        this.Q_XOR_s = null;
        this.QQRows = null;
        this.OTText = null;

        this.nextOTColumn = 0;
        this.showIfRowGreatOrEqualThan = 0;
        this.showTarget = false;
    }

    init(container, row, col) {
        this.initDisplay(container);

        this.ROW = row;
        this.COL = col;
        this.makeR();
        this.makeT();
        this.makeT_XOR_r();
        this.makeS();
        this.makeQ();
        this.makeQ_XOR_s();
        this.makeQQRows(); // after Q and Q_XOR_s
        this.makeOTText();
    }

    initDisplay(container) {
        let W = container.clientWidth;
        let H = container.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x202020);

        {
            let ratio = W / H;
            let w = 13;
            let h = w / ratio;
            this.camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 1, 1000);
            this.camera.position.set(0, 10, 0); // or 10,10,10
            this.camera.setViewOffset(w, h, 1, -1, w, h);
        }
        {
            const controls = new OrbitControls(this.camera, container);
            controls.target.set(0, 0, 0);
            controls.update();
        }

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(W, H);
        container.appendChild(renderer.domElement);

        {
            let axesHelper = new THREE.AxesHelper(5);
            // this.scene.add(axesHelper);
        }
        {
            // ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_clipping.html
            this.scene.add(new THREE.AmbientLight(0xcccccc));

            const spotLight = new THREE.SpotLight(0xffffff, 100);
            spotLight.angle = Math.PI / 5;
            spotLight.penumbra = 0.2;
            spotLight.position.set(10, 15, 15);
            this.scene.add(spotLight);

            const dirLight = new THREE.DirectionalLight(0x55505a, 20);
            dirLight.position.set(0, 3, 0);
            this.scene.add(dirLight);
        }

        const animate = () => {
            renderer.render(this.scene, this.camera);
        };
        renderer.setAnimationLoop(animate);
    }

    // all make() functions will add the objects to the scene

    makeCell(x, y, z) {
        const g = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const cube = new THREE.Mesh(g, MATERIALS[undefined]); // init for value "undefined"
        cube.position.set(x + 0.5, y + 0.5, z + 0.5); // shift
        this.scene.add(cube);
        return new Cell(cube);
    }

    makeWrappingBox(cell1, cell2, mat) {
        let pos1 = cell1.cube.position;
        let pos2 = cell2.cube.position;
        let g = new THREE.BoxGeometry(pos2.x - pos1.x + 1, pos2.y - pos1.y + 1, pos2.z - pos1.z + 1);
        let box = new THREE.Mesh(g, mat);
        box.position.set((pos2.x + pos1.x) / 2, (pos2.y + pos1.y) / 2, (pos2.z + pos1.z) / 2);
        box.visible = false; // !!
        this.scene.add(box);
        return box;
    }

    makeR() {
        this.r = new Array(this.ROW);
        for (let i = 0; i < this.ROW; i++) {
            this.r[i] = this.makeCell(0.5, this.ROW - i - 1, 0.5);
        }
        let pos = this.r[this.ROW - 1].cube.position;
        this.makeText("r", pos.x - 0.08, 0, pos.z + 0.4);
    }

    makeT() {
        this.T = new Array(this.ROW);
        for (let i = 0; i < this.ROW; i++) {
            this.T[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.T[i][j] = this.makeCell(2 + j, this.ROW - i - 1, 0);
            }
        }
        this.T.OTColumn = this.T[this.ROW - 1].map((cell1, j) => this.makeWrappingBox(cell1, this.T[0][j], WRAPPING_BOX_MATERIALS[0]));
        let pos = this.T[this.ROW - 1][this.COL - 1].cube.position;
        this.makeText("T", pos.x + 0.65, 0, pos.z - 0.3);
    }

    makeT_XOR_r() {
        this.T_XOR_r = new Array(this.ROW);
        for (let i = 0; i < this.ROW; i++) {
            this.T_XOR_r[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.T_XOR_r[i][j] = this.makeCell(2 + j, this.ROW - i - 1, 1);
            }
        }
        this.T_XOR_r.OTColumn = this.T_XOR_r[this.ROW - 1].map((cell1, j) => this.makeWrappingBox(cell1, this.T_XOR_r[0][j], WRAPPING_BOX_MATERIALS[1]));
        let pos = this.T_XOR_r[this.ROW - 1][this.COL - 1].cube.position;
        this.makeText("T⊕r", pos.x + 0.65, 0, pos.z - 0.35);
    }

    makeS() {
        this.s = new Array(this.COL);
        for (let j = 0; j < this.COL; j++) {
            this.s[j] = this.makeCell(j - this.COL - 0.4, this.ROW, -1.5);
        }
        let pos = this.s[0].cube.position;
        this.makeText("s", pos.x - 0.9, pos.y - 0.5, pos.z - 0.35);
    }

    makeQ() {
        this.Q = new Array(this.ROW);
        for (let i = 0; i < this.ROW; i++) {
            this.Q[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.Q[i][j] = this.makeCell(j - this.COL - 0.4, this.ROW - i - 1, 0);
            }
        }
        let pos = this.Q[this.ROW - 1][0].cube.position;
        this.makeText("Q", pos.x - 1, 0, pos.z - 0.3);
    }

    makeQ_XOR_s() {
        this.Q_XOR_s = new Array(this.ROW);
        for (let i = 0; i < this.ROW; i++) {
            this.Q_XOR_s[i] = new Array(this.COL);
            for (let j = 0; j < this.COL; j++) {
                this.Q_XOR_s[i][j] = this.makeCell(j - this.COL - 0.4, this.ROW - i - 1, 1);
            }
        }
        let pos = this.Q_XOR_s[this.ROW - 1][0].cube.position;
        this.makeText("Q⊕s", pos.x - 1.64, 0, pos.z - 0.35);
    }

    makeQQRows() {
        this.QQRows = [];
        for (let i = 0; i < this.ROW; i++) {
            this.QQRows.push([
                this.makeWrappingBox(this.Q[i][0], this.Q[i][this.COL - 1], WRAPPING_BOX_MATERIALS[0]),
                this.makeWrappingBox(this.Q_XOR_s[i][0], this.Q_XOR_s[i][this.COL - 1], WRAPPING_BOX_MATERIALS[1])
            ]);
        }
    }

    makeOTText() {
        this.OTText = new Array(this.COL);
        for (let j = 0; j < this.COL; j++) {
            let pos = this.T_XOR_r[this.ROW - 1][j].cube.position;
            this.OTText[j] = this.makeText("OT", pos.x - 0.34, 0, pos.z + 0.45);
            this.OTText[j].visible = false;
        }
    }

    randomBit() {
        return Math.random() < 0.5 ? 0 : 1;
    }

    setR(rArr) {
        console.log("setR: ", rArr);
        if (rArr.length != this.ROW) { throw new Error("array size mismatch"); }
        rArr.forEach((v, j) => this.r[j].setV(v));
    }

    generateT() {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                this.T[i][j].setV(this.randomBit());
            }
        }
    }

    computeT_XOR_r() {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                this.T_XOR_r[i][j].setV(this.T[i][j].v ^ this.r[i].v);
            }
        }
    }

    generateS() {
        for (let j = 0; j < this.COL; j++) {
            this.s[j].setV(this.randomBit());
        }
    }

    obliviousTransferColumn(j) { // somewhat private
        let [src, other] = (this.s[j].v == 0) ? [this.T, this.T_XOR_r] : [this.T_XOR_r, this.T];
        // this.s[j].cube.position.y += 0.2;
        src.OTColumn[j].visible = true;
        other.OTColumn[j].visible = false; // nice to have (when repeating with a different "s")
        this.OTText[j].color = src.OTColumn[j].material.color;
        this.OTText[j].visible = true;
        setTimeout(() => {
            for (let i = 0; i < this.ROW; i++) {
                this.Q[i][j].setV(src[i][j].v);
            }
            // this.s[j].cube.position.y -= 0.2;
            this.OTText[j].visible = false;
        }, 800);
    }
    obliviousTransferNextColumn() {
        this.obliviousTransferColumn(this.nextOTColumn);
        this.nextOTColumn = (this.nextOTColumn + 1) % this.COL;
    }

    computeQ_XOR_s() {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                this.Q_XOR_s[i][j].setV(this.Q[i][j].v ^ this.s[j].v);
            }
        }
    }


    hideShowCellsByRow(fn) { // somewhat private
        for (let i = 0; i < this.ROW; i++) {
            var showLayer = fn(i);
            for (let j = 0; j < this.COL; j++) {
                this.r[i].cube.visible =
                this.T[i][j].cube.visible =
                this.T_XOR_r[i][j].cube.visible =
                this.Q[i][j].cube.visible =
                this.Q_XOR_s[i][j].cube.visible = showLayer;
            }
        }
    }
    hideShowTargetsByRow(fn) { // somewhat private
        for (let i = 0; i < this.ROW; i++) {
            let showLayer = fn(i);
            for (let k = 0; k < 2; k++) {
                this.QQRows[i][k].visible = showLayer && (this.r[i].v == k);
            }
        }
    }
    hideShow() { // somewhat private
        this.hideShowCellsByRow((i) => i >= this.showIfRowGreatOrEqualThan);
        this.hideShowTargetsByRow((i) => this.showTarget && (i >= this.showIfRowGreatOrEqualThan));
    }
    toggleShowRowThreshold() {
        this.showIfRowGreatOrEqualThan = (this.showIfRowGreatOrEqualThan + 1) % this.ROW;
        this.hideShow();
    }
    toggleShowTarget() {
        this.showTarget = !this.showTarget;
        this.hideShow();
    }


    makeText(str, x, y, z) {
        const myText = new Text();
        this.scene.add(myText);

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
}

export { Main };
