export function showCurrency( profileData ) {
	let currency = "£";
	
		profileData?.user?.currency === 'GBP' && (currency = "£");
		profileData?.user?.currency === 'EUR' && (currency = "€");
		profileData?.currency === 'GBP' && (currency = "£");
		profileData?.currency === 'EUR' && (currency = "€");
	
	return currency;

} 