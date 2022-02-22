import React, { useEffect, useState } from "react";
import { AuthContext } from "../../App";
import getOpportunityStatus from "../../functions/getOpportunityStatus";
import useOpportunities from "../../hooks/useOpportunities";

interface props {
}

const OpportunitiesStatusCounts: React.FC<props> = (props) => {

	const { state: authState } = React.useContext(AuthContext);
	const {isLoading, data: opportunities, error} = useOpportunities( authState?.user?.profile );

	const getOpportunityStatuses = () => {

		let active = 0;
		let drafts = 0;
		let expired = 0;
		let successful = 0;

		opportunities?.forEach((opportunity) => {
			if(getOpportunityStatus(opportunity?.opportunityStatus, opportunity?.expiryDate?.date).toLowerCase() === 'active'){
				active++;
			}
			if(getOpportunityStatus(opportunity?.opportunityStatus, opportunity?.expiryDate?.date).toLowerCase() === 'draft'){
				drafts++;
			}
			if(getOpportunityStatus(opportunity?.opportunityStatus, opportunity?.expiryDate?.date).toLowerCase() === 'expired'){
				expired++;
			}
			if(getOpportunityStatus(opportunity?.opportunityStatus, opportunity?.expiryDate?.date).toLowerCase() === 'successful'){
				successful++;
			}
		})

		return { active: active, drafts: drafts, expired: expired, successful: successful }
		// const opportunityStatus = getOpportunityStatus(opportunityData?.opportunityStatus, opportunityData?.expiryDate?.date).toLowerCase();
	}

	const opportunitiesStatusCounts = getOpportunityStatuses();
	
	return  <div className="opportunity-counts">

	{opportunitiesStatusCounts?.active > 0 && <div className="active">
	  <h2>{opportunitiesStatusCounts?.active.toString().padStart(2, '0')}</h2>
	  <p>Active</p>
	</div>
	}
	{opportunitiesStatusCounts?.drafts > 0 && <div className="drafts">
	  <h2>{opportunitiesStatusCounts?.drafts.toString().padStart(2, '0')}</h2>
	  <p>Drafts</p>
	</div>
	}

	{opportunitiesStatusCounts?.expired > 0 && <div className="expired">
	  <h2>{opportunitiesStatusCounts?.expired.toString().padStart(2, '0')}</h2>
	  <p>Expired</p>
	</div>
	}

	{opportunitiesStatusCounts?.successful > 0 && <div className="successful">
	  <h2>{opportunitiesStatusCounts?.successful.toString().padStart(2, '0')}</h2>
	  <p>Successful</p>
	</div>
	}


  </div>
}

export default OpportunitiesStatusCounts;