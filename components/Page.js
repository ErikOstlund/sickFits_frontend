import React, { Component } from 'react';
import Meta from './Meta';
import Header from './Header';

class Page extends Component {
	render() {
		return (
			<div>
				<Meta />
				<Header />

				{/* What does this do? */}
				{this.props.children}
			</div>
		);
	}
}

export default Page;
