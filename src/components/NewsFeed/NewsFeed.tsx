import { IonIcon } from '@ionic/react';
import { link } from 'ionicons/icons';
import React from 'react'
import useNewsFeed from '../../hooks/useNewsFeed';

export const NewsFeed = (props) => {
    const {isLoading: isLoadingNews, data: dataNews, error: errorNews, isSuccess: isSuccessNews} = useNewsFeed();
  
    const {articleCount} = props;
     
    const sortedArticles = () => {
        const theSortedArticles = dataNews.length > 0 ? dataNews.sort((firstEl, secondEl) => { 
          
         return +new Date(secondEl.newsDate) - +new Date(firstEl.newsDate)
         
        } ) : null;
   
        const theFilteredArticles = theSortedArticles ? theSortedArticles.filter((article) => +new Date(article.newsDate) < +new Date()) : [];
   
        return articleCount > 0 && theFilteredArticles ? theFilteredArticles.slice(0, articleCount) : theFilteredArticles;
     }
   
      // console.log(articleCount);
   
    //  isSuccessNews && console.log(sortedArticles());
     
    return (
        <div className="news-feed">

              { isSuccessNews && sortedArticles().map(( newsData:any )=>{
           
           const date = new Date(newsData.newsDate);
           const strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
           const articleDate = date.getDate();
           const articleMonth = strArray[date.getMonth()];

           const articleImage = newsData?.newsImage;

           return <div key={newsData.id} className="news-article">
                    <div className="news-article-header">
                      <p className="news-title">{ newsData.newsTitle }</p>
                      <p className="news-date">{ articleDate } { articleMonth }</p>
                    </div>
                    
                    <p className="news-description">{ newsData.newsDescription }</p>
                    <a href={ newsData.newsLink } target="_blank" className="news-link"><IonIcon color="primary" icon={link} /> <span>{ newsData.newsLink }</span></a>


                    {articleImage &&

                    <picture>
                    
                      <source type="image/webp" media="(max-width: 576px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xs/" + articleImage?.hash + ".webp"} />
                      <source type="image/webp" media="(max-width: 768px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_sm/" + articleImage?.hash + ".webp"} />
                      <source type="image/webp" media="(max-width: 992px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_md/" + articleImage?.hash + ".webp"} />
                      <source type="image/webp" media="(max-width: 1440px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_lg/" + articleImage?.hash + ".webp"} />
                      <source type="image/webp" media="(min-width: 1441px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xl/" + articleImage?.hash + ".webp"} />

                      <source type="image/jpeg" media="(max-width: 576px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xs/" + articleImage?.hash + articleImage?.ext} />
                      <source type="image/jpeg" media="(max-width: 768px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_sm/" + articleImage?.hash + articleImage?.ext} />
                      <source type="image/jpeg" media="(max-width: 992px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_md/" + articleImage?.hash + articleImage?.ext} />
                      <source type="image/jpeg" media="(max-width: 1440px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_lg/" + articleImage?.hash + articleImage?.ext} />
                      <source type="image/jpeg" media="(min-width: 1441px)" srcSet={process.env.REACT_APP_S3_URL + "/images/cover_xl/" + articleImage?.hash + articleImage?.ext} />

                      <img className="cover-image" src={process.env.REACT_APP_S3_URL + "/images/cover_xl/" + articleImage?.hash + articleImage?.ext} alt={newsData.newsTitle} />
                    
                    </picture>

                    }
                  </div>
     
              }) }
              
            </div>
    )
}
