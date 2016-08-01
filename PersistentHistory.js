import take from 'ramda/src/take'
import History from '@act/main/internals/History'
import delay from '@act/main/internals/delay'
export default class PersistentHistory extends History {
  constructor (...args) {
    super(...args)

    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiZnJvbnRlbmQiLCJtb2RlIjoidyJ9.DmjQr6Fm_n8soeW9ixTQQUAGBMsBFqJrM--3un3LoTs'
    const uri = `ws://${window.location.hostname}:3000/${jwt}`
    this.ws = new window.WebSocket(uri)
  }

  push (action) {
    console.log('pushing event: ', action)
    this.ws.send(JSON.stringify(action))
    super.push(action)
  }
}
