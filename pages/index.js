// This is a Stateless Functional Component
// Next.js takes care of importing React for us
import Items from '../components/Items';

const Home = (props) => (
	<div>
		<Items page={parseFloat(props.query.page) || 1} />
	</div>
);

export default Home;
