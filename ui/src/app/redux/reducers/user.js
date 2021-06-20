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
	LOAD_USER,
	CLEAR_USER,
	FAIL_USER,
	LOADING
} from '../actions/types'

import { removeToken } from '../../../setToken'

const initialState = {
	pantry: [],
	ingredients: [],
	recipes: [],
	planner: [],
	loading: null
}

export default function (state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case LOAD_USER:
			return {
				...state,
				pantry: payload.data,
				loading: false
			}
		case PANTRY_SUCCESS:
			return {
				...state,
				pantry: payload.data,
				loading: false
			}
		case PANTRY_FAIL:
			return {
				...state,
				loading: false
			}
		case PANTRY_UPDATE:
			return {
				...state,
				...payload,
				loading: false
			}
		case INGREDIENTS_SUCCESS:
			return {
				...state,
				ingredients: payload.data,
				loading: false
			}
		case INGREDIENTS_DELETE:
			return {
				...state,
				ingredients: state.ingredients.filter(({ id }) => id !== payload),
				loading: false
			}
		case INGREDIENTS_FAIL:
			return {
				...state,
				loading: false,
				ingredients: []
			}
		case RECIPES_SUCCESS:
			return {
				...state,
				recipes: payload.data,
				loading: false
			}
		case RECIPES_FAIL:
			return {
				...state,
				loading: false,
				recipes: []
			}
		case PLANNER_SUCCESS:
			return {
				...state,
				planner: payload.data,
				loading: false
			}
		case PLANNER_FAIL:
			return {
				...state,
				loading: false,
				planner: []
			}
		case FAIL_USER:
		case CLEAR_USER:
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')

			removeToken()
			return {
				state: initialState
			}
		case LOADING:
			return {
				...state,
				loading: true
			}
		default:
			return state
	}
}
