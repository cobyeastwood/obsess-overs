import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

import styled from 'styled-components'
import { login } from '../redux/actions/auth'

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

const initial = {
	user_email: '',
	_user_password: ''
}

const Login = ({ login, isAuthenticated }) => {
	const [form, setForm] = useState(initial)

	if (isAuthenticated) {
		return <Redirect to='/planner' />
	}

	const { user_email, _user_password } = form

	const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

	const onSubmit = async (e) => {
		e.preventDefault()

		login(user_email, _user_password)

		setForm(initial)
	}

	return (
		<React.Fragment>
			<Wrapper>
				<Container>
					<div className='form-group'>
						<h3>Login</h3>
						<br />
						<form>
							<div className='form-group'>
								<label for='exampleDropdownFormEmail1'>Email address</label>
								<input
									type='email'
									className='form-control'
									id='exampleDropdownFormEmail1'
									name='user_email'
									value={user_email}
									placeholder='email@example.com'
									onChange={(e) => onChange(e)}
								/>
							</div>
							<div className='form-group'>
								<label for='exampleDropdownFormPassword1'>Password</label>
								<input
									type='password'
									className='form-control'
									id='exampleDropdownFormPassword1'
									name='_user_password'
									value={_user_password}
									placeholder='Password'
									onChange={(e) => onChange(e)}
								/>
							</div>
							<div className='form-group'>
								<div className='form-check'>
									<input
										type='checkbox'
										className='form-check-input'
										id='dropdownCheck'
									/>
									<label className='form-check-label' for='dropdownCheck'>
										Remember me
									</label>
								</div>
							</div>
							<button
								type='submit'
								className='btn btn-primary'
								onClick={onSubmit}
							>
								Sign in
							</button>
						</form>
						<div className='dropdown-divider'></div>
						<Link to='/register'>New around here? Sign up</Link>
						<br />
						<Link to='/'>Forgot password?</Link>
					</div>
				</Container>
			</Wrapper>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
})

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
}

export default connect(mapStateToProps, { login })(Login)
