import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import { link, logoFacebook, logoInstagram, logoTwitter, logoYoutube } from "ionicons/icons";
import React from "react";

interface SocialMediaTotalsProps {
	socialMediaData?: any,
	showEmpty?: boolean,
}

const SocialMediaTotals: React.FC<SocialMediaTotalsProps> = ( SocialMediaTotalsProps ) => {


	const {socialMediaData, showEmpty } = SocialMediaTotalsProps;
	
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
				
				<a target="_blank" rel="noreferrer" href={!/^https?:\/\//i.test(item.socialMediaUrl) ? `https://${item.socialMediaUrl}` : item.socialMediaUrl }>
					<IonIcon color="primary" size="large" icon={socialMediaIcon(item.socialMediaName)} />
					{ item.socialMediaTotal && <p className="ion-no-margin social-media-total-figure">{ item.socialMediaTotal.toLocaleString() }</p> }
				</a>

			</IonCol>
			
		);
	});

	const facebookData = socialMediaData.find((x: { socialMediaName: string; }) => x.socialMediaName === "facebook");
	const instagramData = socialMediaData.find((x: { socialMediaName: string; }) => x.socialMediaName === "instagram");
	const twitterData = socialMediaData.find((x: { socialMediaName: string; }) => x.socialMediaName === "twitter");
	const youTubeData = socialMediaData.find((x: { socialMediaName: string; }) => x.socialMediaName === "youTube");



	return <div className="social-media-totals">

			<IonGrid>
			{ !showEmpty ? <IonRow className="ion-justify-content-center">
					{ socialMedia } </IonRow> : <IonRow className="ion-justify-content-start">


					<IonCol size="auto" style={{textAlign: "center"}} className="social-media-total ion-padding facebook">

						<IonIcon color={facebookData ? "primary" : "tertiary"} size="large" icon={ socialMediaIcon("facebook") } />
							<p className="ion-no-margin social-media-total-figure">{ facebookData?.socialMediaTotal ? facebookData.socialMediaTotal.toLocaleString() : "-" }</p> 
							
							<IonIcon 
							className={ facebookData?.socialMediaUrl && "has-url"  }
							onMouseOver={(e:any) => { e.currentTarget.parentNode.classList.add("show-url") }} 
							onClick={(e:any) => { e.currentTarget.parentNode.classList.toggle("show-url") }} 
							onMouseOut={(e:any) => { e.currentTarget.parentNode.classList.remove("show-url") }} 
							icon={link} color={facebookData?.socialMediaUrl ? "primary" : "tertiary"} style={{fontSize: "24px"}} />
							
							{ facebookData?.socialMediaUrl && <p className="social-media-url" style={{fontSize: "0.85em", margin: 0, padding: "0 5px"}}> { facebookData?.socialMediaUrl } </p> }

					</IonCol>

					<IonCol size="auto" style={{textAlign: "center"}} className="social-media-total ion-padding instagram">

						<IonIcon color="primary" size="large" icon={ socialMediaIcon("instagram") } />
							<p className="ion-no-margin social-media-total-figure">{ instagramData.socialMediaTotal ? instagramData.socialMediaTotal.toLocaleString() : "-" }</p> 
							
							<IonIcon 
							className={ instagramData.socialMediaUrl && "has-url"  }
							onMouseOver={(e:any) => { e.currentTarget.parentNode.classList.add("show-url") }} 
							onClick={(e:any) => { e.currentTarget.parentNode.classList.toggle("show-url") }} 
							onMouseOut={(e:any) => { e.currentTarget.parentNode.classList.remove("show-url") }} 
							icon={link} color={instagramData.socialMediaUrl ? "primary" : "medium"} style={{fontSize: "24px"}} />
							
							{ instagramData.socialMediaUrl && <p className="social-media-url" style={{fontSize: "0.85em", margin: 0, padding: "0 5px"}}> { instagramData.socialMediaUrl } </p> }

					</IonCol>

					<IonCol size="auto" style={{textAlign: "center"}} className="social-media-total ion-padding twitter">

						<IonIcon color="primary" size="large" icon={ socialMediaIcon("twitter") } />
							<p className="ion-no-margin social-media-total-figure">{ twitterData.socialMediaTotal ? twitterData.socialMediaTotal.toLocaleString() : "-" }</p> 
							
							<IonIcon 
							className={ twitterData.socialMediaUrl && "has-url"  }
							onMouseOver={(e:any) => { e.currentTarget.parentNode.classList.add("show-url") }} 
							onClick={(e:any) => { e.currentTarget.parentNode.classList.toggle("show-url") }} 
							onMouseOut={(e:any) => { e.currentTarget.parentNode.classList.remove("show-url") }} 
							icon={link} color={twitterData.socialMediaUrl ? "primary" : "medium"} style={{fontSize: "24px"}} />
							
							{ twitterData.socialMediaUrl && <p className="social-media-url" style={{fontSize: "0.85em", margin: 0, padding: "0 5px"}}> { twitterData.socialMediaUrl } </p> }

					</IonCol>

					<IonCol size="auto" style={{textAlign: "center"}} className="social-media-total ion-padding youtube">

						<IonIcon color="primary" size="large" icon={ socialMediaIcon("youTube") } />
							<p className="ion-no-margin social-media-total-figure">{ youTubeData.socialMediaTotal ? youTubeData.socialMediaTotal.toLocaleString() : "-" }</p> 
							
							<IonIcon 
							className={ youTubeData.socialMediaUrl && "has-url"  }
							onMouseOver={(e:any) => { e.currentTarget.parentNode.classList.add("show-url") }} 
							onClick={(e:any) => { e.currentTarget.parentNode.classList.toggle("show-url") }} 
							onMouseOut={(e:any) => { e.currentTarget.parentNode.classList.remove("show-url") }} 
							icon={link} color={youTubeData.socialMediaUrl ? "primary" : "medium"} style={{fontSize: "24px"}} />
							
							{ youTubeData.socialMediaUrl && <p className="social-media-url" style={{fontSize: "0.85em", margin: 0, padding: "0 5px"}}> { youTubeData.socialMediaUrl } </p> }

					</IonCol>

					



				</IonRow> }

			</IonGrid>

	</div>;

}

export default SocialMediaTotals;

