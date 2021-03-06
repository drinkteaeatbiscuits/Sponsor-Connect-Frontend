import { IonButton, IonButtons, IonContent, IonInput, IonPage, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';
import useOpportunity from '../../hooks/useOpportunity';
import useAddOpportunity from '../../hooks/useAddOpportunity';

import urlSlug from 'url-slug';
import useEditOpportunity from '../../hooks/useEditOpportunity';
import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import TextEditor from '../../components/TextEditor/TextEditor';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import OpportunityImagesUpload from '../../components/OpportunityImagesUpload/OpportunityImagesUpload';

import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css";

import { Calendar } from 'react-date-range';
import MetaTags from '../../components/MetaTags/MetaTags';

export interface props { }

interface ParamTypes {
  id: string;
}

const AddOpportunity: React.FC = () => {

  const profileId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);


  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [images, setImages] = useState<any>("");
  const [price, setPrice] = useState<string>("");
  const [opportunityError, setOpportunityError] = useState<string>("");
  const [publishedAt, setPublishedAt] = useState<any>(null);
  const [opportunityId, setOpportunityId] = useState<any>("");
  const [opportunitySlug, setOpportunitySlug] = useState<any>("");
  const [date, setDate] = useState("");

  const [newOpportunityData, setNewOpportunityData] = useState<any>("");

  const { isLoading: isAddingOpportunity, data: opportunityData, error: addOpportunityError, isSuccess: opportunitySuccess, mutateAsync: addOpportunityMutation, reset } = useAddOpportunity();

  const { isLoading: isEditingOpportunity, error: editOpportunityError, mutateAsync: editOpportunityMutation } = useEditOpportunity( opportunityId );
  
  const { isLoading, isSuccess, refetch: opportunityRefetch, data, error } = useOpportunity( opportunityId );

  useEffect(() => {

    !opportunityId && !opportunitySuccess && createOpportunity();

    opportunitySuccess && setOpportunityId(opportunityData.id);

    opportunitySuccess && setNewOpportunityData(opportunityData);
    
    setOpportunitySlug( urlSlug(profileId.id + '-' + opportunityId + '-' + title));

    opportunityId && !publishedAt && setPublishedAt(new Date().toISOString());

    // isSuccess && setNewOpportunityData(opportunityData);

  }, [title, opportunityId, publishedAt, opportunitySuccess])
  

  const [editorContent, setEditorContent] = useState(null);
  const [showExpiryDateEdit, setShowExpiryDateEdit] = useState(false);


  const createOpportunity = async () => {
    
    await addOpportunityMutation({
      profile: profileId.id,
      published_at: publishedAt 
    });

  }

  // console.log(editorContent);

  const saveOpportunity = async (status) => {
    
    await editOpportunityMutation({
      profile: profileId.id,
      title,
      description,
      fullDescription,
      // images,
      opportunityDescription: editorContent && convertToRaw(editorContent),
      price,
      published_at: publishedAt ,
      expiryDate: date ? { date } : {},
      opportunityStatus: status,
    }).then(() => {

      // setTitle("");
      // setDescription("");
      // setEditorContent(null);
      // setImages("");
      // setPrice("");
      // setOpportunityError("");
      // setPublishedAt(null);
      // setOpportunityId("");
      // setOpportunitySlug("");
      // setDate("");

      history.push("/opportunity/" + opportunityId, { deletedOpportunity: false });

      // reset();

    });
    
    

  }

  // useIonViewDidEnter(() => {
  //   createOpportunity();
  // });
    

  const displayDate = (date) => {
    let theDate = new Date(date);
    return theDate.getDate().toString().padStart(2, "0") + '/' + (theDate.getMonth() + 1).toString().padStart(2, "0") + '/' + theDate.getFullYear();

  }

  return (
    <IonPage>

      <MetaTags title={'Add Opportunity | Sponsor Connect'} path={'/add-opportunity/' + profileId.id} description={'Add a Sponsor Connect opportunity.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

       
        <IonToolbar>
          <IonButtons className="ion-justify-content-around">
            <IonButton className="" size="small" onClick={() => history.push("/opportunities/" + profileId.id )}>Back to Opportunities</IonButton>
            {/* {authState?.user.profile === parseInt(data?.profile.id) && <IonButton className="" size="small" onClick={() => history.push("/opportunities/" + profileId.id + "/edit")}>Add Opportunity</IonButton>} */}
          </IonButtons>

        </IonToolbar>

      
      <TabBar activeTab="opportunities" />
        <IonContent className="editor-content" fullscreen>

        <div className="content">
        
            <div className="opportunity">

              <h1 style={{color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px"}}>ADD <br/><span style={{color: "var(--ion-color-primary)"}}>OPPORTUNITY</span></h1>
    
              <div className="editor-wrap">

                <div className="editor-section">
                  <div className="editor-section-top">
                    <label className="editor-section-title">Opportunity Name</label>
                    <div className="editor-section-top-buttons">
                      {/* <div className="editor-section-button secondary">?</div> */}
                      { opportunityError && <p className="error-message ion-no-margin"><small>{opportunityError}</small></p> }
                    </div>
                  </div>

                  <div className="editor-section-bottom">
                  <IonInput autocomplete="off" autocapitalize="on" id="opportunity-title" type="text" value={ title } onIonChange={ (e:any) => setTitle(e.detail.value) } />
                  </div>
                </div>

                <div className="editor-section">

                    <div className="editor-section-top">

                      <label className="editor-section-title">Expiry Date</label>

                      <div className="editor-section-top-buttons">
                        { !showExpiryDateEdit &&  <div className="editor-section-button" onClick={() => { setShowExpiryDateEdit( !showExpiryDateEdit ) }}> Add</div> }
                    
                        { showExpiryDateEdit && <div className="editor-section-button secondary" onClick={() => { setDate(""); setShowExpiryDateEdit( !showExpiryDateEdit ) }}>Cancel</div> }
                        
                        { showExpiryDateEdit && date && <div className="editor-section-button" onClick={() => { setDate(""); setShowExpiryDateEdit( !showExpiryDateEdit );}}>Clear</div> }
                      

                      </div>
                      

                    </div>
                    <div className="editor-section-bottom">

                        <p>{ date ? displayDate(date) : "Not Set" }</p>

                        { showExpiryDateEdit && <Calendar date={ date ? new Date(date) : new Date() } onChange={e => setDate(e)} /> }

                    </div>	

                </div>

                <NewImageUpload3 
                  currentImage={ images } 
                  setCurrentImage={ setImages } 
                  field="images" 
                  theref="opportunity" 
                  refId={ opportunityId }
                  imageCropAspectRatio={3 / 1} 
                  circularCrop={false}
                  showCroppedPreview={ true }  
                  label="Cover Image"
                  /> 


                <div className="editor-section price">
                  <div className="editor-section-top">
                    <label className="editor-section-title">Price</label>
                    <div className="editor-section-top-buttons">
                      {/* <div className="editor-section-button secondary">?</div> */}
                    </div>
                  </div>

                  <div className="editor-section-bottom">
                    <div className="currency-display">{authState && authState.user.currency === "GBP" ? String.fromCharCode(163) : authState.user.currency === "EUR" ? String.fromCharCode(8364) : String.fromCharCode(163) }</div>
                    <IonInput className="price" autocomplete="off" id="opportunity-price" type="number" value={ price } onIonChange={ (e:any) => setPrice(e.detail.value) } />
                  </div>
                </div>


                <div className="editor-section">
                  <div className="editor-section-top">
                    <label className="editor-section-title">Short Description</label>
                    <div className="editor-section-top-buttons">
                      {/* <div className="editor-section-button secondary">?</div> */}
                    </div>
                  </div>

                  <div className="editor-section-bottom">
                    <IonInput autocomplete="off" autocapitalize="on" id="opportunity-description" type="text" value={ description } onIonChange={ (e:any) => setDescription(e.detail.value) } />
                  </div>
                </div>


                <div className="editor-section">
                  <div className="editor-section-top">
                    <label className="editor-section-title">Full Description</label>
                    <div className="editor-section-top-buttons">
                      {/* <div className="editor-section-button secondary">?</div> */}
                    </div>
                  </div>

                  <div className="editor-section-bottom show-editor">
                    <TextEditor 
                      
                      placeholder="Enter your description here." 
                      initialText={ null } 
                      textEditorText={ editorContent } 
                      setTextEditorText={ setEditorContent } />  
                  </div>
                </div>


                { opportunitySuccess && isSuccess && data && <OpportunityImagesUpload opportunityData={ data } refetchOpportunityImages={ opportunityRefetch } label="Opportunity Images" /> }


                { opportunitySuccess && <IonButton expand="block" size="small" color="light" onClick={title ? () => saveOpportunity('Draft') : () => setOpportunityError('Please enter a title')}>Save Opportunity as Draft</IonButton> }
                
                { opportunitySuccess && <IonButton expand="block" className="add-opportunity" onClick={title ? () => saveOpportunity('Active') : () => setOpportunityError('Please enter a title')}>Publish Opportunity</IonButton> }
                
              </div>
              
              
              
            </div>

        </div>




      </IonContent>
    </IonPage>
  );
};

export default AddOpportunity;


