import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"
import { EventEmitter } from 'events'
import Experience from "../Experience.js"
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import GSAP from 'gsap'
var mixer;
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
    this.action;
    this.file;
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
          mixer = new THREE.AnimationMixer( file.scene );
          this.action = mixer.clipAction( file.animations[0]) 
          this.bidgetAction = mixer.clipAction( file.animations[1])         
          this.action.play();  
          this.bidgetAction.play();       
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
    //var delta = this.clock.getDelta();
    //this.mixer.update(0.01);
  
    if ( mixer )
    { 
      //this.createAnimation(this.mixer, this.action, file.animations[0]);  
    //   let proxy = {

    //     get time() {

    //        console.log(mixer)
    //         return 1.25;

    //     },

    //     set time(value) {

    //         this.action.paused = false;
    //         //this.mixer.update( 0.05 );

    //         this.mixer.setTime(value);

    //         this.action.paused = true;

    //         //this.mixer.update(0.05)

    //     }

    // };

    let scrollingTL = new GSAP.timeline({
        
        scrollTrigger: {
            trigger: ".second-move",
            endTrigger: '.third-move',
            start: "top top",
            end: "bottom bottom",
            onUpdate: function () {
              mixer.update(0.00001) 
            }

        }

    }) .to(document.getElementById(".second"), {
      onUpdate: () => {
      }
    }, 'same')

        // .to(proxy, {

        //     time: 1.25,
            

        // })


        let scrollingNon = new GSAP.timeline({
        
          scrollTrigger: {
  
              trigger: ".first-move",
              //endTrigger: '.second-move',
  
              start: "top top",
  
              end: "bottom bottom",
  
              //pin: true,
  
              //scrub: true,
              //invalidateOnRefresh: true,
              onUpdate: function () {
                // console.log("hello");
                //this.action.play();
                //mixer.update(0.00001)
  
                
                
              }
  
          }
  
      }) .to(document.getElementById(".first"), {
        onUpdate: () => {
          //this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
          //this.camera.perspectiveCamera.updateProjectionMatrix()
        }
      }, 'same')
   
      
    };

  }
}
