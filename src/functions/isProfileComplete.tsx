export default function isProfileComplete (authState) {

	if( authState.user.profileComplete === 100 ){

		return { profile: true, opportunity: true }

	}else if( authState?.user?.profileCompletionList?.length === 1 && authState?.user?.profileCompletionList[0] === "Add at least one active opportunity") {

		return { profile: true, opportunity: false }

	} else {

		return { profile: false, opportunity: false }
	}


}