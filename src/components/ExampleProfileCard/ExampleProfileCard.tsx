import { IonIcon, IonSkeletonText } from "@ionic/react";
import { barChart, shareSocial, location as locationIcon } from "ionicons/icons";
import FavouriteProfileButton from "../FavouriteProfileButton/FavouriteProfileButton";
import ProfileCard from "../ProfileCard/ProfileCard"
import '../ProfileCard/ProfileCard.scss';

interface props {
	profileName?: any;
	sport?: any;
	description?: any;
  	image?: any;
	location?: any;
	socialTotal?: any;
	opportunityRange?: any;
	profileId?: any;
}
 
const ExampleProfileCard: React.FC<props> = (props) => {

  const {profileName, sport, description, image, location, socialTotal, opportunityRange, profileId } = props;

  return <div className="profile-card example" >

  <div className="profile-image">

	  { image ?
		  <picture>
			  <source type="image/webp" media="(max-width: 1024px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  image?.hash + ".webp" } />
			  <source type="image/jpeg" media="(max-width: 1024px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  image?.hash + image?.ext } />
			  <source type="image/webp" media="(max-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_md/" +  image?.hash + ".webp" } />
			  <source type="image/jpeg" media="(min-width: 1441px)" srcSet={  process.env.REACT_APP_S3_URL + "/images/cover_md/" +  image?.hash + image?.ext } />
			  <img className="profile-image" src={  process.env.REACT_APP_S3_URL + "/images/profile_image_thumbnail/" + image?.hash + image?.ext } alt={profileName} /> 
		  </picture> 
		  : <IonSkeletonText animated={true} style={{width: '100%', height: '101%', marginTop: '-2px'}} />

	  } 

	
  </div>

  <div className="profile-information">
	  <p className="name">{profileName ? profileName : "Your Profile Name"}</p>
	  <p className="sport">{sport ? sport : "Sport"}</p>
	  <div className="description">{ description ? description : <><IonSkeletonText animated={true} style={{width: '100%', marginBottom: '8px'}} /><IonSkeletonText animated={true} style={{width: '100%', marginBottom: '8px'}} /><IonSkeletonText animated={true} style={{width: '100%'}} /></> }</div>

	  <div className="profile-facts">
			<div className="">
			  <IonIcon color="tertiary" icon={locationIcon} /><p>{ location ? location?.label : <IonSkeletonText animated={true} style={{width: '120px'}} /> }</p>
		  </div>


		  {/* <div className="">
			  <IonIcon color="tertiary" icon={barChart} /><p> { opportunityRange && <IonSkeletonText style={{width: '16px'}} /> }</p> 
		  
		  </div>
		  
			  <div className="profile-information-row">
				  <IonIcon color="tertiary" icon={shareSocial} /><p>{socialTotal ? socialTotal : <IonSkeletonText style={{width: '16px'}} /> }</p>
			  </div> */}
		  
	  </div>
  </div>

</div>
}

export default ExampleProfileCard