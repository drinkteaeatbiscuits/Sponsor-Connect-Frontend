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

	const { allProfileData, profileData, setData } = SidebarProps;
	const [showMoreSports, setShowMoreSports] = useState(false);
	const [activeFilters, setActiveFilters] = useState<any[]>([]);

	const [currentLocation, setCurrentLocation] = useState<any[]>([]);
	const [fromLocation, setFromLocation] = useState<any>({});
	const [locationRange, setLocationRange] = useState(distanceGroups.length);

	let result;
	const numberOfSportsVisible = 8;


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

	const visibleSports = Object.keys(sportsCounts).slice(0, numberOfSportsVisible).reduce((result, key) => {
		result[key] = sportsCounts[key];
		return result;
	}, {});

	const hiddenSports = Object.keys(sportsCounts).slice(numberOfSportsVisible).reduce((result, key) => {
		result[key] = sportsCounts[key];

		return result;
	}, {});


	useEffect(() => {

		// console.log('test');
		allProfileData && activeFilters.length > 0 && setData( allProfileData.filter(profile => {

			let showProfile;

			activeFilters.forEach((activeFilter) => {

				if(profile.sport === activeFilter){ showProfile = true; }
				
			});

			return showProfile;
		
		}));

		activeFilters.length <= 0 && setData( allProfileData );

		currentLocation.length <= 0 && navigator.geolocation.getCurrentPosition(function(position) {

			setCurrentLocation([
				{"lat": position.coords.latitude, "long": position.coords.longitude}
			]);

			setFromLocation( { lat: position.coords.latitude, long: position.coords.longitude } );
	
		  });


		  Object.keys(fromLocation).length > 0 && !fromLocation.city && getLocationPlaceName(fromLocation.lat, fromLocation.long);
		
		
	}, [activeFilters, currentLocation, fromLocation]);

	// console.log(currentLocation);
	// console.log(fromLocation);
	
	const filterSports = (e: any, sport: any) => {

		!activeFilters.includes(sport) ? setActiveFilters([...activeFilters, sport])
										: setActiveFilters(activeFilters => (activeFilters.filter((value) => value !== sport)));
	}

	// console.log(activeFilters);

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

	

	const distanceGroupCounts = new Object();


	const profileDistances = () => {

		allProfileData && Object.keys(fromLocation).length > 0 && allProfileData.map((profile) => {

			// distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" )

			distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" );

			let distanceAway;

			Object.keys(profile.latLong).length > 0 && (distanceAway = distance( fromLocation.lat, fromLocation.long, profile.latLong.lat, profile.latLong.lng, "M" ));
			

			distanceGroups.forEach((distance, i) => {
				distanceAway > distance && distanceAway <= distanceGroups[i + 1] && (distanceGroupCounts[distance] = distanceGroupCounts[distance] ? distanceGroupCounts[distance] + 1 : 1);
			});
	
		})
	};

	profileDistances();


	

	const getGraphHeight = (total) => {

		let highestTotal = Math.max(...Object.values(distanceGroupCounts));
		
		return (100 / highestTotal) * total;

	}

	// console.log(distanceGroupCounts);
	

	return <aside className="sidebar">
				<h1>Search <span className="ion-color-primary">Profiles</span></h1>

				<p className="results">{ profileData?.length > 0 ? "Showing " + profileData?.length + " results" : "No results found." }</p>

				<p className="filter-by">Filter by</p>

				<div className="filter-section sports">
					<div className="filter-section-top">
						<div className="filter-section-title-col">
							<p className="filter-section-title">Sports</p>
						</div>

						{ activeFilters.length > 0 && <div className="clear" onClick={()=>{setActiveFilters([])}}>Clear</div> }

					</div>
					<div className="filter-section-bottom">
	
						{ Object.keys(visibleSports).map((sport) => {
							let profileCount = visibleSports[sport];
							return <div key={sport} className="sport">
									<IonCheckbox checked={ activeFilters.includes(sport) ? true : false } 
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
									<IonCheckbox checked={ activeFilters.includes(sport) ? true : false } onIonChange={e => filterSports(e, sport)} />
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
							
							{ distanceGroups.map((distanceGroup, i) => {	
								// console.log(distanceGroup);
								
								distanceGroupCounts[distanceGroup] && console.log(getGraphHeight(distanceGroupCounts[distanceGroup]));

								return <div key={distanceGroup} className={"distance-group " + (locationRange - 1 >= i ? "active" : "")} data-distance={distanceGroup}
								style={{
									height: getGraphHeight(distanceGroupCounts[distanceGroup]) + "%",
								}}></div>
							}) }

						</div>
						<IonRange value={locationRange} onIonChange={(e) => setLocationRange(e.detail.value as number)} min={0} max={distanceGroups.length} step={1} ticks={true} snaps={true} color="primary" />
						
						{ distanceGroups[locationRange - 1] !== undefined && <p className="location-distance">{ distanceGroups[locationRange - 1] === 0 ? "All Locations" : "Within " + distanceGroups[locationRange - 1] + " Miles" }</p>}


					</div>
				</div>
				

		</aside>
}
 
export default Sidebar;