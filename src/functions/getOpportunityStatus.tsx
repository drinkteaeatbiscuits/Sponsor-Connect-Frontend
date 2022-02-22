const getOpportunityStatus = (opportunityStatus, date) => {

	// console.log(date)
	

	let calculatedOpportunityStatus = "Active";

	opportunityStatus === "Draft" && new Date() < new Date(date) && ( calculatedOpportunityStatus = "Draft" ) 
                    
	{/* { opportunityStatus === "Active" && new Date() > new Date(date) && "Active" } */}

	 opportunityStatus === "Active" && new Date() < new Date(date) && (calculatedOpportunityStatus = "Active") 
	
	!date && opportunityStatus === "Active" && (calculatedOpportunityStatus = "Active") 
	
	 new Date() > new Date(date) && ( calculatedOpportunityStatus = "Expired" ) 

	 !opportunityStatus && !date && (calculatedOpportunityStatus = "Draft") 
	
	 opportunityStatus === "Draft" && !date && (calculatedOpportunityStatus = "Draft") 

	 !opportunityStatus && new Date() < new Date(date) && ( calculatedOpportunityStatus = "Draft" ) 



	return calculatedOpportunityStatus;

}

export default getOpportunityStatus;