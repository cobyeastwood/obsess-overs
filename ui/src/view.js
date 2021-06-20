import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import store from './store'
import Footer from './app/components/Footer'
import About from './app/pages/About'
import Login from './app/pages/Login'
import Register from './app/pages/Register'

import Browse from './app/pages/Browse'
import Recipes from './app/pages/Recipes'
import Planner from './app/pages/Planner'
import Pantry from './app/pages/Pantry'

import SideView from './app/hocs/SideView'
import PrivateRoute from './app/routing/PrivateRoute'
import { refresh, logout } from './app/redux/actions/auth'

const View = () => {
	useEffect(() => {
		if (localStorage.access_token && localStorage.refresh_token) {
			store.dispatch(refresh())
		} else {
			store.dispatch(logout())
		}
	}, [])

	return (
		<Router>
			<Switch>
				<Route exact path='/' component={SideView(About)} />
				<Route exact path='/login' component={SideView(Login)} />
				<Route exact path='/register' component={SideView(Register)} />
				<PrivateRoute exact path='/browse' component={SideView(Browse)} />
				<PrivateRoute exact path='/pantry' component={SideView(Pantry)} />
				<PrivateRoute exact path='/planner' component={SideView(Planner)} />
				<PrivateRoute exact path='/recipes' component={SideView(Recipes)} />
			</Switch>
			<Footer />
		</Router>
	)
}

export default View
