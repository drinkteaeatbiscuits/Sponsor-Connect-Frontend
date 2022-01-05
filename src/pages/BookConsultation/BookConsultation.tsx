import { IonPage, IonContent } from '@ionic/react';
import React from 'react'
import NewNewsArticle from '../../components/NewNewsArticle/NewNewsArticle';
import { NewsFeed } from '../../components/NewsFeed/NewsFeed';
import TabBar from '../../components/TabBar';
import './BookConsultation.scss'

const BookConsultation: React.FC = () => {
    return <IonPage>
        <TabBar activeTab="dashboard" />

        <IonContent fullscreen className="ion-padding dashboard">
            <div className="book-consultation-content">
                <h1>Book a consultation</h1>
            </div>
        </IonContent>
    </IonPage>
    
}

export default BookConsultation;