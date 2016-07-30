import take from 'ramda/src/take'
import History from '@act/main/internals/History'
import delay from '@act/main/internals/delay'
import splitAt from 'ramda/src/splitAt'
import map from 'ramda/src/map'

export default class PersistentHistory extends History {
  constructor (...args) {
    super(...args)

    this.timeline = []
    this.present = 0
    this.initialState = this.state
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiY2hhdCIsIm1vZGUiOiJydyJ9._w1IGqgRfLM6epJwy6wBWOZOeSILEpJozR64qVuFgpU'
    const uri = `ws://${window.location.hostname}:3000/${jwt}`
    this.ws = new window.WebSocket(uri)
  }

  push (action) {
    console.log('pushing event: ', action)
    this.ws.send(JSON.stringify(action))
    this.delta.push(action)
    return delay(() => this.concat())
  }

  reload (timeline) {
    this.timeline = timeline
    this.state = this.reduce(this.state, this.timeline)
    this.present += timeline.length
    return this.rerender()
  }

  concat () {
    this.state = this.reduce(this.state, this.delta)
    const [past, future] = splitAt(this.present, this.timeline)
    this.timeline = [...past, ...this.delta, ...future]
    this.present += this.delta.length
    this.delta = []

    map((subscription) => subscription(this), this.subscriptions)
    return this.rerender()
  }

  undo () {
    return this.go(this.present - 1)
  }

  redo () {
    return this.go(this.present + 1)
  }

  get length () {
    return this.timeline.length
  }

  get current () {
    return this.timeline[this.present - 1]
  }

  get previous () {
    return this.timeline[this.present - 2]
  }

  get next () {
    return this.timeline[this.present]
  }

  go (index) {
    index = parseInt(index)
    if (index === this.present ||
        index < 0 ||
        index > this.timeline.length) {
      return
    }

    this.state = this.reduce(this.initialState, take(this.present = index, this.timeline))
    return this.rerender()
  }
}
