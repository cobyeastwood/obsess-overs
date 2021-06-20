import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const PrivateRoute = ({
	component: Component,
	auth: { isAuthenticated, Loading },
	...rest
}) => (
	<Route
		{...rest}
		render={(props) =>
			!isAuthenticated && !Loading ? (
				<Redirect to='/login' />
			) : (
				<Component {...props} />
			)
		}
	/>
)

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired
}

const MapStateToProps = (state) => ({
	auth: state.auth
})

export default connect(MapStateToProps)(PrivateRoute)
