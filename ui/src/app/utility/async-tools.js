const axios = require('axios').default

const authConfig = {
	headers: {
		Authorization: 'Bearer ' + localStorage.getItem('access_token')
	}
}

const axiosPost = async (url, d) => {
	try {
		await axios.post(url, d, authConfig)
	} catch (e) {}
}

const axiosDelete = async (url) => {
	try {
		await axios.delete(url, authConfig)
	} catch (e) {}
}

export { axiosPost, axiosDelete }
