import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { EventEmitter } from 'events'
import Experience from "../Experience.js"

export default class Resources extends EventEmitter {
  constructor(assets) {
    super()
    this.experience = new Experience()
    this.renderer = this.experience.renderer

    this.assets = assets

    this.items = {}
    //console.log(this.assets)
    this.queue = this.assets.length
    this.loaded = 0
    this.mixer;

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.dracoLoader = new DRACOLoader()
    this.loaders.dracoLoader.setDecoderPath("/draco/")
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }
  
  startLoading() {
    
    for(const asset of this.assets) {
      if (asset.type === 'glbModel') {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          console.log(file)
          this.singleAssetLoaded(asset, file)
          //scene.add( file.scene );
          console.log(file)
  
          this.mixer = new THREE.AnimationMixer( file.scene );
          
          file.animations.forEach( ( clip ) => {
            
              this.mixer.clipAction( clip ).play();
            
          } );
          //console.log(file.scene)
        })
      } else if (asset.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(asset.path, (file => {
          this.singleAssetLoaded(asset, file)
        }))
      }
    }
  }

  singleAssetLoaded(asset, file) {
    this.items[asset.name] = file
    this.loaded++

    if (this.loaded === this.queue) {
      this.emit('ready')
    }
  }

  update() {
    //var delta = clock.getDelta();
  
   this.mixer.update( 0.05 );

  }
}
