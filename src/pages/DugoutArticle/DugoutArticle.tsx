import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import parse from 'html-react-parser';

import { useHistory, useLocation, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';

import './DugoutArticle.scss';
import { useQuery, useQueryClient } from 'react-query';
import useDugoutArticles from '../../hooks/useDugoutArticles';
import useDugoutArticle from '../../hooks/useDugoutArticle';

interface ParamTypes {
	slug: string;
  }


export interface props {}

const DugoutArticle: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

 
  const thelocation = useLocation<any>();

  
  
  const client = useQueryClient();
  
  const articleSlug = useParams<ParamTypes>().slug;

  const [articleContent, setArticleContent] = useState(thelocation.state);

  const {data: post, isSuccess} = useDugoutArticle( !!thelocation?.state, articleSlug );

  useEffect(() => {

	isSuccess && setArticleContent(post[0]);

	thelocation.state && setArticleContent(thelocation.state);

  }, [isSuccess, thelocation.state]);

  // console.log(articleContent);
  
//   console.log(articleContent?._embedded?['wp:featuredmedia'][0]?.media_details.sizes.thumbnail.source_url );

  return (
    <IonPage> 
      <TabBar activeTab="dugout" />
      
      <IonContent fullscreen className="ion-padding dugout-article" >
		  <div className="">
			
				<article className="single-post"> 


				{ articleContent?.featured_image &&	<div className="post-header-image">
						<picture>
							<source media="(max-width: 499px)" srcSet={ articleContent?.featured_image_array.dugout_image_strip_sm_x2 + " 2x," + articleContent?.featured_image_array.dugout_image_strip_sm + " 1x" } />
							<source media="(max-width: 1023px)" srcSet={ articleContent?.featured_image_array.dugout_image_strip_md_x2 + " 2x," + articleContent?.featured_image_array.dugout_image_strip_md + " 1x" } />
							<source media="(min-width: 1024px)" srcSet={ articleContent?.featured_image_array.dugout_image_strip_lg_x2 + " 2x," + articleContent?.featured_image_array.dugout_image_strip_lg + " 1x" } />
							<img className="post-featured-image" srcSet={ articleContent?.featured_image_array.dugout_image_strip_lg_x2 + " 2x," + articleContent?.featured_image_array.dugout_image_strip_lg + " 1x" } alt="" />
						</picture>
					</div> }

          
          { articleContent?.title && <div className="entry-header">
              <h1 className="post-title"> { parse( articleContent.title.rendered ) } </h1>
              <div className="entry-header__meta entry-meta">
                <span className="" style={{padding: "0 16px 16px 0", display: "inline-block"}}>Written by <a href="">tom@sponsor-connect.com</a></span>

                  {/* <span className="last-updated" style={{padding: "0 16px 16px 0", display: "inline-block"}}>Last updated: February 7th, 2022</span>				 */}
                {/* <span className="published"  style={{padding: "0 16px 16px 0", display: "inline-block"}}>Published: 4 February 2022</span> */}
                {articleContent.date && <span className="published" style={{ display: "inline-block" }}>Published: {new Date(articleContent.date).getDate() + "/" + (new Date(articleContent.date).getMonth() + 1) + "/" + new Date(articleContent.date).getFullYear()}</span>}

                
              </div>
            </div> }
          
					
					
          { articleContent?.content && <div className="entry-content"> { parse( articleContent.content.rendered ) } </div> }

				</article>
		  </div>
		
      </IonContent>
      
    </IonPage>
  );
};

export default DugoutArticle;


