import * as THREE from 'three'
import GSAP from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger.js'
import ASScroll from '@ashthornton/asscroll'
import Experience from './Experience.js'

export default class Controls {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.sizes = this.experience.sizes
    this.time = this.experience.time
    this.camera = this.experience.camera
    this.actualBike = this.experience.world.bike.actualBike
    this.bikeChildren = this.experience.world.bike.bikeChildren
    this.zoom = {
      zoomValue: this.camera.perspectiveCamera.zoom
    }

    GSAP.registerPlugin(ScrollTrigger)

    document.querySelector('.page').style.overflow = 'visible'

    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      console.log('desktop')
      this.setSmoothScroll()
    }
    this.setScrollTrigger()
  }


  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      // ease: 0.5,
      disableRaf: true
    })


    GSAP.ticker.add(asscroll.update)

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement })


    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value
          return
        }
        return asscroll.currentPos
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      fixedMarkers: true })


    asscroll.on('update', ScrollTrigger.update)
    ScrollTrigger.addEventListener('refresh', asscroll.resize)

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll('.gsap-marker-start, .gsap-marker-end, [asscroll]')
      })
    })
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll()
  }

  reset() {
    this.actualBike.scale.set(1.15, 1.15, 1.15)
    //this.actualBike.position.set(0, 0, 0)
    //this.actualBike.rotation.y = 0
    //this.camera.perspectiveCamera.position.x = 0
   // this.camera.perspectiveCamera.position.y = 6
   // this.camera.perspectiveCamera.position.z = 4
    this.camera.perspectiveCamera.zoom = 1
    this.zoom.zoomValue = 1
  }

  resetMobile() {
    this.actualBike.scale.set(3.5, 3.5, 3.5)
    this.actualBike.rotation.set(0, -Math.PI/2 , 0)
    this.actualBike.position.set(0, 0, 0)
    this.camera.perspectiveCamera.position.x = 0
    this.camera.perspectiveCamera.position.y = 0.4
    this.camera.perspectiveCamera.position.z = 4
    this.camera.perspectiveCamera.zoom = 1
    this.zoom.zoomValue = 1
  }

  setScrollTrigger() {
    console.log(this.actualBike);
    ScrollTrigger.matchMedia({
      // Desktop
     
      '(min-width: 969px)': () => {

        // Resets
        this.reset()

        // First Section
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: function () {
              $("#demo").addClass("active");
              $("#demo").siblings().removeClass('active');

            }
          }
        })
        .fromTo(this.actualBike.rotation, {
          y: 0
        },
        {
          //x: -0.6038839212,
          y: -2.5,
          //z: 0.5419247327,
        }, 'same')
        .fromTo(this.camera.perspectiveCamera.position, {
          x: -1.289,
          y: 0.54,
          z: 0.005
        },
        {
          x: -5,
          y: 1,
          z: -0.8
        }, 'same')
        .fromTo(this.camera.perspectiveCamera.rotation, {
          x: -1.559800753,
          y: -1.527330262,
          z: -1.55962622
        },
        {
          x: -1.559800753,
          y: -1.427330262,
          z: -1.55962622
          
        }, 'same')
        .to(this.zoom, {
          zoomValue: 2.5,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          }
        }, 'same')

        // Second Section
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: function () {
              $("#demo1").addClass("active");
              $("#demo1").siblings().removeClass('active');
              }
          },
        })
        .to(this.actualBike.rotation, {
          y: -0.01,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -5,
          y:1,
          z: 0.98,
        }, 'same')
        // .to(this.camera.perspectiveCamera.rotation, {
        //   x: -0.5614724204,
        //   y: 0.837758041,
        //   z: 0.4373795105,
        // }, 'same')
        .to(this.zoom, {
          zoomValue: 2.2,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue;
            this.camera.perspectiveCamera.updateProjectionMatrix();
          },
        }, 'same')

        // Third Section
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: function () {
              $("#demo2").addClass("active");
              $("#demo2").siblings().removeClass('active');
              
              }
          },
        })
        .to(this.actualBike.rotation, {
          y: -Math.PI/2,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -10,
          y: 2.0,
          z: 0.001
        }, 'same')
        // .to(this.camera.perspectiveCamera.rotation, {
        //   x: -0.7881906902,
        //   y:  -0.0125663706,
        //   z: -0.0125663706,
        // }, 'same')
        .to(this.zoom, {
          zoomValue: 6.5,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          },
        }, 'same')

        // Fourth Section
        this.fourthMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
              trigger: '.fourth-move',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: function () {
                $("#demo3").addClass("active");
                $("#demo3").siblings().removeClass('active');
                }
          }
        })
        .to(this.actualBike.rotation, {
          y: -3.1,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -10,
          y: 1.6,
          z: 0.01,
        }, 'same')
        // .to(this.camera.perspectiveCamera.rotation, {
        //   x: -0.02845135092188762,
        //   y: 0.29416856071633857,
        //   z: 0.008251344278639
        // }, 'same')
        .to(this.zoom, {
          zoomValue: 4.3,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          },
        }, 'same')

        // Five Section
        this.fifehMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
              trigger: '.fifth-move',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: function () {
                $("#demo3").addClass("active");
                $("#demo3").siblings().removeClass('active');
                // $(".experience-canvas").hide();
              
                }
          }
        })
        .to('.experience-canvas', { opacity: 1, duration: 0.5 })
        .to('.experience-canvas', { opacity: 0, duration: 0.5 }
            )
        .to(this.actualBike.rotation, {
          y: -3.1,
        }, 'same')
        .to(this.camera.perspectiveCamera.position, {
          x: -10,
          y: 1.6,
          z: 0.01,
        }, 'same')
        .to(this.zoom, {
          zoomValue: 4.3,
          onUpdate: () => {
            this.camera.perspectiveCamera.zoom = this.zoom.zoomValue
            this.camera.perspectiveCamera.updateProjectionMatrix()
          },
        }, 'same')



         // six Section
        
              
        
        // gsap.registerPlugin(ScrollTrigger);

      

        function setScrollText(){
        
          GSAP.to('#heading1', {
            scrollTrigger: {
              trigger: '#heading1',
              toggleActions: 'play reverse play reverse',
              start: '+=500s',
              end: '+=1000s',
            },
            opacity: 1,
          });
        
          GSAP.to('#heading2', {
            scrollTrigger: {
              trigger: '#heading2',
              toggleActions: 'play reverse play reverse',
              start: '+=2000s',
              end: '+=1000s',
            },
            opacity: 1,
          });
        
          GSAP.to('#heading3', {
            scrollTrigger: {
              trigger: '#heading3',
              toggleActions: 'play reverse play reverse',
              start: '+=3000s',
              end: '+=1000s',
            },
            opacity: 1,
          });
        
        }
        
        function setScrollImages() {
        
          GSAP.to('#img1', {
            scrollTrigger: {
              trigger: '#img1',
              toggleActions: 'play reverse play reverse',
              start: '0s',
              end: '+=6000s',
         
            },
             duration: 0.2,
           opacity: 1, 
           
          })
        
        
        }
        
        GSAP.to('.head', {
          scrollTrigger: {
            pin: '.head',
            end: '+=6000s',
            pinSpacing: true,
          },
        });
        
        setScrollImages();
        setScrollText();
        
      },

      // all
      'all': () => {
        this.sections = document.querySelectorAll('.section')
        this.sections.forEach(section => {
          this.progressWrapper = section.querySelector('.progress-wrapper')
          this.progressBar = section.querySelector('.progress-bar')

          if(section.classList.contains('right')) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6
              }
            })
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6
              }
            })
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6
              }
            })
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6
              }
            })
          }

          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.4,
              pin: this.progressWrapper,
              pinSpacing: false
            }
          })
        })
      }

    });
  }

  

  resize() {}

  update() {}
}
