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

  // console.log(authState);

  const [ uploadingImage, setUploadingImage ] = useState<Boolean>(false);
  const [theImage, setTheImage] = useState<any>("");
  const [src, setSrc] = useState<any>("");
  const [crop, setCrop] = useState<any>({ aspect: 2 / 1 });
  const [croppedImageUrl, setCroppedImageUrl] = useState<any>("");
  const [imageRef, setImageRef] = useState<any>("");
  
  const [uploadedCroppedImage, setUploadedCroppedImage] = useState<any>("");

  const [uploadedImage, setUploadedImage] = useState<any>(null);
  
  const [errorMessages, setErrorMessages] = useState<any>(null);

  const fileValidation = (file:File) => {
		
		const fileSize = file.size;
		const roundedFile = Math.round((fileSize / 1024));
		// The size of the file.
		if (roundedFile >= 10240) {
			setErrorMessages("File too large, please select a file less than 10mb");	
			return false
		} else {
			return true
		}
	}
	
  
  const onDrop = useCallback((acceptedFiles) => {

	console.log(fileValidation(acceptedFiles[0]));

	if(fileValidation(acceptedFiles[0])) {

	const reader = new FileReader();
	reader.addEventListener('load', () => setSrc(reader.result));
	reader.readAsDataURL(acceptedFiles[0]);
	setTheImage(acceptedFiles[0]);

	

	const formData = new FormData();

	formData.append( "files", acceptedFiles[0], acceptedFiles[0].path );
	// formData.append( "ref", "profile" );
	// formData.append( "refId", "1" );
	// formData.append( "field", "coverImage" ); 
	// formData.append('source', "users-permissions");


    axios.post((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload",  
	  {
		headers: { 'Content-Type': 'multipart/form-data' },
		withCredentials: true,
      })
      .then(res => {
        console.log(res);

		let uploadedName = res.data[0].hash + res.data[0].ext;
		let uploadedUrl = "https://sponsor-connect-images.s3.eu-west-2.amazonaws.com/preview_" + uploadedName;

		setUploadedImage(uploadedUrl);

      })
      .catch(err => {
        console.log(err);

		setErrorMessages( JSON.stringify(err) );
      });

	
	}

  }, []);


  const uploadCroppedImage = async () => {
	const formData = new FormData();

	let blob = await fetch(croppedImageUrl).then(r => r.blob());

	const lastModifiedDate = new Date().getTime();
	const file = new File([blob], newFileName, {lastModified: lastModifiedDate, type: "image/jpg"});

	// console.log(file);

	formData.append( "files", file, file.name );

    axios.post((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
		withCredentials: true,
      })
      .then(res => {
        console.log(res);

		setUploadedCroppedImage(res.data[0].formats.thumbnail.url);
      })
      .catch(err => {
        console.log(err);
		setErrorMessages( JSON.stringify(err) );
      });

  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  	const dateNumber = new Date().getTime();
	const randomString = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
	const fileName = theImage?.name?.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '-').toLowerCase();
	const fileExtension = theImage?.name?.split('.').pop();
	const newFileName = dateNumber + "-" + randomString + "-" + fileName + "." + fileExtension;

  const makeClientCrop = async (crop:any)  => {
	if (imageRef && crop.width && crop.height) {

		const croppedImageUrl = await getCroppedImg(
			imageRef,
			crop,
			newFileName
		);
		setCroppedImageUrl(croppedImageUrl);
	}

	
}

const makeFirstCrop = async (image:any, crop:any, fileName:any) => {
	const croppedImageUrl = await getCroppedImg(
		image,
		crop,
		newFileName
	);
	setCroppedImageUrl(croppedImageUrl);
}

const getCroppedImg = (image:any, crop:any, fileName:any) => {

	const canvas = document.createElement('canvas');
	const pixelRatio = window.devicePixelRatio;
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	const ctx = canvas.getContext('2d');

	if(ctx){

	canvas.width = crop.width * pixelRatio * scaleX;
	canvas.height = crop.height * pixelRatio * scaleY;

	ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	ctx.imageSmoothingQuality = 'high';

	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width * scaleX,
		crop.height * scaleY
	);

	}

	return new Promise((resolve, reject) => {

	canvas.toBlob(
		(blob) => {
		if (!blob) {
			//reject(new Error('Canvas is empty'));
			setErrorMessages( 'Canvas is empty' );
			console.error('Canvas is empty');
			return;
		}
			
		// blob.name = fileName;
		
		// window.URL.revokeObjectURL(fileUrl);

		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL(blob);

		resolve(imageUrl);

		},
		'image/jpeg',
		1
	);
	});
}

	



  return (
    <IonPage>
      {/* <Header headerTitle="Home" /> */}
      {/* <TabBar/> */}
      <IonContent fullscreen>


				<NewImageUpload3 />
          
      </IonContent>
    </IonPage>
  );
};

export default NewUpload;
