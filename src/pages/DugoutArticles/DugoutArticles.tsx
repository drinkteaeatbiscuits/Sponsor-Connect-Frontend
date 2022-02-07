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


	console.log(posts);

  return (
    <IonPage> 
      <TabBar activeTab="dugout" />
      
      <IonContent fullscreen className="ion-padding dugout" >
		  <div className="" style={{paddingTop: "120px"}}>
			{
				isSuccess && posts.map((post) => {
					return <article key={post.id} className="" onClick={() => {history.push('/the-dugout/' + post.slug, post)}}>
						{ parse(post.title.rendered) }
					</article>
				})
			}
		  </div>
		
		
		

      </IonContent>
      
    </IonPage>
  );
};

export default DugoutArticles;
