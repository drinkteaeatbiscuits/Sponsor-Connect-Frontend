import { IonIcon } from "@ionic/react";
import { ellipsisVertical, personCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";
import useMultipleProfiles from "../../hooks/useMultipleProfiles";
import FavouriteProfileButton from "../FavouriteProfileButton/FavouriteProfileButton";


import './SavedSearches.scss';

interface props {
	
}
 
const SavedSearches: React.FC<props> = () => {
	
	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);

	const savedSearches = authState?.user?.savedSearches;

	// console.log(authState);

	useEffect(() => {
		
	}, []);

	
	
	return <div className="saved-searches-list" style={{padding: "0 16px 0 12px", overflow: "scroll"}}>	

		{ savedSearches && savedSearches.length > 0 && savedSearches.slice(0).reverse().map((savedSearches, index) => {

				const date = new Date(savedSearches.date);
				const options: Intl.DateTimeFormatOptions = { month: "short", day: '2-digit' };
				
				const dateString = new Intl.DateTimeFormat('en-GB', options).format(date);

				return <div className="saved-search" 
				key={savedSearches.savedSearchId} 
				style={{display: "flex", 
				alignItems: "center", 
				padding: "8px 0", 
				borderBottom: "#EDEDED 1px solid",
				cursor: "pointer"
				}}>


					<div className="" style={{
                        flexGrow: 1, 
                        padding: "0 3px 2px 3px", 
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center"}}>
                        <div className="" onClick={() =>  history.push( {
								pathname: '/profiles',
								state: { activeFilters: savedSearches.activeFilters }
       					} ) } 
					   style={{
                            flexGrow: 1
                        }}>
                            {savedSearches.savedSearchName}
                        </div>

						<div className="" style={{fontSize: "0.9em", color: "var(--ion-color-medium)"}}>
							{dateString}
						</div>
                        
                    	
                    </div>
 
				
					
					</div>

			})
 
			
		}
	</div>
}
 
export default SavedSearches;


