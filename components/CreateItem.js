import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(
			title: $title
			description: $description
			price: $price
			image: $image
			largeImage: $largeImage
		) {
			id
		}
	}
`;

class CreateItem extends Component {
	state = {
		title: 'GI Joe',
		description: 'A real american Hero',
		image: 'joe.jpg',
		largeImage: 'joe-lg.jpg',
		price: 10000
	};

	handleChange = (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	render() {
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
				{(createItem, { loading, error }) => (
					<Form
						onSubmit={async (e) => {
							// stop form from default submit
							e.preventDefault();
							// call the mutation
							const res = await createItem();
							// route user to single item page
							console.log(res);
							Router.push({
								pathname: '/item',
								query: { id: res.data.createItem.id }
							});
						}}
					>
						<h2>Sell an Item</h2>
						<ErrorMessage error={error} />
						<fieldset disabled={loading} aria-busy={loading}>
							<label htmlFor='title'>
								Title
								<input
									type='text'
									id='title'
									name='title'
									placeholder='Title'
									value={this.state.title}
									onChange={this.handleChange}
									required
								/>
							</label>
							<label htmlFor='price'>
								Price
								<input
									type='number'
									id='price'
									name='price'
									placeholder='Price'
									value={this.state.price}
									onChange={this.handleChange}
									required
								/>
							</label>
							<label htmlFor='description'>
								Description
								<textarea
									id='description'
									name='description'
									placeholder='Add a description'
									value={this.state.description}
									onChange={this.handleChange}
									required
								/>
							</label>
							<button type='submit'>Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
