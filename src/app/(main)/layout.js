"use client";

import Navbar from '@/components/Navbar';
import { useState } from 'react';

function Layout({ children }) {
	const [userName, setUserName] = useState('Empleado');
	return (
		<div>
			<Navbar userName={userName} />
			{children}
		</div>
	)
}

export default Layout;
