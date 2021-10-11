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
import UploadImage from '../../components/UploadImage/UploadImage';
import urlSlug from 'url-slug';
import useEditOpportunity from '../../hooks/useEditOpportunity';
import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import TextEditor from '../../components/TextEditor/TextEditor';
import { convertFromRaw, convertToRaw } from 'draft-js';

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

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [images, setImages] = useState<any>("");
  const [price, setPrice] = useState<string>("");
  const [opportunityError, setOpportunityError] = useState<string>("");
  const [publishedAt, setPublishedAt] = useState<any>(null);
  const [opportunityId, setOpportunityId] = useState<any>("");
  const [opportunitySlug, setOpportunitySlug] = useState<any>("");

  const {isLoading: isAddingOpportunity, data: opportunityData, error: addOpportunityError, isSuccess: opportunitySuccess, mutateAsync: addOpportunityMutation} = useAddOpportunity();
  const {isLoading: isEditingOpportunity, error: editOpportunityError, mutateAsync: editOpportunityMutation} = useEditOpportunity( opportunityId );


  useEffect(() => {

    !opportunityId && !opportunitySuccess && createOpportunity();

    opportunitySuccess && setOpportunityId(opportunityData.id);
    
    setOpportunitySlug( urlSlug(profileId.id + '-' + opportunityId + '-' + title));

    opportunityId && !publishedAt && setPublishedAt(new Date().toISOString());


  }, [title, opportunityId, publishedAt, opportunitySuccess])
  

  const [editorContent, setEditorContent] = useState(null);

  // console.log(opportunityData);
  // console.log(opportunityId);
  // console.log(opportunityId);
  // console.log(opportunitySlug);

  const createOpportunity = async () => {
    
    await addOpportunityMutation({
      profile: profileId.id,
      published_at: publishedAt 
    });

  }

  const saveOpportunity = async () => {
    
    await editOpportunityMutation({
      profile: profileId.id,
      title,
      description,
      fullDescription,
      // images,
      opportunityDescription: editorContent && convertToRaw(editorContent),
      price,
      published_at: publishedAt 
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
        
            <div className="opportunity">
      
              <div className="ion-padding">
                <IonList>

                    <IonItem className="">
                      <IonLabel position="stacked">Opportunity Image</IonLabel>
                  
                      {opportunityId && <NewImageUpload3 
                                        currentImage={ images } 
                                        setCurrentImage={ setImages } 
                                        field="images" 
                                        theref="opportunity" 
                                        refId={ opportunityId }
                                        imageCropAspectRatio={3 / 1} 
                                        circularCrop={false}
                                        // showCroppedPreview={ false }  
                                        /> }
                    
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
                      <TextEditor 
                      placeholder="Enter your description here." 
                      initialText={ null } 
                      textEditorText={ editorContent } 
                      setTextEditorText={ setEditorContent } />
                    </IonItem>

                    
                </IonList>
                
              </div>
              
              {opportunitySuccess && <IonButton expand="block" className="add-opportunity" onClick={title ? () => saveOpportunity() : () => setOpportunityError('Please enter a title')}>Save</IonButton>}

              
            </div>

        </div>




      </IonContent>
    </IonPage>
  );
};

export default AddOpportunity;
