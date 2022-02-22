import { IonCol, IonGrid, IonIcon, IonInput, IonRow } from "@ionic/react";
import { link, logoFacebook, logoInstagram, logoTwitter, logoYoutube } from "ionicons/icons";
import React, { useEffect, useState } from "react";

interface SocialMediaTotalsProps {
	socialMediaData?: any,
    setSocialMediaObject: Function,
}

const SocialMediaTotalsEdit: React.FC<SocialMediaTotalsProps> = ( SocialMediaTotalsProps ) => {

    const { socialMediaData, setSocialMediaObject } = SocialMediaTotalsProps;

    // console.log(socialMediaData.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaTotal);

    const [socialMedia, setSocialMedia] = useState<Array<object>>( socialMediaData );
    const [facebookTotal, setFacebookTotal] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaTotal);
    const [facebookUrl, setFacebookUrl] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'facebook'; })[0]?.socialMediaUrl); 
    const [instagramTotal, setInstagramTotal] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaTotal);
    const [instagramUrl, setInstagramUrl] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'instagram'; })[0]?.socialMediaUrl);
    const [twitterTotal, setTwitterTotal] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaTotal);
    const [twitterUrl, setTwitterUrl] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'twitter'; })[0]?.socialMediaUrl);
    const [youTubeTotal, setYouTubeTotal] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaTotal);
    const [youTubeUrl, setYouTubeUrl] = useState<any>(socialMediaData?.filter(function (entry:any) { return entry.socialMediaName === 'youTube'; })[0]?.socialMediaUrl);

    const socialMediaIcon = (socialMediaName:any) => {
		
		let socialMediaIconName = "";
		socialMediaName === 'facebook' && (socialMediaIconName = logoFacebook);
		socialMediaName === 'instagram' && (socialMediaIconName = logoInstagram);
		socialMediaName === 'twitter' && (socialMediaIconName = logoTwitter);
		socialMediaName === 'youTube' && (socialMediaIconName = logoYoutube);

		return socialMediaIconName;
	}

    const updateSocialMediaObject = () => {
        const socialMediaObject: { socialMediaName: string; socialMediaTotal: any; socialMediaUrl: any; }[] = [];

        facebookTotal && socialMediaObject.push({
        "socialMediaName": "facebook",
        "socialMediaTotal": facebookTotal,
        "socialMediaUrl": facebookUrl
        });
        
        instagramTotal && socialMediaObject.push({
        "socialMediaName": "instagram",
        "socialMediaTotal": instagramTotal,
        "socialMediaUrl": instagramUrl
        });
        
        twitterTotal && socialMediaObject.push({
        "socialMediaName": "twitter",
        "socialMediaTotal": twitterTotal,
        "socialMediaUrl": twitterUrl
        });
        
        youTubeTotal && socialMediaObject.push({
        "socialMediaName": "youTube",
        "socialMediaTotal": youTubeTotal,
        "socialMediaUrl": youTubeUrl
        });

        setSocialMediaObject(socialMediaObject);
        setSocialMedia(socialMediaObject);
    }

    useEffect(() => {
        updateSocialMediaObject();    
    }, [youTubeTotal, youTubeUrl, twitterTotal, twitterUrl, instagramTotal, instagramUrl, facebookTotal, facebookUrl ]);

    // console.log(socialMedia);
  
return <div className="social-media-fields">

                        <div className="social-media-field">

                          <IonIcon color={ facebookTotal || facebookUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("facebook") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ facebookTotal && facebookTotal } onIonChange={ (e:any) => setFacebookTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ facebookUrl && facebookUrl } onIonChange={ (e:any) => setFacebookUrl(e.detail.value) } />
                          </div>
                          
                        </div>
                        <div className="social-media-field">

                          <IonIcon color={ instagramTotal || instagramUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("instagram") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ instagramTotal && instagramTotal  } onIonChange={ (e:any) => setInstagramTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ instagramUrl && instagramUrl } onIonChange={ (e:any) => setInstagramUrl(e.detail.value) } />
                          </div>
                          
                        </div>
                        <div className="social-media-field">

                          <IonIcon color={ twitterTotal || twitterUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("twitter") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ twitterTotal && twitterTotal  } onIonChange={ (e:any) => setTwitterTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ twitterUrl && twitterUrl } onIonChange={ (e:any) => setTwitterUrl(e.detail.value) } />
                          </div>
                          
                        </div>
                        <div className="social-media-field">

                          <IonIcon color={ youTubeTotal || youTubeUrl ? "primary" : "tertiary" } size="large" icon={ socialMediaIcon("youTube") } />
                          <div className="total">
                            <div className="label">
                              <label>Total</label>
                            </div>
                            
                            <IonInput type="number" value={ youTubeTotal && youTubeTotal  } onIonChange={ (e:any) => setYouTubeTotal(e.detail.value) } />
                          </div>
                          <div className="url">
                            <div className="label">
                              <label>URL</label>
                            </div>
                            <IonInput type="text" value={ youTubeUrl && youTubeUrl } onIonChange={ (e:any) => setYouTubeUrl(e.detail.value) } />
                          </div>
                          
                        </div>
 

                  </div>
}

export default SocialMediaTotalsEdit;