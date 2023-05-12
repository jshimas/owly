<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">

		
		<!-- AREAS -->
		
		<b-table 
			class="table b-table bg-white mx-5 w-75 table-bordered " 
			 filter=""
			per-page="5"
			:current-page="UsersTablePage"
			:fields="fields"
			:items="filteredList"
			 >
			 <template #cell(acoes)="acoes">
				<b-button @click="UserStore.DeleteUser(acoes.item.id); refresh()" variant="danger" > Eliminar </b-button>
			 </template>
			 <template #cell(escola)="escola">
				{{ UserStore.FindUserProject(escola.item.id)?.nameSchool}}
			 </template>
			
			</b-table>
			<p>Página {{ UsersTablePage }}</p> 
			<b-button variant="none" @click="  0 != UsersTablePage - 1 ? UsersTablePage-- : null ">◀️</b-button>
			<b-button variant="none" @click="UsersTablePage * 5 <= UserStore.GetUsers.length ? UsersTablePage++ : null">▶️</b-button>

			<b-form-group label="Filtrar por Nome">
				<b-input  v-model="NameFilter" ></b-input>
				<b-button @click="UsersFilteredList(NameFilter)">Filter</b-button>
				<b-button @click="NameFilter = '' ; UsersFilteredList(NameFilter)">Remove Filter</b-button>
		</b-form-group>


	
		<b-form @submit="CreateUser">
			<b-form-group label="Nome">
				<b-input v-model="formData.Nome" required ></b-input>
			</b-form-group>
			<b-form-group label="Email">
				<b-input required v-model="formData.Email" type="email" ></b-input>
			</b-form-group>
			<b-form-group label="Escola">
				<b-select 
				v-if="!formData.Admin"
				required v-model="formData.Escola" :options="EscolasList"></b-select>
				<b-select 
				v-if="formData.Admin"
				v-model="formData.Escola" disabled :options="EscolasList"></b-select>
			</b-form-group>
			<b-form-group label="Admin">
				<b-select required v-model="formData.Admin" :options="[ 
					{value: true , text:'Sim'} ,
					{value: false , text:'Não'}
					]" ></b-select>
			</b-form-group>
			<b-form-group label="Função">
				<b-select 
				required
				v-if="!formData.Admin"
				v-model="formData.Funcao" 
				:options="[ 
					{value: 'Coordenador' , text: 'Coordenador'} ,
					{value: 'Ajudante' , text: 'Ajudante'},
					]"
				
				></b-select>
				<b-select 
				
				v-if="formData.Admin"
				disabled
				v-model="formData.Funcao" 
				:options="[ 
					{value: 'Coordenador' , text: 'Coordenador'} ,
					{value: 'Ajudante' , text: 'Ajudante'},
					]"
				
				></b-select>
			</b-form-group>

			<b-button type="submit" variant="success" @click="">Criar Utilizador</b-button>
			<b-button variant="primary" @click="clear">Limpar Campos</b-button>
			<b-alert show>Email: {{NewUser?.email}} <br> Password: {{NewUser?.password}}</b-alert>
		</b-form>


	</div>
  </template>
  <script>
  import { useUserStore } from "../../stores/User";
  import { defineComponent, ref } from 'vue';
  import { reactive } from 'vue';
  import { useProjectStore } from '../../stores/Project';
import { useRouter } from 'vue-router';

  export default ({
	  setup() {

		const Router = useRouter()
		const UserStore = useUserStore()

		if(UserStore.LoggedUserGetter?.admin == false){

		Router.push('/Project')

		}

		  const ProjectStore = useProjectStore()
		  const toastCount = ref(0);
		  
		  const UsersTablePage = ref(1)


		const formData = reactive({
			Nome: null,
			Email: null,
			Escola: null,
			Admin: null,
			Funcao: null
		})

		const NewUser = ref()

		
		
		console.log(formData.value)
		
		const EscolasList = ref(
			ProjectStore.GetProjects.map( Project => ({ 
			value: Project.id,
			text: Project.nameSchool})))

		

		function CreateUser(){
			event.preventDefault()
			if(formData.Admin){
				formData.Funcao = null
				formData.escola = null
			}
			
			UserStore.CreateUser(
				{	email: formData.Email,
					name:  formData.Nome,
					escola: formData.Escola,
					ocupacao: '',
					role: formData.Funcao,
					password: Math.random().toString(36).slice(4),
					admin: formData.Admin,
			})

			if(!formData.Admin){
				ProjectStore.AddCollaborator(formData.Escola,UserStore.GetUsers[UserStore.GetUsers.length-1].id)
			}
			
			NewUser.value = UserStore.GetUsers[UserStore.GetUsers.length-1]
			
			formData.Nome = null
			formData.Email = null
			formData.Escola = null	
			formData.Admin = null
			formData.Funcao = null
		}	 


		function clear(){
			formData.Nome = null
			formData.Email = null
			formData.Escola = null	
			formData.Admin = null
			formData.Funcao = null
		}

		const fields = ['email',{key:'name', text: 'Nome' , sortable: true},'escola', {key:'role' , text:'role'},'admin','acoes']
		
		const filteredList = ref(UserStore.GetUsers)
		const NameFilter = ref('')

		function UsersFilteredList(search){
			console.log('typing')
			if(search != ''){
				return filteredList.value = UserStore.GetUsers.filter(item => {
						return item.name.toLowerCase().includes(search.toLowerCase())
					})

			}else{
				return filteredList.value = UserStore.GetUsers
			}

			
		}

		function refresh(){
			filteredList.value = UserStore.GetUsers

		}

		

	
		return {
			refresh,
			clear,
			NameFilter,
			filteredList,
			UsersFilteredList,
			fields,
			NewUser,
			EscolasList,
			formData,
			UserStore,
			CreateUser,
			UsersTablePage,
		}
	  }
	});
  </script>
