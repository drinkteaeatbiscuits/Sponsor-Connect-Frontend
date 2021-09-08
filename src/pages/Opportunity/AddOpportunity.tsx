import { IonButton, IonButtons, IonContent, IonInput, IonItem, IonLabel, IonList, IonPage, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import useOpportunity from '../../hooks/useOpportunity';
import useAddOpportunity from '../../hooks/useAddOpportunity';
import UploadImage from '../../components/UploadImage/UploadImage';



export interface props { }

interface ParamTypes {
  id: string;
}

const AddOpportunity: React.FC = () => {

  const profileId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

// console.log(profileId);
// const { isLoading, data, error } = useOpportunity(profileId.id);

  const {isLoading: isAddingOpportunity, error: addOpportunityError, mutateAsync: addOpportunityMutation} = useAddOpportunity();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [images, setImages] = useState<Array<any>>([]);
  const [price, setPrice] = useState<string>("");
  const [opportunityError, setOpportunityError] = useState<string>("");

  
  const addOpportunity = async () => {
    
    await addOpportunityMutation({
      profile: profileId.id,
      title,
      description,
      fullDescription,
      images,
      price,
    });
    
    history.goBack();

  }

  return (
    <IonPage>

       
        <IonToolbar>
          <IonButtons className="ion-justify-content-around">
            <IonButton className="" size="small" onClick={() => history.push("/opportunities/" + profileId.id )}>Back to Opportunities</IonButton>
            {/* {authState?.user.profile === parseInt(data?.profile.id) && <IonButton className="" size="small" onClick={() => history.push("/opportunities/" + profileId.id + "/edit")}>Add Opportunity</IonButton>} */}
          </IonButtons>

        </IonToolbar>

      
      <TabBar activeTab="opportunities" />
      <IonContent className="opportunity-content" fullscreen>

<div className="content">
      {/* { authState?.user.profile === parseInt(profileId.id) && <div className="contact-button ion-padding-top">
                <IonButton expand="block" className="add-opportunity" onClick={() => history.push("/add-opportunity/" + profileId.id )}>Add New Opportunity</IonButton>
              </div> } */}

       

          <div className="opportunity">


          
            <div className="ion-padding">
              <IonList>

                  <IonItem className="">
                    <IonLabel position="stacked">Opportunity Image</IonLabel>
                    <UploadImage setCurrentImage={ setImages } field="images" theref="" crop={{ aspect: 2 / 1 }} circularCrop={ false } showCroppedPreview={ false } />
                  </IonItem> 


                  <IonItem>
                    <IonLabel position="stacked">Title</IonLabel>
                    <IonInput autocomplete="off" autocapitalize="on" id="opportunity-title" type="text" value={ title } onIonChange={ (e:any) => setTitle(e.detail.value) } />
                   { opportunityError && <p className="error-message ion-no-margin"><small>{opportunityError}</small></p> }
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel position="stacked">Price</IonLabel>
                    <IonInput autocomplete="off" id="opportunity-price" type="number" value={ price } onIonChange={ (e:any) => setPrice(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonInput autocomplete="off" autocapitalize="on" id="opportunity-description" type="text" value={ description } onIonChange={ (e:any) => setDescription(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Full Description</IonLabel>
                    <IonInput autocomplete="off" autocapitalize="on" id="opportunity-full-description" type="text" value={ fullDescription } onIonChange={ (e:any) => setFullDescription(e.detail.value) } />
                  </IonItem>

                  
              </IonList>
              

            </div>

            
            <IonButton expand="block" className="add-opportunity" onClick={title ? () => addOpportunity() : () => setOpportunityError('Please enter a title')}>Add New Opportunity</IonButton>

            
          </div>



        


</div>




      </IonContent>
    </IonPage>
  );
};

export default AddOpportunity;
