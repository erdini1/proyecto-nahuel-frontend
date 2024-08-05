export const translateType = (type) => {
	switch (type) {
		case 'payment':
			return 'Pago';
		case 'withdrawal':
			return 'Retiro';
		default:
			return type;
	}
};