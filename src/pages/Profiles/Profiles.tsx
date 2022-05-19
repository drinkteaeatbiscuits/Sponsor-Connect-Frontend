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
import useActiveProfiles from '../../hooks/useActiveProflies';
import { AuthContext } from '../../App';
import React from 'react';

export interface props {
}

const Profiles: React.FC<props> = (props) => {

  const thelocation = useLocation<any>();

  const { state: authState } = React.useContext(AuthContext);

  const {isLoading, data, isSuccess, error} = useActiveProfiles();
  error && console.log(error);

  const [profileData, setProfileData] = useState<any[]>([]);

  const [showSidebar, setShowSidebar] = useState( thelocation?.state?.sidebarOpenOnLoad );


  useEffect(() => {
    
    isSuccess && !profileData && setProfileData(data);
    
  }, [ data ]);

 
  return (
    <IonPage>

      <MetaTags title={'Profiles | Sponsor Connect'} path={'/profiles/'} description={'Sponsor Connect profiles.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

      <TabBar activeTab='profiles' />
      { authState.isAuthenticated ? <IonContent className="profiles-content" fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          
        
          { isSuccess && <Sidebar className={showSidebar ? 'show-sidebar' : ''} 
          allProfileData={data} 
          profileData={profileData} 
          setData={setProfileData}  /> }

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
      </IonContent> : <IonContent>
              <p>Login</p>
      </IonContent>
    }
    </IonPage>
  );
};

export default Profiles;