// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css'
import './assets/style/index.scss'

import { Provider } from 'react-redux'
import store from '@/store/store'

import RouteComponent from './components/RouteComponent'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouteComponent></RouteComponent>
  </Provider>
)
