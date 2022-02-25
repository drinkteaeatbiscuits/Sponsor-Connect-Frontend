import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';
import useMyProfile from '../../hooks/useMyProfile';
import { convertFromRaw, convertToRaw } from 'draft-js';
import useUpdateProfileDescriptions from '../../hooks/useUpdateProfileDescriptions';

import './EditProfileDescription.scss';
import EditorSection from './EditorSection';

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
      <IonContent fullscreen>

          <div className="content edit-profile-description-content">

            <h1 style={{textTransform: 'uppercase', color: 'var(--ion-color-dark)'}}>Edit Profile <span style={{color: 'var(--ion-color-primary)'}}>Description</span></h1>

            { profileData.status === "success" && <EditorSection title="Information About You" initialEditorContent={ profileData?.data?.informationAboutYou } editorContent={ informationAboutYou } setEditorContent={ setInformationAboutYou } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Competition Information" initialEditorContent={ profileData?.data?.competitionInformation } editorContent={ competitionInformation } setEditorContent={ setCompetitionInformation } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Supporters Information" initialEditorContent={ profileData?.data?.supportersInformation } editorContent={ supportersInformation } setEditorContent={ setSupportersInformation } saveContent={() => updateProfile()} /> }
            
            { profileData.status === "success" && <EditorSection title="Any Other Information" initialEditorContent={ profileData?.data?.anyOtherInfo } editorContent={ anyOtherInfo } setEditorContent={ setAnyOtherInfo } saveContent={() => updateProfile()} /> }

            
           <IonButton className="button-tertiary" size="small" onClick={ () => history.push('/profile/' + profileData.data?.id ) } >Back to profile</IonButton>


          </div>

      </IonContent>
    </IonPage>
  );
};

export default EditProfileDescription;
