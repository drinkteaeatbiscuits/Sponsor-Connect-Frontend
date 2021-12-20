import { IonIcon } from '@ionic/react';
import { link } from 'ionicons/icons';
import React from 'react'
import useNewsFeed from '../../hooks/useNewsFeed';

export const NewsFeed = (props) => {
    const {isLoading: isLoadingNews, data: dataNews, error: errorNews, isSuccess: isSuccessNews} = useNewsFeed();
  
    const {articleCount} = props;
     
    const sortedArticles = () => {
        const theSortedArticles = dataNews.sort((firstEl, secondEl) => { 
          console.log(firstEl);
         return +new Date(firstEl.newsDate) - +new Date(secondEl.newsDate)
        } );
   
        const theFilteredArticles = theSortedArticles.filter((article) => +new Date(article.newsDate) < +new Date());
   
        return theFilteredArticles;
     }
   
      console.log(articleCount);
   
     isSuccessNews && console.log(sortedArticles());
     
    return (
        <div className="news-feed">
              <p className="dashboard-section-title">Latest News</p>
              
              { isSuccessNews && sortedArticles().map(( newsData:any )=>{
           
           const date = new Date(newsData.newsDate);
           const strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
           const articleDate = date.getDate();
           const articleMonth = strArray[date.getMonth()];

           return <div key={newsData.id} className="news-article">
                    <div className="news-article-header">
                      <p className="news-title">{ newsData.newsTitle }</p>
                      <p className="news-date">{ articleDate } { articleMonth }</p>
                    </div>
                    
                    <p className="news-description">{ newsData.newsDescription }</p>
                    <a href={ newsData.newsLink } className="news-link"><IonIcon color="primary" icon={link} /> <span>{ newsData.newsLink }</span></a>

                  </div>
     
              }) }
              
            </div>
    )
}
