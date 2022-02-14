import { IonButton, IonContent, IonItem, IonList, IonLoading, IonPage } from '@ionic/react';
// import useImagePosts from '../hooks/useImagePosts';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import TabBar from '../../components/TabBar';
import useProfiles from '../../hooks/useProflies';

import Masonry from 'react-masonry-css';

import './Profiles.scss';
import Sidebar from './Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';

export interface props {
}


const Profiles: React.FC<props> = (props) => {

 
  const thelocation = useLocation<any>();

  const {isLoading, data, isSuccess, error} = useProfiles();
  error && console.log(error);

  const [profileData, setProfileData] = useState<any[]>([]);

  const [showSidebar, setShowSidebar] = useState( thelocation?.state?.sidebarOpenOnLoad );

  useEffect(() => {
    
    isSuccess && !profileData && setProfileData(data);

  }, [ data ]);


  return (
    <IonPage>
      <TabBar activeTab='profiles' />
      <IonContent className="profiles-content" fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          
          <Sidebar className={showSidebar ? 'show-sidebar' : ''} allProfileData={data} profileData={profileData} setData={setProfileData}  />

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