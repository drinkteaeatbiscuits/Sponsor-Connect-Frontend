import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonIcon, IonImg, IonItem, IonList, IonRow, IonSlide, IonSlides } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import useOpportunities from "../../hooks/useOpportunities";

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

		
	
			{ data?.map(( p:any )=>{
				return <IonCard className="opportunity" key={p.id} button={true} onClick={ ()=> history.push("/opportunity/" + p.id) }>
						
						{ p.images[0] && <img src={(process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + p.images[0]?.url} alt={p.title} /> }
					

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

