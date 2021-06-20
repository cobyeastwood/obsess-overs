import React, { useEffect, useState } from 'react'
import { upperCase } from 'lodash'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import styled from 'styled-components'
import { browseGet } from '../redux/actions/user'
import PropTypes from 'prop-types'

import { tease } from '../utility/string-tools'

import '../styles/find.styles.css'

const Wrapper = styled.div`
	grid-column: 2;
	grid-row: 1;
	margin: 1rem;
`

const Container = styled.div`
	width: 18rem;
	margin: 1rem;
	text-align: center;
`

const Browse = ({ recipes, browseGet }) => {
	function handleScroll() {
		const scrollTop =
			(document.documentElement && document.documentElement.scrollTop) ||
			document.body.scrollTop
		const scrollHeight =
			(document.documentElement && document.documentElement.scrollHeight) ||
			document.body.scrollHeight
		if (scrollTop + window.innerHeight + 50 >= scrollHeight) {
			setIsBottom(true)
		}
	}

	const [isBottom, setIsBottom] = useState(false)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		if (isBottom) {
			browseGet()
			setIsBottom(false)
		}
	}, [isBottom])

	const [state, setState] = useState({ show: false })

	const showModal = () => {
		setState({ show: true })
	}

	const hideModal = () => {
		setState({ show: false })
	}

	return (
		<React.Fragment>
			<Navbar />
			<Wrapper>
				<div
					className='d-flex justify-content-center flex-wrap'
					style={{ display: 'block' }}
				>
					{Array.isArray(recipes)
						? recipes.map(({ name, description, id }, i) => (
								<Container className={`card order-${i}`} key={i}>
									<div className='card-body'>
										<h5 className='card-title'>{upperCase(name)}</h5>
										<br />
										<p className='card-text'>{tease(description)}</p>
										<Link to={`/recipes?id=${id}`}>More</Link>
									</div>
								</Container>
						  ))
						: ''}
				</div>
			</Wrapper>
		</React.Fragment>
	)
}

const mapStateToProps = (state) => ({
	recipes: state.user.recipes
})

Browse.propTypes = {
	recipes: PropTypes.array,
	browseGet: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { browseGet })(Browse)
