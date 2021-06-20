import React, { useEffect, useState } from 'react'

import ReactStars from 'react-stars'

import styled from 'styled-components'

import { connect } from 'react-redux'

import { useLocation } from 'react-router-dom'

const axios = require('axios').default

const axiosGet = async (set, url) => {
	try {
		const { data, status = {} } = await axios.get(url)

		if (data && data.status === 200 && Array.isArray(data)) {
			set([data])
		} else if (data && data.status === 200) {
			set(data)
		}
	} catch (e) {}
}

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
`

function useQuery() {
	return new URLSearchParams(useLocation().search)
}

const Recipes = ({ recipes, planner }) => {
	const [ratingData, setRatingData] = useState([])

	let query = useQuery()

	const [recipe] = recipes
		.concat(planner)
		.filter((c) => c.id === query.get('id'))

	const {
		id,
		contributor_id,
		description,
		ingredients,
		minutes,
		name,
		nutrition,
		steps,
		submitted,
		tags
	} = recipe

	useEffect(() => {
		axiosGet(setRatingData, `/api/v1/overs/ratings/${id}`)
	}, [])

	return (
		<React.Fragment>
			<Wrapper>
				<Container>
					{ratingData.length !== 0 ? (
						<React.Fragment>
							<h1>{name}</h1>
							<div className='m-1'>
								<h6>contributor id</h6>
								<p>{contributor_id}</p>
								<h6>description</h6>
								<p>{description}</p>
								<h6>ingredients</h6>
								<p>{ingredients}</p>
								<h6>minutes</h6>
								<p>{minutes}</p>
								<h6>nutrition</h6>
								<p>{nutrition}</p>
								<h6>steps</h6>
								<p>{steps}</p>
								<h6>submitted</h6>
								<p>{submitted}</p>
								<h6>tags</h6>
								<p>{tags}</p>
							</div>
							<ReactStars
								count={5}
								value={parseFloat(ratingData.data[0].avg).toFixed(2)}
								size={28}
								color2={'#000000'}
								edit={false}
								half={true}
							/>
						</React.Fragment>
					) : (
						<div
							className='justify-content-center'
							style={{ marginRight: '4rem', textAlign: 'center' }}
						>
							<div className='spinner-border' role='status'>
								<span className='sr-only'>Loading...</span>
							</div>
						</div>
					)}
					<br />
				</Container>
			</Wrapper>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	recipes: state.user.recipes,
	planner: state.user.planner
})

export default connect(mapStateToProps, {})(Recipes)

// Image Upload
// https://academind.com/learn/react/snippets/image-upload/
