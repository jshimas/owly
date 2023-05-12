<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<h1 class="mt-5 mx-5">Página do Projeto</h1>
		<br />

		<h2 class="mx-5">
			<b-input
				v-if="editName"
				v-model="UserStore.FindLoggedUserProject().nameProject"
			></b-input>
			<span v-else
				>Projeto {{ UserStore.FindLoggedUserProject().nameProject }}</span
			>

			<template v-if="UserStore.FindLoggedUserProject().state == 'Planeamento'">
				<b-button
					variant="primary"
					v-if="(UserStore.LoggedUserGetter.funcao = 'Coordenador')"
					@click="editName = !editName"
				>
					<template v-if="!editName">Editar Titulo</template>
					<template v-else>Fechar</template>
				</b-button>
			</template>
		</h2>
		<br />
		<p class="mx-5">
			<b-badge pill>{{
				ThemeStore.GetThemeId(UserStore.FindLoggedUserProject().theme).name
			}}</b-badge>
			<b-badge pill>{{ UserStore.FindLoggedUserProject().nameSchool }}</b-badge>
			<b-badge pill
				>{{
					LevelsStore.CheckLevel(
						ActivityStore.GetActivityCountByProjectID(
							UserStore.FindLoggedUserProject().id
						),
						ActivityStore.GetAreaCountByProjectID(
							UserStore.FindLoggedUserProject().id
						)
					).name
				}}
			</b-badge>
		</p>

		<div
			class="mx-5 mb-3"
			v-if="UserStore.FindLoggedUserProject().state == 'Planeamento'"
		>
			<b-select
				v-if="editTheme"
				v-model="UserStore.FindLoggedUserProject().theme"
				:options="
					ThemeStore.GetThemes.map((theme) => ({
						value: theme.id,
						text: theme.name,
					}))
				"
			></b-select>
			<b-button v-if="!editTheme" @click="editTheme = !editTheme"
				>Escolher Tema</b-button
			>
			<b-button v-if="editTheme" @click="editTheme = !editTheme"
				>Fechar</b-button
			>
		</div>

		<b-table
			class="table b-table bg-white mx-5 w-75 table-bordered"
			:fields="fields"
			:items="ActivitysOfProject"
		>
			<template #cell(Ações)="row">
				<b-button @click="GoToActivityView(row.item.id)">Detalhes</b-button>
			</template></b-table
		>

		<div class="mx-5">
			<b-button
				variant="success"
				v-if="UserStore.FindLoggedUserProjectState() == 'Execução'"
				to="/Project/Executions"
				>Execuções de Atividades</b-button
			>
			<b-button
				variant="success"
				v-if="UserStore.FindLoggedUserProjectState() == 'Planeamento'"
				to="/Project/CreateActivity"
				>Criar Atividade</b-button
			>
		</div>

		<h3 class="mt-5 mx-5">Colaboradores</h3>
		<table class="table b-table bg-white mx-5 w-75 table-bordered">
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
							:to="'Profile/' + UserStore.GetUserFunc(CollaboratorID).id"
							>Ver Perfil</b-button
						>
					</td>
				</tr>
			</tbody>
		</table>

		<br />

		<br />
		<div v-if="UserStore.LoggedUserGetter.role == 'Coordenador'">
			<b-button
				class="mx-5"
				v-if="Project.state == 'Planeamento'"
				@click="Project.state = 'Em Aprovação'"
			>
				Pedir Aprovação
			</b-button>
		</div>
	</div>
</template>

<script>
import { ref, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/User";
import { useActivityStore } from "../../stores/Activity";

import { useProjectStore } from "../../stores/Project";
import { useExecutionStore } from "../../stores/Execution";
import { useLevelsStore } from "../../stores/levels";
import { useThemeStore } from "../../stores/Theme";

export default {
	components: {},
	setup() {
		const editName = ref(false);
		const editTheme = ref(false);

		const ThemeStore = useThemeStore();

		const Router = useRouter();
		const UserStore = useUserStore();
		if (UserStore.LoggedUserGetter.admin == true) {
			Router.push("/admin");
		}

		const ActivityStore = useActivityStore();

		const LevelsStore = useLevelsStore();

		const ProjectStore = useProjectStore();

		const fields = ref(["id", "name", "Ações"]);

		const Project = ref(UserStore.FindLoggedUserProject());

		let ActivitysOfProject = ActivityStore.GetActivitysByProjectFunction(
			Project.value.id
		);

		ActivitysOfProject = ActivitysOfProject.map((Activity) => ({
			id: Activity.id,
			name: Activity.name,
		}));

		const ProjectCollaborators = ref(Project.value.collaborators);

		function GoToActivityView(ActivityId) {
			Router.push({ path: `/Project/Activity/${ActivityId}` });
		}

		const ExecutionStore = useExecutionStore();

		const ProjectExecutions = ref([]);

		ActivitysOfProject.forEach((Activity) => {
			ProjectExecutions.value.push(
				ExecutionStore.GetExecutionByActivityFunction(Activity.id)
			);
		});

		return {
			editName,
			editTheme,
			ThemeStore,
			LevelsStore,
			UserStore,
			Project,
			ProjectCollaborators,
			ActivitysOfProject,
			fields,
			GoToActivityView,
			ProjectExecutions,
			ActivityStore,
		};
	},
};
</script>

<style lang="scss" scoped></style>
