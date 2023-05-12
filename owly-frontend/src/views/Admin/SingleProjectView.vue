<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<h1>Página do Projeto</h1>
		<br />
		<h2>{{ Project.nameProject }} || {{ Project.state }}</h2>
		<br />
		<b-badge>{{
			ThemeStore.GetThemeId(
				ProjectStore.GetProjectFunction($route.params.id).theme
			).name
		}}</b-badge>
		<b-badge>{{
			ProjectStore.GetProjectFunction($route.params.id).nameSchool
		}}</b-badge>
		<b-badge
			>{{
				LevelsStore.CheckLevel(
					ActivityStore.GetActivityCountByProjectID($route.params.id),
					ActivityStore.GetAreaCountByProjectID($route.params.id)
				).name
			}}
		</b-badge>
		<b-badge>{{ Project.state }}</b-badge>

		<b-table :fields="fields" :items="ActivitysOfProject">
			<template #cell(Ações)="row">
				<b-button @click="GoToActivityView(row.item.id)">Detalhes</b-button>
			</template>
		</b-table>

		<div>
			<b-button
				variant="success"
				v-if="Project.state == 'Execução'"
				:to="`/Admin/Project/${Route.params.id}/Executions`"
				>Execuções de Atividades</b-button
			>
		</div>

		<h3>Colaboradores</h3>
		<table>
			<thead>
				<tr>
					<th>Email</th>
					<th>Nome</th>
					<th>Ações</th>
				</tr>
			</thead>

			<tbody>
				<tr
					v-for="(CollaboratorID, index) of ProjectCollaborators"
					:key="index"
				>
					<td>{{ UserStore.GetUserFunc(CollaboratorID).email }}</td>
					<td>{{ UserStore.GetUserFunc(CollaboratorID).name }}</td>
					<td>
						<b-button
							variant="secondary"
							:to="'/Profile/' + UserStore.GetUserFunc(CollaboratorID).id"
							>Ver Perfil</b-button
						>
					</td>
				</tr>
			</tbody>
		</table>

		<b-button
			variant="success"
			v-if="Project.state == 'Em Aprovação'"
			@click="Project.state = 'Execução'"
			>Aprovar
		</b-button>

		<b-button
			variant="danger"
			v-if="Project.state == 'Em Aprovação'"
			@click="Project.state = 'Planeamento'"
			>Reprovar
		</b-button>
	</div>
</template>

<script defer>
import { ref, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../stores/User";
import { useActivityStore } from "../../stores/Activity";

import { useProjectStore } from "../../stores/Project";
import { useExecutionStore } from "../../stores/Execution";
import { useLevelsStore } from "../../stores/levels";
import { useThemeStore } from "../../stores/Theme";

export default {
	components: {},
	setup() {
		const LevelsStore = useLevelsStore();
		const Router = useRouter();
		const UserStore = useUserStore();
		if (UserStore.LoggedUserGetter?.admin == false) {
			Router.push("/Project");
		}

		const Route = useRoute();

		const ThemeStore = useThemeStore();

		const ActivityStore = useActivityStore();

		const ProjectStore = useProjectStore();

		const fields = ref(["id", "name", "Ações"]);

		const Project = ref(ProjectStore.GetProjectFunction(Route.params.id));

		let ActivitysOfProject = ActivityStore.GetActivitysByProjectFunction(
			Project.value.id
		);

		ActivitysOfProject = ActivitysOfProject.map((Activity) => ({
			id: Activity.id,
			name: Activity.name,
		}));

		const ProjectCollaborators = ref(Project.value.collaborators);

		function GoToActivityView(ActivityId) {
			Router.push({
				path: `/Admin/Project/${Route.params.id}/Activity/${ActivityId}`,
			});
		}

		const ExecutionStore = useExecutionStore();

		const ProjectExecutions = ref([]);

		ActivitysOfProject.forEach((Activity) => {
			ProjectExecutions.value.push(
				ExecutionStore.GetExecutionByActivityFunction(Activity.id)
			);
		});

		return {
			ThemeStore,
			ProjectStore,
			LevelsStore,
			UserStore,
			Project,
			ProjectCollaborators,
			ActivitysOfProject,
			fields,
			GoToActivityView,
			ProjectExecutions,
			ActivityStore,
			Route,
		};
	},
};
</script>

<style lang="scss" scoped></style>
