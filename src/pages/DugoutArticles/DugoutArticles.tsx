import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import parse from 'html-react-parser';

import { useHistory, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';

import './DugoutArticles.scss';
import useDugoutArticles from '../../hooks/useDugoutArticles';




export interface props {}

const DugoutArticles: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  
	

	// const [allPosts, setAllPosts] = useState(null);
	const [page, setPage] = useState(1);
	const {status,
		data,
		error,
		isFetching,
		isFetchingNextPage,
		isFetchingPreviousPage,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage,
		hasPreviousPage,
		isSuccess } = useDugoutArticles( true, page );


	const updatedDate = (updated, published) => {
		let updatedDate = new Date(updated)
		let publishedDate = new Date(published)

		if(updatedDate.getTime() > publishedDate.getTime()){
			return <span style={{paddingRight:"12px", display: "inline-block", paddingBottom: "12px"}} className="last-updated pr-3 d-inline-block  pb-2">Last updated: { updatedDate.getDate()  + "/" + (updatedDate.getMonth()+1) + "/" + updatedDate.getFullYear() }</span>;
		}else{
			return
		}
	}
	console.log(data);

	const loadMoreButtonRef = React.useRef(null);
	// const getMorePosts = () => {
	// 	console.log('get more posts');
	// 	setPage(page + 1);
	// }

  return (
    <IonPage> 
      <TabBar activeTab="dugout" />
      
      <IonContent fullscreen className="ion-padding dugout" >
		  <div className="dugout-articles">
		  	
			<div className="posts-header">
				<h1 className="posts-title">The Dugout</h1>
			</div>

			<div className="posts">
			<div className="posts-container">

			
			{ isSuccess && data instanceof Object && data?.pages?.map((page) => {
				return <React.Fragment key={page[0].id}>
				{console.log(page)}
				{ page && page?.map((post) => {
					{console.log(post)}
					return <article key={post.id} className="post">
								<div className="post-info">

									<h4 onClick={() => {history.push('/the-dugout/' + post.slug, post)}} style={{margin: "0", cursor: "pointer"}}>{ parse(post.title.rendered) }</h4>
									<div className="entry-header__meta entry-meta">
										<span className="" style={{paddingRight:"12px", display: "inline-block", paddingBottom: "12px"}}>Written by { post._embedded?.author[0]?.name }</span>

										{ updatedDate(post.modified, post.date ) }

										{ post.date && <span className="published" style={{display: "inline-block", paddingBottom: "12px"}}>Published: { new Date(post.date).getDate()  + "/" + (new Date(post.date).getMonth()+1) + "/" + new Date(post.date).getFullYear() }</span> }
										
										
									</div>
								</div>	
								<div className="post-image">
									{/* <?php if(get_the_post_thumbnail_url()){ ?><a href="<?php the_permalink(); ?>"><img className="d-block" src="<?php echo get_the_post_thumbnail_url($post_id, 'image_3x2_sm'); ?>" /></a><?php } ?> */}
									{ post?.featured_image && <img onClick={() => {history.push('/the-dugout/' + post.slug, post)}} className="" style={{display: "block", cursor: "pointer"}} src={post?.featured_image_array.dugout_image_strip_sm_x2} /> }
								</div>
								<div className="post-category">
									{post.categories.includes(66) ? "Template" : "Article" }
								</div>
							</article>
				})
								}
				</ React.Fragment>
			})}

				
			<IonButton
              ref={loadMoreButtonRef}
              onClick={() => fetchNextPage()}
            //   disabled={!hasNextPage || isFetchingNextPage}
            >
              {/* {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load Newer'
                : 'Nothing more to load'} */}
            </IonButton>

				</div>
			</div>
		

			{/* {
				isSuccess && posts.map((post) => {
					return <article key={post.id} className="" onClick={() => {history.push('/the-dugout/' + post.slug, post)}}>
						{ parse(post.title.rendered) }
					</article>
				})
			} */}
		  </div>
		
		
		

      </IonContent>
      
    </IonPage>
  );
};

export default DugoutArticles;
