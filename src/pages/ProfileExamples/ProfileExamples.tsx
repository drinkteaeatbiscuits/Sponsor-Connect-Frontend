import { IonContent, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import React, { useEffect, useState } from "react";
import MetaTags from "../../components/MetaTags/MetaTags";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import TabBar from "../../components/TabBar";
import useAdminSettings from "../../hooks/useAdminSettings";
import useProfiles from "../../hooks/useProflies";


interface props {
}
 
const ProfileExamples: React.FC<props> = ( props ) => {

	const { data: profiles, isSuccess } = useProfiles(true);
	const {data: settings, isSuccess: settingsSuccess} = useAdminSettings();

	const [ exampleProfiles, setExampleProfiles ] = useState<[]>([]);

	useEffect(() => {
		
		settingsSuccess && exampleProfiles?.length === 0 && settings?.exampleProfiles && setExampleProfiles( settings?.exampleProfiles.map((p) => p.id) );

	}, [settings, settingsSuccess]);

	console.log(profiles);

	return <IonPage>

			<MetaTags title={'Example Profiles | Sponsor Connect'} path={'/profiles/'} description={'Sponsor Connect profiles.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

	<TabBar activeTab='profiles' />
	<IonContent className="example-profiles-content" fullscreen>

		<div className="content" style={{paddingLeft: '8px', paddingRight: '8px'}}>

			<h1 style={{textTransform: 'uppercase', color: 'var(--ion-color-dark', letterSpacing: '-0.01em'}}>Example <span style={{color: 'var(--ion-color-primary)'}}>Profiles</span></h1>
			<div className="example-profiles" style={{padding: '0 0 60px'}}>
				{ settingsSuccess && settings?.exampleProfiles?.map(( profile:any )=>{
				return <ProfileCard key={profile.id} profileData={profile} />
			  }) }
			</div>
			

		</div>
	</IonContent>
  </IonPage>
}

export default ProfileExamples;