import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { logoFacebook, logoInstagram, logoTwitter, logoYoutube } from "ionicons/icons";
import React from "react";

interface SocialMediaTotalsProps {
	socialMediaData?: any,
}

const SocialMediaTotals: React.FC<SocialMediaTotalsProps> = ( SocialMediaTotalsProps ) => {


	const socialMediaData = SocialMediaTotalsProps.socialMediaData;
	
	// console.log(socialMediaData);

	const socialMediaIcon = (socialMediaName:any) => {
		
		let socialMediaIconName = "";
		socialMediaName === 'facebook' && (socialMediaIconName = logoFacebook);
		socialMediaName === 'instagram' && (socialMediaIconName = logoInstagram);
		socialMediaName === 'twitter' && (socialMediaIconName = logoTwitter);
		socialMediaName === 'youTube' && (socialMediaIconName = logoYoutube);

		return socialMediaIconName;
	}

	const socialMedia = socialMediaData.map((item: any) => {

		return (
			<IonCol size="auto" key={item.socialMediaName} className="social-media-total ion-padding">
				
				<a target="_blank" rel="noreferrer" href={item.socialMediaUrl}>
					<IonIcon color="primary" size="large" icon={socialMediaIcon(item.socialMediaName)} />
					{ item.socialMediaTotal && <p className="ion-no-margin social-media-total-figure">{item.socialMediaTotal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> }
				</a>

			</IonCol>
			
		);
	});


	return <div className="social-media-totals">

			<IonGrid>
				<IonRow className="ion-justify-content-center">
					{ socialMedia }
				</IonRow>
			</IonGrid>

	</div>;

}

export default SocialMediaTotals;

