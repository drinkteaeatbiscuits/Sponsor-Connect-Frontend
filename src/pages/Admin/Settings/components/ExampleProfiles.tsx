import { IonSelect, IonSelectOption } from "@ionic/react";
import React, { useEffect, useState } from "react";
import useAdminSettings from "../../../../hooks/useAdminSettings";
import useEditAdminSettings from "../../../../hooks/useEditAdminSettings";
import useProfiles from "../../../../hooks/useProflies";


interface props {
}
 
const ExampleProfiles: React.FC<props> = ( props ) => {

	
	const {data: settings, isSuccess: settingsSuccess} = useAdminSettings();
	const { mutateAsync: saveSettings } = useEditAdminSettings();

	const [ exampleProfiles, setExampleProfiles ] = useState<[]>([]);

	const { data: profiles, isSuccess } = useProfiles(true);

	useEffect(() => {
		
		settingsSuccess && exampleProfiles?.length === 0 && settings?.exampleProfiles && setExampleProfiles( settings?.exampleProfiles.map((p) => p.id) );

	}, [settings, settingsSuccess]);


	const saveSetting = async () => {

		await saveSettings( { exampleProfiles: exampleProfiles } );

	} 

	return <div className="">
			
			<div className="" style={{display: 'flex', justifyContent: 'space-between', padding: '0 0 8px'}}>
				<label style={{fontWeight: 500}}>Example Profiles</label>

				<div style={{color: 'var(--ion-color-primary)', fontWeight: 500, cursor: 'pointer'}} onClick={() => { saveSetting() }}>Save</div>	
			</div>

			{isSuccess && <IonSelect
			  name="Example Profiles"
              value={exampleProfiles}
              multiple={true}
              cancelText="cancel"
              okText="save"
              onIonChange={(e) => setExampleProfiles(e.detail.value)}
            >
				{profiles.map((profile) => <IonSelectOption key={profile.id} value={profile.id}>{ profile.profileName }</IonSelectOption>)}
              
            </IonSelect> }

			
	</div>
}

export default ExampleProfiles;