import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import gsap from 'gsap';
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Test mesh
 */
// Geometry
let count = 100;

const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 32, 32);

let instanceGeometry = new THREE.InstancedBufferGeometry();

THREE.BufferGeometry.prototype.copy.call(instanceGeometry, geometry);

let offset = new Float32Array(count);
let speed = new Float32Array(count);
// Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uSprite: { value: new THREE.TextureLoader().load('/hands-sprite.png') },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
});

// Mesh
const mesh = new THREE.InstancedMesh(instanceGeometry, material, count);
scene.add(mesh);

let dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
    dummy.position.set(5 * (i / count - 0.5), 0, 0);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    offset[i] = Math.random();
    speed[i] = 0.5 + 0.5 * Math.random();
}
// set attributes for the instanced mesh for speed and offset
instanceGeometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offset, 1, false));
instanceGeometry.setAttribute('speed', new THREE.InstancedBufferAttribute(speed, 1, false));
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Orthographic camera
// const camera = new THREE.OrthographicCamera(-1/2, 1/2, 1/2, -1/2, 0.1, 100)

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    // Update controls
    controls.update();

    // Get elapsedtime
    const elapsedTime = clock.getElapsedTime();

    // Update uniforms
    material.uniforms.uTime.value = elapsedTime;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();