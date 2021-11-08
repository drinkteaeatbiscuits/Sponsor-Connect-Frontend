import { IonCheckbox, IonIcon, IonRange } from "@ionic/react";
import { constructOutline, location } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
import { AuthContext } from "../../../App";
import useOpportunityValues from "../../../hooks/useOpportunityValues";

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

	const { state: authState } = React.useContext(AuthContext);

	

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

	const [budget, setBudget] = useState<any>({ lower: 1, upper: 8 });
	
	const [budgetGroupCounts, setBudgetGroupCounts] = useState<object>({});
	
	const [distanceGroupCounts, setDistanceGroupCounts] = useState<object>({});

	const [budgetRange, setBudgetRange] = useState<{
		lower: number;
		upper: number;
	  }>({ lower: 0, upper: budgetGroups.length });


	const [lowerBudget, setLowerBudget] = useState(0);
	const [upperBudget, setUpperBudget] = useState(budgetGroups.length);

	const [sportsData, setSportsData] = useState<any[]>([]);
	const [distanceData, setDistanceData] = useState<any[]>([]);
	const [budgetData, setBudgetData] = useState<any[]>([]);

	
	
	let result;
	const numberOfSportsVisible = 8;

	result = sportsData?.map(a => a.sport);

	result = result?.filter(function( element ) {
		return element.length > 0;
	 });

	 

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

	// console.log(visibleSports);
	

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
	
		distanceData && Object.keys(fromLocation).length > 0 && distanceData.map((profile) => {

			// distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" );

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



	const updateBudgetGroups = () => {

		let updatedObject = {};

		budgetData && Object.keys(budget).length > 0 && budgetData.map((profile) => {


			const maxValue = Math.max(...profile.opportunities.map(o => o.price), 0);
			const minValue = Math.min(...profile.opportunities.map(o => o.price));

			// console.log(maxValue, minValue);


			budgetGroups.forEach((budget, i) => {

				// console.log(budget, minValue, maxValue);

				let addtogroup = false;

				( minValue >= budget && minValue <= budgetGroups[i + 1] ) && ( addtogroup = true );

				( maxValue <= budget && maxValue >= budgetGroups[i - 1] ) && ( addtogroup = true );
				
				addtogroup && ( updatedObject[budget] = updatedObject[budget] ? updatedObject[budget] + 1 : 1 );

			});
			

		});

		setBudgetGroupCounts(updatedObject);

	}

	// console.log(budgetGroupCounts);

	const updateProfiles = async () => {

		console.log('updating profiles');
		

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



			let showProfileBudget = false;
			// check if a distance filter is selected
			// activeFilters?.budget === 0 && ( showProfileBudget = true ); 
			// activeFilters?.budget === null && ( showProfileBudget = true );

			console.log(activeFilters?.budget);
			

			let maxValue = Math.max(...profile.opportunities.map(o => o.price), 0);
			let minValue = Math.min(...profile.opportunities.map(o => o.price));
			
			if(activeFilters?.budget){
				console.log(maxValue);
				console.log(minValue);
				console.log(budgetGroups[activeFilters?.budget.lower - 1]);

				// if minimum value is greater than lower filter and less than upper filter
				((minValue >= budgetGroups[activeFilters?.budget.lower - 1]) && ( minValue <= budgetGroups[activeFilters?.budget.upper - 1] )) && ( showProfileBudget = true );

				// or
				
				// if maximum value is less than upper filter and greater than lower filter 

				// ((minValue >= budgetGroups[activeFilters?.budget.lower - 1]) && (minValue <= budgetGroups[activeFilters?.budget.upper - 1]) 
				// || (maxValue >= budgetGroups[activeFilters?.budget.lower - 1]) && (maxValue <= budgetGroups[activeFilters?.budget.upper - 1]))  && ( showProfileBudget = true );
				


			}

			// console.log(showProfileDistance);

			// distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" ))

			if(showProfileDistance && showProfile && showProfileBudget) {
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


		allProfileData && await setDistanceData( allProfileData.filter(profile => {

			let showDistanceProfile = false;

			// check if any sports filters are selected
			activeFilters?.sports.length === 0 && (showDistanceProfile = true); 
			
			activeFilters?.sports.length > 0 && activeFilters.sports.forEach((activeFilter) => {
				// console.log(activeFilter);
				// console.log(profile.sport);
				if( profile.sport === activeFilter ){ showDistanceProfile = true; }
			});


			if(showDistanceProfile) {
				return true;
			}else{
				return;
			}

		}));

		

		allProfileData && await setBudgetData( allProfileData.filter(profile => {

			let showBudgetProfile = false;

			// check if any sports filters are selected
			activeFilters?.sports.length === 0 && (showBudgetProfile = true); 
			
			activeFilters?.sports.length > 0 && activeFilters.sports.forEach((activeFilter) => {
				// console.log(activeFilter);
				// console.log(profile.sport);
				if( profile.sport === activeFilter ){ showBudgetProfile = true; }
			});


			if(showBudgetProfile) {
				return true;
			}else{
				return;
			}

		}));


		setUpdatingProfiles(false);

	}

	

	

	const [gettingLocation, setGettingLocation] = useState(false);

	useEffect(() => {
		

		if( allProfileData && authState?.currentLocation && currentLocation.length <= 0 ) {

			console.log('already got location');
			
			setCurrentLocation([authState?.currentLocation]);
			setFromLocation(authState?.currentLocation);
			
			setUpdatingProfiles(true);
			// updateProfiles();
	
		}
		
		if ( allProfileData && !authState?.currentLocation && currentLocation.length <= 0 && !gettingLocation ) {

			setGettingLocation(true);
	
			console.log('getting location');
	
			navigator.geolocation.getCurrentPosition(function(position) {
				setCurrentLocation([
					{"lat": position.coords.latitude, "long": position.coords.longitude}
				]);
				
				setFromLocation( { lat: position.coords.latitude, long: position.coords.longitude } );
			});
	
			Object.keys(fromLocation).length > 0 && !fromLocation.city && getLocationPlaceName(fromLocation.lat, fromLocation.long);
	
			setUpdatingProfiles(true);
			// updateProfiles();
	
		}

		currentLocation.length > 0 && setGettingLocation(false);

		if( updatingProfiles ){

			updateProfiles();

		}

		allProfileData && Object.keys(profileData).length <= 0 && activeFilters?.sports.length <= 0 && !activeFilters?.distance && setData(allProfileData);
		allProfileData && Object.keys(sportsData).length <= 0 && activeFilters?.sports.length <= 0 && !activeFilters?.distance && setSportsData(allProfileData)


		sportsData && updateProfileDistances();

		sportsData && updateBudgetGroups();

		


	}, [ allProfileData, authState?.currentLocation, updatingProfiles, activeFilters ])
	
	
	
	
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

	
	const updateBudget = (e) => {

		console.log('update budget');

		setUpdatingProfiles(true);
		setActiveFilters( prevState => ({ ...prevState, budget: e }));

	}


	const getGraphHeight = (total) => {

		let highestTotal = Math.max(...Object.values(distanceGroupCounts));
		return (100 / highestTotal) * total;

	}

	const getBudgetGraphHeight = (total) => {

		let highestTotal = Math.max(...Object.values(budgetGroupCounts));
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
									className={"distance-group " + (locationRange >= i + 2 ? "active" : "")}
									style={{
										height: getGraphHeight(distanceGroupCounts[distanceGroup]) + "%",
									}}></div>
								}
							}) 
							
							}

						</div>
						

						<IonRange 
						value={locationRange} 
						onIonChange={(e) => { setDistance(e.detail.value as number); setLocationRange(e.detail.value as number) }} 
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
						<div className="range-graph">


							{ budgetGroups.map((group, i) => {

								if(i + 1 >= budgetGroups.length ) { return } else {
								return <div key={budgetGroupCounts[group] + "-" + group} className={"distance-group " + (budget.upper >= i + 2 ? "active" : "")}
								style={{
									height: getBudgetGraphHeight(budgetGroupCounts[group]) + "%",
										}}></div>
								}
							}) 

							}

						</div>

						<IonRange 
							
							onIonChange={(e) => { setBudget(e.detail.value); updateBudget( e.detail.value ); }}
							debounce={20} 
							dualKnobs={true}
							min={1}  
							max={budgetGroups.length} 
							step={1} 
							ticks={true} 
							snaps={true} color="primary" />
						

						{ budgetGroups[budget.lower - 1] === 0 && budgetGroups[budget.upper - 1] === -1 && <p className="location-distance">All Budgets</p> }

						{ ( budgetGroups[budget.lower - 1] !== 0 || budgetGroups[budget.upper - 1] !== -1 ) &&
						<p className="location-distance">{ "From £" + budgetGroups[budget.lower - 1] + ( budgetGroups[budget.upper - 1] === -1 ? " up to any " : (" to £" + budgetGroups[budget.upper - 1]) )  }</p> }
						
						

					</div>


					

				</div>

		</aside>
}


 
export default Sidebar;