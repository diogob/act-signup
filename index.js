import main from '@act/main'
import naiveSerialize from '@act/main/processes/naiveSerialize'
import { post } from '../act/packages/main/signals/sources/xhr'

const login = (payload, history) => {
  history.push({ type: 'loading' })

  post('http://localhost:3000/rpc/login', payload)(
    ({ items }) => history.push({ type: 'success', payload: items }),
    (msg) => history.push({ type: 'loginFailed', payload: msg })
  )
}

const view = (model) => (
  ['div.flex.center.two.demo', [
    ['div', [
      ['form', {submit: [login, naiveSerialize]}, [
        ['article.card', [
          ['header', [
            ['h3', 'User Login ']
          ]],
          ['footer', [
            ['label', ['Email', ['input', {name: 'email'}]]],
            ['label', ['Password', ['input', {type: 'password', name: 'pass'}]]],
            ['button', {style: {margin: '15px 0 0 0'}}, 'Login'],
            model.loading
              ? ['div', 'Loading...']
              : [],
            model.error && ['span.label.error', model.error]
          ]]
        ]]
      ]]
    ]]
  ]]
)

const model = {
  error: '',
  loading: false
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'success':
      return { ...state, error: '', loading: false }
    case 'loading':
      return { ...state, error: '', loading: true }
    case 'loginFailed':
      return { ...state, error: payload, loading: false }
    default:
      console.log(type, ': ', payload, ' -> ', state)
      return state
  }
}

main(view, {model, reducer})
