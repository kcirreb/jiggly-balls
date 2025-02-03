import * as THREE from "three";

const center = new THREE.Vector3(0, 0, 0);

const createBall = (RAPIER, world) => {
  const size = 0.1 + Math.random() * 0.25;
  const density = size * 1.0;
  const range = 5;

  let x = Math.random() * range - range * 0.5;
  let y = Math.random() * range - range * 0.5 + 3;
  let z = Math.random() * range - range * 0.5;

  let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
  let rigidBody = world.createRigidBody(rigidBodyDesc);

  let colliderDesc = RAPIER.ColliderDesc.ball(size).setDensity(density);
  world.createCollider(colliderDesc, rigidBody);

  const geometry = new THREE.IcosahedronGeometry(size, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });
  const wireMesh = new THREE.Mesh(geometry, wireMaterial);
  wireMesh.scale.setScalar(1.01);
  mesh.add(wireMesh);

  const update = () => {
    rigidBody.resetForces(true);
    let { x, y, z } = rigidBody.translation();
    let position = new THREE.Vector3(x, y, z);
    let direction = position.clone().sub(center).normalize();
    rigidBody.addForce(direction.multiplyScalar(-0.5), true);
    mesh.position.set(x, y, z);
  };

  return { rigidBody, mesh, update };
};

const createMouseBall = (RAPIER, world) => {
  const size = 0.25;

  let rigidBodyDesc =
    RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(0, 0, 0);
  let rigidBody = world.createRigidBody(rigidBodyDesc);

  let colliderDesc = RAPIER.ColliderDesc.ball(size * 3);
  world.createCollider(colliderDesc, rigidBody);

  const geometry = new THREE.IcosahedronGeometry(size, 8);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const light = new THREE.PointLight(0xffffff);
  mesh.add(light);

  const update = (mousePosition) => {
    rigidBody.setTranslation({
      x: mousePosition.x * 5,
      y: mousePosition.y * 5,
      z: 0.2,
    });
    let { x, y, z } = rigidBody.translation();
    mesh.position.set(x, y, z);
  };

  return { mesh, update };
};

export { createBall, createMouseBall };
