import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
	// this chunk is for page numbers within the app
	// performs all queries for given page and returns data in pageProps!
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		// expose the query to the user
		pageProps.query = ctx.query;
		return { pageProps };
	}

	render() {
		const { Component, apollo, pageProps } = this.props;

		return (
			<Container>
				<ApolloProvider client={apollo}>
					<Page>
						{/* The Component tag will be the current page (home, sell, orders) */}
						<Component {...pageProps} />
					</Page>
				</ApolloProvider>
			</Container>
		);
	}
}

export default withData(MyApp);
