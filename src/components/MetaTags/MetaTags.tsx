import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface props {
	title?: any;
	path?: any;
	description?: any;
  image?: any;
}
 
const MetaTags: React.FC<props> = (props) => {
  const { pathname } = useLocation();

  const { title, path, description, image } = props;
  const [metaTitle, setMetaTitle] = useState<string>(title);
  const [metaDescription, setMetaDescription] = useState<string>(description);
  const [metaImage, setMetaImage] = useState<string>(image);

  // console.log(pathname);
  // console.log(path);

  useEffect(() => {

        setMetaTitle(pathname === path ? title : '');
        setMetaDescription(pathname === path ? description : '');
        setMetaImage(pathname === path ? image : '');
  
      }, [pathname]);


  return <>

        <Helmet>

            { metaTitle && metaTitle.length > 0 && <title>{ metaTitle }</title> }
            { metaDescription && metaDescription.length > 0 && <meta name="description" content={ metaDescription } /> }

            { metaTitle && metaTitle.length > 0 && <meta property="og:title" content={ metaTitle } data-rh="true" /> }

            { metaDescription && metaDescription.length > 0 && <meta property="og:description" content={ metaDescription } data-rh="true" /> }
            { metaImage && metaImage.length > 0 && <meta property="og:image" content={ metaImage } data-rh="true" /> }

        </Helmet>
  </>
}

export default MetaTags