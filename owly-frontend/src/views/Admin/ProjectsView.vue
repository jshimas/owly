<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<div>
			<!-- AREAS -->

			<b-table 
			class="table b-table bg-white mx-5 w-75 table-bordered " 
			per-page="5"
			:current-page="AreaTablePage"
			:fields="fields"
			:items="ProjectStore.GetProjects"
			 >
			<template #cell(acoes)="acoes">
				<b-button
				
				@click="Router.push(`/Admin/Project/${acoes.item.id}`)" 
				variant="success" > Ver Em Detalhe </b-button>
			</template>
			</b-table>
			<p>Página {{ AreaTablePage }}</p> 
			<b-button variant="none" @click="  0 != AreaTablePage - 1 ? AreaTablePage-- : null ">◀️</b-button>
			<b-button variant="none" @click="AreaTablePage * 5 <= ProjectStore.GetProjects.length ? AreaTablePage++ : null">▶️</b-button>
			<br>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue';
import { useAreaStore } from '../../stores/Area';
import { useThemeStore } from '../../stores/Theme';
import { useProjectStore } from '../../stores/Project';
import { useRouter } from 'vue-router';
import { useUserStore } from "../../stores/User";


export default {
	setup() {
		const AreaStore = useAreaStore()
		const ThemeStore = useThemeStore()
		const ProjectStore = useProjectStore()
		const Router = useRouter()
		const UserStore = useUserStore()
		if(UserStore.LoggedUserGetter?.admin == false){

		Router.push('/Project')

		}

		const fields = [
          {
            key: 'id',
            sortable: true,
			label: 'ID'
          },
          {
            key: 'nameProject',
			label: 'Nome',
            sortable: true
          },
		  {
            key: 'state',
            sortable: false,
			label: 'Estado'
          },
		  {
            key: 'nameSchool',
            sortable: false,
			label: 'Escola'
          },
		  {
            key: 'acoes',
            sortable: false,
			label: 'Ações'
          },
		]
		
		const AreaTablePage = ref(1)
		const ThemeTablePage = ref(1)
		const NewAreaName = ref('')
		
		function CreateNewArea(){
			event.preventDefault()

			AreaStore.CreateArea(NewAreaName.value)
		}


		return {ProjectStore,fields,AreaTablePage,ThemeTablePage,NewAreaName,CreateNewArea,Router};
	},
};
</script>

<style lang="scss" scoped></style>
