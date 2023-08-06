import {
	AnimationMixer
} from 'three';

export class Player {
	constructor(info) {
		this.moving = false;
		info.gltfLoader.load(
			info.modelSrc,
			glb => {
				glb.scene.traverse(child => {
					if (child.isMesh) {
						child.castShadow = true;
					}
				});
				this.modelMesh = glb.scene.children[0];
				this.modelMesh.position.x = 0
				this.modelMesh.position.z = 0
				this.modelMesh.position.y = info.scale;
				this.modelMesh.name = 'ilbuni';
				
				this.modelMesh.scale.set(info.scale, info.scale , info.scale);

				info.scene.add(this.modelMesh);
				info.meshes.push(this.modelMesh);

				this.actions = [];
		
				this.mixer = new AnimationMixer(this.modelMesh);
				this.actions[0] = this.mixer.clipAction(glb.animations[0]);
				this.actions[1] = this.mixer.clipAction(glb.animations[1]);
				this.actions[0].play();
			}
		);

	}
}