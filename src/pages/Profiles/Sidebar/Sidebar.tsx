import { IonCheckbox, IonIcon, IonRange } from "@ionic/react";
import { constructOutline, location } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyBVk9Y4B2ZJG1_ldwkfUPfgcy48YzNTa4Q");

interface SidebarProps {
	allProfileData?: any;
	profileData?: any;
	setData?: any;
}


const Sidebar: React.FC<SidebarProps> = (SidebarProps) => {

	const filters = {
		sports: [],
		distance: null,
		budget: null
	};

	const getLocationPlaceName = (lat, long) => {

		Geocode.fromLatLng(lat, long).then(
			(response) => {
			const address = response.results[0].formatted_address;
			let city, state, country;
			for (let i = 0; i < response.results[0].address_components.length; i++) {
				for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
				switch (response.results[0].address_components[i].types[j]) {
					case "locality":
					city = response.results[0].address_components[i].long_name;
					break;
					case "administrative_area_level_1":
					state = response.results[0].address_components[i].long_name;
					break;
					case "country":
					country = response.results[0].address_components[i].long_name;
					break;
				}
				}
			}

			setFromLocation({ ...fromLocation, "city": city});
			
			},
			(error) => {
				console.error(error);
			}
		);
	}

	const distanceGroups = [1, 5, 10, 25, 50, 100, 200, 0];
	const budgetGroups = [0, 100, 500, 1000, 2500, 5000, 10000, -1];

	const { allProfileData, profileData, setData } = SidebarProps;
	const [showMoreSports, setShowMoreSports] = useState(false);
	const [activeFilters, setActiveFilters] = useState<any>(filters);
	
	// const [activeFilters2, setActiveFilters2] = useState<any[]>([]);

	const [budgetSet, setBudgetSet] = useState(false);

	const [updatingProfiles, setUpdatingProfiles] = useState(true);

	const [currentLocation, setCurrentLocation] = useState<any[]>([]);
	const [fromLocation, setFromLocation] = useState<any>({});
	const [locationRange, setLocationRange] = useState(distanceGroups.length);
	// const [budgetRange, setBudgetRange] = useState(budgetGroups.length);

	// const [budget, setBudget] = useState("");
	const [distanceGroupCounts, setDistanceGroupCounts] = useState<object>({});

	const [budgetRange, setBudgetRange] = useState<{
		lower: number;
		upper: number;
	  }>({ lower: 0, upper: budgetGroups.length });


	const [lowerBudget, setLowerBudget] = useState(0);
	const [upperBudget, setUpperBudget] = useState(budgetGroups.length);

	const [sportsData, setSportsData] = useState<any[]>([]);
	// const [visibleSports, setVisibleSports] = useState();

	let result;
	const numberOfSportsVisible = 8;

	result = sportsData?.map(a => a.sport);
	
	// console.log(activeFilters.sports);
	// console.log(result);

	

	result = result?.filter(function( element ) {
		return element.length > 0;
	 });

	//  console.log(result);

	 
	 

	const sportsCounts = {};

	if(result?.length > 0){
		for (let sport of result.values()){
			
			sportsCounts[sport] = sportsCounts[sport] ? sportsCounts[sport] + 1 : 1;
			
		}
	}

	let visibleSports = Object.keys(sportsCounts).slice(0, numberOfSportsVisible).reduce((result, key) => {
		result[key] = sportsCounts[key];
		return result;
	}, {});

	let hiddenSports = Object.keys(sportsCounts).slice(numberOfSportsVisible).reduce((result, key) => {
		result[key] = sportsCounts[key];
		return result;
	}, {});


	activeFilters.sports.length > 0 && activeFilters.sports.forEach((sport) => {
		
		
		!visibleSports[sport] && (visibleSports = {[sport]: 0, ...visibleSports});

		
	});

	console.log(visibleSports);
	

	// const updateSportsList = () => {

	// 	setVisibleSports()

	// }


	function distance(lat1, lon1, lat2, lon2, unit) {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit=="K") { dist = dist * 1.609344 }
			if (unit=="N") { dist = dist * 0.8684 }
			return dist;
		}
	}

	const updateProfileDistances = () => {

		let updatedObject = {};
	

		profileData && Object.keys(fromLocation).length > 0 && profileData.map((profile) => {

			distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" );

			let distanceAway;

			Object.keys(profile.latLong).length > 0 && (
				distanceAway = distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" ));

			distanceGroups.forEach((distance, i) => {

				distanceAway > distance && distanceAway <= distanceGroups[i + 1] && 
					
					( updatedObject[distance] = updatedObject[distance] ? updatedObject[distance] + 1 : 1 );

			});

		});

		setDistanceGroupCounts(updatedObject);
		// console.log(updatedObject);
	};


	const updateProfiles = async () => {

		// console.log('update profiles');

		allProfileData && await setData( allProfileData.filter(profile => {
			let showProfile = false;

			// check if any sports filters are selected
			activeFilters?.sports.length === 0 && (showProfile = true); 
			
			activeFilters?.sports.length > 0 && activeFilters.sports.forEach((activeFilter) => {
				// console.log(activeFilter);
				// console.log(profile.sport);
				if( profile.sport === activeFilter ){ showProfile = true; }
			});


			// console.log('filtered distance - ' + activeFilters?.distance);
			// console.log('actual distance - ' + distance(fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M"));


			let showProfileDistance = false;

			// check if a distance filter is selected
			activeFilters?.distance === 0 && ( showProfileDistance = true ); 
			activeFilters?.distance === null && ( showProfileDistance = true ); 

			// if there is a distance filter selected then hide profiles without location
			// console.log(distance(fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M"));
			
			if( activeFilters?.distance > 0 && Object.keys(profile.latLong).length === 0 ){
				showProfileDistance = false;
			}  
			
			if ( Number(distance(fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M")) < Number(activeFilters?.distance) ) {
				showProfileDistance = true;
			}
			

			// console.log(showProfileDistance);

			// distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" ))

			if(showProfileDistance && showProfile) {
				return true;
			}else{
				return;
			}
			// return showProfile;

		}));



		allProfileData && await setSportsData( allProfileData.filter(profile => {


			let showProfileDistance = false;

			activeFilters?.distance === 0 && ( showProfileDistance = true ); 
			activeFilters?.distance === null && ( showProfileDistance = true ); 
			
			if( activeFilters?.distance > 0 && Object.keys(profile.latLong).length === 0 ){
				showProfileDistance = false;
			}  
			
			if ( Number(distance(fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M")) < Number(activeFilters?.distance) ) {
				showProfileDistance = true;
			}


			if(showProfileDistance) {
				return true;
			}else{
				return;
			}

		}));

		setUpdatingProfiles(false);

	}

	
	// console.log(activeFilters?.sports.length);
	// console.log(activeFilters?.distance);

	// console.log(updatingProfiles);
	// console.log(activeFilters);
	// console.log(budgetRange);

	useEffect(() => {


		allProfileData && Object.keys(profileData).length <= 0 && activeFilters?.sports.length <= 0 && !activeFilters?.distance && setData(allProfileData);

		allProfileData && Object.keys(sportsData).length <= 0 && activeFilters?.sports.length <= 0 && !activeFilters?.distance && setSportsData(allProfileData)

		profileData && updateProfileDistances();

		if( updatingProfiles ){

			updatingProfiles && updateProfiles();

		}

		currentLocation.length <= 0 && navigator.geolocation.getCurrentPosition(function(position) {
			setCurrentLocation([
				{"lat": position.coords.latitude, "long": position.coords.longitude}
			]);
			setFromLocation( { lat: position.coords.latitude, long: position.coords.longitude } );
		  });


		  Object.keys(fromLocation).length > 0 && !fromLocation.city && getLocationPlaceName(fromLocation.lat, fromLocation.long);

		
	}, [activeFilters, currentLocation, fromLocation, profileData, updatingProfiles]);


	
	const filterSports = (e: any, sport: any) => {

		setUpdatingProfiles(true);

		
		e.detail.checked && !activeFilters?.sports.includes(sport) ? setActiveFilters(prevState => ({ ...prevState, sports: [...activeFilters?.sports,...[sport]]})) 
		: setActiveFilters( prevState => ({ ...prevState, sports: activeFilters?.sports.filter(e => e !== sport)})) 

		// !activeFilters?.sports.includes(sport) && setActiveFilters( prevState => ({ ...prevState, sports: activeFilters?.sports.filter(e => e !== sport)}) );

	}



	const setDistance = (e) => {
		
		setUpdatingProfiles(true);

		setActiveFilters( prevState => ({ ...prevState, distance: distanceGroups[e - 1] }));
		
	}


	const setBudget = (e) => {
		// setUpdatingProfiles(true);

		console.log(e);

		//  setActiveFilters( prevState => ({ ...prevState, budget: budgetGroups[e - 1] }));

		
	}

	const budgetChange = (e) => {

		// let lb = e.detail.value.lower;
		// let ub = e.detail.value.upper;

		setLowerBudget(e.detail.value.lower);
		setUpperBudget(e.detail.value.upper);

		setActiveFilters( prevState => ({ ...prevState, budget: {lower: lowerBudget, upper: upperBudget} }));
	}



	const getGraphHeight = (total) => {

		let highestTotal = Math.max(...Object.values(distanceGroupCounts));

		return (100 / highestTotal) * total;

	}
	

	return <aside className="sidebar">
				<h1>Search <span className="ion-color-primary">Profiles</span></h1>

				<p className="results">{ profileData?.length > 0 ? "Showing " + profileData?.length + " results" : "No results found." }</p>

				<p className="filter-by">Filter by</p>

				<div className="filter-section sports">
					<div className="filter-section-top">
						<div className="filter-section-title-col">
							<p className="filter-section-title">Sports</p>
						</div>

						{ activeFilters?.sports.length > 0 && <div className="clear" onClick={()=>{setActiveFilters( prevState => ({ ...prevState, sports: []}))}}>Clear</div> }

					</div>
					<div className="filter-section-bottom">


	
						{ Object.keys(visibleSports).map((sport) => {

							let profileCount = visibleSports[sport];
							return <div key={sport} className="sport">
									<IonCheckbox checked={ activeFilters?.sports.includes(sport) ? true : false } 
									onIonChange={(e) => { 
										filterSports(e, sport);
										
									}} />
									
									<div className="checkbox-label" onClick={(e) => filterSports(e, sport)}>{sport}</div>
									<div className="checkbox-count">{ profileCount }</div>
								</div>	
							}) }
						
						{ Object.keys(hiddenSports).length > 0 &&	<div className="view-more-sports" onClick={() => setShowMoreSports( showMoreSports ? false : true )}>
								{showMoreSports ? "Less" : "More" }
							</div> }

							{showMoreSports && <div className="hidden-sports">
							{ Object.keys(hiddenSports).map((sport) => {
							let profileCount = hiddenSports[sport];
							return <div key={sport} className="sport">
									<IonCheckbox checked={ activeFilters?.sports.includes(sport) ? true : false } 
									onIonChange={e => {
										filterSports(e, sport); 
										}} />
									<div className="checkbox-label">{sport}</div>
									<div className="checkbox-count">{profileCount}</div>
								</div>	
							}) }
							</div> }
					</div>
				</div>

				<div className="filter-section location">
							
					<div className="filter-section-top">
						<div className="filter-section-title-col">
							<p className="filter-section-title">Location</p>
						</div>

						<div className="clear" onClick={() => console.log('change')}>Change Location</div>

					</div>
					<div className="filter-section-bottom">

						<div className="selected-location" style={{display: "flex", alignItems: "center"}}>
							<IonIcon icon={location} color="primary" style={{fontSize: "24px", marginRight: "5px"}} />
							{fromLocation.city}
						</div>

						<div className="range-graph">

							<div className="distance-group"
								style={{
									height: "0%",
								}}></div>


							{ distanceGroups.map((distanceGroup, i) => {

								if(i + 1 >= distanceGroups.length ) { return } else {
								
									return <div key={distanceGroupCounts[distanceGroup] + "-" + distanceGroup} 
									className={"distance-group " + (locationRange >= i + 1 ? "active" : "")}
									style={{
										height: getGraphHeight(distanceGroupCounts[distanceGroup]) + "%",
									}}></div>
								}
							}) 
							
							}

						</div>
						

						<IonRange value={locationRange} 
						onIonChange={(e) => {setDistance(e.detail.value as number); setLocationRange(e.detail.value as number)}} 
						min={0} 
						max={distanceGroups.length} 
						step={1} 
						ticks={true} 
						snaps={true} color="primary" />
						
						{ distanceGroups[locationRange - 1] !== undefined && <p className="location-distance">{ distanceGroups[locationRange - 1] === 0 ? "All Locations" : "Within " + distanceGroups[locationRange - 1] + " Miles" }</p>}


					</div>
				</div>

				<div className="filter-section budget">
							
					<div className="filter-section-top">
						<div className="filter-section-title-col">
							<p className="filter-section-title">Budget</p>
						</div>

						<div className="clear" onClick={() => console.log('change')}>Clear</div>

					</div>
					<div className="filter-section-bottom">

				{	// console.log(lowerBudget);
	// console.log(upperBudget); 
}

						<IonRange 
							onIonChange={(e) => { budgetChange(e); setBudgetSet(true) }} 
							dualKnobs={true}
							min={0}  
							max={budgetGroups.length} 
							step={1} 
							ticks={true} 
							snaps={true} color="primary" />
					</div>

				</div>

		</aside>
}
 
export default Sidebar;
