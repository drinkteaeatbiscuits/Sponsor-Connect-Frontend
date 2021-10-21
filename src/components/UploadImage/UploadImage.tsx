import { IonButton, IonButtons, IonProgressBar, IonSpinner } from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone';
import ReactCrop from "react-image-crop";
import { AuthContext } from "../../App";
import useDeleteImage from "../../hooks/useDeleteImage";
import useUploadImage from "../../hooks/useUploadImage";

import './UploadImage.scss';


interface UploadImageProps {
	// socialMediaData?: any,
	// setImage: Function;
	// setSrc: Function;
	currentImage?: any,
	setCurrentImage: Function,
	field?: any,
	theref?: any,
	refId?: any,
	crop?: any,
	circularCrop?: boolean,
	showCroppedPreview?: boolean,
}

const UploadImage: React.FC<UploadImageProps> = ( UploadImageProps ) => {

	const { state: authState } = React.useContext(AuthContext);
	const [src, setSrc] = useState<any>("");
	const [crop, setCrop] = useState<any>({ aspect: 2 / 1 });
	const [imageRef, setImageRef] = useState<any>("");
	const [fileUrl, setFileUrl] = useState<any>("");
	const [croppedImageUrl, setCroppedImageUrl] = useState<any>("");
	const [theImage, setTheImage] = useState<any>("");

	const [uploadProgress, setUploadProgress] = useState<any>("");

	const [aNewImage, setANewImage] = useState<boolean>(false);

	const { isLoading: isLoadingUploadImage, isSuccess: isSuccessUploadImage, error: isLoadingUploadImageError, mutateAsync: addUploadImageMutation } = useUploadImage( authState?.user.profile, UploadImageProps.setCurrentImage, setUploadProgress );
	const { isLoading: isDeletingImage, error: isDeletingImageError, mutateAsync: addDeletingImageMutation } = useDeleteImage();

	// console.log(imageRef);

	// console.log(isLoadingUploadImage);

	// useEffect(() => {

	// 	setCrop(UploadImageProps.crop);

	// }, [setCrop(UploadImageProps.crop)])

	// !isLoadingUploadImage && setUploadProgress(0);
	// console.log( UploadImageProps.currentImage );

	const onDrop = useCallback((acceptedFiles) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => setSrc(reader.result));
		reader.readAsDataURL(acceptedFiles[0]);
		setTheImage(acceptedFiles[0]);
		
		setUploadProgress(0);
		// console.log(acceptedFiles[0]);
	}, []);
 
	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

	const dateNumber = new Date().getTime();
	const randomString = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
	const fileName = theImage?.name?.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '-').toLowerCase();
	const fileExtension = theImage?.name?.split('.').pop();
	const newFileName = dateNumber + "-" + randomString + "-" + fileName + "." + fileExtension;
    

  	const blobToFile = (theBlob:any, fileName:any) => {
    	const lastModifiedDate = new Date().getTime();
		const file = new File([theBlob], fileName, {lastModified: lastModifiedDate, type: "image/jpg"});
		return file;
	}

  	
	const uploadImage = async (field:any, theref:any, refId:any ) => {

		setANewImage(false);

		if(croppedImageUrl) {
		let blob = await fetch(croppedImageUrl).then(r => r.blob());

			addUploadImageMutation( [ { data: blobToFile(blob, newFileName), field: field, theref: theref, refId: refId } ] );

		} else if (theImage) { 

			addUploadImageMutation( [ { data: blobToFile(theImage, newFileName), field: field, theref: theref,  refId: refId } ] );

		}

		// setANewImage(true);



		// UploadImageProps.setCurrentImage(null);

	}


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

	const removeImage = () => {
		// console.log('remove image');
		
		addDeletingImageMutation(UploadImageProps.currentImage.id);

		UploadImageProps.setCurrentImage(null);
		setSrc(null);
		setCroppedImageUrl(null);
	}

	const changeImage = () => {
		
		// console.log('change image');

		setANewImage(true);
		setSrc(null);
		setCroppedImageUrl(null);
	}

	const cancelUpload = () => {

		// console.log('cancel upload');
		setANewImage(true);
		setSrc(null);
		setCroppedImageUrl(null);
	
	}

	

	return <div className="upload-image-wrap">
	
	
			{ UploadImageProps.currentImage && !aNewImage ? 
		
			<div className="current-image-thumb">

				{/* {console.log(UploadImageProps.currentImage)} */}
				
				<img className={ UploadImageProps.circularCrop ? "circle-crop" : "" } alt="current thumbnail" src={  process.env.REACT_APP_S3_URL + "/cover_sm_" +  UploadImageProps.currentImage?.hash + UploadImageProps.currentImage?.ext } />
				<IonButtons slot="end" className="buttons-end">
					<IonButton buttonType="link" className="link" onClick={ () => changeImage() } >Change Image</IonButton>
					<IonButton buttonType="link" className="link" onClick={ () => removeImage() } >Remove Image</IonButton>
				</IonButtons>
                
			</div>
			: 
			
			 <div className="upload-image">

				 
				{ !src && <div className="dropzone" {...getRootProps()}>
				 	<input {...getInputProps()} /> 
					{
						isDragActive ?
						<p>Drop the files here ...</p> :
						<p>Drag &amp; drop your image here, or click to select image</p>
					}
				</div> }
				
				<div className="crop-area">

				{ isLoadingUploadImage && <div className="loading-overlay"><IonSpinner name="dots" color="light" /></div> }

				<ReactCrop src={src} keepSelection={true} ruleOfThirds={true} circularCrop={ UploadImageProps.circularCrop } crop={crop} 
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
					
					makeFirstCrop(img, firstCrop, img.name);

					setImageRef(img);

					return false;
					 }}
				onComplete={(crop:any) => makeClientCrop(crop)}
				onChange={(newCrop:any) => {setCrop(newCrop);}} />
				</div>
				
				{croppedImageUrl && UploadImageProps.showCroppedPreview && (<img alt="Crop" className={ UploadImageProps.circularCrop ? "circle-crop" : "" } style={{ maxWidth: '100%' }} src={croppedImageUrl} />)}
				
				{ uploadProgress > 0 && isLoadingUploadImage &&
				 <IonProgressBar color="primary" value={ uploadProgress / 100 }></IonProgressBar> }
				 
				

				{theImage && src && <IonButtons slot="end" className="buttons-end">
				{ uploadProgress > 0 && <h2 className="ion-align-self-start upload-progress">{uploadProgress}%</h2> }
					{ !isLoadingUploadImage && <IonButton color="primary" size="small" className="" onClick={() => uploadImage(UploadImageProps.field, UploadImageProps.theref, UploadImageProps.refId )} >Upload</IonButton> }
					<IonButton buttonType="link" className="link" onClick={ () => cancelUpload() } >Cancel</IonButton>
				</IonButtons>}

				
			</div>
			
		
		}
			
	</div>;

}

export default UploadImage;

