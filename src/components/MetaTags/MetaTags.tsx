import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { env } from "process";

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

        <Helmet prioritizeSeoTags>

            { metaTitle && metaTitle.length > 0 && <title  data-react-helmet='true'>{ metaTitle }</title> }
            { metaDescription && metaDescription.length > 0 && <meta name="description" content={ metaDescription } data-react-helmet='true' /> }

            { metaTitle && metaTitle.length > 0 && <meta property="og:title" content={ metaTitle } data-rh="true" data-react-helmet='true' /> }

            { metaDescription && metaDescription.length > 0 && <meta property="og:description" content={ metaDescription } data-rh="true"  data-react-helmet='true' /> }
            { metaImage && metaImage.length > 0 && <meta property="og:image" content={ metaImage } data-rh="true"  data-react-helmet='true' /> }

            <meta property="og:url" content={process.env.REACT_APP_PUBLIC_URL + pathname} data-react-helmet='true' />
            <meta property="og:type" content='website' data-react-helmet='true' />

        </Helmet>
  </>
}

export default MetaTags