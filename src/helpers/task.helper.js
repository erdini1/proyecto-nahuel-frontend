export const translateTypeTask = (type) => {

	const roles = {
		general: "General",
		elaboration: "Elaboración",
	};

	switch (type) {
		case "general":
			return roles.general;
		case "elaboration":
			return roles.elaboration;
		default:
			return type;
	}
};