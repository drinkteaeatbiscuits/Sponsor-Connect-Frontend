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
import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import { convertFromRaw, convertToRaw } from 'draft-js';
import TextEditor from '../../components/TextEditor/TextEditor';
import OpportunityImagesUpload from '../../components/OpportunityImagesUpload/OpportunityImagesUpload';


export interface props { }

interface ParamTypes {
  id: string;
}

const EditOpportunity: React.FC = () => {

  const opportunityId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

// console.log(profileId);
  const { isLoading, isSuccess: opportunitySuccess, refetch: opportunityRefetch, data, error } = useOpportunity(opportunityId.id);

  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [images, setImages] = useState<any>("");
  const [price, setPrice] = useState<string>("");
  const [opportunityError, setOpportunityError] = useState<string>("");

  const [editorContent, setEditorContent] = useState(null);

  const [showEditTitle, setShowEditTitle] = useState(false);

  const [showOpportunityCoverImageUpload, setShowOpportunityCoverImageUpload] = useState(false);
  
  // const {isLoading: isAddingOpportunity, error: addOpportunityError, mutateAsync: editOpportunityMutation} = useEditOpportunity( opportunityId.id );

  const {isLoading: isEditingOpportunity, error: editOpportunityError, mutateAsync: editOpportunityMutation} = useEditOpportunity( opportunityId.id );

  useEffect(() => {
    
    if (!isLoading) {
      setTitle(data.title);
      setDescription(data.description);
      setFullDescription(data.fullDescription);
      setPrice(data.price);
      setImages(data.images);
      setEditorContent( data?.opportunityDescription && convertFromRaw( data?.opportunityDescription ));
    }
    
  }, [data, isLoading]);

  // console.log(images[0]?.url)

  
  const saveOpportunity = async () => {
    
    await editOpportunityMutation({
      profile: authState?.user.profile.id,
      title,
      description,
      fullDescription,
      opportunityDescription: editorContent && convertToRaw(editorContent),
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
      <IonContent className="editor-content" fullscreen>
      <div className="content">
        
        <div className="opportunity">

          <h1 style={{color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px"}}>EDIT <br/><span style={{color: "var(--ion-color-primary)"}}>OPPORTUNITY</span></h1>
  
          <div className="editor-wrap">
            

          { opportunityId && <NewImageUpload3 
                                    currentImage={ images } 
                                    setCurrentImage={ setImages } 
                                    field="images" 
                                    theref="opportunity" 
                                    refId={ opportunityId.id }
                                    imageCropAspectRatio={3 / 1} 
                                    circularCrop={false}
                                    // showCroppedPreview={ false }  
                                    label="Opportunity Cover Image"
                                    /> 
             }


            <div className="editor-section upload-image-wrap">

                <div className="editor-section-top">

                  <label className="editor-section-title">Opportunity Name</label>
                  
                  <div className="editor-section-top-buttons">

                    {!showEditTitle ? <div className="editor-section-button" onClick={() => setShowEditTitle(true)}>Edit</div> : 
                    <div className="editor-section-button" onClick={() => setShowEditTitle(false)}>Cancel</div> }

                  </div>	

                </div>

                <div className="editor-section-bottom">
                  
                  { !showEditTitle ? title && title : <IonInput autocomplete="off" autocapitalize="on" id="opportunity-title" type="text" value={ title } onIonChange={ (e:any) => setTitle(e.detail.value) } />
                  }

                  { opportunityError && <p className="error-message ion-no-margin"><small>{opportunityError}</small></p> }
                </div>

            </div>



            <IonList>

                
                
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

                <IonItem>
                      <IonLabel position="stacked">Full Description</IonLabel>
                      {opportunitySuccess &&  <TextEditor 
                      placeholder="Enter your description here." 
                      initialText={ data?.opportunityDescription && convertFromRaw( data?.opportunityDescription ) } 
                      textEditorText={ editorContent } 
                      setTextEditorText={ setEditorContent } /> }
                    </IonItem>

            </IonList>


            {opportunitySuccess && <OpportunityImagesUpload opportunityData={ data } refetchOpportunityImages={ opportunityRefetch } />}
            
          </div>
          
          {opportunitySuccess && <IonButton expand="block" className="add-opportunity" onClick={title ? () => saveOpportunity() : () => setOpportunityError('Please enter a title')}>Save</IonButton>}

          
          </div>

      </div>



      </IonContent>
    </IonPage>
  );
};

export default EditOpportunity;
