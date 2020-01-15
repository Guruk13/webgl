import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

const Scene = {
	vars: {
		container: null,
		scene: null,
		records: null,
		renderer: null,
		camera: null,
		stats: null,
		controls: null,
		texture: null,
		mouse: new THREE.Vector2(),
		INTERSECTED: null,
		raycaster: new THREE.Raycaster(),
		animSpeed: null,
		animPercent: 0.00,
		text: "DAWIN"
	},
	animate: () => {
		Scene.vars.camera.updateMatrixWorld();
		requestAnimationFrame(Scene.animate);
		console.log(Scene.vars.records);
		Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

		Scene.customAnimation();

		let intersects = [];



		if (intersects.length > 0) {

			if (Scene.vars.INTERSECTED != intersects[0].object) {

				if (Scene.vars.INTERSECTED) Scene.vars.INTERSECTED.material.emissive.setHex(Scene.vars.INTERSECTED.currentHex);

				Scene.vars.Scene.vars.INTERSECTED = intersects[0].object;


			}

		} else {
			if (Scene.vars.INTERSECTED) Scene.vars.INTERSECTED.material.emissive.setHex(Scene.vars.INTERSECTED.currentHex);

			Scene.vars.INTERSECTED = null;

		}




		Scene.vars.turn = null;

		if (intersects.length > 0) {
			Scene.vars.turn = true;
			Scene.vars.animSpeed = 0.05;
		} else {
			Scene.vars.turn = false;
			Scene.vars.animSpeed = -0.05;
		}


		Scene.render();
	},
	render: () => {
		Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
		Scene.vars.stats.update();
	},
	customAnimation: () => {
		let vars = Scene.vars;

		if (vars.animSpeed === null) {
			return;
		}

		vars.animPercent = vars.animPercent + vars.animSpeed;
		let percent = (vars.animPercent - 0.4) / 0.6;

		if (vars.turn && vars.Scene.vars.INTERSECTED != null) {
			vars.Scene.vars.INTERSECTED.rotation.x = Math.PI / percent;
		}



		if (vars.animPercent >= 0.40) {
			let percent = (vars.animPercent - 0.4) / 0.6;
			//vars.statuette.position.y = 50 * percent;



		} else if (vars.animPercent < 0.70) {
			//vars.statuette.position.y = 0;
		}


	},
	loadFBX: (file, scale, position, rotation, ) => {
		let vars = Scene.vars;
		let loader = new FBXLoader();

		if (file === undefined) {
			return;
		}

		let positionx = -500
		for (let i = 0; i <= 2; i++) {
			loader.load('./fbx/' + file, (object) => {


				//console.log("loading captain")
				position.x = positionx;
				object.position.y = position[1];
				object.position.z = position[2];

				object.rotation.x = rotation[0];
				object.rotation.y = rotation[1];
				object.rotation.z = rotation[2];

				object.scale.x = object.scale.y = object.scale.z = scale;
				Scene.vars["record".$i] = mesh;
				console.log("tell that bitch be cool ");
				Scene.add(object);

			});
			positionx += 500;
		}








	},


	onWindowResize: () => {
		let vars = Scene.vars;
		vars.camera.aspect = window.innerWidth / window.innerHeight;
		vars.camera.updateProjectionMatrix();
		vars.renderer.setSize(window.innerWidth, window.innerHeight);
	},
	onMouseMove: (event) => {
		Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	},
	init: () => {
		let vars = Scene.vars;

		// Préparer le container pour la scène
		vars.container = document.createElement('div');
		vars.container.classList.add('fullscreen');
		document.body.appendChild(vars.container);

		// ajout de la scène
		vars.scene = new THREE.Scene();
		vars.scene.background = new THREE.Color(0xa0a0a0);
		vars.scene.fog = new THREE.Fog(vars.scene.background, 500, 3000);

		// paramétrage du moteur de rendu
		vars.renderer = new THREE.WebGLRenderer({ antialias: true });
		vars.renderer.setPixelRatio(window.devicePixelRatio);
		vars.renderer.setSize(window.innerWidth, window.innerHeight);

		vars.renderer.shadowMap.enabled = true;
		vars.renderer.shadowMapSoft = true;

		vars.container.appendChild(vars.renderer.domElement);

		// ajout de la caméra
		vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
		vars.camera.position.set(50, 500, 1000);

		// ajout de la lumière
		const lightIntensityHemisphere = .5;
		let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, lightIntensityHemisphere);
		light.position.set(0, 700, 0);
		vars.scene.add(light);

		// ajout des directionelles
		const lightIntensity = .8;
		const d = 1000;
		let light1 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
		light1.position.set(0, 700, 0);
		light1.castShadow = true;
		light1.shadow.camera.left = -d;
		light1.shadow.camera.right = d;
		light1.shadow.camera.top = d;
		light1.shadow.camera.bottom = -d;
		light1.shadow.camera.far = 2000;
		light1.shadow.mapSize.width = 4096;
		light1.shadow.mapSize.height = 4096;
		vars.scene.add(light1);
		// let helper = new THREE.DirectionalLightHelper(light1, 5);
		// vars.scene.add(helper);

		let light2 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
		light2.position.set(-400, 200, 400);
		light2.castShadow = true;
		light2.shadow.camera.left = -d;
		light2.shadow.camera.right = d;
		light2.shadow.camera.top = d;
		light2.shadow.camera.bottom = -d;
		light2.shadow.camera.far = 2000;
		light2.shadow.mapSize.width = 4096;
		light2.shadow.mapSize.height = 4096;
		vars.scene.add(light2);
		// let helper2 = new THREE.DirectionalLightHelper(light2, 5);
		// vars.scene.add(helper2);

		let light3 = new THREE.DirectionalLight(0xFFFFFF, lightIntensity);
		light3.position.set(400, 200, 400);
		light3.castShadow = true;
		light3.shadow.camera.left = -d;
		light3.shadow.camera.right = d;
		light3.shadow.camera.top = d;
		light3.shadow.camera.bottom = -d;
		light3.shadow.camera.far = 2000;
		light3.shadow.mapSize.width = 4096;
		light3.shadow.mapSize.height = 4096;
		vars.scene.add(light3);
		// let helper3 = new THREE.DirectionalLightHelper(light3, 5);
		// vars.scene.add(helper3);

		// ajout du sol
		let mesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2000, 2000),
			new THREE.MeshLambertMaterial(
				{ color: new THREE.Color(0x888888) }
			)
		);
		mesh.rotation.x = -Math.PI / 2;
		mesh.receiveShadow = false;
		vars.scene.add(mesh);

		let planeMaterial = new THREE.ShadowMaterial();
		planeMaterial.opacity = 0.07;
		let shadowPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2000, 2000),
			planeMaterial);
		shadowPlane.rotation.x = -Math.PI / 2;
		shadowPlane.receiveShadow = true;

		vars.scene.add(shadowPlane);

		// ajout de la texture helper du sol
		let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		vars.scene.add(grid);

		vars.texture = new THREE.TextureLoader().load('./texture/marbre.jpg');

		let hash = document.location.hash.substr(1);
		if (hash.length !== 0) {
			let text = hash.substring();
			Scene.vars.text = decodeURI(text);
		}

		Scene.loadFBX("SM_VinylRecord.fbx", 10, [20, 20, 10], [0, 0, 0])

		// ajout des controles
		vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);

		vars.controls.target.set(0, 100, 0);
		vars.controls.update();

		window.addEventListener('resize', Scene.onWindowResize, false);
		window.addEventListener('mousemove', Scene.onMouseMove, false);

		vars.stats = new Stats();
		vars.container.appendChild(vars.stats.dom);

		Scene.animate();
	}
};

Scene.init();


