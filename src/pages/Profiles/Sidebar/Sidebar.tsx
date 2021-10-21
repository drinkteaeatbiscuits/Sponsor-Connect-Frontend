import { IonCheckbox } from "@ionic/react";
import React from "react";

interface SidebarProps {
	allProfileData?: any;
	profileData?: any;
	setData?: any;
}


 
const Sidebar: React.FC<SidebarProps> = (SidebarProps) => {

	const { allProfileData, profileData, setData } = SidebarProps;


	let result;
	
	// allProfileData?.length > 0 && (result = allProfileData?.filter((a:any) => a.sport.length > 0));

	result = allProfileData?.map(a => a.sport);
	result = result?.filter(function( element ) {
		return element.length > 0;
	 });


	const sportsCounts = {};

	if(result?.length > 0){
		for (let sport of result.values()){
			sportsCounts[sport] = sportsCounts[sport] ? sportsCounts[sport] + 1 : 1;
		}
    	
	}
	

	return <aside className="sidebar">
				<h1>Search <span className="ion-color-primary">Profiles</span></h1>

				<p className="results">{ profileData.length > 0 ? "Showing " + profileData.length + " results" : "No results found." }</p>

				<p className="filter-by">Filter by</p>

				<div className="filter-section sports">
					<div className="filter-section-top">
						<div className="filter-section-title-col">
							<p className="filter-section-title">Sports</p>
						</div>
						<div className="clear">Clear</div>
					</div>
					{ Object.keys(sportsCounts).map((e) => {

					let profileCount = sportsCounts[e];
					return <div key={e} className="sport">
						<div className="checkbox">
							<IonCheckbox checked={true} onIonChange={e => console.log("check")} />
						</div>
						{e} {profileCount}
						</div>
					}) }

				</div>
				

		</aside>
}
 
export default Sidebar;