import { IonButton, IonContent, IonDatetime, IonInput, IonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import useAddPost from '../../hooks/useAddPost';
import useEditPost from '../../hooks/useEditPost';
import EditorSection from '../EditorSection/EditorSection'
import NewImageUpload3 from '../NewImageUpload3/NewImageUpload3';

import { Calendar } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const NewNewsArticle = () =>  {

    const [newsTitle, setNewsTitle] = useState("");
    const [newsDescription, setNewsDescription] = useState("");
    const [newsLink, setNewsLink] = useState("");
    const [newsDate, setNewsDate] = useState(new Date().toISOString());
    const [currentImage, setCurrentImage] = useState("");
    const [showPosts, setShowPosts] = useState(false);
    const [publishedAt, setPublishedAt] = useState<any>(null);
    const [newsId, setNewsId] = useState<any>(null);
    const [showModal, setShowModal] = useState<any>(false);

    const { data: postData, isSuccess: postSuccess, mutateAsync: addPostMutation } = useAddPost();
    const { mutateAsync: editPostMutation } = useEditPost( newsId );

    useEffect(() => {

        // !newsId && !postSuccess && createPost();
    
        postSuccess && setNewsId(postData.id);
    
        newsId && !publishedAt && setPublishedAt(new Date().toISOString());
    
      }, [newsId, publishedAt, postSuccess])

    const createPost = async () => {
    
        await addPostMutation({
            newsTitle,
            newsDescription,
            newsLink,
            newsDate,
            published_at: publishedAt 
        });
    
      }
    
    const editPost = async () => {
        await editPostMutation({
            newsTitle,
            newsDescription,
            newsLink,
            newsDate: date ? date.toISOString() : publishedAt,
            published_at: publishedAt
        })
    }


    const [date, setDate] = useState(new Date());

    // console.log(date);
    console.log(newsId);
      


    return (
        <div className='new-news-article' style={{backgroundColor: "#fff", padding: "16px", borderRadius: "5px"}}>
            
           <div className="" style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #dddddd", margin: "0 0 8px"}}>
            <p style={{flexGrow: 1, fontWeight: 700, fontSize: "2em", color: "var(--ion-color-dark)", padding: "0 0 4px", margin: "0"}}>New Post</p>
            <p onClick={() => {setShowPosts(showPosts ? false : true)}} style={{justifySelf: "flex-end", fontSize: "0.9em", fontWeight: 400, color: "var(--ion-color-medium)", padding: "0 12px 0 0", margin: "0", cursor: "pointer"}}>Cancel</p>
            <p onClick={() => {setShowPosts(showPosts ? false : true); !showPosts ? createPost() : editPost()}} style={{justifySelf: "flex-end", fontWeight: 500, color: "var(--ion-color-primary)", padding: "0", margin: "0", cursor: "pointer"}}>{!showPosts ? "Add New Post" : "Save Post"}</p>
           </div>

           { showPosts && <div className="">
                <div>
                    <label style={{color: "var(--ion-color-dark)", fontWeight: 700, paddingBottom: "5px", display: "block"}}>Title</label>
                    <IonInput autocomplete="off" 
                        autocapitalize="on" 
                        type="text" 
                        value={ newsTitle } 
                        onIonChange={ (e:any) => {
                            setNewsTitle( e.detail.value );  
                        } } />
            
                </div>
                <div style={{padding: "8px 0"}}>
                    <label style={{color: "var(--ion-color-dark)",fontWeight: 700, paddingBottom: "5px", display: "block"}}>Description</label>
            
                    <IonInput autocomplete="off" 
                        autocapitalize="on" 
                        type="text" 
                        value={ newsDescription } 
                        onIonChange={ (e:any) => {
                            setNewsDescription( e.detail.value );  
                        } } />
                </div>
                <div>
                        <label style={{color: "var(--ion-color-dark)",fontWeight: 700, paddingBottom: "5px", display: "block"}}>Link</label>
                    
                        <IonInput autocomplete="off" 
                            autocapitalize="on" 
                            type="url" 
                            value={ newsLink } 
                            onIonChange={ (e:any) => {
                                setNewsLink( e.detail.value );  
                            } } />
                </div>

                <div className="">
                    
                    <Calendar date={date} onChange={e => setDate(e)} />
                    {/* <IonDatetime  value={newsDate} first-day-of-week="1" onIonChange={e => setNewsDate(e.detail.value!)}></IonDatetime> */}

                    <div className="">
                        <NewImageUpload3 
                            setCurrentImage={setCurrentImage} 
                            field="newsImage" 
                            theref="news-article" 
                            refId={newsId} 
                            label="Image" 
                            /> 
                    </div>

                </div>
            </div> 
            
            }
            
            
        </div>
    )
}

export default NewNewsArticle

// currentImage?: any,
// 	setCurrentImage: Function,
// 	field?: any,
// 	theref?: any,
// 	refId?: any,
// 	imageCropAspectRatio?: any,
// 	circularCrop?: boolean,
// 	showCroppedPreview?: boolean,
// 	label?: any,
// 	showUploadArea?: boolean,
// 	className?: string,
// 	required?: boolean,