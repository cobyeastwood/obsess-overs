import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import { Provider } from 'react-redux'
import store from './store'

import View from './view'

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<View />
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
)
