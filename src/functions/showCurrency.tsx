export function showCurrency( profileData ) {
	let currency = "£";
	
		profileData?.user.currency === 'GBP' && (currency = "£");
		profileData?.user.currency === 'EUR' && (currency = "€");
	
	return currency;

} 