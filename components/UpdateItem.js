import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			price
		}
	}
`;

const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION(
		$id: ID!
		$title: String
		$description: String
		$price: Int
	) {
		updateItem(
			id: $id
			title: $title
			description: $description
			price: $price
		) {
			id
			title
			description
			price
		}
	}
`;

class UpdateItem extends Component {
	state = {};

	handleChange = async (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	updateItem = async (e, updatedItemMutation) => {
		// stop form from default submit
		e.preventDefault();

		console.log('updating Item');
		console.log(this.state);
		const res = await updatedItemMutation({
			// id is not in state so have to create our own obj with it and current state
			variables: {
				id: this.props.id,
				...this.state
			}
		});
	};

	render() {
		return (
			<Query
				query={SINGLE_ITEM_QUERY}
				variables={{
					id: this.props.id
				}}
			>
				{({ data, loading }) => {
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No Item Found for ID: {this.props.id}</p>;
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
							{(updatedItemData, { loading, error }) => (
								<Form onSubmit={(e) => this.updateItem(e, updatedItemData)}>
									<h2>Edit Item</h2>
									<ErrorMessage error={error} />
									<fieldset disabled={loading} aria-busy={loading}>
										<label htmlFor='title'>
											Title
											<input
												type='text'
												id='title'
												name='title'
												placeholder='Title'
												defaultValue={data.item.title}
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
												defaultValue={data.item.price}
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
												defaultValue={data.item.description}
												onChange={this.handleChange}
												required
											/>
										</label>

										<button type='submit'>
											{loading ? 'Saving...' : 'Update'}
										</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
