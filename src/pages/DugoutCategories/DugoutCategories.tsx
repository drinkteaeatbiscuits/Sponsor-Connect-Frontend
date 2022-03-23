import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';

import parse from 'html-react-parser';

import { useHistory, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';

import './DugoutCategories.scss';
import useDugoutArticles from '../../hooks/useDugoutArticles';

import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';
import MetaTags from '../../components/MetaTags/MetaTags';


export interface props { }

const DugoutCategories: React.FC = () => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);


	const dugoutCategoryStyles = {
		flexGrow: 1,
		maxWidth: '420px',
		background: '#fff', 
		padding: '16px',
		margin: '8px 16px',
		minWidth: '280px',
		
		// minHeight: '400px',
		borderTop: '4px solid var(--ion-color-primary)'

	}


	//   console.log(allPosts);

	return (
		<IonPage>

			<MetaTags title={'Dugout | Sponsor Connect'} path={'/the-dugout-categories'} description={'Sponsor Connect Dugout.'} image={ "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

			<TabBar activeTab="the-dugout" />

			<IonContent fullscreen className="ion-padding dugout" >
				<div className="dugout-articles">

					<div className="posts-header">
						<h1 className="posts-title">The Dugout</h1>
					</div>

					<ErrorBoundary>
						<div className="dugout-categories"
						style={{
							display: 'flex',
							justifyContent: 'flex-start',
							flexWrap: 'wrap',
							maxWidth: '920px',
							marginLeft: 'auto',
							marginRight: 'auto', 
						}}>
							<div className="dugout-category"
							onClick={() => {
								history.push('/the-dugout', {category: 'articles', refetch: true})
							}}
							style={dugoutCategoryStyles}>
								<div className=""
								style={{
									width: '100%',
									height: '180px',
									overflow: 'hidden',
									position: 'relative',
									background: 'var(--ion-color-primary)'
								}}>
									<img style={{
										maxWidth: '100%',
										objectFit: 'cover',
										objectPosition: 'center center',
										position: 'absolute',
										width: '100%',
										height: '100%',
										// mixBlendMode: 'luminosity'
									}} 
									src="https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/articles-category.jpg" />
								</div>
								<p style={{margin: '8px 0', 
								fontWeight: 700,
								fontSize: '1.8em',
								letterSpacing: '-0.01em',
								}}>Articles</p>
								<p>Informative articles, information and advice about sponsorship in sports.</p>
							</div>
							<div className="dugout-category"
							onClick={() => {
								history.push('/the-dugout', {category: 'templates', refetch: true})
							}}
							style={dugoutCategoryStyles}>
								<div className=""
								style={{
									width: '100%',
									height: '180px',
									overflow: 'hidden',
									position: 'relative',
									background: 'var(--ion-color-primary)'
								}}>
									<img style={{
										maxWidth: '100%',
										objectFit: 'cover',
										objectPosition: 'center center',
										position: 'absolute',
										width: '100%',
										height: '100%',

									}} src="https://sponsor-connect-website-images.s3.eu-west-2.amazonaws.com/templates.jpg" />
								</div>
								
								<p style={{margin: '8px 0',
								fontWeight: 700,
								fontSize: '1.8em',
								letterSpacing: '-0.01em',
								}}>Templates</p>
								<p>Useful email templates to help when contacting potential sponsors.</p>
							</div>
						</div>

					</ErrorBoundary>

				</div>




			</IonContent>

		</IonPage>
	);
};

export default DugoutCategories;
