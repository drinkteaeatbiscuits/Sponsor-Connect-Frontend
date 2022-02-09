import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';

import parse from 'html-react-parser';

import { useHistory, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React, { useState } from 'react';
import TabBar from '../../components/TabBar';

import './DugoutArticles.scss';
import useDugoutArticles from '../../hooks/useDugoutArticles';




export interface props {}

const DugoutArticles: React.FC = () => {

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  
	const {data: posts, isSuccess} = useDugoutArticles( true );


	const updatedDate = (date) => {

	}
	console.log(posts);

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

			{
				isSuccess && posts.map((post) => {
					return <article key={post.id} className="post">
							<div className="post-info">
								<h4 onClick={() => {history.push('/the-dugout/' + post.slug, post)}} className="m-0">{ parse(post.title.rendered) }</h4>
								<div className="entry-header__meta entry-meta">
									<span className="pr-3 d-inline-block pb-2" style={{paddingRight:"12px"}}>Written by { post._embedded?.author[0]?.name }</span>

									
										{/* { { let postDate = new Date(post.date); } }
									
										
										<?php 
										$u_time = get_the_time('U');
										$u_modified_time = get_the_modified_time('U');
										if ($u_modified_time >= $u_time + 86400) {
										$updated_date = get_the_modified_time('F jS, Y');
										$updated_time = get_the_modified_time('h:i a');
										echo '<span className="last-updated pr-3 d-inline-block  pb-2">Last updated: '. $updated_date .'</span>';
										} ?> */}
									



									{ post.date && <span className="published d-inline-block pb-2">Published: { post.date }</span> }
									
									
								</div>
							</div>	
							<div className="post-image">
								{/* <?php if(get_the_post_thumbnail_url()){ ?><a href="<?php the_permalink(); ?>"><img className="d-block" src="<?php echo get_the_post_thumbnail_url($post_id, 'image_3x2_sm'); ?>" /></a><?php } ?> */}
							</div>
						</article>
									})
								}

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
