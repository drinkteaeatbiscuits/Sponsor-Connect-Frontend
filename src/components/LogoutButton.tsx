import { IonButton } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../App";

// interface LogoutProps {}

const LogoutButton: React.FC = () => {

	
	const { state: authState, dispatch } = React.useContext(AuthContext);
    

	const doLogout = async () => {

		const URL = process.env.REACT_APP_API_URL;
	
		const logoutResp = await fetch( URL + "/logout", {
			method: "POST",
			credentials: "include",
		  });
	
		  const logoutInfo = await logoutResp.json();
  
		  if(logoutInfo?.statusCode) {
  
			  alert( "Error: " + logoutInfo.data[0].messages[0].message );
  
		  }else{
			  
			  console.log(logoutInfo);

			  dispatch && dispatch({
				type: "LOGOUT"
			  });

			  
		  }

	  }

	return <IonButton className="logout-button" onClick={()=> doLogout()}>Logout</IonButton>;

}

export default LogoutButton;

