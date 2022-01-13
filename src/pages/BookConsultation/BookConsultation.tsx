import { IonPage, IonContent } from '@ionic/react';
import React from 'react';
import NewNewsArticle from '../../components/NewNewsArticle/NewNewsArticle';
import { NewsFeed } from '../../components/NewsFeed/NewsFeed';
import TabBar from '../../components/TabBar';
import { InlineWidget } from "react-calendly";


import './BookConsultation.scss'

const BookConsultation: React.FC = () => {
    return <IonPage>
        <TabBar activeTab="dashboard" />

        <IonContent fullscreen className="ion-padding dashboard">
            <div className="book-consultation-content" style={{margin: "0 auto"}}>
                <h1 style={{marginBottom: 0, paddingLeft: "10px", textTransform: "uppercase", textAlign: "center"}}>Book a consultation</h1>

                <InlineWidget styles={{ height: '80vh' }} 
                pageSettings={{
                backgroundColor: 'ffffff',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: '0EB59A',
                textColor: '3A3939'
                }} 
                url="https://calendly.com/sponsor-connect" />

            </div>
        </IonContent>
    </IonPage>
    
}

export default BookConsultation;