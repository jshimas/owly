

<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		
		<h2 class="m-5">
			Atividades Executadas
			
		</h2>
		<table class="table b-table bg-white mx-5 w-75 table-bordered ">
			<tr>
				<th>Atividade</th>
			</tr>
			<template v-for="Activity in ActivitiesOfProject" :key="Activity.id">
				
				<tr >
					<td>
						{{ Activity.id }} || {{ Activity.name }} ||
						{{ AreaStore.GetAreaById(Activity.idArea).name }}
						
					</td>
				</tr>
				<tr>
					<th>Execuções</th>
				</tr>
				<tr v-for="Execution in ExecutionStore.GetExecutionByActivityFunction(Activity.id)">
					<td>
						<img :src="Execution.image" :alt="Execution.image"> {{ Execution.description }} 
					</td>
				</tr>
			</template>
		</table>
		
		
		<div class="mx-5">
			<b-button :to="`/Admin/Project/${Route.params.id}`">Voltar</b-button>
		</div>

	</div>
</template>

<script>
import { ref } from "vue";
import { useAreaStore } from "../../stores/Area";
import { useActivityStore } from "../../stores/Activity";
import { useUserStore } from "../../stores/User";
import { useExecutionStore } from "../../stores/Execution";
import { useProjectStore } from "../../stores/Project";

import { useRouter, useRoute } from "vue-router";
import Dropdown from "../../components/Dropdown.vue";

export default {
	components:{
		Dropdown
	},
	setup() {
		const Router = useRouter()
		const UserStore = useUserStore()
		if(UserStore.LoggedUserGetter?.admin == false){

		Router.push('/Project')

		}
		const Route = useRoute()
		const Project = useProjectStore()

		const ExecutionStore = useExecutionStore();
		const ActivityStore = useActivityStore();
		const AreaStore = useAreaStore();

		const ActivitiesOfProject = ref(
			ActivityStore.GetActivitysByProjectFunction(
				Route.params.id
			)
		);

		console.log(ActivityStore.GetActivitysByProjectFunction(Route.params.id))


		return { AreaStore, ActivitiesOfProject, ExecutionStore , Route};
	},
};
</script>

<style lang="scss" scoped></style>
