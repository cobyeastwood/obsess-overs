import axios from 'axios'

import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	AUTH_ERROR
} from './types'

import { clear } from '../actions/user'

// Register Users
export const register = (dataPost) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const body = JSON.stringify(dataPost)

	try {
		const { data, status } = await axios.post('/api/v4/register', body, config)
		if (status < 299) {
			dispatch(clear())
			dispatch({
				type: REGISTER_SUCCESS,
				payload: data
			})
		}
	} catch (e) {
		dispatch({
			type: REGISTER_FAIL,
			payload: e
		})
	}
}

// Refresh JWT
export const refresh = () => async (dispatch) => {
	try {
		const { data, status } = await axios.post(`/api/v4/token/refresh`, {
			refresh_token: localStorage.getItem('refresh_token')
		})
		if (status < 299) {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: data
			})
		}
	} catch (e) {
		dispatch({
			type: LOGIN_FAIL,
			payload: e
		})
	}
}

export const login = (email, password) => async (dispatch) => {
	try {
		const { data } = await axios.post('/api/v4/login', {
			user_email: email,
			user_password: password
		})
		dispatch({
			type: LOGIN_SUCCESS,
			payload: data
		})
	} catch (e) {
		dispatch({
			type: LOGIN_FAIL,
			payload: e
		})
	}
}

// Logout
export const logout = () => async (dispatch) => {
	try {
		await axios.post('/api/v4/logout')
	} catch (e) {}
	dispatch({ type: LOGOUT })
	dispatch(clear())
}
