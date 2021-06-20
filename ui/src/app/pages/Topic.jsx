import React from 'react'

import { useRouteMatch, Link, Switch, Route, useParams } from 'react-router-dom'

export const Topics = () => {
	let match = useRouteMatch()

	return (
		<div>
			<h2>Topics</h2>
			<ul>
				<li>
					<Link to={`${match.url}/account`}>Account</Link>
				</li>
			</ul>
			<Switch>
				<Route path={`${match.path}/:topicId`}>
					<Topic />
				</Route>
			</Switch>
		</div>
	)
}

function Topic() {
	let { topicId } = useParams()
	return <h3>Requested ID: {topicId}</h3>
}
