import { IonButton, IonButtons, IonContent, IonDatetime, IonInput, IonItem, IonLabel, IonList, IonPage, IonToolbar } from '@ionic/react';
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
import EditorSection from '../../components/EditorSection/EditorSection';

import { Calendar } from 'react-date-range';
import getOpportunityStatus from '../../functions/getOpportunityStatus';


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

  const [showExpiryDateEdit, setShowExpiryDateEdit] = useState(false);

  const [date, setDate] = useState("");

  const [opportunityStatus, setOpportunityStatus] = useState("")
  

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
      data?.expiryDate?.date && setDate(data.expiryDate.date);

      setOpportunityStatus(data.opportunityStatus);
    }
    
  }, [data, isLoading]);

  
  const displayDate = (date) => {
    let theDate = new Date(date);
    return theDate.getDate().toString().padStart(2, "0") + '/' + (theDate.getMonth() + 1).toString().padStart(2, "0") + '/' + theDate.getFullYear();

  }
  
  const saveField = async ( sectionData ) => {

		await editOpportunityMutation( sectionData );

	}

 
// console.log(date)
// console.log(data)


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

            <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Status</label>

                  <div className="editor-section-top-buttons">
                    
                    { !opportunityStatus || opportunityStatus === "Draft" && ( new Date() < new Date(date) ) && <div className="editor-section-button" onClick={() => { saveField( {opportunityStatus: "Active" }); }}>Publish</div> }
                   
                    {!opportunityStatus && !date && <div className="editor-section-button" onClick={() => { saveField( {opportunityStatus: "Active" }); }}>Publish</div> }

                    { opportunityStatus === "Active" && !date && <div className="editor-section-button" onClick={() => { saveField( {opportunityStatus: "Draft" }); }}>Set to Draft</div> }
                    
                    { opportunityStatus === "Active" && ( new Date() < new Date(date) ) && <div className="editor-section-button" onClick={() => { saveField( {opportunityStatus: "Draft" }); }}>Set to Draft</div> }


                    { opportunityStatus === "Draft" && !date && <div className="editor-section-button" onClick={() => { saveField( {opportunityStatus: "Active" }); }}>Publish</div> }

                    {/* { new Date() < new Date(date) && <div className="editor-section-button" onClick={() => { saveField( {opportunityStatus: "Active" }); }}>Publish</div> } */}
                  
                  </div>
                  

                </div>
                <div className="editor-section-bottom">

                  

                    {/* { opportunityStatus === "Draft" && new Date() < new Date(date) && "Draft" }

                    { opportunityStatus === "Active" && new Date() < new Date(date) && "Active" }
                    
                    { !date && opportunityStatus === "Active" && "Active" }
                    
                    { new Date() > new Date(date) && "Expired" }

                    { !opportunityStatus && !date && "Draft" }
                    
                    { opportunityStatus === "Draft" && !date && "Draft" }

                    { !opportunityStatus && new Date() < new Date(date) && "Draft" } */}

                    { getOpportunityStatus(opportunityStatus, date) }

                </div>	

            </div>

            <div className="editor-section">

                <div className="editor-section-top">

                  <label className="editor-section-title">Expiry Date</label>

                  <div className="editor-section-top-buttons">

                    { !showExpiryDateEdit &&  <div className="editor-section-button" onClick={() => { setShowExpiryDateEdit( !showExpiryDateEdit ) }}>{ date ? "Edit" : "Add" }</div> }
                    
                    { showExpiryDateEdit && <div className="editor-section-button secondary" onClick={() => { setShowExpiryDateEdit( !showExpiryDateEdit ) }}>Cancel</div> }
                    
                    { showExpiryDateEdit && date && <div className="editor-section-button" onClick={() => { setDate(""); saveField( {expiryDate: {} }); setShowExpiryDateEdit( !showExpiryDateEdit );}}>Clear</div> }
                   
                    { showExpiryDateEdit && date && <div className="editor-section-button" onClick={() => { saveField( {expiryDate: { date } }); setShowExpiryDateEdit( !showExpiryDateEdit ); }}>Save</div> }


                  </div>
                   

                </div>
                <div className="editor-section-bottom">

                    { date ? displayDate(date) : "Not Set" }

                    { showExpiryDateEdit && <Calendar date={ date ? new Date(date) : new Date() } onChange={e => setDate(e)} /> }

                </div>	

            </div>
            
            <EditorSection opportunityId={opportunityId.id} fieldRef="title" label={"Opportunity Name"} currentValue={title} />

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
            
            <EditorSection opportunityId={opportunityId.id} fieldRef="price" className="price" label={"Price"} currentValue={price} fieldType="number" />
            
            <EditorSection opportunityId={opportunityId.id} fieldRef="description" className="description" label={"Description"} currentValue={description} />
            
            <EditorSection 
              opportunityId={opportunityId.id} 
              fieldType="TextEditor" 
              fieldRef="opportunityDescription" 
              className="full-description" 
              label={"Full Description"} 
              currentValue={ editorContent && editorContent } />
              

            {opportunitySuccess && <OpportunityImagesUpload 
            opportunityData={ data } 
            refetchOpportunityImages={ opportunityRefetch }
            label="Opportunity Images" />}

            {opportunitySuccess && <IonButton className="button-tertiary" expand="block" size="small" onClick={() => history.push('/opportunity/' + opportunityId.id)}>Back to Opportunity</IonButton>}

          
            
          </div>
          
        </div>

    </div>



      </IonContent>
    </IonPage>
  );
};

export default EditOpportunity;
