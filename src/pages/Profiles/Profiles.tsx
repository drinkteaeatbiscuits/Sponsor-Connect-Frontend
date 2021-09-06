import { IonContent, IonItem, IonList, IonLoading, IonPage } from '@ionic/react';
// import useImagePosts from '../hooks/useImagePosts';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import useProfiles from '../../hooks/useProflies';

export interface props {}

const Profiles: React.FC = () => {

  const {isLoading, data, error} = useProfiles();

  error && console.log(error);


  return (
    <IonPage>
      <Header headerTitle="Profiles"/>
      <TabBar/>
      <IonContent fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          <IonList>
              { data?.map(( p:any )=>{
              return <IonItem key={p.id}><p>{p.profileName}</p></IonItem>
            })}
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profiles;