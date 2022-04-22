import { IonButton, IonButtons, IonProgressBar } from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone';
import ReactCrop from "react-image-crop";
import { AuthContext } from "../../App";
import useDeleteImage from "../../hooks/useDeleteImage";
import useUploadImage from "../../hooks/useUploadImage";

import './NewImageUpload3.scss';

// Import the editor styles
import 'pintura/pintura.css';

import {

	// The method used to register the plugins
    setPlugins,

    // The plugins we want to use
    plugin_crop,
    plugin_finetune,
    plugin_filter,
	plugin_filter_defaults,
	plugin_finetune_defaults,

    // Our factory method
    openEditor,
	locale_en_gb, 
	plugin_crop_locale_en_gb,
	plugin_finetune_locale_en_gb,
	plugin_filter_locale_en_gb,

	createDefaultImageReader,
	createDefaultImageWriter

} from 'pintura';
import { useQueryClient } from "react-query";



interface UploadImageProps {
	// socialMediaData?: any,
	// setImage: Function;
	// setSrc: Function;
	currentImage?: any,
	setCurrentImage: Function,
	field?: any,
	theref?: any,
	refId?: any,
	imageCropAspectRatio?: any,
	circularCrop?: boolean,
	showCroppedPreview?: boolean,
	label?: any,
	showUploadArea?: boolean,
	className?: string,
	required?: boolean,
	isProfileBuild?: boolean,
}


// Merge the locale objects
const myLocale = {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
	...plugin_filter_locale_en_gb,
	...plugin_finetune_locale_en_gb
};

setPlugins(plugin_crop, plugin_finetune, plugin_filter);

const getFileName = (file: any) => {
	const dateNumber = new Date().getTime();
	const randomString = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
	const fileName = file?.name?.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '-').toLowerCase();
	const fileExtension = file?.name?.split('.').pop();
	const newFileName = dateNumber + "-" + randomString + "-" + fileName + "." + fileExtension;

	return newFileName;
}



 
const NewImageUpload3: React.FC<UploadImageProps> = (UploadImageProps) => {

	const { state: authState } = React.useContext(AuthContext);
	
	const {isProfileBuild} = UploadImageProps;

	const client = useQueryClient();

	const imageWriter = createDefaultImageWriter({
		// Generate Unique File Name
		renameFile: (file) => getFileName(file),

		
		// targetSize: {
		// 	width: 1920,
		// 	height: 1200,
		// 	fit: 'cover',
		// 	upscale: true,
		// },
	
		// Fix image orientation
		orientImage: true,
	
		// Don't retain image EXIF data
		copyImageHead: false,
	
		// Convert all input images to jpegs
		mimeType: 'image/jpeg',
	
		// Scale all input canvas data to fit a 4096 * 4096 rectangle
		canvasMemoryLimit: 4096 * 4096,
		store: (state, options, onprogress) =>
			new Promise((resolve, reject) => {
				const { dest } = state;
	
				// create a formdata object to send to the server
				const formData = new FormData();
				formData.append('files', dest, dest.name);
				formData.append( "ref", UploadImageProps.theref );
				formData.append( "refId", UploadImageProps.refId );
				formData.append( "field", UploadImageProps.field ); 
	
				// create a request object
				const request = new XMLHttpRequest();
				request.withCredentials = true;
				request.open('POST', (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/upload", true);
	
				// show progress in interface
				request.upload.onprogress = onprogress;
	
				// catch errors
				request.onerror = () => reject('oh no something went wrong!');
				request.ontimeout = () => reject('oh no request timed out!');
	
				// handle success state
				request.onload = () => {
					if (request.status >= 200 && request.status < 300) {

						UploadImageProps.setCurrentImage(JSON.parse(request.response)[0]);

						setShowImageUpload(false);

						// store request in state so it can be accessed by other processes
						state.store = request;
						resolve(state);

						
						UploadImageProps.required && fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/update-profile-completion", {
							method: "POST",
							credentials: "include",
						}).then(() => {
							
							
							client.invalidateQueries(["profile"]);
							client.invalidateQueries(["profile", authState?.user?.profile]);

						})


					} else {
						reject('oh no something went wrong!');
					}
				};
	
				// start uploading the image
				request.send(formData);  
			}), 
	});

	const { isLoading: isDeletingImage, error: isDeletingImageError, mutateAsync: addDeletingImageMutation } = useDeleteImage(authState?.user?.profile);
	const [src, setSrc] = useState<any>("");
	const [croppedImageUrl, setCroppedImageUrl] = useState<any>("");
	const [aNewImage, setANewImage] = useState<boolean>(false);
	const [file, setFile] = useState<any>("");

	// This function is called when the user taps the edit button, it opens the editor and returns the modified file when done
	const editImage = (image:any, done:any) => {
    const imageFile = image.pintura ? image.pintura.file : image;
    const imageState = image.pintura ? image.pintura.data : {};

	 
    const editor = UploadImageProps.circularCrop ? openEditor({
        src: imageFile,
        imageState,
		imageCropAspectRatio: UploadImageProps.circularCrop ? 1 : UploadImageProps.imageCropAspectRatio || undefined,
		// Let's draw a circle on top of the editor preview when in the crop util
		
		willRenderCanvas: (shapes, state) => {

			const {
				utilVisibility,
				selectionRect,
				lineColor,
				backgroundColor,
			} = state;
	
			// Exit if crop utils is not visible
			if (utilVisibility.crop <= 0) return shapes;
	
			// Get variable shortcuts to the crop selection rect
			const { x, y, width, height } = selectionRect;
	
			return {
				// Copy all props from current shapes
				...shapes,
	
				// Now we add an inverted ellipse shape to the interface shapes array
				interfaceShapes: [
					{
						x: x + width * 0.5,
						y: y + height * 0.5,
						rx: width * 0.5,
						ry: height * 0.5,
						opacity: utilVisibility.crop,
						inverted: true,
						backgroundColor: [...backgroundColor, 0.5],
						strokeWidth: 1,
						strokeColor: [...lineColor],
					},
					// Spread all existing interface shapes onto the array
					...shapes.interfaceShapes,
				],
			};
		},
		locale: myLocale,
		imageReader: createDefaultImageReader(),
		...plugin_filter_defaults,
		...plugin_finetune_defaults,
		imageWriter: imageWriter,
    }) : openEditor({
        src: imageFile,
        imageState,
		imageCropAspectRatio: UploadImageProps.circularCrop ? 1 : UploadImageProps.imageCropAspectRatio || undefined,
		locale: myLocale,
		imageReader: createDefaultImageReader(),
		...plugin_filter_defaults,
		...plugin_finetune_defaults,
		imageWriter: imageWriter,
    }); 


    editor.on('close', () => {
        // nothing
    });

    editor.on('process', ({ dest, imageState }) => {
        Object.assign(dest, {
            pintura: { file: imageFile, data: imageState },
        });
        done(dest);
    });
};

const onDrop = (acceptedFiles:any) => editImage(acceptedFiles[0], () => {});

const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: 'image/*', onDrop});

const thumbs = <div key={file?.name}>
		<div>
			<img src={file?.preview} alt="" />
		</div>
		<button	
			onClick={() =>
				editImage(file, (output:any) => {

					const updatedFile = output;

					// revoke preview URL for old image
					if (file.preview) URL.revokeObjectURL(file.preview);

					// set new preview URL
					Object.assign(output, {
						preview: URL.createObjectURL(output),
					});

					// update view
					setFile( updatedFile );
				})
			}
		>
			Edit
		</button>
	</div>;


useEffect(
	() => {
		// Make sure to revoke the data uris to avoid memory leaks
		URL.revokeObjectURL(file.preview);
	},
	[file]
);



	// const [file, setFile] = useState<any>("");
	const [total, setTotal] = useState<any>("");
	const [loaded, setLoaded] = useState<any>("");

	const handleEvent = (e:any) => {
		console.log(e);
		console.log(e.loaded);
		console.log(e.total);
		
		setLoaded(e.loaded);
		setTotal(e.total);
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


	const [ showImageUpload, setShowImageUpload ] = useState(false);

	
	

	return <div className={"editor-section upload-image-wrap " + ( UploadImageProps.className && UploadImageProps.className )  }>

					{ !isProfileBuild && <div className="editor-section-top">

						<label className="editor-section-title">{ UploadImageProps.label }</label>
						
						<div className="editor-section-top-buttons">

							{ UploadImageProps.currentImage ? 
							<div className="editor-section-button" onClick={() => removeImage()}>Remove Image</div> : 
							!showImageUpload ? <div className="editor-section-button" onClick={() => setShowImageUpload(true)}>Add Image</div> : 
							<div className="editor-section-button secondary" onClick={() => setShowImageUpload(false)}>Cancel</div> }
						

						</div>	

					</div> }

					{ !isProfileBuild && <div className="editor-section-bottom">



						{ UploadImageProps.currentImage ? 
							UploadImageProps.showCroppedPreview && <div className="current-image">
								
								<img onError={(e) => {let image = e.target as HTMLImageElement; image.src = process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  UploadImageProps.currentImage?.hash + UploadImageProps.currentImage?.ext }} className={ UploadImageProps.circularCrop ? "circle-crop" : "" } alt="current thumbnail" src={  process.env.REACT_APP_S3_URL + "/images/cover_sm/" +  UploadImageProps.currentImage?.hash + UploadImageProps.currentImage?.ext } />
							
							</div> : showImageUpload &&
							<div className="upload-image">
								<div {...getRootProps({ className: 'dropzone' })}>
									<input {...getInputProps()} />
									<p>Drag 'n' drop some files here, or click to select files</p>
								</div>
							</div>
						}
						
					</div> }



					{ isProfileBuild && 
					<div className="profile-build-upload">
						

						{ UploadImageProps.currentImage ? <div>
							<IonButton onClick={() => removeImage()} size="small" expand="block" color="tertiary">Remove Image</IonButton>
						
						</div> : 
						<div className="upload-image">
							<div {...getRootProps({ className: 'dropzone' })}>
								<input {...getInputProps()} />
								<p>Drag 'n' drop some files here, or click to select files</p>
							</div>
						</div> }

					</div>
					 }
					
			</div>


}

export default NewImageUpload3;

