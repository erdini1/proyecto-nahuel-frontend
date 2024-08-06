"use client";

import Sidebar from "@/components/component/Sidebar";

function Layout({ children }) {
	return (
		<div className="min-h-screen w-full overflow-hidden lg:grid lg:grid-cols-[280px_1fr]">
			<Sidebar />
			<main className="flex-1">{children}</main>
		</div>
	);
}

export default Layout;


// "use client";

// import Sidebar from "@/components/component/Sidebar";

// function Layout({ children }) {

// 	return (
// 		<div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
// 			<Sidebar />
// 			{children}
// 		</div>
// 	)
// }

// export default Layout;
