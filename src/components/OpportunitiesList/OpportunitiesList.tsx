import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonList, IonRow, IonSlide, IonSlides } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import getOpportunityStatus from "../../functions/getOpportunityStatus";
import { showCurrency } from "../../functions/showCurrency";
import useOpportunities from "../../hooks/useOpportunities";
import FavouriteOpportunityButton from "../FavouriteOpportunityButton/FavouriteOpportunityButton";

import './OpportunitiesList.scss';

interface OpportunitiesListProps {
	images?: any,
	profileId: string,
	
}


const OpportunitiesList: React.FC<OpportunitiesListProps> = ( OpportunitiesListProps ) => {

	// console.log(OpportunitiesListProps);
	const history = useHistory();
	const {isLoading, data, error} = useOpportunities( OpportunitiesListProps?.profileId );
	const { state: authState, dispatch } = React.useContext(AuthContext);

	const { profileId } = OpportunitiesListProps;
	
	// console.log(data);
	return <div className="opportunities">

	
			{ data?.length > 0 && data?.sort((a,b) => (Number(a.price) > Number(b.price)) ? -1 : ((Number(b.price) > Number(a.price)) ? 1 : 0)).map(( opportunity:any )=>{

				const opportunityStatus = getOpportunityStatus(opportunity.opportunityStatus, opportunity.expiryDate?.date).toLowerCase();
				{ if( opportunityStatus != "active" && authState?.user?.profile !== parseInt(profileId) ){ return }}

				return <div className={"opportunity opportunity-status-" + getOpportunityStatus(opportunity.opportunityStatus, opportunity.expiryDate?.date).toLowerCase() }  
				style={{position: "relative"}} 
				key={opportunity.id} 
				onClick={ ()=> history.push("/opportunity/" + opportunity.id, {deletedOpportunity: false}) }>

					<div className=" opportunity-details " >

							{opportunity.price && <p className="price" style={{flexGrow: 1}}>{ showCurrency(opportunity.profile) }{opportunity.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
							
							<FavouriteOpportunityButton className="" 
							style={{
								position: "absolute",
								right: '12px',
								top: '10px',
								zIndex: 9
							}} 
							opportunityId={opportunity.id} />
					
							
							{opportunity.title && <p className="title">{opportunity.title}</p> }
					
			
							{opportunity.description && <p className="description">
							
								{opportunity.description} 

							</p> }

					</div>

				{ opportunity.images && 
         
						<div className="opportunity-image-thumb">
							<picture>
								<source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile/" +  opportunity.images?.hash + ".webp" } />
								<source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile/" +  opportunity.images?.hash + opportunity.images?.ext } />
								<img className="opportunity-image" src={  process.env.REACT_APP_S3_URL + "/images/profile/" + opportunity.images?.hash + opportunity.images?.ext } alt={opportunity.title} /> 
							</picture> 
						</div>
		 			 }
						
				  	</div>
				})}


		</div>;

}

export default OpportunitiesList;

