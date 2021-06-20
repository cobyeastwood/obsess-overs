import React, { Component } from 'react'
import styled from 'styled-components'

import { Link } from 'react-router-dom'

const Wrapper = styled.div`
	display: grid;
	grid-column: 2 / 5;
	grid-row: 1;
	margin-right: 15rem;
	margin-left: 10rem;
	margin-bottom: 5rem;
`

const Container = styled.div`
	display: block;
	margin-top: 2rem;
`

export default class About extends Component {
	render() {
		return (
			<React.Fragment>
				<Wrapper>
					<Container>
						<div style={{ marginBottom: '2rem' }}>
							<h3>About</h3>
						</div>

						<span>
							Obsess Overs project was established to better organize, sort, and
							manage favorite leftover home ingredients. All recipes are free
							and for all to explore.
						</span>
						<br />
						<br />
						<Link to='/register'>Register?</Link>
					</Container>
				</Wrapper>
			</React.Fragment>
		)
	}
}
