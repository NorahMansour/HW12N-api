export function paymentController(payments: any[], newPayment: any) {
	const paymentIndex = payments.findIndex((el) => el.id === newPayment.id);
	if (paymentIndex === -1) {
		payments.push(newPayment);
	} else {
		payments[paymentIndex] = {
			...payments[paymentIndex],
			...newPayment,
		};
	}
	return payments;

    
}