import { IonButton, IonButtons, IonProgressBar } from "@ionic/react";
import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone';
import ReactCrop from "react-image-crop";
import { AuthContext } from "../../App";
import useDeleteImage from "../../hooks/useDeleteImage";
import useUploadImage from "../../hooks/useUploadImage";

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


// Merge the locale objects
const myLocale = {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
	...plugin_filter_locale_en_gb,
	...plugin_finetune_locale_en_gb
};

setPlugins(plugin_crop, plugin_finetune, plugin_filter);

const imageWriter = createDefaultImageWriter({
    store: (state, options, onprogress) =>
        new Promise((resolve, reject) => {
            const { dest } = state;

            // create a formdata object to send to the server
            const formData = new FormData();
            formData.append('files', dest, dest.name);
			// formData.append( "ref", "profile" );
			// formData.append( "refId", "3" );
			// formData.append( "field", "coverImage" ); 

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
                    // store request in state so it can be accessed by other processes
                    state.store = request;
                    resolve(state);
                } else {
                    reject('oh no something went wrong!');
                }
            };

            // start uploading the image
            request.send(formData);
        }),
});


const NewImageUpload3: React.FC = () => {

	// This function is called when the user taps the edit button, it opens the editor and returns the modified file when done
const editImage = (image:any, done:any) => {
    const imageFile = image.pintura ? image.pintura.file : image;
    const imageState = image.pintura ? image.pintura.data : {};

    const editor = openEditor({
        src: imageFile,
        imageState,
		imageCropAspectRatio: 16 / 9,
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

const [file, setFile] = useState<any>("");
// const [src, setSrc] = useState<any>("");

console.log(file?.pintura?.file);

// const onDrop = useCallback((acceptedFiles) => {

// 	setFiles(
// 		acceptedFiles.map((file:any) =>
// 			Object.assign(file, {
// 				preview: URL.createObjectURL(file),
// 			})
// 		)
// 	);

// }, []);


const getFileName = (file: any) => {
	const dateNumber = new Date().getTime();
	const randomString = [...Array(12)].map(() => Math.random().toString(36)[2]).join('');
	const fileName = file?.name?.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '-').toLowerCase();
	const fileExtension = file?.name?.split('.').pop();
	const newFileName = dateNumber + "-" + randomString + "-" + fileName + "." + fileExtension;

	return newFileName;
}



const onDrop = useCallback((acceptedFiles) => {

	
	Object.assign(acceptedFiles[0], {
						preview: URL.createObjectURL(acceptedFiles[0]),
					})
	
	setFile(acceptedFiles[0]);
	
	// setUploadProgress(0);
	// console.log(acceptedFiles[0]);
}, []);

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
	() => () => {
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

	
	

	return <div className="new-image-upload">

		<section className="container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>{thumbs}</aside>
        </section>

		
	</div>

}

export default NewImageUpload3;

