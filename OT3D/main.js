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
    constructor(container, row, col) {
        [this.scene, this.camera, this.renderer] = this.initDisplay(container); // only scene is needed
        this.ROW = row;
        this.COL = col;
        this.r = this.make1DCells(this.ROW, (i) => [0.5, this.ROW - i - 1, 0.5]);
        this.T = this.make2DCells(this.ROW, this.COL, (i, j) => [2 + j, this.ROW - i - 1, 0]);
        this.T_XOR_r = this.make2DCells(this.ROW, this.COL, (i, j) => [2 + j, this.ROW - i - 1, 1]);
        this.TTCols = this.makeTTCols();
        this.s = this.make1DCells(this.COL, (j) => [j - this.COL - 0.4, this.ROW, -1.5]);
        this.Q = this.make2DCells(this.ROW, this.COL, (i, j) => [j - this.COL - 0.4, this.ROW - i - 1, 0]);
        this.Q_XOR_s = this.make2DCells(this.ROW, this.COL, (i, j) => [j - this.COL - 0.4, this.ROW - i - 1, 1]);
        this.QQRows = this.makeQQRows();

        this.makeStaticText();
        this.OTText = this.makeOTText();

        this.nextOTColumn = 0;
        this.showIfRowGreatOrEqualThan = 0;
        this.showTarget = false;
    }

    initDisplay(container) {
        let scene, camera, renderer;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x202020);

        let W = container.clientWidth;
        let H = container.clientHeight;
        {
            let ratio = W / H;
            let w = 13;
            let h = w / ratio;
            camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 1, 1000);
            camera.position.set(0, 10, 0); // or 10,10,10
            camera.setViewOffset(w, h, 1, -1, w, h);
        }
        {
            const controls = new OrbitControls(camera, container);
            controls.target.set(0, 0, 0);
            controls.update();
        }
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(W, H);
        container.appendChild(renderer.domElement);
        {
            let axesHelper = new THREE.AxesHelper(5);
            // scene.add(axesHelper);
        }
        {
            // ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_clipping.html
            scene.add(new THREE.AmbientLight(0xcccccc));

            const spotLight = new THREE.SpotLight(0xffffff, 100);
            spotLight.angle = Math.PI / 5;
            spotLight.penumbra = 0.2;
            spotLight.position.set(10, 15, 15);
            scene.add(spotLight);

            const dirLight = new THREE.DirectionalLight(0x55505a, 20);
            dirLight.position.set(0, 3, 0);
            scene.add(dirLight);
        }

        const animate = () => {
            renderer.render(scene, camera);
        };
        renderer.setAnimationLoop(animate);

        return [scene, camera, renderer];
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

    mapN(n, fn) {
        return [...new Array(n)].map((_, i) => fn(i));
    }
    make1DCells(len, posFn) {
        return this.mapN(len, i => this.makeCell(...posFn(i)));
    }
    make2DCells(row, col, posFn) {
        return this.mapN(row, i => this.mapN(col, j => this.makeCell(...posFn(i, j))));
    }

    makeTTCols() {
        return this.mapN(this.COL, j => [
            this.makeWrappingBox(this.T[this.ROW - 1][j], this.T[0][j], WRAPPING_BOX_MATERIALS[0]),
            this.makeWrappingBox(this.T_XOR_r[this.ROW - 1][j], this.T_XOR_r[0][j], WRAPPING_BOX_MATERIALS[1])
        ]);
    }
    makeQQRows() {
        return this.mapN(this.ROW, i => [
            this.makeWrappingBox(this.Q[i][0], this.Q[i][this.COL - 1], WRAPPING_BOX_MATERIALS[0]),
            this.makeWrappingBox(this.Q_XOR_s[i][0], this.Q_XOR_s[i][this.COL - 1], WRAPPING_BOX_MATERIALS[1])
        ]);
    }

    makeStaticText() {
        let pos = this.r[this.ROW - 1].cube.position;
        this.makeText("r", pos.x - 0.08, 0, pos.z + 0.4);
        pos = this.T[this.ROW - 1][this.COL - 1].cube.position;
        this.makeText("T", pos.x + 0.65, 0, pos.z - 0.3);
        pos = this.T_XOR_r[this.ROW - 1][this.COL - 1].cube.position;
        this.makeText("T⊕r", pos.x + 0.65, 0, pos.z - 0.35);
        pos = this.s[0].cube.position;
        this.makeText("s", pos.x - 0.9, pos.y - 0.5, pos.z - 0.35);
        pos = this.Q[this.ROW - 1][0].cube.position;
        this.makeText("Q", pos.x - 1, 0, pos.z - 0.3);
        pos = this.Q_XOR_s[this.ROW - 1][0].cube.position;
        this.makeText("Q⊕s", pos.x - 1.64, 0, pos.z - 0.35);
    }
    makeOTText() {
        return this.mapN(this.COL, j => {
            let pos = this.T_XOR_r[this.ROW - 1][j].cube.position;
            let text = this.makeText("OT", pos.x - 0.34, 0, pos.z + 0.45);
            text.visible = false;
            return text;
        });
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
        let s = this.s[j].v;
        this.TTCols[j][s].visible = true;
        this.TTCols[j][1 - s].visible = false; // nice to have (when repeating with a different "s")
        this.OTText[j].color = MATERIALS[s].color;
        this.OTText[j].visible = true;
        setTimeout(() => {
            let src = (s == 0) ? this.T : this.T_XOR_r;
            for (let i = 0; i < this.ROW; i++) {
                this.Q[i][j].setV(src[i][j].v);
            }
            this.OTText[j].visible = false;
        }, 800);
    }
    obliviousTransferNextColumn() {
        if (this.s[this.nextOTColumn].v == undefined) return;
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

    // https://protectwise.github.io/troika/troika-three-text/#usage
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
