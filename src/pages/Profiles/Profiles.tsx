import { IonContent, IonItem, IonList, IonLoading, IonPage } from '@ionic/react';
// import useImagePosts from '../hooks/useImagePosts';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import TabBar from '../../components/TabBar';
import useProfiles from '../../hooks/useProflies';

import Masonry from 'react-masonry-css';

import './Profiles.scss';
import Sidebar from './Sidebar/Sidebar';
import { useEffect, useState } from 'react';

export interface props {}

const Profiles: React.FC = () => {

  const {isLoading, data, isSuccess, error} = useProfiles();
  error && console.log(error);

  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    
    isSuccess && setProfileData(data);

  }, [ data ])

  return (
    <IonPage>
      <TabBar/>
      <IonContent className="profiles-content" fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          
          <Sidebar allProfileData={data} profileData={profileData} setData={setProfileData} />

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