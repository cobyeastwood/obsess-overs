import React, { useState, useEffect } from 'react'

import { upperCase } from 'lodash'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
	pantryGet,
	ingredientsGet,
	ingredientsDelete,
	recipesGet,
	browseGet
} from '../redux/actions/user'

import { tease } from '../utility/string-tools'

const Wrapper = styled.div`
	display: grid;
	grid-column: 2 / 6;
	grid-row: 1;
	justify-content: space-between;
`

const Wrapper2 = styled.div`
	display: grid;
	grid-column: 2 / 5;
	grid-row: 2;
	margin-right: 10rem;
	margin-left: 10rem;
	margin-bottom: 5rem;
	justify-content: left;
`

const Container = styled.div`
	display: block;
	margin: 1.5rem;
`

const initial = {
	ingredient: ''
}

export const Planner = ({
	pantry,
	ingredients,
	planner,
	browseGet,
	pantryGet,
	ingredientsGet,
	ingredientsDelete,
	recipesGet
}) => {
	useEffect(() => {
		browseGet()
		pantryGet()
	}, [])

	const [local, setLocal] = useState([])

	const [recipeData, setRecipeData] = useState([])

	const [form, setForm] = useState(initial)

	const { ingredient } = form

	const [found, setFound] = useState(false)

	const onChange = (e) => {
		searchGetIngredients(e, e.target.value.toLowerCase())
		setForm({ ...form, [e.target.name]: e.target.value.toLowerCase() })
	}

	const getRecipes = (e) => {
		e.preventDefault()

		let v = local.concat([form.ingredient.trim()])

		setFound(true)

		recipesGet(v)
		setLocal(v)

		setForm(initial)
	}

	const searchGetIngredients = (e, v) => {
		e.preventDefault()

		ingredientsGet(v)
	}

	const updateRecipeSelect = (e, processed) => {
		e.preventDefault()

		let v

		switch (typeof processed) {
			case 'string':
				v = local.concat([processed.trim().replace(',', '')])
				break
			default:
				return
		}

		setRecipeData([])

		setFound(true)

		recipesGet(v)
		setLocal(v)

		setForm(initial)
	}

	const deleteLocal = (e, i) => {
		e.preventDefault()

		let v = [...local]

		if (i > -1) {
			v.splice(i, 1)
			setLocal(v)
		}

		if (v.length === 0) {
			setRecipeData([])
			return
		}

		recipesGet(v)
	}

	return (
		<React.Fragment>
			<Wrapper
				style={{ marginTop: '0.5rem', marginLeft: '5rem' }}
				className='justify-content-between'
			>
				<Container>
					<div className='d-flex flex-row justify-content-between'>
						<div>
							<form
								className='form-inline d-block my-2 my-lg-0'
								autocomplete='off'
							>
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
									onClick={getRecipes}
								>
									Search
								</button>
							</form>
							<div style={{ marginTop: '2rem' }}>
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
												<span onClick={(e) => updateRecipeSelect(e, processed)}>
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
						</div>
						<span
							style={{
								marginLeft: '5rem',
								marginRight: '5rem',
								maxWidth: '350px'
							}}
						>
							<h6 style={{ maringBottom: '1rem' }}>Search From Pantry</h6>
							<div
								className='border d-flex align-content-start flex-wrap'
								style={{
									minHeight: '100px',
									minWidth: '200px'
								}}
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
												onClick={(e) => updateRecipeSelect(e, ingredient_name)}
											>
												{ingredient_name}
											</span>
									  ))
									: ''}
							</div>
						</span>
					</div>
					<div style={{ marginTop: '2rem' }}>
						{local.map((f, i) => (
							<span
								className='badge bg-primary'
								style={{ color: 'lightgray', margin: '0.25rem' }}
								key={i}
							>
								{f}{' '}
								<i
									className='far fa-times-circle'
									onClick={(e) => deleteLocal(e, i)}
								/>
							</span>
						))}
					</div>
				</Container>
			</Wrapper>
			<Wrapper2>
				<Container>
					{Array.isArray(planner)
						? planner.map(({ name, description, id }, i) => (
								<div
									className={`card order-${i}`}
									key={i}
									style={{ margin: '1rem' }}
								>
									<div className='card-body'>
										<h5 className='card-title'>{upperCase(name)}</h5>
										<br />
										<p className='card-text'>{tease(description)}</p>
										<p className='card-text'>{id}</p>
										<Link to={`/recipes?id=${id}`}>More</Link>
									</div>
								</div>
						  ))
						: Array.isArray(planner) && found
						? 'No recipes found with these ingredients...'
						: ''}
				</Container>
			</Wrapper2>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	pantry: state.user.pantry,
	ingredients: state.user.ingredients,
	planner: state.user.planner
})

Planner.propTypes = {
	pantryGet: PropTypes.func.isRequired,
	ingredientsGet: PropTypes.func.isRequired,
	ingredientsDelete: PropTypes.func.isRequired,
	recipesGet: PropTypes.func.isRequired,
	pantry: PropTypes.array,
	ingredients: PropTypes.array,
	planner: PropTypes.array
}

export default connect(mapStateToProps, {
	browseGet,
	pantryGet,
	ingredientsGet,
	ingredientsDelete,
	recipesGet
})(Planner)

// NOTE -- Dec, 12th
// DESC: Create seperate useStates for recipes, and ingredients currently merging together.
