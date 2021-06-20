import React from 'react'
import styled from 'styled-components'

import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Bar = styled.ul`
	display: grid;
	grid-row: 1;
	grid-column: 1;
	margin-top: 2rem;
	width: 5rem;
	padding: 0;

	&h6 {
		border: solid 0.075rem #e3e3e3;
		border-radius: 0rem;
		color: #282c34;
		margin: 0;
		font-size: 14px;
		font-weight: 500;
		padding: 1rem;
		width: 6rem;
	}
`

class Sidebar extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<React.Fragment>
				{this.props.bool === false ? (
					<Bar>
						<ul className='list-group'>
							<Button variant='info' size='sm'>
								<Link to='/login'>Sign Up / Log In</Link>
							</Button>
							<li className='list-group-item'>
								<Link
									to='/browse'
									className='nav-link active'
									id='home-tab'
									data-toggle='tab'
									href='#home'
									role='tab'
									aria-controls='home'
									aria-selected='false'
								>
									Browse
								</Link>
							</li>
							<li className='list-group-item'>
								<Link
									to='/planner'
									className='nav-link active'
									id='home-tab'
									data-toggle='tab'
									href='#home'
									role='tab'
									aria-controls='home'
									aria-selected='true'
								>
									Builder
								</Link>
							</li>
							<li className='list-group-item'>
								<Link
									to='/pantry'
									className='nav-link active'
									id='home-tab'
									data-toggle='tab'
									href='#home'
									role='tab'
									aria-controls='home'
									aria-selected='true'
								>
									Pantry
								</Link>
							</li>
						</ul>
					</Bar>
				) : (
					''
				)}
			</React.Fragment>
		)
	}
}

export default Sidebar
