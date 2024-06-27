export const translateRole = (role) => {

	const roles = {
		admin: "Admin",
		employee: "Empleado",
		cashier: "Cajero"
	};

	switch (role) {
		case "admin":
			return roles.admin;
		case "employee":
			return roles.employee;
		case "cashier":
			return roles.cashier;
		default:
			return role;
	}
};