import { IonButton, IonContent, IonItem, IonList, IonLoading, IonPage } from '@ionic/react';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import TabBar from '../../components/TabBar';
import useProfiles from '../../hooks/useProflies';

import './Profiles.scss';
import Sidebar from './Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import MetaTags from '../../components/MetaTags/MetaTags';
import useAdminSettings from '../../hooks/useAdminSettings';

export interface props {
}

const Profiles: React.FC<props> = (props) => {

  const thelocation = useLocation<any>();

  const {isLoading, data, isSuccess, error} = useProfiles();
  error && console.log(error);

  const [profileData, setProfileData] = useState<any[]>([]);

  const [showSidebar, setShowSidebar] = useState( thelocation?.state?.sidebarOpenOnLoad );

  const {data: settings, isSuccess: settingsSuccess} = useAdminSettings();

	const exampleProfileIds = settingsSuccess && settings?.exampleProfiles.map((profile) => profile.id);
	const testProfileIds = settingsSuccess && settings?.testProfiles.map((profile) => profile.id);


  useEffect(() => {
    
    isSuccess && settingsSuccess && !profileData && setProfileData(data);
    
  }, [ data ]);


  // console.log(data);
  return (
    <IonPage>

      <MetaTags title={'Profiles | Sponsor Connect'} path={'/profiles/'} description={'Sponsor Connect profiles.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

      <TabBar activeTab='profiles' />
      <IonContent className="profiles-content" fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          
          <Sidebar className={showSidebar ? 'show-sidebar' : ''} 
          allProfileData={data && data.filter(
            (profile) => exampleProfileIds && !exampleProfileIds?.includes(profile.id))
          .filter(
            (profile) => testProfileIds && !testProfileIds?.includes(profile.id))} 
          profileData={profileData} 
          setData={setProfileData}  />

          <div className="toggle-sidebar-button" >
           
           {!showSidebar ? <IonButton onClick={() => setShowSidebar(true)} size="small" color="tertiary" expand="block">
            Filter Results</IonButton>

            : <IonButton onClick={() => setShowSidebar(false)} size="small" color="primary" expand="block">
            Done</IonButton> }
          </div>

          <div className="content">

              { profileData?.length > 0 && profileData?.map(( profile:any )=>{
                  return <ProfileCard key={profile.id} profileData={profile} />
                }) }

          </div>
      </IonContent>
    </IonPage>
  );
};

export default Profiles;