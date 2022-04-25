import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import React, { useState } from "react";
import { IonReactRouter } from '@ionic/react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import TagManager from 'react-gtm-module';

import Login from './pages/Login/Login';
import CreateAccount from './pages/CreateAccount/CreateAccount';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/app.scss';

import { useEffect } from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import Profiles from './pages/Profiles/Profiles';
import Profile from './pages/Profile/Profile';
import Opportunities from './pages/Opportunities/Opportunities';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile/EditProfile';
import Billing from './pages/Billing';
import Account from './pages/Account/Account';

import Subscription from './pages/Subscription/Subscription';
import Landing from './pages/Landing/Landing';
import Opportunity from './pages/Opportunity/Opportunity';
import OnBoardingSport from './pages/OnBoardingSport/OnBoardingSport';
import OnBoardingBusiness from './pages/OnBoardingBusiness/OnBoardingBusiness';
import AddOpportunity from './pages/Opportunity/AddOpportunity';
import EditOpportunity from './pages/Opportunity/EditOpportunity';
import CreateAccountBusiness from './pages/CreateAccountBusiness/CreateAccountBusiness';
import SearchOpportunities from './pages/SearchOpportunities/SearchOpportunities';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Subscribe from './pages/Subscribe/Subscribe';
import ProfileImages from './pages/ProfileImages/ProfileImages';
import EditProfileDescription from './pages/EditProfile/EditProfileDescription';

import Geocode from "react-geocode";
import NotificationSettings from './pages/NotificationSettings/NotificationSettings';
import Notifications from './components/Notifications/Notifications';
import BookConsultation from './pages/BookConsultation/BookConsultation';
import DashboardBusiness from './pages/DashboardBusiness/DashboardBusiness';
import Favourites from './pages/Favourites/Favourites';
import DugoutArticles from './pages/DugoutArticles/DugoutArticles';
import DugoutArticle from './pages/DugoutArticle/DugoutArticle';
import DugoutCategories from './pages/DugoutCategories/DugoutCategories';
import useMySubscription from './hooks/useMySubscription';
import PleaseSubscribe from './pages/PleaseSubscribe/PleaseSubscribe';
import ScrollToTop from './components/ScrollTop/ScrollTop';
import { HelmetProvider } from 'react-helmet-async';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import Subscriptions from './pages/Admin/Subscriptions/Subscriptions';
import Users from './pages/Admin/Users/Users';
import Discounts from './pages/Admin/Discounts/Discounts';
import BuildProfile from './pages/Build Profile/BuildProfile';
import AdminSettings from './pages/Admin/Settings/AdminSettings';
import ProfileExamples from './pages/ProfileExamples/ProfileExamples';
import useProfiles from './hooks/useProflies';

const tagManagerArgs = {
  gtmId: 'GTM-K6H3NN8'
}

process.env.NODE_ENV === "production" && TagManager.initialize(tagManagerArgs)


Geocode.setApiKey(process.env.REACT_APP_GEOCODE_API_KEY);

let stripePK = "";
process.env.REACT_APP_STRIPE_PK && (stripePK = process.env.REACT_APP_STRIPE_PK);
const stripePromise = loadStripe(stripePK);

export const AuthContext = React.createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
}>({});

const initialState = {
  isAuthenticated: false,
  user: null,
  currentLocation: null,
  profile: null,
  mySubscription: {}
};

const reducer = (state: any, action: any) => {

  switch (action.type) {
    case "LOGIN":
      let isAuthenticated = false;
      action.payload.status = "Authenticated" ? isAuthenticated = true : isAuthenticated = false;
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      // localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case "setUser": {
      let isAuthenticated = false;
      action.payload.status = "Authenticated" ? isAuthenticated = true : isAuthenticated = false;
      return {
        ...state,
        isAuthenticated: isAuthenticated,
        user: action.payload.user,
      }
    }
    case "setSubscription": {
      state.mySubscription.subscriptionStatus = action.payload
      return {
        ...state,
      }
    }
    case "setFavouriteProfiles": {
      state.user.favouriteProfiles = action.payload
      return {
        ...state 
      }
    }
    case "setFavouriteOpportunities": {
      state.user.favouriteOpportunities = action.payload
      return {
        ...state 
      }
    }
    case "setSavedSearches": {
      state.user.savedSearches = action.payload
      return {
        ...state 
      }
    }
    case "setSearchNow": {
      state.user.searchNow = action.payload
      return {
        ...state 
      }
    }
    case "setCurrentLocation": {
      state.currentLocation = action.payload
      return {
        ...state 
      }
    }
    case "viewedProfile": {
      state.user.viewedProfiles = action.payload
      return {
        ...state 
      }
    }
    case "updateProfileComplete": {
      // console.log(action.payload);
      state.user.profileComplete = action.payload.profileComplete
      state.user.profileCompletionList = action.payload.profileCompletionList
      return {
        ...state 
      }
    }

    default:

    return state;
  }
};



const checkIfAuthenticated = async () => {

  const loginResp = await fetch((process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/profiles/auth", {
    method: "GET",
    credentials: "include",
  });

  const profileInfo = await loginResp.json();

  return profileInfo?.statusCode ? false : profileInfo;

}



const App: React.FC = () => {

  const getLocationPlaceName = (lat, long) => {

    setCheckingLocationPlaceName(true);

		Geocode.fromLatLng(lat, long).then(
			(response) => {
			const address = response.results[0].formatted_address;
			let city, state, country;
			for (let i = 0; i < response.results[0].address_components.length; i++) {
				for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
				switch (response.results[0].address_components[i].types[j]) {
					case "locality":
					city = response.results[0].address_components[i].long_name;
					break;
					case "administrative_area_level_1":
					state = response.results[0].address_components[i].long_name;
					break;
					case "country":
					country = response.results[0].address_components[i].long_name;
					break;
				}
				}
			}

			setFromLocation({ ...fromLocation, "city": city});
			
			},
			(error) => {
				console.error(error);
			}
		);
	}

  const doesLocationCookieExist = () => {

    if (document.cookie.split(';').some((item) => item.trim().startsWith('user_location='))) {
      return true;
    }
    return false;

  }

  const {isLoading, data: profilesData, isSuccess, error} = useProfiles(true);

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [wasUserHere, setWasUserHere] = useState<any>("");
  const [currentLocation, setCurrentLocation] = useState<any>("");
  const [fromLocation, setFromLocation] = useState<any>({});
  const [checkUser, setCheckUser] = useState<any>(false);
  const [checkingLocation, setCheckingLocation] = useState<any>(false);
  const [checkingLocationPlaceName, setCheckingLocationPlaceName] = useState<any>(false);
  const { data: mySubscription, isSuccess: subscriptionSuccess, error: subscriptionError, refetch: refetchMySubscription } = useMySubscription();

  const [activeSubscription, setActiveSubscription] = useState(false);
  const [accountType, setAccountType] = useState('');

  // console.log(activeSubscription);

  const subscriptionActive = () => {
    if(state?.mySubscription?.subscriptionStatus === 'active'){
      setActiveSubscription(true);
    }else{
      setActiveSubscription(false);
    } 
  }
  
  const businessAccount = () => {
    if(state?.user?.accountType && state?.user?.accountType === 'Business'){
      setAccountType('Business');
    }else{
      setAccountType('');
    } 
  }

  

  useEffect(() => {

    !wasUserHere && checkIfAuthenticated().then( (data) => { 
      
      setWasUserHere(data); 
      setCheckUser(true); 
      refetchMySubscription();

    } );


    subscriptionSuccess && mySubscription.length > 0 && (state.mySubscription = mySubscription[0]);

    subscriptionActive();

    businessAccount();

    !doesLocationCookieExist() && !checkingLocation && currentLocation.length <= 0 && navigator.geolocation.getCurrentPosition(function(position) {
    
      setCurrentLocation([
        {"lat": position.coords.latitude, "long": position.coords.longitude}
      ]);
    
      setFromLocation( { lat: position.coords.latitude, long: position.coords.longitude } );

      setCheckingLocation(true);

    });

    !doesLocationCookieExist() && !checkingLocationPlaceName && Object.keys(fromLocation).length > 0 && !fromLocation.city && getLocationPlaceName(fromLocation.lat, fromLocation.long);

    !doesLocationCookieExist() && Object.keys(fromLocation).length > 0 && fromLocation.city && (initialState.currentLocation = fromLocation);

    !doesLocationCookieExist() && Object.keys(fromLocation).length > 0 && fromLocation.city && (document.cookie = "user_location=" + JSON.stringify({lat: fromLocation.lat, long: fromLocation.long, city: fromLocation.city }) + ";max-age=" + 60*60*24 );

    // doesLocationCookieExist() && Object.keys(fromLocation).length <= 0 && setFromLocation(JSON.parse( document.cookie.split('; ').find(row => row.startsWith('user_location='))?.split('=')[1] || "" ));
    
    doesLocationCookieExist() && (initialState.currentLocation = JSON.parse( document.cookie.split('; ').find(row => row.startsWith('user_location='))?.split('=')[1] || "" ));

  }, [currentLocation, fromLocation, state.isAuthenticated, doesLocationCookieExist(), mySubscription, state.mySubscription]);

  wasUserHere && (initialState.isAuthenticated = true);
  wasUserHere && (initialState.user = wasUserHere);

  // console.log(wasUserHere);
  // console.log(state?.user && state?.user?.role.type === 'admin' )
  // console.log(state.isAuthenticated )

  // console.log(location);
  // let location = useLocation();

  // console.log(location.pathname);

  // location?.pathname !== '' &&
// { console.log(profilesData && profilesData.map(a => a.slug) )}

  let profileSlugs: string[] = [];

  if(isSuccess){
    for( var i=0; i<profilesData?.length; i++ ){

      profilesData[i].slug && profileSlugs.push( profilesData[i].slug );
      
    }
  }

  // console.log(profileSlugs);

  // const location = useLocation();
 

  return (
    <HelmetProvider>  
    <IonApp>
      <Elements stripe={stripePromise}>

        <AuthContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          
          <IonReactRouter>
           
            { state?.user?.profile &&  <Notifications /> }

            <ScrollToTop />

            <IonRouterOutlet animated={false}>

            <Switch>

            
              
              <Route exact path="/">
               <Landing />
                {/* { state.isAuthenticated ? <Redirect to="/dashboard" /> : <Landing /> } */}
              </Route>
              
              <Route exact path="/dashboard" component={() => state.isAuthenticated ? ( state.user.profile ? <Dashboard /> : (state?.user?.role.type === 'admin' ? <AdminDashboard />  : <DashboardBusiness />) ) : ( checkUser && <Redirect to="/login" /> )} />
              {/* { state.isAuthenticated && <Dashboard /> } */}

                {/* { state.isAuthenticated ? ( state.user.profile ? <Dashboard /> : (state?.user?.role.type === 'admin' ? <AdminDashboard />  : <DashboardBusiness />) ) : ( checkUser && <Redirect to="/login" /> ) } */}

              {/* </Route> */}
               
              
              {/* <Route exact path="/:slug" render={(props) => {
                if(isSuccess && profileSlugs.includes(props.match.params.slug)){
                  return <Profile />
                }else{
                  return <Redirect to={"/" + props.match.params.slug} />
                }
              }} /> */}


              <Route path="/sports" component={() => state.isAuthenticated ? <Redirect to="/dashboard" /> : <OnBoardingSport />} />
             

              <Route path="/business">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <OnBoardingBusiness />}
              </Route>

              <Route path="/landing">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <Landing />}
              </Route>

              <Route path="/create-account-sports">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <CreateAccount />}
              </Route> 

              <Route path="/create-account-business">
                {state.isAuthenticated ? <Redirect to="/dashboard" /> : <CreateAccountBusiness />}
              </Route> 

              

              <Route exact path="/favourites">

                { state.isAuthenticated ? <Favourites /> : ( checkUser && <Redirect to="/login" /> ) }

              </Route>

              <Route exact path="/login">
                { state.isAuthenticated ? <Redirect to="/dashboard" /> : ( checkUser && <Login />) }
              </Route>

              <Route exact path="/profile/view/:id">
                  <Profile />
              </Route>


               <Route exact path="/profile/:id">
                {state.isAuthenticated ? <Profile /> : (checkUser && <Redirect to="/login" />)}
                </Route> 

               <Route exact path="/profile/:id/edit">
                {state.isAuthenticated ? <EditProfile /> : (checkUser && <Redirect to="/login" />)}
              </Route>

               <Route exact path="/profile/:id/build">
                {state.isAuthenticated ? <BuildProfile /> : (checkUser && <Redirect to="/login" />)}
              </Route>

               <Route exact path="/manage-profile-images">
                {state.isAuthenticated ? <ProfileImages /> : (checkUser && <Redirect to="/login" />)}
              </Route>

               <Route exact path="/edit-profile-description">
                {state.isAuthenticated ? <EditProfileDescription /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              
               <Route exact path="/opportunities/:id">
                {state.isAuthenticated ? <Opportunities /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/opportunity/:id">
                {state.isAuthenticated ? <Opportunity /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/add-opportunity/:id">
                {state.isAuthenticated ? <AddOpportunity /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/edit-opportunity/:id">
                {state.isAuthenticated ? <EditOpportunity /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/search-opportunities">
                {state.isAuthenticated ? <SearchOpportunities /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              
              <Route exact path="/settings/billing">
                {state.isAuthenticated ? <Billing /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/subscribe">
                {state.isAuthenticated ? <Subscribe /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/settings/subscription">
                {state.isAuthenticated ? <Subscription /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/settings/account">
                {state.isAuthenticated ? <Account /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/settings/notifications">
                {state.isAuthenticated ? <NotificationSettings /> : (checkUser && <Redirect to="/login" />)}
              </Route>
              
              <Route exact path="/settings">
                {state.isAuthenticated ? ( state?.user?.role.type === 'admin' ? <AdminSettings/> : <Settings /> ) : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/reset-password">
                <ResetPassword />
              </Route>

              <Route exact path="/forgot-password">
                <ForgotPassword /> 
              </Route>

              <Route exact path="/profiles">
                {state.isAuthenticated ? <Profiles /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/example-profiles">
                {state.isAuthenticated ? <ProfileExamples /> : (checkUser && <Redirect to="/login" />)}
              </Route>


              <Route exact path="/subscriptions">
                {state.isAuthenticated && state?.user?.role.type === 'admin' ? <Subscriptions /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/dashboard/users">
                {state.isAuthenticated && state?.user?.role.type === 'admin' ? <Users /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/discounts">
                {state.isAuthenticated && state?.user?.role.type === 'admin' ? <Discounts /> : (checkUser && <Redirect to="/login" />)}
              </Route>

              <Route exact path="/book-consultation">
                {state.isAuthenticated ? <BookConsultation /> : (checkUser && <Redirect to="/login" />)}
              </Route>


              {/* <Route exact path="/admin/news-feed">
                <NewsArticles />
              </Route> */}

              

              <Route exact path="/the-dugout">
              
                {state.isAuthenticated ? ((activeSubscription || accountType === "Business") ? <DugoutArticles /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}
                
              </Route>

              <Route exact path="/the-dugout-categories">
                
                {state.isAuthenticated ? ((activeSubscription || accountType === "Business") ? <DugoutCategories /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}

              </Route>
              
              <Route exact path="/the-dugout/:slug">
                
                {state.isAuthenticated ? ((activeSubscription || accountType === "Business") ? <DugoutArticle /> : <PleaseSubscribe /> ) : (checkUser && <Redirect to="/login" />)}
                
              </Route>


              <Route exact path="/:slug" component={() => <Profile />} />
           
              

              
              
              <Route>
                <ErrorPage />
              </Route>
              
              </Switch>

            </IonRouterOutlet>
          </IonReactRouter>

        </AuthContext.Provider>
        
      </Elements>
    </IonApp>
    </HelmetProvider>
  )
};

export default App;
