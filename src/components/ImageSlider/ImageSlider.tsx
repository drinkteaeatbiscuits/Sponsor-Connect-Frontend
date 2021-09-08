import { IonCol, IonGrid, IonIcon, IonImg, IonRow, IonSlide, IonSlides } from "@ionic/react";
import React from "react";

import './image-slider.scss';

interface ImageSliderProps {
	images?: any,
}

const slideOpts = {
	initialSlide: 0,
	speed: 400,
	grabCursor: true,
	slidesPerView: 'auto',
	spaceBetween: 8,
	slidesOffsetBefore: 16,
	slidesOffsetAfter: 8,
	navigation: false,
	pagination: false

  };

const ImageSlider: React.FC<ImageSliderProps> = ( ImageSliderProps ) => {


	return <IonSlides pager={true} options={slideOpts}>

			
    { ImageSliderProps.images.map((item: any) => { 

		// console.log(item); 
		return <IonSlide key={ item.id }>
					<img alt={ "Profile Image " + item.id } src={ (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + item.url } />
				</IonSlide>; 
	
	} ) } 
           
  </IonSlides>;

}

export default ImageSlider;

