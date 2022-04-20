import React from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../../App";

import './ProfileTodoList.scss';

interface props {
	excludeOpportunity?: boolean,
	setStepNumber?: any,
}

const ProfileTodoList: React.FC<props> = (props) => {

	const { state: authState, dispatch } = React.useContext(AuthContext);
	const history = useHistory();
	const {excludeOpportunity, setStepNumber} = props;

	const todoLink = (itemName) => {
		if(itemName === 'Add a profile name'){
			if(setStepNumber){
				return setStepNumber(0);
			}else{
				return history.push("/profile/" + authState?.user?.profile + "/edit");
			}
		}

		if(itemName === 'Select your sport'){
			if(setStepNumber){
				return setStepNumber(1);
			}else{
				return history.push("/profile/" + authState?.user?.profile + "/edit");
			}
		}
		if(itemName === 'Add a location'){
			if(setStepNumber){
				return setStepNumber(4);
			}else{
				return history.push("/profile/" + authState?.user?.profile + "/edit");
			}
		}
		if(itemName === 'Upload a profile picture'){
			if(setStepNumber){
				return setStepNumber(5);
			}else{
				return history.push("/profile/" + authState?.user?.profile + "/edit");
			}
		}
		if(itemName === 'Upload a cover image'){
			if(setStepNumber){
				return setStepNumber(2);
			}else{
				return history.push("/profile/" + authState?.user?.profile + "/edit");
			}
		}
		if(itemName === 'Add at least one active opportunity'){
			
			return history.push("/add-opportunity/" + authState?.user?.profile + "/edit");
			
		}
	}

	return <div className="">
			<ul className="profile-todo">
				{ authState.user.profileCompletionList.map((item) => {

					if( item === "Add at least one active opportunity" && excludeOpportunity ){
						return
					}else{
						return <li key={item} onClick={() => todoLink(item)}>{item}</li>
					}
					
				}) }
				
			</ul>
	</div>

  }

export default ProfileTodoList;

