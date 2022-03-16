import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface props {
	title?: any;
	path?: any;
}
 
const MetaTags: React.FC<props> = (props) => {
  const { pathname } = useLocation();

  const { title, path } = props;
  const [metaTitle, setMetaTitle] = useState<string>(title);

  useEffect(() => {

        setMetaTitle(pathname === path ? title : '')
  
    }, [pathname]);



  return <>

        <Helmet>
            { metaTitle && metaTitle.length > 0 && <title>{ metaTitle }</title> }
            {/* <meta name="description" content="Test" /> */}
        </Helmet>
  </>
}

export default MetaTags