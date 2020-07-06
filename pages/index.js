// This is a Stateless Functional Components
// Next.js takes care of importing React for us

import Link from 'next/link';

const Home = (props) => (
	<div>
		<p> Hey!</p>
		<Link href='/sell'>
			<a>Sell</a>
		</Link>
	</div>
);

export default Home;
