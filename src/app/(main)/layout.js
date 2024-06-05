"use client";
// import { redirect } from "next/navigation";
// import { useAuthContext } from "@/contexts/authContext";

function Layout({ children }) {
	//   const { isLoggedIn } = useAuthContext();

	//   if (!isLoggedIn) {
	//     redirect("/login");
	//   }

	return <div>{children}</div>;
}

export default Layout;
