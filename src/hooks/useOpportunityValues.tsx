import { useQuery, useQueryClient } from 'react-query';

const useOpportunityValues = ( profileId:any ) => {

	const client = useQueryClient();
	return useQuery(
		"opportunity-value-" + profileId,
	  async() => {

		const response = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + '/opportunities?profile=' + profileId, {
		  credentials: "include",
		});

		let priceRange : any = null;
		
		const opportunities = await response.json();
  
		if(opportunities.length > 0){
		let opportunityPriceRange: any[] = [];
		
		opportunities.forEach(( opportunity:any )=>{
			
			opportunityPriceRange.push(opportunity.price);

		})

			priceRange = "£" + Math.min.apply(Math, opportunityPriceRange).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " - " + Math.max.apply(Math, opportunityPriceRange).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}else{
			
			priceRange = null;

		}
		client.setQueryData(["opportunity-value-" + profileId, profileId], priceRange);
  
		return priceRange;
	  }
	)

}

export default useOpportunityValues;