import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT
} from '../actions/types'

import { setToken, removeToken } from '../../../setToken'

const initialState = {
	access_token: null,
	refresh_token: null,
	isAuthenticated: null,
	loading: true,
	user: null
}

export default function (state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			// Set JWT in Local Storage
			localStorage.setItem('access_token', payload.access_token)
			localStorage.setItem('refresh_token', payload.refresh_token)

			// Set Axios Headers
			setToken(payload.access_token)

			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			}
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case AUTH_ERROR:
		case LOGOUT:
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')

			removeToken()
			return {
				...state,
				access_token: null,
				refresh_token: null,
				isAuthenticated: false,
				loading: false,
				user: null
			}
		default:
			return state
	}
}
