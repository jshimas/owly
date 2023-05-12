<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<b-table
			class="table b-table bg-white mx-5 w-75 table-bordered"
			:fields="fields"
			:items="ProjectStore.GetProjects"
		>
			<template #cell(acoes)="row">
				<b-button variant="danger" @click="DeleteProject(row.item.id)"
					>Eliminar</b-button
				>
			</template>
		</b-table>
		<b-form>
			<b-form-group label="Name">
				<b-input required v-model="name"> </b-input>
				<b-button
					@click="ProjectStore.CreateProject({ nameSchool: name })"
					varaint="success"
					>Criar Escola</b-button
				>
			</b-form-group>
		</b-form>
	</div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useActivityStore } from "../../stores/Activity";
import { useExecutionStore } from "../../stores/Execution";
import { useProjectStore } from "../../stores/Project";
import { useUserStore } from "../../stores/User";

export default {
	setup() {
		const Router = useRouter();
		const UserStore = useUserStore();
		if (UserStore.LoggedUserGetter?.admin == false) {
			Router.push("/Project");
		}

		const ProjectStore = useProjectStore();
		const ActivityStore = useActivityStore();
		const ExecutionStore = useExecutionStore();

		const name = ref();

		const fields = [
			{ key: "id", sortable: true },
			{ key: "nameSchool", sortable: true },
			{ key: "acoes", label: "Ações" },
		];

		function DeleteProject(ProjectID) {
			ActivityStore.GetActivitysByProjectID(ProjectID).forEach((Activity) => {
				ActivityStore.DeleteActivity(Activity.id);
				ExecutionStore.GetExecutionByActivityFunction(Activity.id).forEach(
					(Execution) => ExecutionStore.DeleteExecution(Execution.id)
				);
			});

			ProjectStore.DeleteProject(ProjectID);
		}

		return {
			DeleteProject,
			name,
			ProjectStore,
			fields,
		};
	},
};
</script>

<style lang="scss" scoped></style>
