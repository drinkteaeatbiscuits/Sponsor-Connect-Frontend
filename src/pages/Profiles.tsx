import { IonContent, IonItem, IonList, IonLoading, IonPage } from '@ionic/react';
// import useImagePosts from '../hooks/useImagePosts';
import Header from '../components/Header';
import useProfiles from '../hooks/useProflies';

export interface props {}

const Profiles: React.FC = () => {

  const {isLoading, data, error} = useProfiles();

  error && console.log(error);

  // console.log(process.env.REACT_APP_API_URL);

  return (
    <IonPage>
      <Header headerTitle="Profiles"/>
      <IonContent fullscreen>
        <IonLoading isOpen={isLoading} message="Loading..." />
          <IonList>
              { data?.map(( p:any )=>{
              return <IonItem key={p.id}><p>{p.firstName}</p></IonItem>
            })}
          </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Profiles;