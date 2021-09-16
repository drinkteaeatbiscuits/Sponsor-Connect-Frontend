import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonList, IonRow, IonSlide, IonSlides } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import useOpportunities from "../../hooks/useOpportunities";

import Image from '../Image/Image';

import './OpportunitiesList.scss';

interface OpportunitiesListProps {
	images?: any,
	profileId? : string
}


const OpportunitiesList: React.FC<OpportunitiesListProps> = ( OpportunitiesListProps ) => {

	// console.log(OpportunitiesListProps);
	const history = useHistory();
	const {isLoading, data, error} = useOpportunities( OpportunitiesListProps?.profileId );


	return <div className="opportunities">

		
	
			{ data?.length > 0 && data?.map(( p:any )=>{
				return <IonCard className="opportunity" key={p.id} button={true} onClick={ ()=> history.push("/opportunity/" + p.id) }>

					
			
					

						{ p.images && 
         

		 <picture>
		   <source type="image/webp" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xs_" +  p.images?.hash + ".webp" } />
		   <source type="image/webp" media="(max-width: 768px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_sm_" +  p.images?.hash + ".webp" } />
		   <source type="image/webp" media="(max-width: 992px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_md_" +  p.images?.hash + ".webp" } />
		   <source type="image/webp" media="(max-width: 1440px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_lg_" +  p.images?.hash + ".webp" } />
		   <source type="image/webp" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xl_" +  p.images?.hash + ".webp" } />

		   <source type="image/jpeg" media="(max-width: 576px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xs_" +  p.images?.hash + ".jpg" } />
		   <source type="image/jpeg" media="(max-width: 768px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_sm_" +  p.images?.hash + ".jpg" } />
		   <source type="image/jpeg" media="(max-width: 992px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_md_" +  p.images?.hash + ".jpg" } />
		   <source type="image/jpeg" media="(max-width: 1440px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_lg_" +  p.images?.hash + ".jpg" } />
		   <source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/cover_xl_" +  p.images?.hash + ".jpg" } />

		   <img className="cover-image" src={  process.env.REACT_APP_S3_URL + "/cover_xl_" + p.images?.hash + ".jpg" } alt="Profile Cover" />
		 </picture>  
		 
		 }
					

						<IonCardHeader>
							{p.price && <p className="price">£{p.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
							
							{p.title && <IonCardTitle className="title">{p.title}</IonCardTitle> }
						</IonCardHeader>
			
						{p.title && <IonCardContent className="description">
							{p.description} 
						</IonCardContent> }

				  	</IonCard>
				})}

		
	
		</div>;

}

export default OpportunitiesList;

