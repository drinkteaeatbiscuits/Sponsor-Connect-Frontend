import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonLoading, IonPage } from '@ionic/react';
import { useState } from 'react';
import useAddImagePost from '../hooks/useAddImagePost';
// import './Home.css';
import { useHistory } from 'react-router';
import Header from '../components/Header';

const AddItem: React.FC = () => {

  const history = useHistory();
  const [dtebText, setDTEBText] = useState("");
  const {isLoading, error, mutateAsync: addPhotoMutation} = useAddImagePost();


  console.log(error);

  const saveTheImagePost = async () => {
    
    await addPhotoMutation({dtebText});
    
    history.goBack();
  }

  return (
    <IonPage>
      <Header headerTitle="Add Item"/>
      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={isLoading} message="Loading Profiles" />
        <IonItem>
			    <IonLabel position="stacked">Text</IonLabel>
			    <IonInput type="text" onIonChange={ (e:any) => setDTEBText(e.detail.value) } />
		    </IonItem>
		    <div style={{paddingTop: 8}}><IonButton onClick={()=> saveTheImagePost()} expand="block">SAVE</IonButton></div>
	  </IonContent>

    </IonPage>
  );
};

export default AddItem;
