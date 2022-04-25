import getOpportunityStatus from "./getOpportunityStatus";

const getProfileOpportunityValues = (opportunities) => {

	if(!opportunities){
		return
	}
	// console.log(date)

	const onlyActiveOppotunities = opportunities.filter((opportunity) => {

		const opportunityStatus = getOpportunityStatus(opportunity.opportunityStatus, opportunity.expiryDate?.date).toLowerCase();

		if(opportunityStatus === 'active'){
			return opportunity;
		}else {
			return
		}
	
	});
	
	const min = Math.min(...onlyActiveOppotunities.map(o => o.price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const max = Math.max(...onlyActiveOppotunities.map(o => o.price), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
						

	if(onlyActiveOppotunities.length > 0 ){
		return { min: min, max: max };
	}else{
		return
	}
	

}

export default getProfileOpportunityValues;