import { IonButton } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../App";

// interface LogoutProps {}

interface LogoutProps {
	className?: string,
	color?: string,
	expand?: any,
	size?: any,
}

const LogoutButton: React.FC<LogoutProps> = ( props: LogoutProps ) => {

	
	const { state: authState, dispatch } = React.useContext(AuthContext);


	const doLogout = async () => {
	
		const logoutResp = await fetch( (process.env.NODE_ENV === "development" ? 'http://localhost:1337' : process.env.REACT_APP_API_URL) + "/logout", {
			method: "POST",
			credentials: "include",
		  });
	
		  const logoutInfo = await logoutResp.json();
  
		  if(logoutInfo?.statusCode) {
  
			  alert( "Error: " + logoutInfo.data[0].messages[0].message );
  
		  }else{
			  
			//   console.log(logoutInfo);

			  dispatch && dispatch({
				type: "LOGOUT"
			  });

			

			  
		  }

	  }

	return <IonButton onClick={()=> doLogout()} { ...props }>Log Out</IonButton>;

}

export default LogoutButton;

