import React from 'react'
import { get, upperCase, upperFirst } from 'lodash'

import { strOnlyChars } from '../utility/string-tools'

const Modal = ({ show, ratingData, data, hideModal }) => {
	const showHideClassName = show ? 'modal display-block' : 'modal display-none'

	const nutritionArray = get(data, 'nutrition', '')
		.replace('[', '')
		.replace(']', '')
		.split(',')

	const nutritionText = [
		'Calories (#)',
		'Total Fat (PDV)',
		'Sugar (PDV)',
		'Sodium (PDV)',
		'Protein (PDV)',
		'Saturated Fat (PDV)',
		'Carbohydrates (PDV)'
	]

	const food =
		get(data, 'name', '')
			.split(' ')
			.map((e) => `${e}-`) + data.id

	return (
		<div className={showHideClassName}>
			<section className='modal-main'>
				<div className='card text-center'>
					<div className='card-header'>
						{upperCase(data.name)}
						<a
							href={`https://www.food.com/recipe/${food}`}
							style={{ float: 'right' }}
						>
							Link
						</a>
					</div>
					<div className='card-body'>
						<br />
						<h6 className='card-text'>Description:</h6>
						<p className='card-text'>
							{upperFirst(strOnlyChars(get(data, 'description', '')))}
						</p>
						<h6 className='card-text'>Steps {`(${data.n_steps})`}:</h6>
						<p className='card-text'>
							{get(data, 'steps', '')
								.split("'")
								.filter((str, i) => i % 2 === 1)
								.map((step, i) => (
									<>{`${i + 1}. ${strOnlyChars(upperFirst(step))} `}</>
								))}
						</p>
						<h6 className='card-text'>
							Ingredients {`(${data.n_ingredients})`}:
						</h6>
						<p className='card-text'>
							{get(data, 'ingredients', '')
								.trim()
								.split("'")
								.map((i) => (
									<>{`${strOnlyChars(i)} `}</>
								))}
						</p>
						<h6 className='card-text'>
							<small className='text-muted'>Details</small>
						</h6>
						<p style={{ margin: '0', padding: '0' }}>
							<small className='text-muted'>Minutes: {data.minutes}</small>
						</p>
						<p style={{ margin: '0', padding: '0' }}>
							<small className='text-muted'>
								Ratings: {get(ratingData, '[0].data[0].sum', 'NaN')}
							</small>
						</p>
						<br />
						<table className='table' style={{ margin: '0', padding: '0' }}>
							<caption style={{ textAlign: 'center' }}>Nutrition Table</caption>
						</table>
						<table className='table'>
							<thread>
								<tr>
									<th scope='col'>
										{nutritionText[0]}
										<br />
										{nutritionArray[0]}
									</th>
									<th scope='col'>
										{nutritionText[1]}
										<br />
										{nutritionArray[1]}
									</th>
									<th scope='col'>
										{nutritionText[2]}
										<br />
										{nutritionArray[2]}
									</th>
									<th scope='col'>
										{nutritionText[3]}
										<br />
										{nutritionArray[3]}
									</th>
									<th scope='col'>
										{nutritionText[4]}
										<br />
										{nutritionArray[4]}
									</th>
									<th scope='col'>
										{nutritionText[5]}
										<br />
										{nutritionArray[5]}
									</th>
									<th scope='col'>
										{nutritionText[6]}
										<br />
										{nutritionArray[6]}
									</th>
								</tr>
							</thread>
						</table>
						<button type='button' className='btn btn-link' onClick={hideModal}>
							Close
						</button>
						<button type='button' className='btn btn-link'>
							Save
						</button>
					</div>
					<div className='card-footer text-muted'>{data.submitted}</div>
				</div>
			</section>
		</div>
	)
}

export default Modal
