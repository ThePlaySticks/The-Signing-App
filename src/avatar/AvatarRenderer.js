import * as THREE from 'three';

export class AvatarRenderer {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.bones = {};
    this.materials = {};
    this.animationFrameId = null;
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.avatarGroup = null;

    this.initScene();
    this.buildAvatar();
    this.setupInteractions();
    this.animate();
  }

  initScene() {
    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent canvas for beautiful glassmorphism

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.45, 2.6);
    this.camera.lookAt(0, 1.25, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa78bfa, 0.9);
    fillLight.position.set(-2.5, 2, 2);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    rimLight.position.set(0, 3, -3);
    this.scene.add(rimLight);

    // Subtle pedestal disc
    const discGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.05, 32);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.6
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.025;
    disc.receiveShadow = true;
    this.scene.add(disc);

    window.addEventListener('resize', () => this.onResize());
  }

  buildAvatar() {
    this.avatarGroup = new THREE.Group();
    this.scene.add(this.avatarGroup);

    // Modern Stylized Humanoid Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xf3a87c, // warm skin tone
      roughness: 0.55,
      metalness: 0.05
    });

    const clothMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Vibrant indigo-blue shirt
      roughness: 0.65,
      metalness: 0.1
    });

    const accentClothMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.6,
      metalness: 0.1
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.8
    });

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe185d });

    // 1. Torso / Chest
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.62, 24);
    const torso = new THREE.Mesh(torsoGeo, clothMat);
    torso.position.y = 0.85;
    torso.castShadow = true;
    this.avatarGroup.add(torso);

    // Collar / Neckline detail
    const collarGeo = new THREE.TorusGeometry(0.12, 0.03, 16, 24);
    const collar = new THREE.Mesh(collarGeo, accentClothMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0, 1.16, 0);
    this.avatarGroup.add(collar);

    // 2. Neck & Head
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.14, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 1.22;
    this.avatarGroup.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.38, 0);
    this.avatarGroup.add(headGroup);
    this.bones.head = headGroup;

    // Stylized Head
    const headGeo = new THREE.SphereGeometry(0.19, 32, 24);
    headGeo.scale(1, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.205, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.05, -0.02);
    headGroup.add(hairMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.026, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.065, 0.03, 0.165);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.065, 0.03, 0.165);
    headGroup.add(rightEye);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.055, 0.012, 0.01);
    const leftBrow = new THREE.Mesh(browGeo, hairMat);
    leftBrow.position.set(-0.065, 0.08, 0.17);
    leftBrow.rotation.z = -0.05;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMat);
    rightBrow.position.set(0.065, 0.08, 0.17);
    rightBrow.rotation.z = 0.05;
    headGroup.add(rightBrow);

    // Mouth
    const mouthGeo = new THREE.TorusGeometry(0.035, 0.008, 8, 16, Math.PI);
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.rotation.x = Math.PI * 0.95;
    mouth.position.set(0, -0.09, 0.165);
    headGroup.add(mouth);

    // 3. Arms & Articulated Hands (Left and Right)
    this.bones.rightArm = this.createArm('right', skinMat, clothMat);
    this.bones.leftArm = this.createArm('left', skinMat, clothMat);
  }

  createArm(side, skinMat, clothMat) {
    const isRight = side === 'right';
    const sign = isRight ? 1 : -1;

    // Shoulder Pivot
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.set(sign * 0.28, 1.12, 0);
    this.avatarGroup.add(shoulderGroup);

    // Upper arm sleeve & limb
    const upperArmGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.3, 16);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, clothMat);
    upperArmMesh.position.y = -0.15;
    shoulderGroup.add(upperArmMesh);

    // Elbow Pivot
    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, -0.3, 0);
    shoulderGroup.add(elbowGroup);

    // Forearm
    const forearmGeo = new THREE.CylinderGeometry(0.05, 0.042, 0.28, 16);
    const forearmMesh = new THREE.Mesh(forearmGeo, skinMat);
    forearmMesh.position.y = -0.14;
    elbowGroup.add(forearmMesh);

    // Wrist Pivot
    const wristGroup = new THREE.Group();
    wristGroup.position.set(0, -0.28, 0);
    elbowGroup.add(wristGroup);

    // Palm
    const palmGeo = new THREE.BoxGeometry(0.085, 0.11, 0.025);
    const palmMesh = new THREE.Mesh(palmGeo, skinMat);
    palmMesh.position.y = -0.055;
    wristGroup.add(palmMesh);

    // 5 Articulated Fingers
    const fingers = {};
    const fingerConfigs = [
      { name: 'thumb', x: sign * 0.05, y: -0.03, z: 0.015, len: 0.065, radius: 0.013 },
      { name: 'index', x: sign * 0.032, y: -0.11, z: 0, len: 0.08, radius: 0.011 },
      { name: 'middle', x: 0, y: -0.11, z: 0, len: 0.088, radius: 0.011 },
      { name: 'ring', x: -sign * 0.028, y: -0.11, z: 0, len: 0.078, radius: 0.01 },
      { name: 'pinky', x: -sign * 0.048, y: -0.105, z: 0, len: 0.065, radius: 0.009 }
    ];

    fingerConfigs.forEach((cfg) => {
      const fingerGroup = new THREE.Group();
      fingerGroup.position.set(cfg.x, cfg.y, cfg.z);
      wristGroup.add(fingerGroup);

      const fGeo = new THREE.CylinderGeometry(cfg.radius * 0.85, cfg.radius, cfg.len, 10);
      const fMesh = new THREE.Mesh(fGeo, skinMat);
      fMesh.position.y = -cfg.len / 2;
      fingerGroup.add(fMesh);

      fingers[cfg.name] = fingerGroup;
    });

    // Default rest arm pose
    if (isRight) {
      shoulderGroup.rotation.z = -0.15;
      shoulderGroup.rotation.x = 0.1;
      elbowGroup.rotation.x = 0.35;
    } else {
      shoulderGroup.rotation.z = 0.15;
      shoulderGroup.rotation.x = 0.1;
      elbowGroup.rotation.x = 0.35;
    }

    return {
      shoulder: shoulderGroup,
      elbow: elbowGroup,
      wrist: wristGroup,
      fingers: fingers
    };
  }

  setupInteractions() {
    const el = this.renderer.domElement;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;

      if (this.avatarGroup) {
        this.avatarGroup.rotation.y += deltaX * 0.01;
      }
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for mobile rotation
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.prevMousePos.x;
      if (this.avatarGroup) {
        this.avatarGroup.rotation.y += deltaX * 0.012;
      }
      this.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  resetRotation() {
    if (this.avatarGroup) {
      this.avatarGroup.rotation.y = 0;
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    // Subtle organic breathing idle motion when not heavily signing
    const t = Date.now() * 0.0015;
    if (this.bones.head) {
      this.bones.head.position.y = 1.38 + Math.sin(t) * 0.003;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
