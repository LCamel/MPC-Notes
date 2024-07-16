import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

export let container;
export let scene;

export let ROW;
export let r;


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
        camera.position.x = 20;
        camera.position.y = 20;
        camera.position.z = 20;
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
}
// export { setR };