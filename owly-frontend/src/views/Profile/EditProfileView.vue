<template>
	<div class="w-100 vh-100 backgroundPages ">
	
	<h2 class="m-5">Editar Perfil</h2>
	<b-form class="card mx-5 p-3 text-white" @submit="ChangeUser">
		<b-img  blank blank-color="#ccc" width="64" rounded  alt="Foto de perfil"></b-img>
		
	<b-form-group label="Nome" inline>
		<b-input v-model="formData.nome"></b-input>
	</b-form-group>
	<b-form-group disabled	label="Escola" inline>
		<b-input v-model="formData.escola"></b-input>
	</b-form-group>
	<b-form-group label="Ocupação" inline>
		<b-input v-model="formData.ocupacao"></b-input>
	</b-form-group>
	<b-form-group label="Email" inline>
		<b-input v-model="formData.email"></b-input>
	</b-form-group>
	<b-form-group  label="Password" inline>
		
			<b-input required v-model="formData.password" v-if="show" type="password" ></b-input>
			<b-input required v-model="formData.password" v-if="!show" type="text" ></b-input>
			<b-button variant="primary" @click="show = !show">Mostrar</b-button>
	</b-form-group>
		<b-button type="submit" >Guardar</b-button>
	</b-form>
	</div>
</template>

<script>
import { useUserStore } from '../../stores/User';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
	setup() {
		const Router = useRouter()

		const fileInput = ref()

		function ClickFileInput() {
			console.log(fileInput.value)
			fileInput.value.click
		}


		const UserStore = useUserStore()
		const User = UserStore.LoggedUserGetter
		const formData = reactive({
			password: User.password,
			nome: User.name,
			escola: UserStore?.FindLoggedUserProject(User.id)?.nameSchool ,
			ocupacao: User.ocupacao,
			email: User.email,

		})
		
		const show = ref(true)


		function ChangeUser() {
			User.name = formData.nome
			User.password = formData.password
			User.escola = formData.escola
			User.ocupacao = formData.ocupacao
			User.email = formData.email


			UserStore.ChangeUser(User)

			Router.push('/home')
		}

		return {User,formData,show,fileInput,ClickFileInput,ChangeUser};
	},
};
</script>

<style lang="scss" scoped></style>
