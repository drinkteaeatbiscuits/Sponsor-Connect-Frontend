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
	const { state: authState, dispatch } = React.useContext(AuthContext);

	const savedSearches = authState?.user?.savedSearches;

	// console.log(authState);

	useEffect(() => {
		
	}, []);


	const budgetGroups = [0, 100, 500, 1000, 2500, 5000, 10000, -1];

	const loadSavedSearch = (activeFilters) => {

		dispatch && dispatch({
			type: "setSearchNow",
			payload: activeFilters
		  });

		history.push( {
			pathname: '/profiles'
	   } )
	}
	
	
	return <div className="saved-searches-list" style={{padding: "0 16px 0 12px", overflow: "scroll"}}>	

		{ savedSearches && savedSearches.length > 0 && savedSearches.slice(0).reverse().map((savedSearches, index) => {

				const date = new Date(savedSearches.date);
				const options: Intl.DateTimeFormatOptions = { month: "short", day: '2-digit' };
				
				const dateString = new Intl.DateTimeFormat('en-GB', options).format(date);

				return <div className="saved-search" 
				key={ savedSearches.savedSearchId + '-' + index } 
				style={{display: "flex", 
				flexWrap: "wrap",
				alignItems: "center", 
				padding: "8px 0", 
				borderBottom: "#EDEDED 1px solid",
				cursor: "pointer"
				}}>


					<div className="" style={{
                        flexGrow: 1, 
                        padding: "0 3px 0px 3px", 
						lineHeight: 1.4,
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center"}}>
                        <div className="saved-search-name" onClick={() => loadSavedSearch(savedSearches.activeFilters ) } 
					   style={{
                            flexGrow: 1
                        }}>
                            {savedSearches.savedSearchName}
                        </div>

						<div className="" style={{fontSize: "0.9em", color: "var(--ion-color-medium)"}}>
							{dateString}
						</div>

						
                        
                    	
                    </div>

					<div className="" style={{width: "100%", padding: "0 3px 2px 3px", color: "var(--ion-color-dark)"}}>
						

							{savedSearches.activeFilters.sports.length > 0 && 
							<div className="sports">
								{savedSearches.activeFilters.sports.map((sport, index) => {
									return <span key={sport + '-' + index} style={{display: "inline-block", padding: "0 6px 1px 0", fontSize: "0.85em", lineHeight: 1}}>{sport}</span>
								})}
							</div> }

							{savedSearches.activeFilters.distance && <div className="distance">
								<span style={{display: "inline-block", padding: "0 6px 1px 0", fontSize: "0.85em", lineHeight: 1}}>Within {savedSearches.activeFilters.distance} miles</span>
							</div> }
							
							{savedSearches.activeFilters.budget && <div className="budget">
								{/* <span style={{display: "inline-block", padding: "0 6px 1px 0", fontSize: "0.85em", lineHeight: 1}}>{savedSearches.activeFilters.budget.lower} - {savedSearches.activeFilters.budget.upper}</span> */}
							
								
								{/* { budgetGroups[savedSearches.activeFilters.budget.lower - 1] === 0 && budgetGroups[savedSearches.activeFilters.budget.upper - 1] === -1 && <span style={{display: "inline-block", padding: "0 6px 1px 0", fontSize: "0.85em", lineHeight: 1}}>All Budgets</span> } */}

								{ ( budgetGroups[savedSearches.activeFilters.budget.lower - 1] !== 0 || budgetGroups[savedSearches.activeFilters.budget.upper - 1] !== -1 ) &&
								<span style={{display: "inline-block", padding: "0 6px 1px 0", fontSize: "0.85em", lineHeight: 1}}>{ "From £" + budgetGroups[savedSearches.activeFilters.budget.lower - 1] + ( budgetGroups[savedSearches.activeFilters.budget.upper - 1] === -1 ? " up to any " : (" to £" + budgetGroups[savedSearches.activeFilters.budget.upper - 1]) )  }</span> }

							
							
							</div> }

							{/* { console.log(savedSearches.activeFilters) } */}
						</div>
 
				
					
					</div>

			})
 
			
		}
	</div>
}
 
export default SavedSearches;


