const axios = require('axios').default

const setToken = (token) => {
	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
	} else {
		delete axios.defaults.headers.common['Authorization']
	}
}

const removeToken = () => {
	delete axios.defaults.headers.common['Authorization']
}

export { setToken, removeToken }
