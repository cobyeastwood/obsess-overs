import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Li = styled.li`
	margin-top: 0.5rem;
`

const Span = styled.span`
	margin: 0.5rem;
`

export default class Footer extends PureComponent {
	render() {
		return (
			<React.Fragment>
				<footer
					className='page-footer font-small blue pt-4'
					style={{ background: '#F5F5F5', marginTop: '5rem' }}
				>
					<div className='container-fluid text-center text-md-left'>
						<div className='row'>
							<div className='col-md-6 mt-md-0 mt-3'>
								<h5 className='text-uppercase'>Obsess Overs</h5>
								<p>
									Recipes you want to make. Cooking advice that works.
									Restaurant recommendations you trust.
								</p>
							</div>
							<hr className='clearfix w-100 d-md-none pb-3' />
							<div className='col-md-3 mb-md-0 mb-3'>
								<h6 className='text-uppercase'>More About Obsess Overs</h6>

								<ul className='list-unstyled'>
									<Li>
										<Link to='/about'>Home</Link>
									</Li>
									<Li>
										<Link to='/login'>Login</Link>
									</Li>
									<Li>
										<Link to='/register'>Register</Link>
									</Li>
								</ul>
							</div>
							<div className='col-md-3 mb-md-0 mb-3'>
								<h6 className='text-uppercase'>Contact</h6>

								<ul className='list-unstyled'>
									<Li>
										<Link to='/browse'>Browse</Link>
									</Li>
									<Li>
										<Link to='/input'>Input</Link>
									</Li>
									<Li>
										<Link to='/pantry'>Pantry</Link>
									</Li>
								</ul>
							</div>
							<hr style={{ width: '97.5%' }} />
						</div>
					</div>
					<div className='d-inline-flex p-2 justify-content-left'>
						<Span>Site Map</Span>
						<Span>More</Span>
						<Span>Feeds</Span>
						<Span>Store</Span>
					</div>
					<div className='footer-copyright text-center py-3'>
						© 2020 Obsess Overs
					</div>
				</footer>
			</React.Fragment>
		)
	}
}
