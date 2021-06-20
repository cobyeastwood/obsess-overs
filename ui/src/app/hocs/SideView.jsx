import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { logout } from '../redux/actions/auth'

import Sidebar from '../components/Sidebar'

const Container = styled.div`
	display: grid;
	grid-row: 1;
	grid-column: 2;
	grid-template-columns: repeat(2, auto);
	margin-top: 5rem;
	background-color: transparent;
`

export function SideView(WrappedComponent) {
	return class extends React.Component {
		constructor(props) {
			super(props)

			this.state = { bool: false }
			this.handleClick = this.handleClick.bind(this)
		}

		handleClick() {
			this.setState((state) => ({
				bool: !state.bool
			}))
		}

		onClick = (e) => {
			e.preventDefault()
			this.props.logout()
		}

		render() {
			return (
				<React.Fragment>
					<nav className='navbar navbar-light bg-light justify-content-between'>
						<span>
							<Button
								variant='light'
								size='sm'
								onClick={this.handleClick}
								style={{ marginLeft: '1rem', marginRight: '1rem' }}
							>
								<i
									style={{ fontSize: '16px' }}
									className={
										this.state.bool === false
											? 'fas fa-angle-down'
											: 'fas fa-angle-up'
									}
								/>
							</Button>
							<Link to='/' className='navbar-brand'>
								Obsess Overs
							</Link>
						</span>
						<form className='form-inline'>
							<input
								className='form-control mr-sm-2'
								type='search'
								placeholder='Search'
								aria-label='Search'
							/>
							<button
								className='btn btn-outline-success m-2 my-2 my-sm-0'
								type='submit'
							>
								Search
							</button>

							{this.props.isAuthenticated ? (
								<button
									className='btn btn-outline-info m-2 my-2 my-sm-0'
									onClick={this.onClick.bind(this)}
								>
									Logout{' '}
								</button>
							) : (
								<Link to='/login'>
									<button className='btn btn-outline-info m-2 my-2 my-sm-0'>
										Login
									</button>
								</Link>
							)}
						</form>
					</nav>
					<Container>
						<Sidebar bool={this.state.bool} />
						<WrappedComponent />
					</Container>
				</React.Fragment>
			)
		}
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
})

SideView.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
}

const composeWrapper = compose(connect(mapStateToProps, { logout }), SideView)

export default composeWrapper
