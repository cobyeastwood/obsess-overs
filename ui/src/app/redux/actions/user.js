import axios from 'axios'

import {
	PANTRY_SUCCESS,
	PANTRY_UPDATE,
	PANTRY_FAIL,
	INGREDIENTS_SUCCESS,
	INGREDIENTS_DELETE,
	INGREDIENTS_FAIL,
	PLANNER_SUCCESS,
	PLANNER_FAIL,
	RECIPES_SUCCESS,
	RECIPES_FAIL,
	CLEAR_USER,
	LOAD_USER,
	FAIL_USER,
	LOADING
} from './types'

export const clear = () => (dispatch) => {
	dispatch({ type: CLEAR_USER })
}

export const load = () => async (dispatch) => {
	try {
		const { data, status } = await axios.get('/api/v1/overs/users/pantry')

		if (status < 299) {
			dispatch({
				type: LOAD_USER,
				payload: data
			})
		}
	} catch (e) {
		dispatch({
			type: FAIL_USER,
			payload: e
		})
	}
}

export const pantryGet = () => async (dispatch) => {
	try {
		const { data, status } = await axios.get(`/api/v1/overs/users/pantry`)
		if (status < 299) {
			dispatch({
				type: PANTRY_SUCCESS,
				payload: data
			})
			dispatch({
				type: INGREDIENTS_FAIL
			})
		}
	} catch (e) {
		dispatch({
			type: PANTRY_FAIL,
			payload: e
		})
	}
}

export const pantryPost = (dataPost) => async (dispatch) => {
	try {
		const { status } = axios.post(`/api/v2/overs/pantry/update`, dataPost)

		if (status < 299) {
			dispatch({
				type: PANTRY_UPDATE
			})
		}
	} catch (e) {
		dispatch({
			type: PANTRY_FAIL,
			payload: e
		})
	}
}

export const pantryDelete = (dataDelete) => async (dispatch) => {
	try {
		const { status } = axios.delete(
			`/api/v3/overs/pantry/delete/${dataDelete.toString()}`
		)

		if (status < 299) {
			dispatch({
				type: PANTRY_UPDATE
			})
		}
	} catch (e) {
		dispatch({
			type: PANTRY_FAIL,
			payload: e
		})
	}
}

export const ingredientsGet = (value) => async (dispatch) => {
	try {
		const { data, status } = await axios.get(
			`/api/v1/overs/search/ingredients/${value.toString()}`
		)

		if (status < 299) {
			dispatch({
				type: INGREDIENTS_SUCCESS,
				payload: data
			})
		}
	} catch (e) {
		dispatch({
			type: INGREDIENTS_FAIL,
			payload: e
		})
	}
}

export const ingredientsDelete = (id) => (dispatch) => {
	dispatch({
		type: INGREDIENTS_DELETE,
		payload: id
	})
}

export const recipesGet = (value) => async (dispatch) => {
	try {
		const { data, status } = await axios.get(
			`/api/v1/overs/search/recipes/${value.toString()}`
		)

		if (status < 299) {
			dispatch({
				type: PLANNER_SUCCESS,
				payload: data
			})
		}
	} catch (e) {
		dispatch({
			type: PLANNER_FAIL,
			payload: e
		})
	}
}

let int = 15

export const browseGet = () => async (dispatch) => {
	try {
		const { data, status } = await axios.get(`/api/v1/overs/recipes/${int}`)

		if (status < 299) {
			dispatch({
				type: RECIPES_SUCCESS,
				payload: data
			})
			int += 7
		}
	} catch (e) {
		dispatch({
			type: RECIPES_FAIL,
			payload: e
		})
	}
}

export const imagePost = (imageData) => async (dispatch) => {
	try {
		const { status } = await axios.post(
			'/api/v2/upload-recipe-image',
			imageData
		)

		if (status < 299) {
			dispatch({ type: INGREDIENTS_FAIL })
			return true
		} else {
			return false
		}
	} catch (e) {}
}

export const loadingPost = () => async (dispatch) => {
	dispatch({
		type: LOADING
	})
}
