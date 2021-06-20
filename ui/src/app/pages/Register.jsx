import React, { useState } from 'react'
import styled from 'styled-components'

import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import { register } from '../redux/actions/auth'

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
	first_name: '',
	last_name: '',
	email: '',
	password: '',
	address_one: '',
	address_two: '',
	city: '',
	zip_code: ''
}

const Register = ({ register, isAuthenticated }) => {
	const [state, setState] = useState(initial)

	const onChange = (e) =>
		setState({ ...state, [e.target.name]: e.target.value })

	const onSubmit = (e) => {
		e.preventDefault()
		register(state)
		setState({ initial })
	}

	if (isAuthenticated) {
		return <Redirect to='/planner' />
	}

	return (
		<React.Fragment>
			<Wrapper>
				<Container>
					<form>
						<div className='form-group'>
							<h3>Register</h3>
							<br />
							<label for='inputAddress'>First Name</label>
							<input
								type='text'
								name='first_name'
								value={state.first_name}
								onChange={onChange}
								className='form-control'
								id='inputAddress'
								placeholder='First Name'
							/>
						</div>
						<div className='form-group'>
							<label for='inputAddress2'>Last Name</label>
							<input
								type='text'
								name='last_name'
								value={state.last_name}
								onChange={onChange}
								className='form-control'
								id='inputAddress2'
								placeholder='Last Name'
							/>
						</div>
						<div className='form-row'>
							<div className='form-group col-md-6'>
								<label for='inputEmail4'>Email</label>
								<input
									type='email'
									name='email'
									value={state.email}
									onChange={onChange}
									className='form-control'
									id='inputEmail4'
								/>
							</div>
							<div className='form-group col-md-6'>
								<label for='inputPassword4'>Password</label>
								<input
									type='password'
									name='password'
									value={state.password}
									onChange={onChange}
									className='form-control'
									id='inputPassword4'
								/>
							</div>
						</div>
						<div className='form-group'>
							<label for='inputAddress'>Address</label>
							<input
								type='text'
								name='address_one'
								value={state.address_one}
								onChange={onChange}
								className='form-control'
								id='inputAddress'
								placeholder='1234 Main St'
							/>
						</div>
						<div className='form-group'>
							<label for='inputAddress2'>Address 2</label>
							<input
								type='text'
								name='address_two'
								value={state.address_two}
								onChange={onChange}
								className='form-control'
								id='inputAddress2'
								placeholder='Apartment, studio, or floor'
							/>
						</div>
						<div className='form-row'>
							<div className='form-group col-md-6'>
								<label for='inputCity'>City</label>
								<input
									type='text'
									name='city'
									value={state.city}
									onChange={onChange}
									className='form-control'
									id='inputCity'
								/>
							</div>
							<div className='form-group col-md-4'>
								<label for='inputState'>State</label>
								<select id='inputState' className='form-control'>
									<option selected>Select..</option>
									<option value='AL'>Alabama</option>
									<option value='AK'>Alaska</option>
									<option value='AZ'>Arizona</option>
									<option value='AR'>Arkansas</option>
									<option value='CA'>California</option>
									<option value='CO'>Colorado</option>
									<option value='CT'>Connecticut</option>
									<option value='DE'>Delaware</option>
									<option value='DC'>District Of Columbia</option>
									<option value='FL'>Florida</option>
									<option value='GA'>Georgia</option>
									<option value='HI'>Hawaii</option>
									<option value='ID'>Idaho</option>
									<option value='IL'>Illinois</option>
									<option value='IN'>Indiana</option>
									<option value='IA'>Iowa</option>
									<option value='KS'>Kansas</option>
									<option value='KY'>Kentucky</option>
									<option value='LA'>Louisiana</option>
									<option value='ME'>Maine</option>
									<option value='MD'>Maryland</option>
									<option value='MA'>Massachusetts</option>
									<option value='MI'>Michigan</option>
									<option value='MN'>Minnesota</option>
									<option value='MS'>Mississippi</option>
									<option value='MO'>Missouri</option>
									<option value='MT'>Montana</option>
									<option value='NE'>Nebraska</option>
									<option value='NV'>Nevada</option>
									<option value='NH'>New Hampshire</option>
									<option value='NJ'>New Jersey</option>
									<option value='NM'>New Mexico</option>
									<option value='NY'>New York</option>
									<option value='NC'>North Carolina</option>
									<option value='ND'>North Dakota</option>
									<option value='OH'>Ohio</option>
									<option value='OK'>Oklahoma</option>
									<option value='OR'>Oregon</option>
									<option value='PA'>Pennsylvania</option>
									<option value='RI'>Rhode Island</option>
									<option value='SC'>South Carolina</option>
									<option value='SD'>South Dakota</option>
									<option value='TN'>Tennessee</option>
									<option value='TX'>Texas</option>
									<option value='UT'>Utah</option>
									<option value='VT'>Vermont</option>
									<option value='VA'>Virginia</option>
									<option value='WA'>Washington</option>
									<option value='WV'>West Virginia</option>
									<option value='WI'>Wisconsin</option>
									<option value='WY'>Wyoming</option>
								</select>
							</div>
							<div className='form-group col-md-2'>
								<label for='inputZip'>Zip</label>
								<input
									type='text'
									name='zip_code'
									value={state.zip_code}
									onChange={onChange}
									className='form-control'
									id='inputZip'
								/>
							</div>
						</div>
						<div className='form-group'>
							<div className='form-check'>
								<input
									className='form-check-input'
									type='checkbox'
									id='gridCheck'
								/>
								<label className='form-check-label' for='gridCheck'>
									Check me out
								</label>
							</div>
						</div>
						<button
							type='submit'
							className='btn btn-primary'
							onClick={onSubmit}
						>
							Register
						</button>
					</form>
				</Container>
			</Wrapper>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated
})

Register.propTypes = {
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool
}

export default connect(mapStateToProps, { register })(Register)
