import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyBVk9Y4B2ZJG1_ldwkfUPfgcy48YzNTa4Q");

const getLocationPlaceName = (lat, long, setFromLocation, fromLocation) => {

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

export default getLocationPlaceName;