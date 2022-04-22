import { IonSelect, IonSelectOption } from "@ionic/react";
import React, { useEffect, useState } from "react";
import useAdminSettings from "../../../../hooks/useAdminSettings";
import useEditAdminSettings from "../../../../hooks/useEditAdminSettings";
import useProfiles from "../../../../hooks/useProflies";


interface props {
}
 
const TestProfiles: React.FC<props> = ( props ) => {

	const { data: profiles, isSuccess } = useProfiles(true);
	const {data: settings, isSuccess: settingsSuccess} = useAdminSettings();
	const { mutateAsync: saveSettings } = useEditAdminSettings();

	const [ testProfiles, setTestProfiles ] = useState<[]>([]);

	useEffect(() => {
		
		settingsSuccess && testProfiles?.length === 0 && settings?.testProfiles && setTestProfiles( settings?.testProfiles.map((p) => p.id) );

	}, [settings, settingsSuccess]);


	const saveSetting = async () => {

		await saveSettings( { testProfiles: testProfiles } );

	} 

	return <div className="" style={{borderTop: '1px solid var(--ion-color-light-shade)', margin: '8px 0 0', padding: '8px 0 0'}}>
			
			<div className="" style={{display: 'flex', justifyContent: 'space-between', padding: '0 0 8px'}}>
				<label style={{fontWeight: 500}}>Test Profiles</label>

				<div style={{color: 'var(--ion-color-primary)', fontWeight: 500, cursor: 'pointer'}} onClick={() => { saveSetting() }}>Save</div>	
			</div>

			{isSuccess && <IonSelect
			  name="Test Profiles"
              value={testProfiles}
              multiple={true}
              cancelText="cancel"
              okText="save"
              onIonChange={(e) => setTestProfiles(e.detail.value)}
            >
				{profiles.map((profile) => <IonSelectOption key={profile.id} value={profile.id}>{ profile.profileName }</IonSelectOption>)}
              
            </IonSelect> }

			
	</div>
}

export default TestProfiles;