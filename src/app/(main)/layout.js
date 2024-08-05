import Navbar from '@/components/component/Navbar';

function Layout({ children }) {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	)
}

export default Layout;
