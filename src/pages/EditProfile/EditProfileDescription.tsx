import { IonButton, IonContent, IonIcon, IonPage, IonSegment, IonSegmentButton } from '@ionic/react';
import { useHistory } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';
import useMyProfile from '../../hooks/useMyProfile';
import { convertFromRaw, convertToRaw } from 'draft-js';
import useUpdateProfileDescriptions from '../../hooks/useUpdateProfileDescriptions';

import './EditProfileDescription.scss';
import EditorSection from './EditorSection';
import { images, pencil, person } from 'ionicons/icons';
import EditProfileTabs from '../../components/EditProfileTabs/EditProfileTabs';

export interface props {}

const EditProfileDescription: React.FC = () => {

	const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const profileData = useMyProfile();
  const {isLoading, error, mutateAsync: addProfileDescriptionMutation} = useUpdateProfileDescriptions(authState.user.profile);

  const [informationAboutYou, setInformationAboutYou] : any = useState();
  const [competitionInformation, setCompetitionInformation] : any = useState();
  const [supportersInformation, setSupportersInformation] : any = useState();
  const [anyOtherInfo, setAnyOtherInfo] : any = useState();

  // const [showInformationAboutYouEditor, setShowInformationAboutYouEditor] = useState(false);
  // const [showCompetitionInformationEditor, setShowCompetitionInformationEditor] = useState(false);
  // const [showSupportersInformationEditor, setShowSupportersInformationEditor] = useState(false);
  // const [showAnyOtherInfoEditor, setShowAnyOtherInfoEditor] = useState(false);


  // console.log(profileData);
  useEffect(() => {

    if (profileData.status === "success") {

      setInformationAboutYou(profileData.data?.informationAboutYou && convertFromRaw( profileData.data?.informationAboutYou ));

      setCompetitionInformation(profileData.data?.competitionInformation && convertFromRaw( profileData.data?.competitionInformation ));

      setSupportersInformation(profileData.data?.supportersInformation && convertFromRaw( profileData.data?.supportersInformation ));

      setAnyOtherInfo(profileData.data?.anyOtherInfo && convertFromRaw( profileData.data?.anyOtherInfo ));

    }

  }, [profileData.status, profileData.data]);

  const updateProfile = async () => {
    
    await addProfileDescriptionMutation({
      informationAboutYou: informationAboutYou && convertToRaw( informationAboutYou ),
      competitionInformation: competitionInformation && convertToRaw( competitionInformation ),
      supportersInformation: supportersInformation && convertToRaw( supportersInformation ),
      anyOtherInfo: anyOtherInfo && convertToRaw( anyOtherInfo ),

    });

    profileData.refetch();
    
    // history.goBack();
  }

  return (

    <IonPage>
      <TabBar activeTab="profile"/>
      <IonContent className="editor-content" fullscreen>
        <div className="content">
          <div className="edit-profile">
            <h1 style={{ color: "var(--ion-color-dark)", lineHeight: 0.8, fontSize: "4em", padding: "15px" }}>EDIT <br /><span style={{ color: "var(--ion-color-primary)" }}>PROFILE</span></h1>
            
            <EditProfileTabs value='description' />
            
            <div className="editor-wrap">

            { profileData.status === "success" && <EditorSection title="Information About You" initialEditorContent={ profileData?.data?.informationAboutYou } editorContent={ informationAboutYou } setEditorContent={ setInformationAboutYou } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Competition Information" initialEditorContent={ profileData?.data?.competitionInformation } editorContent={ competitionInformation } setEditorContent={ setCompetitionInformation } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Supporters Information" initialEditorContent={ profileData?.data?.supportersInformation } editorContent={ supportersInformation } setEditorContent={ setSupportersInformation } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Any Other Information" initialEditorContent={ profileData?.data?.anyOtherInfo } editorContent={ anyOtherInfo } setEditorContent={ setAnyOtherInfo } saveContent={() => updateProfile()} /> }

            
           <IonButton className="button-tertiary" expand="block" size="small" onClick={ () => history.push(authState?.user.profileSlug ? "/" + authState?.user.profileSlug : "/profile/" + authState?.user.profile) } >Back to profile</IonButton>
          
            </div>
        </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default EditProfileDescription;
