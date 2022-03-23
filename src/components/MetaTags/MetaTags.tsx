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

  useEffect(() => {

        setMetaTitle(pathname === path ? title : '')
  
    }, [pathname]);



  return <>

        <Helmet>
          
            { metaTitle && metaTitle.length > 0 && <title>{ metaTitle }</title> }
            { description && description.length > 0 && <meta name="description" content={ description } /> }

            { metaTitle && metaTitle.length > 0 && <meta property="og:title" content={ metaTitle } data-rh="true" /> }

            { description && description.length > 0 && <meta property="og:description" content={ description } data-rh="true" /> }
            { image && <meta property="og:image" content={ image } data-rh="true" /> }

        </Helmet>
  </>
}

export default MetaTags