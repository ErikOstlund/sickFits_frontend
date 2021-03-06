import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Error from './ErrorMessage';
import styled from 'styled-components';

// Styled Components
const ItemDetailsStyles = styled.div`
	max-width: 1200px;
	margin: 2rem auto;
	box-shadow: ${(props) => props.theme.bs};
	display: grid;
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	min-height: 800px;
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.details {
		margin: 3rem;
		font-size: 2rem;
	}
`;

// Queries
const ITEM_DETAILS_QUERY = gql`
	query ITEM_DETAILS_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			largeImage
		}
	}
`;

class ItemDetails extends Component {
	render() {
		return (
			<Query query={ITEM_DETAILS_QUERY} variables={{ id: this.props.id }}>
				{/* child that has our payload of these 3 things */}
				{({ error, loading, data }) => {
					if (error) return <Error error={error} />;
					if (loading) return <p>Loading...</p>;
					if (!data.item) return <p>No Item Found For: {this.props.id}</p>;

					const item = data.item;

					return (
						<ItemDetailsStyles>
							{/* Next.js allows mutliple Head tags anywhere in app! */}
							<Head>
								<title>Sick Fits | {item.title}</title>
							</Head>

							<img src={item.largeImage} alt={item.title} />

							<div className='detail'>
								<h2>{item.title}</h2>
								<p>{item.description}</p>
							</div>
						</ItemDetailsStyles>
					);
				}}
			</Query>
		);
	}
}

export default ItemDetails;
