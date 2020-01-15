import * as THREE from '../vendor/three.js-master/build/three.module.js';
import Stats from '../vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

const Scene = {
	vars: {
		container: null,
		scene: null,
		renderer: null,
		camera: null,
		stats: null,
		controls: null,
		texture: null,
		mouse: new THREE.Vector2(),
		raycaster: new THREE.Raycaster(),
		animSpeed: null,
		animPercent: 0.00,
		text: "DAWIN"
	},
	animate: () => {
		requestAnimationFrame(Scene.animate);
		Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

		Scene.customAnimation();

		if (Scene.vars.Moroder !== undefined) {
			// utiliser optionalTarget : pour eviter ca 
			let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.children, true);
			

			if ( Scene.vars.raycaster.intersectObjects(Scene.vars.Moroder.children, true)){
				 intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.Moroder.children, true);
			}

			if ( Scene.vars.raycaster.intersectObjects(Scene.vars.GameOfLove.children, true)){
				 intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.GameOfLove.children, true);
			}

			if ( Scene.vars.raycaster.intersectObjects(Scene.vars.Contact.children, true)){
					 intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.Contact.children, true);
			}
			console.log(intersects);


			Scene.vars.turn = null;
			let which = null;
			if (intersects.length > 0) {
				Scene.vars.turn = true;
				Scene.vars.Which = intersects[0].object;
				Scene.vars.animSpeed = 0.05;
			} else {
				Scene.vars.turn = false;
				Scene.vars.Which = null;
				Scene.vars.animSpeed = -0.05;
			}



			// let mouse = new THREE.Vector3(Scene.vars.mouse.x, Scene.vars.mouse.y, 0);
			// mouse.unproject(Scene.vars.camera);

			// let ray = new THREE.Raycaster(Scene.vars.camera.position, mouse.sub(Scene.vars.camera.position).normalize()); 
			// let intersects = ray.intersectObjects(Scene.vars.goldGroup.children, true);
			// if(intersects.length > 0) {
			// 	var arrow = new THREE.ArrowHelper(ray.ray.direction, ray.ray.origin, 1000, 0xFF00000);
			// 	Scene.vars.scene.add(arrow);
			// }
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

		if (vars.turn && vars.Which != null ) {
			vars.Which.rotation.x = Math.PI / percent;
		}



		if (vars.animPercent >= 0.40) {
			let percent = (vars.animPercent - 0.4) / 0.6;
			vars.statuette.position.y = 50 * percent;



		} else if (vars.animPercent < 0.70) {
			vars.statuette.position.y = 0;
		}


	},
	loadFBX: (file, scale, position, rotation, color, namespace, callback) => {
		let vars = Scene.vars;
		let loader = new FBXLoader();

		if (file === undefined) {
			return;
		}

		loader.load('./fbx/' + file, (object) => {

			object.traverse((child) => {
				if (child.isMesh) {

					child.castShadow = true;
					child.receiveShadow = true;

					if (namespace === "plaquette") {
						child.material = new THREE.MeshBasicMaterial({
							map: Scene.vars.texture
						});
					}

					if (namespace === "statuette") {
						child.material = new THREE.MeshStandardMaterial({
							color: new THREE.Color(color),
							roughness: .3,
							metalness: .6
						})
					}

					child.material.color = new THREE.Color(color);
				}
			});

			object.position.x = position[0];
			object.position.y = position[1];
			object.position.z = position[2];

			object.rotation.x = rotation[0];
			object.rotation.y = rotation[1];
			object.rotation.z = rotation[2];

			object.scale.x = object.scale.y = object.scale.z = scale;
			Scene.vars[namespace] = object;

			callback();
		});

	},
	loadText: (text, scale, position, rotation, color, namespace, callback) => {
		let loader = new THREE.FontLoader();

		if (text === undefined || text === "") {
			return;
		}

		loader.load('./vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json', (font) => {
			let geometry = new THREE.TextGeometry(text, {
				font,
				size: 1,
				height: 0.1,
				curveSegments: 1,
				bevelEnabled: false
			});

			geometry.computeBoundingBox();
			let offset = geometry.boundingBox.getCenter().negate();
			geometry.translate(offset.x, offset.y, offset.z);

			let material = new THREE.MeshBasicMaterial({
				color: new THREE.Color(color)
			});

			let mesh = new THREE.Mesh(geometry, material);

			mesh.position.x = position[0];
			mesh.position.y = position[1];
			mesh.position.z = position[2];

			mesh.rotation.x = rotation[0];
			mesh.rotation.y = rotation[1];
			mesh.rotation.z = rotation[2];

			mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

			Scene.vars[namespace] = mesh;

			callback();
		});
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

		Scene.loadFBX("Logo_Feelity.FBX", 10, [20, 20, 10], [0, 0, 0], 0xFFFFFF, 'logo', () => {
			Scene.loadFBX("SM_VinylRecord.fbx", 10, [-500, 100, 0], [0, 0, Math.PI / 2], 0xFFFFFF, 'record1', () => {
				Scene.loadFBX("Statuette.FBX", 10, [0, 0, 0], [0, 0, 0], 0xFFD700, 'statuette', () => {
					Scene.loadFBX("SM_VinylRecord.fbx", 10, [0, 100, 0], [0, 0, Math.PI / 2], 0xFFFFFF, 'record2', () => {
						Scene.loadFBX("SM_VinylRecord.fbx", 10, [500, 100, 0], [0, 0, Math.PI / 2], 0xFFFFFF, 'record3', () => {
							Scene.loadFBX("Plaquette.FBX", 10, [0, 4, 45], [0, 0, 0], 0xFFFFFF, 'plaquette', () => {
								Scene.loadText(Scene.vars.text, 10, [0, 23, 52], [0, 0, 0], 0x1A1A1A, "texte", () => {

									let vars = Scene.vars;

									let gold = new THREE.Group();
									gold.add(vars.statuette);


									vars.scene.add(gold);
									vars.goldGroup = gold;



									let moroder = new THREE.Group();
									moroder.add(vars.record1);

									let contact = new THREE.Group();
									contact.add(vars.record2);

									let gameoflove = new THREE.Group();
									gameoflove.add(vars.record3);



									vars.scene.add(gameoflove);
									vars.scene.add(moroder);
									vars.scene.add(contact);

									vars.Contact = contact;
									vars.Moroder = moroder;
									vars.GameOfLove = gameoflove;






									let elem = document.querySelector('#loading');
									elem.parentNode.removeChild(elem);
								});
							});
						});
					});
				});
			});
		});

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