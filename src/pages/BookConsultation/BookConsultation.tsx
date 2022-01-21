import { IonPage, IonContent } from '@ionic/react';
import React from 'react';
import NewNewsArticle from '../../components/NewNewsArticle/NewNewsArticle';
import { NewsFeed } from '../../components/NewsFeed/NewsFeed';
import TabBar from '../../components/TabBar';
import { InlineWidget } from "react-calendly";
// import 'https://assets.calendly.com/assets/external/widget.js';

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
                url="https://calendly.com/sponsorconnect"
                 />





            </div>
        </IonContent>
    </IonPage>
    
}

export default BookConsultation;

// eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNjQyMDg4NjE2LCJqdGkiOiIxOWZlYzcwYy0wN2Q5LTQ3YjItODNhZC05ODAyYTljYWIwMDAiLCJ1c2VyX3V1aWQiOiJiMWI0N2FiYy1mMmQ5LTQ5ZDQtODdiMS03M2QwMzllZGZjMDgifQ.9tsASfRobopG_i8WAy7X4K9UjQ2iPCmhVjNxFgoCJDY