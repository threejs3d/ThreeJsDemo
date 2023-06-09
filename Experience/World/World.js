import * as THREE from 'three'
import Experience from "../Experience.js"

import { EventEmitter } from 'events'

import Environment from './Environment.js'
import Bike from './Bike.js'
// import Controls from '../Controls.js'


export default class World extends EventEmitter {
  constructor() {
    super()
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.camera = this.experience.camera
    this.resources = this.experience.resources

    this.resources.on('ready', () => {
      this.environment = new Environment()
      this.bike = new Bike()
      // this.controls = new Controls()
      this.emit('worldready')
    })
  }

  switchTheme(theme) {
    if(this.environment) {
      this.environment.switchTheme(theme)
    }
    if(this.bike) {
      this.bike.switchTheme(theme)
    }
    if(this.floor) {
      this.floor.switchTheme(theme)
    }
  }

  resize() {

  }

  update() {
    if(this.bike) {
      this.bike.update()
    }

    if(this.controls) {
      this.controls.update()
    }
  }
}
