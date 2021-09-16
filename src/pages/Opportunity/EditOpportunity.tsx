import { IonButton, IonButtons, IonContent, IonInput, IonItem, IonLabel, IonList, IonPage, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import useOpportunity from '../../hooks/useOpportunity';
import useAddOpportunity from '../../hooks/useAddOpportunity';
import useEditOpportunity from '../../hooks/useEditOpportunity';
import UploadImage from '../../components/UploadImage/UploadImage';


export interface props { }

interface ParamTypes {
  id: string;
}

const EditOpportunity: React.FC = () => {

  const opportunityId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

// console.log(profileId);
  const { isLoading, data, error } = useOpportunity(opportunityId.id);

  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [images, setImages] = useState<any>("");
  const [price, setPrice] = useState<string>("");
  const [opportunityError, setOpportunityError] = useState<string>("");
  
  const {isLoading: isAddingOpportunity, error: addOpportunityError, mutateAsync: editOpportunityMutation} = useEditOpportunity( opportunityId.id );

  useEffect(() => {
    
    if (!isLoading) {
      setTitle(data.title);
      setDescription(data.description);
      setFullDescription(data.fullDescription);
      setPrice(data.price);
      setImages(data.images);
    }
    
  }, [data, isLoading]);

  // console.log(images[0]?.url)
console.log(opportunityId);
  
  const editOpportunity = async () => {
    
    await editOpportunityMutation({
      profile: authState?.user.profile.id,
      title,
      description,
      fullDescription,
      // images,
      price,
    });
    
    history.goBack();

  }

  return (
    <IonPage>

       
        <IonToolbar>
          <IonButtons className="ion-justify-content-around">
            <IonButton className="" size="small" onClick={() => history.push("/opportunity/" + opportunityId.id )}>Back to Opportunity</IonButton>
            {/* {authState?.user.profile === parseInt(data?.profile.id) && <IonButton className="" size="small" onClick={() => history.push("/opportunities/" + profileId.id + "/edit")}>Add Opportunity</IonButton>} */}
          </IonButtons>

        </IonToolbar>

      
      <TabBar activeTab="opportunities" />
      <IonContent className="opportunity-content" fullscreen>

<div className="content">
      

        {!isLoading &&

          <div className="opportunity">


                <IonItem className="">
                    <IonLabel position="stacked">Opportunity Image</IonLabel>
                   
                    <UploadImage currentImage={ images } setCurrentImage={ setImages } field="images" theref="opportunity" crop={{ aspect: 2 / 1 }} circularCrop={ false } showCroppedPreview={ false } refId={opportunityId.id} />
                  </IonItem> 


            <div className="ion-padding">
              <IonList>

                  <IonItem>
                    <IonLabel position="stacked">Title</IonLabel>
                    <IonInput autocomplete="off" id="opportunity-title" type="text" value={ title } onIonChange={ (e:any) => setTitle(e.detail.value) } />
                   { opportunityError && <p className="error-message ion-no-margin"><small>{opportunityError}</small></p> }
                  </IonItem>
                  
                  <IonItem>
                    <IonLabel position="stacked">Price</IonLabel>
                    <IonInput autocomplete="off" id="opportunity-price" type="text" value={ price } onIonChange={ (e:any) => setPrice(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonInput autocomplete="off" id="opportunity-description" type="text" value={ description } onIonChange={ (e:any) => setDescription(e.detail.value) } />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Full Description</IonLabel>
                    <IonInput autocomplete="off" id="opportunity-full-description" type="text" value={ fullDescription } onIonChange={ (e:any) => setFullDescription(e.detail.value) } />
                  </IonItem>

                  
              </IonList>
              

            </div>

            
            <IonButton expand="block" className="add-opportunity" onClick={title ? () => editOpportunity() : () => setOpportunityError('Please enter a title')}>Save</IonButton>
            <IonButton buttonType="link" className="link" size="small" onClick={() => history.push("/opportunity/" + opportunityId )}>Cancel</IonButton>
            
          </div>



        }


</div>




      </IonContent>
    </IonPage>
  );
};

export default EditOpportunity;
