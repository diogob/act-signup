import main from '@act/main'
import value from '@act/main/processes/value'
import { get, post } from '@act/main/signals/sources/xhr'
import { when, equals } from 'ramda/src/compose'

const login = (_, history) => {
  history.push({ type: 'loading' })

  post('http://localhost:3000/rpc/login', model.inputs)(
    ({ items }) => history.push({ type: 'success', payload: items }),
    (msg) => history.push({ type: 'loginFailed', payload: msg })
  )
}

const view = (model) => (
  ['main', [
    ['h1', ['User Signup ']],
    ['label', {for: 'email'}, ['Email']],
    ['input#email', {change: {email: value}}],
    ['label', {for: 'password'}, ['Password']],
    ['input#password', {change: {pass: value}}],
    ['button', {click: login}, ['Login']],
    model.loading
      ? ['div', 'Loading...']
      : [],
    model.error && ['div', {style: 'background: red padding: 10px'}, model.error]
  ]]
)

const model = {
  error: '',
  loading: false,
  inputs: {
    email: '',
    pass: ''
  }
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'success':
      return { ...state, error: '', loading: false }
    case 'loading':
      return { ...state, error: '', loading: true }
    case 'loginFailed':
      return { ...state, error: payload, loading: false }
    case 'email':
      return { ...state, inputs: { ...state.inputs, email: payload } }
    case 'pass':
      return { ...state, inputs: { ...state.inputs, pass: payload } }
    default:
      console.log(type, ': ', payload, ' -> ', state)
      return state
  }
}

main(view, {model, reducer})
