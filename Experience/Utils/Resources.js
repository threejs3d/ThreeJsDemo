import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { EventEmitter } from 'events'
import Experience from "../Experience.js"
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import GSAP from 'gsap'

export default class Resources extends EventEmitter {
  constructor(assets) {
    super()
    this.experience = new Experience()
    this.renderer = this.experience.renderer
    this.clock = new THREE.Clock();
    this.assets = assets

    this.items = {}
    //console.log(this.assets)
    this.queue = this.assets.length
    this.loaded = 0
    this.mixer;
    GSAP.registerPlugin(ScrollTrigger)
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
          console.log(file) 
          this.mixer = new THREE.AnimationMixer( file.scene );
          this.action = this.mixer.clipAction( file.animations[0])
          this.createAnimation(this.mixer, this.action, file.animations[0]);            
          this.action.play();         
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
    var delta = this.clock.getDelta();
  
    if ( this.mixer )
    { 
      //this.createAnimation(this.mixer, this.action, file.animations[0]);     
      this.mixer.update( 0.01 )
    };

  }


  createAnimation(mixer, action, clip) {

    let proxy = {

        get time() {

            return mixer.time;

        },

        set time(value) {

            action.paused = false;
            this.mixer.update( 0.05 );

            mixer.setTime(value);

            action.paused = true;

        }

    };

    let scrollingTL = new GSAP.timeline({
        
        scrollTrigger: {

            trigger: ".third-move",

            start: "top top",

            end: "bottom bottom",

            //pin: true,

            scrub: true,
            //invalidateOnRefresh: true,
            onUpdate: function () {
              console.log("hello");
              //this.update();
            }

        }

    })

        .to(proxy, {

            time: clip.duration,
            

        })

}
}
