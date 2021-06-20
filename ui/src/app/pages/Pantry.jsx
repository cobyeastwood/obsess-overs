import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import Button from 'react-bootstrap/Button'
import styled from 'styled-components'

import PropTypes from 'prop-types'

import {
	pantryGet,
	pantryPost,
	pantryDelete,
	ingredientsGet,
	ingredientsDelete,
	imagePost
} from '../redux/actions/user'

import '../../styles/pantry.styles.css'

const Wrapper = styled.div`
	display: grid;
	grid-column: 2;
	grid-row: 1;
	margin: 1rem;
`

const WrapperTwo = styled.div`
	display: grid;
	grid-column: 3 / 4;
	grid-row: 1;
	width: 500px;
`

const initial = {
	ingredient: ''
}

function Pantry({
	pantry,
	ingredients,
	pantryGet,
	pantryPost,
	pantryDelete,
	ingredientsGet,
	ingredientsDelete,
	imagePost
}) {
	const [getting, setGetting] = useState(false)

	useEffect(() => {
		pantryGet()
		return () => {
			setGetting(false)
		}
	}, [getting])

	const [file, setFile] = useState({ selectedFile: null })

	const fileChangeHandler = (e) => {
		setFile(e.target.files[0])
	}

	const uploadHandler = async (e) => {
		e.preventDefault()

		const formData = new FormData()
		formData.append('myFile', file, file.name)

		const bool = await imagePost(formData)

		setFile({ selectedFile: null })

		setGetting(bool)
	}

	const [form, setForm] = useState(initial)

	const { ingredient } = form

	const onChange = (e) => {
		ingredientsGet(e.target.value.toLowerCase())
		setForm({ ...form, [e.target.name]: e.target.value.toLowerCase() })
	}

	const [alert, setAlert] = useState(false)

	const duplicateAlert = () => {
		setAlert(true)

		setTimeout(() => {
			setAlert(false)
		}, 1500)
	}

	const updatePantry = (e) => {
		e.preventDefault()

		let u_id = Date.now()

		if (pantry.some((c) => c.ingredient_name === ingredient.trim())) {
			duplicateAlert()
			setForm(initial)
			return
		}

		pantryPost({
			id: u_id,
			ingredient_name: ingredient.trim(),
			quantity: 0,
			cost: 0.0
		})

		setForm(initial)
		setGetting(true)
	}

	const updatePantrySelect = (e, processed) => {
		e.preventDefault()

		let i_id = Date.now()

		if (pantry.some((c) => c.ingredient_name === ingredient.trim())) {
			setForm(initial)
			duplicateAlert()
			return
		} else if (
			processed &&
			pantry.some((c) => c.ingredient_name === processed)
		) {
			setForm(initial)
			duplicateAlert()
			return
		}

		setForm({ ingredient: processed })

		pantryPost({
			id: i_id,
			ingredient_name: processed,
			quantity: 0,
			cost: 0.0
		})

		setForm(initial)
		setGetting(true)
	}

	const updatePantryDelete = (e, i, deleteCount = 1) => {
		e.preventDefault()

		if (i > -1) {
			pantryDelete(pantry.splice(i, deleteCount).map(({ id }) => id))
		}

		setGetting(true)
	}

	return (
		<React.Fragment>
			<Wrapper>
				<div className='m-3'>
					<div>
						<div className='wrapper'>
							<div className='upload-container'>
								<div className='border-container'>
									<label className='m-2' style={{ fontSize: '16px' }}>
										{file.name ? file.name : 'Select File'}
									</label>
									<input
										type='file'
										name='file'
										placeholder='temmm'
										className='container custom-file-input'
										onChange={fileChangeHandler}
									/>
									<button
										type='button'
										className='btn btn-secondary btn-sm rounded m-2'
										onClick={uploadHandler}
									>
										Upload
									</button>
								</div>
							</div>
						</div>
					</div>
					<form className='form-inline d-block my-2 my-lg-0' autocomplete='off'>
						<input
							className='form-control mr-sm-2'
							type='search'
							placeholder='Search...'
							aria-label='Search'
							name='ingredient'
							value={ingredient}
							onChange={onChange}
						/>
						<button
							className='btn btn-outline my-2 my-sm-0'
							onClick={updatePantry}
						>
							Add
						</button>
					</form>
					<div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
						{Array.isArray(ingredients)
							? ingredients.map(({ id, processed }, i) => (
									<span
										className='badge bg-light'
										style={{
											color: 'lightgray',
											margin: '0.25rem',
											padding: '4px',
											textAlign: 'center'
										}}
										key={i}
									>
										<span onClick={(e) => updatePantrySelect(e, processed)}>
											{processed}{' '}
										</span>
										<i
											className='far fa-times-circle'
											onClick={() => ingredientsDelete(id)}
										/>
									</span>
							  ))
							: ''}
					</div>
					{alert ? (
						<div class='alert alert-danger' role='alert'>
							Duplicate ingredient attempting to be added to Pantry
						</div>
					) : (
						''
					)}
				</div>
			</Wrapper>
			<WrapperTwo>
				<div className='m-4'>
					<h6 style={{ marginBottom: '1rem' }}>Pantry</h6>
					<div
						className='border d-flex align-content-start flex-wrap'
						style={{ minHeight: '250px' }}
					>
						{Array.isArray(pantry)
							? pantry.map(({ ingredient_name }, i) => (
									<span
										className='d-inline rounded p-2 bg-light text-gray'
										style={{
											textSize: '30px',
											borderColor: 'gray',
											color: 'gray',
											margin: '0.25rem'
										}}
										key={i}
									>
										{ingredient_name}{' '}
										<i
											className='far fa-times-circle'
											onClick={(e) => updatePantryDelete(e, i)}
										/>
									</span>
							  ))
							: ''}
					</div>
					<Button
						style={{ marginTop: '1rem' }}
						onClick={(e) => updatePantryDelete(e, 0, pantry.length)}
					>
						Clear
					</Button>
				</div>
			</WrapperTwo>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	id: state.auth.id,
	pantry: state.user.pantry,
	ingredients: state.user.ingredients
})

Pantry.propTypes = {
	pantryGet: PropTypes.func.isRequired,
	pantryPost: PropTypes.func.isRequired,
	pantryDelete: PropTypes.func.isRequired,
	ingredientsGet: PropTypes.func.isRequired,
	ingredientsDelete: PropTypes.func.isRequired,
	imagePost: PropTypes.func.isRequired,
	pantry: PropTypes.array,
	ingredients: PropTypes.array
}

export default connect(mapStateToProps, {
	pantryGet,
	pantryPost,
	pantryDelete,
	ingredientsGet,
	ingredientsDelete,
	imagePost
})(Pantry)
