<template>
	<div class="w-100 vh-100 d-flex justify-content-center align-items-center backgroundPages">
		<b-card class="w-25">
			<b-form @submit.prevent="Login(LoginData.email,LoginData.password)">
				<b-form-group>
					<b-label>Email</b-label>
					<b-input v-model="LoginData.email" type="email"></b-input>
				</b-form-group>
				<b-form-group>
					<b-label>Password</b-label>
					<b-input v-model="LoginData.password" type="password"/>
				</b-form-group>
		
				<b-button variant="primary" type="submit">Login</b-button>
				</b-form>

		</b-card>
	</div>
</template>

<script>
import { useUserStore } from "../stores/User";
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
	setup() {

		const userStore = useUserStore()

		const Router = useRouter()
		
		try{
			if(userStore.CheckIfLoggedUserIsLogged()){
				if(userStore.CheckIfLoggedUserIsAdmin() == true){
					Router.push("/Admin") 
				}else{
					Router.push("/Home") 
				}
			}
	}catch{

		}



		const LoginData = reactive({email:"", password:""})

		//useUserStore().LogIn("user@example", "ae3j0v2gu");

		function Login(email,login){	
			try{
				userStore.LogIn(email,login);

				if(userStore.CheckIfLoggedUserIsAdmin() == true){
					Router.push("/Admin") 
				}else{
					Router.push("/Home") 
				}
			}
			catch{
				alert('Login failed!')
			}
		}

		return {LoginData, Login};
	},
};
</script>

<style lang="scss" scoped></style>
