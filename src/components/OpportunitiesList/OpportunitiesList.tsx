import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonList, IonRow, IonSlide, IonSlides } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import useOpportunities from "../../hooks/useOpportunities";

import Image from '../Image/Image';

import './OpportunitiesList.scss';

interface OpportunitiesListProps {
	images?: any,
	profileId? : string,
	
}


const OpportunitiesList: React.FC<OpportunitiesListProps> = ( OpportunitiesListProps ) => {

	// console.log(OpportunitiesListProps);
	const history = useHistory();
	const {isLoading, data, error} = useOpportunities( OpportunitiesListProps?.profileId );


	return <div className="opportunities">

			{/* {data.thisdoesntexsist} */}

	
			{ data?.length > 0 && data?.map(( opportunity:any )=>{
				return <div className="opportunity" key={opportunity.id} onClick={ ()=> history.push("/opportunity/" + opportunity.id) }>

					
					<div className=" opportunity-details">

							
						
							{opportunity.price && <p className="price">£{opportunity.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
							
							{opportunity.title && <p className="title">{opportunity.title}</p> }
					
			
						{opportunity.description && <p className="description">
							{opportunity.description} 
						</p> }


					</div>

			{ opportunity.images && 
         
						<div className="opportunity-image-thumb">

							{/* {console.log(opportunity.images)} */}
							{/* <img className="opportunity-image" src={  process.env.REACT_APP_S3_URL + "/profile_image_thumbnail_" + p.images?.hash + ".jpg" } alt={p.title} /> */}
							<picture>
								<source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  opportunity.images?.hash + ".webp" } />
								<source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" +  opportunity.images?.hash + opportunity.images?.ext } />
								<img className="opportunity-image" src={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" + opportunity.images?.hash + opportunity.images?.ext } alt={opportunity.title} /> 
							</picture> 
						</div>
		 			 }
						

				  	</div>
				})}

		
	
		</div>;

}

export default OpportunitiesList;

