import { Redirect, useLocation, useParams } from "react-router-dom";
import useProfile from "../../hooks/useProfile";
import AdminDashboard from "../../pages/Admin/Dashboard/AdminDashboard";
import AdminSettings from "../../pages/Admin/Settings/AdminSettings";
import Dashboard from "../../pages/Dashboard/Dashboard";
import DashboardBusiness from "../../pages/DashboardBusiness/DashboardBusiness";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import Loading from "../../pages/Loading/Loading";
import Login from "../../pages/Login/Login";

export interface props {}

interface ParamTypes {
  id: string;
  slug: string
}

const CheckProfile = ({ isAdmin, profileId, children }) => {

	const params = useParams<ParamTypes>();
	const slug = params.slug;
	
	const {isLoading, data, error, isSuccess} = useProfile( params.id ? params.id : null, slug ? slug : null );

	// isSuccess && console.log(data?.user?.subscriptionStatus === 'active');

	if(isAdmin){
		return children;
	}

	if(isSuccess && profileId === data?.id) {
		return children;
	}

	if (isSuccess && !data) {
		return <ErrorPage />;
	}

	if(isSuccess && data?.user?.subscriptionStatus === 'active'){

		return children;
	
	} 
	
	if( isSuccess ) {

		return <ErrorPage />;
	
	}

	return <Loading />
 	

};

export default CheckProfile;