export const translateType = (type) => {
	switch (type) {
		case 'cancellation':
			return 'Anulación';
		case 'return':
			return 'Devolución';
		default:
			return type;
	}
};