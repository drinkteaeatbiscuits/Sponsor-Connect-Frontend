import { IonButton, IonButtons, IonContent, IonPage, IonToolbar } from '@ionic/react';
import Header from '../../components/Header';
import { useHistory, useLocation, useParams } from 'react-router';
import Cookies from 'js-cookie';
import { AuthContext } from "../../App";
import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import TabBar from '../../components/TabBar';
import OpportunitiesList from '../../components/OpportunitiesList/OpportunitiesList';
import useOpportunity from '../../hooks/useOpportunity';
import { useMutation, useQueryClient } from 'react-query';
import useDeleteOpportunity from '../../hooks/useDeleteOpportunity';
import Image from '../../components/Image/Image';
import OpportunityExpanded from '../../components/OpportunityExpanded/OpportunityExpanded';
import MetaTags from '../../components/MetaTags/MetaTags';

export interface props { }

interface ParamTypes {
  id: string;
}


const Opportunity: React.FC = () => {

  const opportunityId = useParams<ParamTypes>();

  const history = useHistory();
  const { state: authState } = React.useContext(AuthContext);
  const theLocation = useLocation<any>();
  const { isLoading, data: opportunityData, error } = useOpportunity(Number(opportunityId.id));
  
  const [deletedOpportunity, setDeletedOpportunity] = useState(theLocation?.state?.deletedOpportunity);
  
  useEffect(() => {
    
    setDeletedOpportunity(theLocation?.state?.deletedOpportunity);

	}, [theLocation?.state?.deletedOpportunity]);

  // console.log(deletedOpportunity);
  // console.log( theLocation?.state?.deletedOpportunity );

  return (
    <IonPage>

      <MetaTags title={opportunityData?.title ? opportunityData?.title + ' | Sponsor Connect' : 'Sponsor Connect'} path={'/opportunity/' + opportunityId?.id} description={ opportunityData?.opportunityDescription } image={ opportunityData?.images ? process.env.REACT_APP_S3_URL + "/images/cover_xl/" + opportunityData?.images?.hash + opportunityData?.images?.ext : "https://sponsor-connect.com/wp-content/uploads/2021/07/sponsor-connect.jpg" } />  

      <TabBar activeTab="opportunities" />
      <IonContent className="opportunity-content" fullscreen>

        {!isLoading && 
          <div className="content">

              { opportunityData &&  <OpportunityExpanded opportunityData={opportunityData} deletedOpportunity={deletedOpportunity} setDeletedOpportunity={setDeletedOpportunity} /> }
        
          </div>
        }

      </IonContent>
    </IonPage>
  );
};

export default Opportunity;
