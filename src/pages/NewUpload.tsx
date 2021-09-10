import { IonButton, IonContent, IonInput, IonPage, useIonViewDidEnter } from '@ionic/react';
// import Header from '../components/Header';
import { AuthContext } from '../App';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import UploadImage from '../components/UploadImage/UploadImage';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
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

  
  const onDrop = useCallback((acceptedFiles) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => setSrc(reader.result));
	reader.readAsDataURL(acceptedFiles[0]);
	setTheImage(acceptedFiles[0]);

	const formData = new FormData();

	formData.append( "files", acceptedFiles[0], acceptedFiles[0].path );
	formData.append( "ref", "profile" );
	formData.append( "refId", "1" );
	formData.append( "field", "coverImage" ); 
	// formData.append('source', "users-permissions");

    axios.post((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload", 
	formData, 
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

        <h1>New Upload</h1>

		{!uploadedImage ? (
		 !uploadingImage ? <IonButton className="Upload Image" onClick={() => setUploadingImage(true)} >Upload Image</IonButton> 
		: <div className="upload-image">

				<div className="dropzone" {...getRootProps()}>
				 	<input {...getInputProps()} /> 
					{
						isDragActive ?
						<p>Drop the files here ...</p> :
						<p>Drag &amp; drop your image here, or click to select image</p>
					}
				</div>

		</div> ) : 
		
		<ReactCrop src={ src } keepSelection={true} circularCrop={ false } crop={ crop } 
				onImageLoaded={(img:any) => {
					 
					const aspect = crop?.aspect;
					const width = img.width / aspect < img.height * aspect ? 100 : ((img.height * aspect) / img.width) * 100;
					const height = img.width / aspect > img.height * aspect ? 100 : (img.width / aspect / img.height) * 100;
					const y = (100 - height) / 2;
					const x = (100 - width) / 2;

					const widthpx = Math.round(img.width /100 * width);
					const heightpx = Math.round(img.height /100 * height);
					const xpx = Math.round(img.width /100 * x);
					const ypx = Math.round(img.height /100 * y);
					
					const firstCrop = {
						unit: 'px',
						width: widthpx,
						height: heightpx,
						x: xpx,
						y: ypx,
						aspect,
					  }

					setCrop(firstCrop);
					makeClientCrop(firstCrop); 
					
					// getCroppedImg(img, firstCrop, img.name);

					makeFirstCrop(img, firstCrop, img.name);

					setImageRef(img);

					

					return false;
					 }}
				onComplete={(crop:any) => makeClientCrop(crop)}
				onChange={(newCrop:any) => {setCrop(newCrop);}} />
				
				}

				

				{croppedImageUrl && <IonButton onClick={() => uploadCroppedImage()}>Upload Cropped Image</IonButton>}

				{ uploadedCroppedImage && <img src={uploadedCroppedImage} alt="cropped and uploaded result" />}
				
				{ errorMessages && <p>{ errorMessages }</p>}
          
      </IonContent>
    </IonPage>
  );
};

export default NewUpload;
