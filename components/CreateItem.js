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
		title: '',
		description: '',
		image: '',
		largeImage: '',
		price: ''
	};

	handleChange = async (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	uploadFile = async (e) => {
		console.log('uploading file...');
		// get the file
		const files = e.target.files;
		// use javascript's form data api to prep data
		const data = new FormData();
		data.append('file', files[0]);
		// add upload preset from Cloudinary
		data.append('upload_preset', 'sickfits');

		// connect to Cloudianry api
		const res = await fetch(
			'https://api.cloudinary.com/v1_1/eostlund/image/upload',
			{
				method: 'POST',
				body: data
			}
		);

		// parse the returned data into json
		const file = await res.json();
		console.log(file);

		// set the state
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url
		});
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
							<label htmlFor='file'>
								Image
								<input
									type='file'
									id='file'
									name='file'
									placeholder='Upload an Image'
									onChange={this.uploadFile}
									required
								/>
								{/* Image Preview */}
								{this.state.image && (
									<img width='70' src={this.state.image} alt='Upload Preview' />
								)}
							</label>

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
