import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, NgZone, signal, PLATFORM_ID, Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isNightMode = signal(false);
  activeStatIndex = signal(0);

  stats = [
    { value: '500+', label: 'Projects Completed', icon: 'apartment' },
    { value: '18+', label: 'Years Experience', icon: 'history' },
    { value: '250+', label: 'Happy Clients', icon: 'people' },
    { value: '50+', label: 'Expert Team', icon: 'engineering' },
  ];

  services = [
    {
      icon: 'home_work',
      title: 'Residential Construction',
      description: 'Dream homes crafted with precision — from villas to apartments.',
      color: '#F4B400',
    },
    {
      icon: 'business',
      title: 'Commercial Construction',
      description: 'Office buildings, malls, and commercial spaces built to impress.',
      color: '#FF6B00',
    },
    {
      icon: 'design_services',
      title: 'Interior Design',
      description: 'Stunning interiors that blend aesthetics with functionality.',
      color: '#F4B400',
    },
    {
      icon: 'construction',
      title: 'Renovation',
      description: 'Transform your existing space into something extraordinary.',
      color: '#FF6B00',
    },
    {
      icon: 'architecture',
      title: 'Architecture Planning',
      description: 'Innovative architectural blueprints that stand the test of time.',
      color: '#F4B400',
    },
    {
      icon: 'factory',
      title: 'Industrial Projects',
      description: 'Large-scale industrial facilities built for peak performance.',
      color: '#FF6B00',
    },
  ];

  private renderer: any;
  private scene: any;
  private camera: any;
  private animationId: number = 0;
  private crane: any;
  private craneArm: any;
  private buildings: any[] = [];
  private particles: any;
  private clock: any;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initThreeJS(), 100);
    }
  }

  async initThreeJS() {
    const THREE = await import('three');
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
    const gsap = (await import('gsap')).default;

    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // ---- Renderer ----
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // ---- Scene ----
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.018);

    // ---- Camera ----
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 500);
    this.camera.position.set(0, 8, 30);

    // ---- Controls ----
    const controls = new OrbitControls(this.camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.target.set(0, 4, 0);

    // ---- Clock ----
    this.clock = new THREE.Clock();

    // ---- Lights ----
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF4E0, 2.0);
    sunLight.position.set(20, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    this.scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xF4B400, 0.5);
    fillLight.position.set(-20, 10, -10);
    this.scene.add(fillLight);

    // Yellow construction light
    const pointLight = new THREE.PointLight(0xF4B400, 3, 30);
    pointLight.position.set(0, 20, 0);
    this.scene.add(pointLight);

    // ---- Ground ----
    const groundGeo = new THREE.PlaneGeometry(120, 120, 20, 20);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid lines on ground
    const gridHelper = new THREE.GridHelper(100, 30, 0xF4B400, 0x333333);
    (gridHelper.material as any).opacity = 0.3;
    (gridHelper.material as any).transparent = true;
    this.scene.add(gridHelper);

    // ---- Helper Functions ----
    const makeMaterial = (color: number, roughness = 0.7, metalness = 0.3, emissive = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive });

    // ---- Main Building Under Construction ----
    const buildingGroup = new THREE.Group();

    // Foundation
    const foundGeo = new THREE.BoxGeometry(12, 0.5, 10);
    const foundMesh = new THREE.Mesh(foundGeo, makeMaterial(0x333333, 0.9, 0.05));
    foundMesh.position.y = 0.25;
    foundMesh.receiveShadow = true;
    buildingGroup.add(foundMesh);

    // Floors (building up)
    const floorColors = [0x2A2A2A, 0x303030, 0x363636, 0x3A3A3A, 0x3D3D3D, 0x404040];
    for (let i = 0; i < 6; i++) {
      const floorH = 2.2;
      const floorGeo = new THREE.BoxGeometry(11, floorH, 9);
      const floorMat = makeMaterial(floorColors[i], 0.8, 0.2);
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.y = 0.5 + floorH * i + floorH / 2;
      floor.castShadow = true;
      floor.receiveShadow = true;
      buildingGroup.add(floor);

      // Windows per floor
      for (let wx = -3; wx <= 3; wx += 2) {
        for (let side of [-1, 1]) {
          const winGeo = new THREE.BoxGeometry(0.8, 1.2, 0.1);
          const winMat = new THREE.MeshStandardMaterial({
            color: 0x88CCFF,
            roughness: 0.1,
            metalness: 0.9,
            emissive: 0x224488,
            emissiveIntensity: i < 4 ? 0.6 : 0.1,
          });
          const win = new THREE.Mesh(winGeo, winMat);
          win.position.set(wx, 0.5 + floorH * i + floorH / 2, side * (9 / 2 + 0.05));
          buildingGroup.add(win);
        }
      }
    }

    // Top floor — scaffold
    const scaffoldGeo = new THREE.BoxGeometry(11, 1.5, 9);
    const scaffoldMat = new THREE.MeshStandardMaterial({
      color: 0xF4B400,
      roughness: 0.6,
      metalness: 0.4,
      wireframe: false,
      opacity: 0.9,
      transparent: true,
    });
    const scaffold = new THREE.Mesh(scaffoldGeo, scaffoldMat);
    scaffold.position.y = 14.5;
    buildingGroup.add(scaffold);

    buildingGroup.position.set(-5, 0, 0);
    this.scene.add(buildingGroup);
    this.buildings.push(buildingGroup);

    // ---- Background Buildings ----
    const bgBuildings = [
      { pos: [-22, 0, -15], size: [6, 18, 6], color: 0x252525 },
      { pos: [18, 0, -18], size: [7, 22, 7], color: 0x222222 },
      { pos: [-35, 0, -8], size: [5, 12, 5], color: 0x2A2A2A },
      { pos: [30, 0, -10], size: [8, 16, 6], color: 0x202020 },
      { pos: [0, 0, -30], size: [10, 28, 8], color: 0x1E1E1E },
    ];

    bgBuildings.forEach(({ pos, size, color }) => {
      const geo = new THREE.BoxGeometry(...(size as [number, number, number]));
      const mat = makeMaterial(color, 0.9, 0.1);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1] + size[1] / 2, pos[2]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });

    // ---- Tower Crane ----
    const craneGroup = new THREE.Group();
    const craneMat = makeMaterial(0xF4B400, 0.5, 0.7);
    const darkMat = makeMaterial(0x333333, 0.8, 0.3);

    // Mast (vertical pole)
    const mastGeo = new THREE.BoxGeometry(0.6, 22, 0.6);
    const mast = new THREE.Mesh(mastGeo, craneMat);
    mast.position.y = 11;
    mast.castShadow = true;
    craneGroup.add(mast);

    // Jib (horizontal arm — forward)
    const jibGeo = new THREE.BoxGeometry(18, 0.4, 0.4);
    const jib = new THREE.Mesh(jibGeo, craneMat);
    jib.position.set(7, 22, 0);
    jib.castShadow = true;
    craneGroup.add(jib);

    // Counter jib (back arm)
    const cJibGeo = new THREE.BoxGeometry(7, 0.4, 0.4);
    const cJib = new THREE.Mesh(cJibGeo, craneMat);
    cJib.position.set(-5, 22, 0);
    craneGroup.add(cJib);

    // Counter weight
    const cwGeo = new THREE.BoxGeometry(2.5, 1.2, 1.2);
    const cw = new THREE.Mesh(cwGeo, darkMat);
    cw.position.set(-9, 21.5, 0);
    craneGroup.add(cw);

    // Operator cab
    const cabGeo = new THREE.BoxGeometry(1.5, 1.2, 1.5);
    const cab = new THREE.Mesh(cabGeo, darkMat);
    cab.position.set(0, 21, 0);
    craneGroup.add(cab);

    // Hook rope
    const ropeGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.position.set(12, 19.5, 0);
    craneGroup.add(rope);

    // Hook
    const hookGeo = new THREE.TorusGeometry(0.4, 0.1, 8, 16, Math.PI);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9 });
    const hook = new THREE.Mesh(hookGeo, hookMat);
    hook.position.set(12, 17, 0);
    hook.rotation.z = Math.PI / 2;
    craneGroup.add(hook);

    craneGroup.position.set(8, 0, 2);
    this.scene.add(craneGroup);
    this.crane = craneGroup;

    // ---- Construction Equipment ----
    // Yellow excavator-like vehicle
    const excavatorGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(3.5, 1.5, 2);
    const body = new THREE.Mesh(bodyGeo, makeMaterial(0xF4B400, 0.5, 0.3));
    body.position.y = 1;
    excavatorGroup.add(body);

    const cabExGeo = new THREE.BoxGeometry(1.5, 1.2, 1.6);
    const cabEx = new THREE.Mesh(cabExGeo, makeMaterial(0xE6A800, 0.5, 0.3));
    cabEx.position.set(0.8, 2.2, 0);
    excavatorGroup.add(cabEx);

    // Tracks
    [-0.9, 0.9].forEach(z => {
      const trackGeo = new THREE.BoxGeometry(4, 0.5, 0.4);
      const track = new THREE.Mesh(trackGeo, makeMaterial(0x222222, 0.9, 0.1));
      track.position.set(0, 0.3, z);
      excavatorGroup.add(track);
    });

    // Arm
    const armGeo = new THREE.BoxGeometry(2.5, 0.3, 0.3);
    const arm = new THREE.Mesh(armGeo, makeMaterial(0xF4B400, 0.5, 0.3));
    arm.position.set(-2.2, 1.5, 0);
    arm.rotation.z = Math.PI / 6;
    excavatorGroup.add(arm);

    excavatorGroup.position.set(-18, 0, 8);
    this.scene.add(excavatorGroup);

    // Cement mixer truck
    const mixerGroup = new THREE.Group();
    const truckBody = new THREE.Mesh(
      new THREE.BoxGeometry(5, 2, 2.5),
      makeMaterial(0xFF6B00, 0.6, 0.2)
    );
    truckBody.position.y = 1.5;
    mixerGroup.add(truckBody);

    const drumGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 16);
    const drum = new THREE.Mesh(drumGeo, makeMaterial(0xCC5500, 0.6, 0.3));
    drum.position.set(0.5, 2.8, 0);
    drum.rotation.z = Math.PI * 0.15;
    mixerGroup.add(drum);

    // Wheels
    [-1.5, 1.5].forEach(x => {
      [-1, 1].forEach(z => {
        const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
        const wheel = new THREE.Mesh(wheelGeo, makeMaterial(0x111111, 0.9, 0.1));
        wheel.position.set(x, 0.5, z * 1.3);
        wheel.rotation.x = Math.PI / 2;
        mixerGroup.add(wheel);
      });
    });

    mixerGroup.position.set(16, 0, 10);
    mixerGroup.rotation.y = -Math.PI / 6;
    this.scene.add(mixerGroup);

    // ---- Scaffolding poles around building ----
    const poleMat = makeMaterial(0x888888, 0.7, 0.5);
    for (let y = 0; y < 14; y += 2.5) {
      for (let x of [-6, 6]) {
        const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8);
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(x, y + 1.25, 5);
        this.scene.add(pole);
      }
    }

    // Horizontal cross-bars
    for (let y = 2.5; y < 14; y += 2.5) {
      const barGeo = new THREE.CylinderGeometry(0.05, 0.05, 12, 8);
      const bar = new THREE.Mesh(barGeo, poleMat);
      bar.position.set(0, y, 5);
      bar.rotation.z = Math.PI / 2;
      this.scene.add(bar);
    }

    // ---- Particles (dust/sparks) ----
    const pCount = 300;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 40;
      pPositions[i * 3 + 1] = Math.random() * 20;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xF4B400,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    // ---- Stars background ----
    const starCount = 500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 400;
      starPositions[i * 3 + 1] = Math.random() * 100 + 20;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true, opacity: 0 });
    const stars = new THREE.Points(starGeo, starMat);
    this.scene.add(stars);

    // ---- GSAP Intro Animation ----
    gsap.from(this.camera.position, {
      y: 40,
      z: 70,
      duration: 3,
      ease: 'power3.inOut',
    });

    // ---- Resize Handler ----
    const onResize = () => {
      const w2 = canvas.clientWidth;
      const h2 = canvas.clientHeight;
      this.camera.aspect = w2 / h2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', onResize);

    // ---- Animation Loop ----
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        const t = this.clock.getElapsedTime();

        // Crane rotation
        craneGroup.rotation.y = Math.sin(t * 0.3) * 0.6;

        // Hook sway
        hook.position.y = 17 + Math.sin(t * 0.8) * 0.5;
        rope.position.y = 19.5 + Math.sin(t * 0.8) * 0.25;

        // Particle drift
        const pos = this.particles.geometry.attributes['position'];
        for (let i = 0; i < pCount; i++) {
          pos.array[i * 3 + 1] += 0.02;
          if (pos.array[i * 3 + 1] > 22) {
            pos.array[i * 3 + 1] = 0;
          }
        }
        pos.needsUpdate = true;

        // Drum rotation
        drum.rotation.x = t * 1.5;

        // Night mode star fade
        if (this.isNightMode()) {
          (starMat as any).opacity = Math.min((starMat as any).opacity + 0.01, 0.8);
        } else {
          (starMat as any).opacity = Math.max((starMat as any).opacity - 0.01, 0);
        }

        controls.update();
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  toggleNightMode() {
    this.isNightMode.update(v => !v);
    if (!this.scene) return;

    const THREE_Color = this.scene.fog.color.constructor;
    if (this.isNightMode()) {
      this.scene.fog.color.set(0x020409);
      this.renderer.setClearColor(0x020409, 1);
    } else {
      this.scene.fog.color.set(0x0a0a0a);
      this.renderer.setClearColor(0x000000, 0);
    }
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
    window.removeEventListener('resize', () => {});
  }
}
