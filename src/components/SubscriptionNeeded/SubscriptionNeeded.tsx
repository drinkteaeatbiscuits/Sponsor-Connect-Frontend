import { Redirect } from "react-router-dom";
import Login from "../../pages/Login/Login";
import PleaseSubscribe from "../../pages/PleaseSubscribe/PleaseSubscribe";

const SubscriptionNeeded = ({ isLoggedIn, isAdmin, isBusiness, activeSubscription, children }) => {
 
if ( !isLoggedIn ) {
 	return <Login />;
 } 
 
 if ( isAdmin ) {
 	return children;
 } 
 
 if ( isBusiness ) {
 	return children;
 }

 if (!activeSubscription) {
	<PleaseSubscribe />
 }
 
 return children;

};

export default SubscriptionNeeded; 