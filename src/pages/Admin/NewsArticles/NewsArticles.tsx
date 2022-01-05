import { IonPage, IonContent } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../../../App';
import NewNewsArticle from '../../../components/NewNewsArticle/NewNewsArticle';
import { NewsFeed } from '../../../components/NewsFeed/NewsFeed';
import TabBar from '../../../components/TabBar';

const NewsArticles: React.FC = () => {

    const history = useHistory();
    const { state: authState } = React.useContext(AuthContext);

    return <IonPage>
        <TabBar activeTab="dashboard" />

        <IonContent fullscreen className="ion-padding dashboard">

            <div className="news-articles-content">
                <div className="" style={{margin: "0 auto", padding: "80px 16px", maxWidth: "720px"}}>
                    <NewNewsArticle />

                    <div className="" style={{
                        backgroundColor: "#fff", 
                        padding: "16px", 
                        margin: "16px auto", 
                        borderRadius: "5px"}}>
                        <NewsFeed articleCount={0} />
                    </div>
                    
                </div>
            </div>
        </IonContent>
    </IonPage>

}

export default NewsArticles;
