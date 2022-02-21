import React from "react";

import './ImageGallery.scss';

interface ImageGalleryProps {
	images?: any,
	galleryId?: string,
}
 
const ImageGallery: React.FC<ImageGalleryProps> = (ImageGalleryProps) => {
	

	const { images, galleryId } = ImageGalleryProps;

	return <div className="image-gallery">

	{ images.map((profileImage: any) => {
			
	return <div key={profileImage.id} className="image" onMouseLeave={(e) => {(e.currentTarget.querySelector('.active')  as HTMLElement)?.classList.remove("active")}}>
			<div className="image-inner">
			<a
				href={profileImage?.url}
				data-fancybox={galleryId ? galleryId : "image-gallery"}
				>
					<picture>
						<source type="image/webp" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + ".webp" } />
						<source type="image/jpeg" srcSet={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + profileImage?.ext } />
						<img className="image-thumb" alt={ "Image " + profileImage.id } src={ process.env.REACT_APP_S3_URL + "/images/profile/" +  profileImage?.hash + profileImage?.ext } /> 
					</picture>
				</a>
			</div>
		</div>
	
			})
		}
  </div>  

}
 
export default ImageGallery;