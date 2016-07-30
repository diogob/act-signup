import main from '@act/main'
import naiveSerialize from '@act/main/processes/naiveSerialize'
import { post } from '../act/packages/main/signals/sources/xhr'
import PersistentHistory from './PersistentHistory'

const login = (payload, history) => {
  history.push({ type: 'loading' })

  post('http://localhost:3000/rpc/login', payload)(
    ({ items }) => history.push({ type: 'success', payload: items }),
    (msg) => history.push({ type: 'loginFailed', payload: msg })
  )
}

const signup = (payload, history) => {
  history.push({ type: 'loading' })

  post('http://localhost:3000/users', payload)(
    ({ items }) => history.push({ type: 'success', payload: items }),
    (msg) => history.push({ type: 'signupFailed', payload: msg })
  )
}

const form = (fn, action) => (
  ['form', {submit: [fn, naiveSerialize]}, [
    ['article.card', [
      ['header', [
        ['h3', `User ${action}`]
      ]],
      ['footer', [
        ['label', ['Email', ['input', {name: 'email'}]]],
        ['label', ['Password', ['input', {type: 'password', name: 'pass'}]]],
        ['button', {style: {margin: '15px 0 0 0'}}, action],
        ['a', {href: '#', click: 'signup'}, 'go to signup'],
        ['a', {href: '#', click: 'login'}, 'go to login']
      ]]
    ]]
  ]]
)

const view = (model) => (
  ['div.flex.center.one.demo', [
    ['div', [
      model.action === 'login'
        ? form(login, 'login')
        : form(signup, 'signup')
    ]],
    model.loading
      ? ['div', 'Loading...']
      : [],
    model.error && ['span.label.error', model.error]
  ]]
)

const model = {
  error: '',
  loading: false,
  action: 'login'
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'login':
      return { ...state, action: 'login' }
    case 'signup':
      return { ...state, action: 'signup' }
    case 'success':
      return { ...state, error: '', loading: false }
    case 'loading':
      return { ...state, error: '', loading: true }
    case 'loginFailed':
      return { ...state, error: payload, loading: false }
    case 'signupFailed':
      return { ...state, error: payload, loading: false }
    default:
      console.log(type, ': ', payload, ' -> ', state)
      return state
  }
}

main(view, {model, reducer, historyClass: PersistentHistory})
