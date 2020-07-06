import Link from 'next/link';

const Nav = () => (
	<div>
		<Link href='/sell'>
			<a>Sell</a>
		</Link>
		<Link href='/'>
			<a>Go Home</a>
		</Link>
	</div>
);

export default Nav;
