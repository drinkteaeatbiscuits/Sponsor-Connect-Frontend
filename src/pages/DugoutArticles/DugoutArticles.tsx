import { IonButton, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/react';

import parse from 'html-react-parser';

import { useHistory, useLocation, useParams } from 'react-router';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import TabBar from '../../components/TabBar';

import './DugoutArticles.scss';
import useDugoutArticles from '../../hooks/useDugoutArticles';

import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import ErrorBoundary from '../../containers/ErrorBoundary/ErrorBoundary';
import { useQueryClient } from 'react-query';


export interface props { }

const DugoutArticles: React.FC = () => {

	const history = useHistory();
	const { state: authState } = React.useContext(AuthContext);
	const location = useLocation<any>();


	const category = location?.state?.category;

	// const [allPosts, setAllPosts] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalPosts, setTotalPosts] = useState(0);
	const [theCategory, setTheCategory] = useState("");

	const [allPosts, setAllPosts] = useState<any>([]);

	const { status,
		data,
		error,
		isFetching,
		isSuccess,
		refetch } = useDugoutArticles(page, setTotalPages, setTotalPosts, category);


	const updatedDate = (updated, published) => {
		let updatedDate = new Date(updated)
		let publishedDate = new Date(published)

		if (updatedDate.getTime() > publishedDate.getTime()) {
			return <span style={{ paddingRight: "12px", display: "inline-block", paddingBottom: "12px" }} className="last-updated pr-3 d-inline-block  pb-2">Last updated: {updatedDate.getDate() + "/" + (updatedDate.getMonth() + 1) + "/" + updatedDate.getFullYear()}</span>;
		} else {
			return
		}
	}
	


	useEffect(() => {

		category && setTheCategory(category);

		if(category !== theCategory) { 

			setAllPosts([]);
			setPage(1);

			page === 1 && refetch();
			data && allPosts.length < totalPosts && data[0]?.id !== allPosts[0]?.id && setAllPosts(data);
			setTheCategory(category);

		}else{
			// console.log('same category');
			data && allPosts.length < totalPosts && data[0]?.id !== allPosts[0]?.id && setAllPosts([...allPosts, ...data]);
		}
		

	}, [data, category]);

	

	const getNextPage = () => {

		totalPages > page && setPage(page + 1);

	}

	const loadMoreButtonRef = React.useRef<any>();

	useIntersectionObserver({
		root: null,
		rootMargin: "0px 0px 500px 0px",
		target: loadMoreButtonRef,
		threshold: 0,
		onIntersect: () => { isSuccess && getNextPage(); isSuccess && console.log("intersecting") },

	});

	//   console.log(allPosts);

	return (
		<IonPage>
			<TabBar activeTab="the-dugout" />

			<IonContent fullscreen className="ion-padding dugout" >
				<div className="dugout-articles">

					<div className="posts-header">
						<h1 className="posts-title">The Dugout</h1>
					</div>

					<ErrorBoundary>
						<div className="posts">
							<div className="posts-container">


								{allPosts && allPosts.length > 0 && allPosts?.map((post) => {

									return <article key={post.id} className="post">
										<div className="post-info">

											<h4 onClick={() => { history.push('/the-dugout/' + post.slug, post) }} style={{ margin: "0", cursor: "pointer" }}>{parse(post.title.rendered)}</h4>
											<div className="entry-header__meta entry-meta">
												<span className="" style={{ paddingRight: "12px", display: "inline-block", paddingBottom: "12px" }}>Written by {post._embedded?.author[0]?.name}</span>

												{/* {updatedDate(post.modified, post.date)} */}

												{post.date && <span className="published" style={{ display: "inline-block", paddingBottom: "12px" }}>Published: {new Date(post.date).getDate() + "/" + (new Date(post.date).getMonth() + 1) + "/" + new Date(post.date).getFullYear()}</span>}


											</div>
										</div>
										<div className="post-image">
											{/* <?php if(get_the_post_thumbnail_url()){ ?><a href="<?php the_permalink(); ?>"><img className="d-block" src="<?php echo get_the_post_thumbnail_url($post_id, 'image_3x2_sm'); ?>" /></a><?php } ?> */}
											{post?.featured_image && <img onClick={() => { history.push('/the-dugout/' + post.slug, post) }} className="" style={{ display: "block", cursor: "pointer" }} src={post?.featured_image_array.dugout_image_strip_sm_x2} />}
										</div>
										<div className="post-category">
											{post.categories.includes(66) ? "Template" : "Article"}
										</div>
									</article>
								})
								}


								{totalPages > page && <IonButton ref={loadMoreButtonRef} onClick={() => { getNextPage(); }}>
									Load More
								</IonButton>}

								{isFetching && <IonSpinner style={{ margin: "0 auto", display: "block" }} />}

							</div>
						</div>

					</ErrorBoundary>

				</div>




			</IonContent>

		</IonPage>
	);
};

export default DugoutArticles;
