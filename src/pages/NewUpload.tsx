import { IonButton, IonContent, IonInput, IonPage, useIonViewDidEnter } from '@ionic/react';
// import Header from '../components/Header';
import { AuthContext } from '../App';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import UploadImage from '../components/UploadImage/UploadImage';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import { useMutation } from 'react-query';
import NewImageUpload2 from '../components/NewImageUpload2/NewImageUpload2';
import NewImageUpload3 from '../components/NewImageUpload3/NewImageUpload3';
// import TabBar from '../components/TabBar'; 

export interface props { }

const NewUpload: React.FC = () => {

  const history = useHistory();

  const { state: authState } = React.useContext(AuthContext);

  const { dispatch } = React.useContext( AuthContext );

  const [ uploadingImage, setUploadingImage ] = useState<Boolean>(false);
  const [theImage, setTheImage] = useState<any>("");
  const [src, setSrc] = useState<any>("");
  const [crop, setCrop] = useState<any>({ aspect: 2 / 1 });
  const [croppedImageUrl, setCroppedImageUrl] = useState<any>("");
  const [imageRef, setImageRef] = useState<any>("");
  
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState<any>("");

  const [uploadedImage, setUploadedImage] = useState<any>(null);
  
  const [errorMessages, setErrorMessages] = useState<any>(null);
  
  const [currentImage, setCurrentImage] = useState<any>("");


  return (
    <IonPage>
      {/* <Header headerTitle="Home" /> */}
      {/* <TabBar/> */}
      <IonContent fullscreen>


				<NewImageUpload3 imageCropAspectRatio={10 / 1} circularCrop={true} setCurrentImage={setCurrentImage}  />
          
      </IonContent>
    </IonPage>
  );
};

export default NewUpload;
