<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<b-form class=" m-5 py-3 card w-50" @submit="CreateReunion" >
			<b-form-group class="text-white mx-3" label="Nome Da Reunião">
				<b-input required v-model="name">

				</b-input>
			</b-form-group>

			
			<div class="bg-white px-3 py-3 my-3" style="border-right:20px solid #576C54;border-left:20px solid #576C54;">
				<b-form-group label="Filtrar Utilizadores">
					<b-input @input="FilterUserList" v-model="filterForUsers">
	
					</b-input>
				</b-form-group>
			<b-form-group label="Selecionar Utilizador">
				<b-select v-model="userID" :options="ListOfUsers"></b-select>
		
					<b-button @click="addUser()" variant="success" :disabled="
					ListOfUsersToAdd.some(user => user == userID) ">adicionar</b-button>
					
				</b-form-group>
				<b-form-group >
					<p>Utilizadores Adiconados</p>
					<p v-if="ListOfUsersToAdd.length == 0">Sem utilizadores Adicionados</p>
					<div v-else v-for="item in ListOfUsersToAdd" :key="item.id">
						{{ item.name }} <b-button @click="deleteUser" variant="danger">Eliminar</b-button>
					</div>
				</b-form-group >
				</div>
					
			<b-form-group class="text-white mx-3" label="Foto da Reunião">
				<b-form-file
					v-model="file"
					:state="Boolean(file)"
					accept="image/jpeg, image/png, image/gif"
					placeholder="Carregue uma foto"
					drop-placeholder="Carregue uma foto"
					></b-form-file>
			</b-form-group>

			<b-button class="mx-5" variant="success" type="submit">Criar Reunião</b-button>
		</b-form>
	</div>
</template>

<script>

import { useReunionStore } from '../../stores/Reunion';
import { useUserStore } from '../../stores/User';
import { ref ,reactive} from 'vue';
import { useRouter } from 'vue-router';

export default {
	
	setup() {
	
	const Router = useRouter()

	const UserStore = useUserStore()


	// If user is not allowed to create a new Reunion
	if(UserStore.LoggedUserGetter.role != 'Coordenador' && UserStore.LoggedUserGetter.admin != true){
		Router.push('/Home')
	}


	const ReunionStore = useReunionStore()

	const ListOfUsers = ref(UserStore.GetUsers.map( user => ({value: user , text: user.name })).filter(user => user.value.id != UserStore.LoggedUserGetter.id))

	const ListOfUsersToAdd= ref([])
	
	const userID = ref(undefined)

	const filterForUsers = ref()

	function addUser(){
		if(userID.value)
		ListOfUsersToAdd.value.push(userID.value)
	}

	function deleteUser(){
		ListOfUsersToAdd.value.splice(ListOfUsersToAdd.value.findIndex(user => user.id == userID.value),1)
	
	}

	function FilterUserList(){

		ListOfUsers.value = 
		UserStore.GetUsers.map( user => ({value: user , text: user.name }))
		.filter(user => user.text.includes(filterForUsers.value) && user.value.id != UserStore.LoggedUserGetter.id)


	}

	const name = ref()
	const file = ref()

	function CreateReunion(){
		event.preventDefault()

		let collaborators = ListOfUsersToAdd.value.map(user => user.id)
		collaborators.push(UserStore.LoggedUserGetter.id)
		
		if(collaborators.length == 1){
			alert('Adiciona mais utilizadores')
		}else{
			
			
			ReunionStore.CreateReunion({ 
				name: name.value,
				collaborators: collaborators ,
				picture: file ,
				leader: UserStore.LoggedUserGetter.id
			})

		Router.push(`/Reunion/${ReunionStore.GetReunions[ReunionStore.GetReunions.length - 1].id}`)

		}

	}
	

	const formData = reactive()
	
    return {
		file,
		name,
		CreateReunion,
		filterForUsers,
		FilterUserList,
		deleteUser,
		addUser,
		userID,
		ListOfUsersToAdd,
		ListOfUsers
 
    }
  }
}
</script>

<style lang="scss" scoped></style>
