import { IonContent, IonItem, IonList, IonLoading, IonPage } from '@ionic/react';
// import useImagePosts from '../hooks/useImagePosts';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import TabBar from '../../components/TabBar';
import useProfiles from '../../hooks/useProflies';

import Masonry from 'react-masonry-css';

import './Profiles.scss';

export interface props {}

const Profiles: React.FC = () => {

  const {isLoading, data, error} = useProfiles();
  error && console.log(error);

  const breakpointColumnsObj = {
    default: 3,
    1060: 2,
    680: 1
  };

  return (
    <IonPage>
      <TabBar/>
      <IonContent className="profiles-content" fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          <div className="content">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column">
                { data?.length > 0 && data?.map(( p:any )=>{
                  return <ProfileCard key={p.id} profileData={p} />
                }) }
            </Masonry>
          </div>
      </IonContent>
    </IonPage>
  );
};

export default Profiles;