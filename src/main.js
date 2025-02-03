import * as THREE from "three";
import RAPIER from "https://cdn.skypack.dev/@dimforge/rapier3d-compat";
import { createBall, createMouseBall } from "./ball.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

await RAPIER.init();
const gravity = { x: 0.0, y: 0.0, z: 0.0 };
const world = new RAPIER.World(gravity);

const balls = [];
for (let i = 0; i < 100; i++) {
  const ball = createBall(RAPIER, world);
  balls.push(ball);
  scene.add(ball.mesh);
}

let mousePosition = new THREE.Vector2();
const mouseBall = createMouseBall(RAPIER, world);
scene.add(mouseBall.mesh);

const light = new THREE.HemisphereLight(0x00bbff, 0xaa00ff);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  world.step();
  mouseBall.update(mousePosition);
  balls.forEach((ball) => ball.update());
  renderer.render(scene, camera);
}
animate();

function handleMouseMove(event) {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("mousemove", handleMouseMove, false);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
