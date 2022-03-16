import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonToolbar } from '@ionic/react';

import { useHistory, useLocation, useParams } from 'react-router';

import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';

import TabBar from '../../components/TabBar';

import useOpportunity from '../../hooks/useOpportunity';

import useEditOpportunity from '../../hooks/useEditOpportunity';

import NewImageUpload3 from '../../components/NewImageUpload3/NewImageUpload3';
import { convertFromRaw } from 'draft-js';

import OpportunityImagesUpload from '../../components/OpportunityImagesUpload/OpportunityImagesUpload';
import EditorSection from '../../components/EditorSection/EditorSection';

import { Calendar } from 'react-date-range';
import getOpportunityStatus from '../../functions/getOpportunityStatus';
import useDeleteOpportunity from '../../hooks/useDeleteOpportunity';
import { checkmark, closeOutline, trashOutline } from 'ionicons/icons';


export interface props { }

interface ParamTypes {
  id: string;
}

const EditOpportunity: React.FC = () => {

  const opportunityId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const [deletedOpportunity, setDeletedOpportunity] = useState(false);

// console.log(profileId);
  const { isLoading, isSuccess: opportunitySuccess, refetch: opportunityRefetch, data, error } = useOpportunity(Number(opportunityId.id));

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [images, setImages] = useState<any>("");
  const [price, setPrice] = useState<string>("");
  const [editorContent, setEditorContent] = useState(null);
  const [showExpiryDateEdit, setShowExpiryDateEdit] = useState(false);
  const [date, setDate] = useState("");
  const [opportunityStatus, setOpportunityStatus] = useState("")

  const { mutateAsync: editOpportunityMutation} = useEditOpportunity( opportunityId.id );

  const {isSuccess: hasDeletedOpportunity, mutateAsync: deleteOpportunityMutation } = useDeleteOpportunity( opportunityId.id );
	const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    
    if (opportunitySuccess) {
      setTitle(data?.title);
      setDescription(data?.description);
      setFullDescription(data?.fullDescription);
      setPrice(data?.price);
      setImages(data?.images);
      setEditorContent( data?.opportunityDescription && convertFromRaw( data?.opportunityDescription ));
      data?.expiryDate?.date && setDate(data.expiryDate.date);
      setOpportunityStatus(data.opportunityStatus);
    }

    hasDeletedOpportunity && setDeletedOpportunity(true);

  }, [data, isLoading, hasDeletedOpportunity]);

  const updateProfileCompletion = async () => {
    const updateProfileCompletionReq = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/update-profile-completion", {
              method: "POST",
              credentials: "include",
            });
        console.log(updateProfileCompletionReq);
  }
  
  const displayDate = (date) => {
    let theDate = new Date(date);
    return theDate.getDate().toString().padStart(2, "0") + '/' + (theDate.getMonth() + 1).toString().padStart(2, "0") + '/' + theDate.getFullYear();

  }
  
  const saveField = async ( sectionData ) => {

		await editOpportunityMutation( sectionData );

    updateProfileCompletion();

	}

  const deleteOpportunity = async () => {
		await deleteOpportunityMutation();

    updateProfileCompletion();
	}


  // console.log(deletedOpportunity);
  // console.log(theLocation);

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
        
      { !deletedOpportunity ? <div className="opportunity">

          <h1 style={{color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "16px 16px 0"}}>EDIT <br/><span style={{color: "var(--ion-color-primary)"}}>OPPORTUNITY</span></h1>
          
          { !error && <div className="opportunity-back">
            <p onClick={() => { history.push('/opportunity/' + opportunityId.id)}}>{"< Back to opportunity"}</p>
          </div> }

          { opportunitySuccess && <div className="editor-wrap">

              <div className="" style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                  {!showDelete && <IonIcon className="" color='primary' style={{position: 'relative', fontSize: '20px', marginRight: '5px', cursor: 'pointer'}} onClick={() => { showDelete ? setShowDelete(false) : setShowDelete(true) }} icon={trashOutline}></IonIcon>}

                  {showDelete && <div className="delete-opportunity">
                    <span>Delete opportunity? </span>
                    <IonIcon className="tick" onClick={() => { setShowDelete(false); deleteOpportunity(); }} icon={checkmark}></IonIcon>
                    <IonIcon className="" onClick={() => setShowDelete(false)} icon={closeOutline}></IonIcon>

                      </div>}
              </div>

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
          }

          { error && <div className="opportunity-deleted"><p style={{fontWeight: 700, fontSize: '24px', letterSpacing: "-0.02em"}}>Opportunity Not Found</p> <p style={{cursor: "pointer"}} 
        onClick={() => history.push("/opportunities/" + authState?.user?.profile)}>{"< Back to all opportunities"}</p> </div> }
          
        </div>

        : <div className="opportunity-deleted" style={{backgroundColor: '#fff', padding: '8px 28px' , margin: '28px 0'}}><p style={{fontWeight: 700, fontSize: '24px', letterSpacing: "-0.02em"}}>Opportunity Deleted</p> <p style={{cursor: "pointer"}} 
        onClick={() => history.push("/opportunities/" + authState?.user?.profile)}>{"< Back to all opportunities"}</p> </div> }

        
    </div>
          


      </IonContent>
    </IonPage>
  );
};

export default EditOpportunity;
