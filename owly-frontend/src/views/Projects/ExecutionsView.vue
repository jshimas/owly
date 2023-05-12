<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		

		<h2 class="m-5">
			Atividades Executadas

		</h2>
		

		<table class="table b-table bg-white mx-5 w-75 table-bordered ">
			
			<template v-for="Activity in ActivitiesOfProject" :key="Activity.id">
			
			<tr >
				<th>
					 <h3>
						 {{ Activity.name }}
						 
					 </h3>
					 <small>	 
						 {{ AreaStore.GetAreaById(Activity.idArea).name }}
					 </small>
					
				</th>
			</tr>
			<tr>
				<th>Execuções</th>
			</tr>
			<tr v-for="Execution in ExecutionStore.GetExecutionByActivityFunction(Activity.id)">
				<td>
					 <img :src="Execution.image" :alt="Execution.image"> {{ Execution.description }} 
					<b-button :to="`/Project/EditExecution/${Execution.id }`" variant="success"> Editar </b-button>
					<b-button variant="danger" @click="ExecutionStore.DeleteExecution(Execution.id)"> Eliminar</b-button>
				</td>
			</tr>
		</template>
		</table>
		

		
		<div class="d-flex mx-5">
			<b-button to="/Project/ExecuteActivity" class="mr-3">Executar Atividade</b-button>
			<b-button to="/Project" variant="primary">Voltar</b-button>

		</div>
	</div>
</template>

<script>
import { ref } from "vue";
import { useAreaStore } from "../../stores/Area";
import { useActivityStore } from "../../stores/Activity";
import { useUserStore } from "../../stores/User";
import { useExecutionStore } from "../../stores/Execution";
import { useRouter } from "vue-router";
import Dropdown from "../../components/Dropdown.vue";

export default {
	components:{
		Dropdown
	},
	setup() {
		const Router = useRouter();
		const UserStore = useUserStore();
		if(UserStore.LoggedUserGetter.admin == true) {
          Router.push('/admin')
        }
		const ExecutionStore = useExecutionStore();
		const ActivityStore = useActivityStore();
		const AreaStore = useAreaStore();

		const ActivitiesOfProject = ref(
			ActivityStore.GetActivitysByProjectFunction(
				UserStore.FindLoggedUserProject().id
			)
		);

		return { AreaStore, ActivitiesOfProject, ExecutionStore };
	},
};
</script>

<style lang="scss" scoped></style>
