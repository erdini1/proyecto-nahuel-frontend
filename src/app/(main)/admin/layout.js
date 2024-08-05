"use client";

import Sidebar from "@/components/component/Sidebar";

function Layout({ children }) {

	return (
		<div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
			<Sidebar />
			{children}
		</div>
	)
}

export default Layout;
