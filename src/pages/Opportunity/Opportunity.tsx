import { IonButton, IonButtons, IonContent, IonPage, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import useOpportunity from '../../hooks/useOpportunity';
import { useMutation, useQueryClient } from 'react-query';
import useDeleteOpportunity from '../../hooks/useDeleteOpportunity';
import Image from '../../components/Image/Image';

export interface props { }

interface ParamTypes {
  id: string;
}


const Opportunity: React.FC = () => {

  const opportunityId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);

  const { isLoading, data, error } = useOpportunity(opportunityId.id);
  const {isLoading: isDeletingOpportunity, error: deleteOpportunityError, mutateAsync: deleteOpportunityMutation} = useDeleteOpportunity( opportunityId.id );

  
  const deleteOpportunity = async () => {
    console.log('delete opportunity');

    await deleteOpportunityMutation();

    history.goBack();

  }

  // console.log(data?.profile );

  return (
    <IonPage>

       
        <IonToolbar>
          <IonButtons className="ion-justify-content-around">
            {/* <IonButton className="" size="small" onClick={() => history.push("/opportunities/" + data?.profile.id )}>Back to Opportunities</IonButton> */}
            {authState?.user.profile === parseInt(data?.profile.id) && <IonButton className="" size="small" onClick={() => history.push("/edit-opportunity/" + opportunityId.id)}>Edit Opportunity</IonButton>}
          </IonButtons>

        </IonToolbar>

      
      <TabBar activeTab="opportunities" />
      <IonContent className="opportunity-content" fullscreen>

        {!isLoading &&
        <div className="content">
          <div className="opportunity">


            {data?.images[0] && <Image image={data.images} alt={data.title} />}

            <div className="ion-padding">
              <h1 className="ion-text-uppercase ion-color-dark line-height-1">{data?.title}</h1>

              { data?.price && <p className="price">£{data?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> }

              { data?.description && 
              <div className="description ion-margin-bottom">
                {data.description}
              </div> }
              { data?.fullDescription && 
              <div className="full-description">
               {data.fullDescription} 
              </div>
              }

            </div>
            {authState?.user.profile === parseInt(data?.profile.id) && <IonButtons>
              <IonButton className="" size="small" onClick={() => history.push("/edit-opportunity/" + opportunityId.id)}>Edit Opportunity</IonButton>
            
            <IonButton className="" size="small" onClick={() => deleteOpportunity()}>Delete Opportunity</IonButton></IonButtons>}
        
          </div>
          </div>
        }


      </IonContent>
    </IonPage>
  );
};

export default Opportunity;
