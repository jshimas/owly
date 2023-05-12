<template>
	<div>
		<h1>Cheat Sheet Stores</h1>
		<h2>Themes</h2>
		<h3>//Getter Todos</h3>
		{{ useThemeStore().GetThemes }}

		<br />
		<h3>//Getter Por ID</h3>
		{{ useThemeStore().GetTheme }}

		<br />
		<h2>Areas</h2>

		{{ useAreaStore().GetAreas }}

		<br />
		<h3>//Getter Por ID</h3>
		{{ useAreaStore().GetArea }}
		<br />

		<h2>Reunions</h2>
		<h3>//Getter Todos</h3>
		{{ useReunionStore().GetReunions }}

		<br />
		<h3>//Getter Por ID</h3>
		{{ useReunionStore().GetReunion }}

		<br />
		<h3>//Getter Por filtro de nome (includes) (devolve Array)</h3>
		{{ useReunionStore().GetReunionsByName }}

		<br />

		<h2>Messages</h2>
		<h3>//Getter Todos</h3>
		{{ useMessageStore().GetMessages }}

		<br />

		<h3>//Getter Por ID Reunioes (devolve Array)</h3>
		{{ useMessageStore().GetMessagesByReunion }}

		<h2>User</h2>
		<h3>//Getter Todos</h3>
		{{ useUserStore().GetUsers }}

		<br />

		{{ useUserStore().GetUser }}

		<h2>Project</h2>
		<h3>//Getter Todos</h3>
		{{ useProjectStore().GetProjects }}

		<br />
		<h3>//Getter Por ID</h3>
		{{ useProjectStore().GetProject }}

		<h2>Activity</h2>
		<h3>//Getter Todos</h3>
		{{ useActivityStore().GetActivitys }}

		<br />
		<h3>//Getter Por idProjeto (devolve Array)</h3>
		{{ useActivityStore().GetActivitysByProject }}

		<h2>Execution</h2>
		<h3>//Getter Todos</h3>
		{{ useExecutionStore().GetExecutions }}

		<br />
		<h3>//Getter Por idProjeto (devolve Array)</h3>
		{{ useExecutionStore().GetExecutionByActivity }}
	</div>
</template>

<script>
import { ref, computed } from "vue";
import { useThemeStore } from "../stores/Theme";
import { useAreaStore } from "../stores/Area";
import { useMessageStore } from "../stores/Message";
import { useUserStore } from "../stores/User";
import { useProjectStore } from "../stores/Project";
import { useReunionStore } from "../stores/Reunion";
import { useActivityStore } from "../stores/Activity";
import { useExecutionStore } from "../stores/Execution";

export default {
	setup() {
		useThemeStore().SetTheme(1);

		useAreaStore().SetArea(2);

		useUserStore().SetUser(1);

		//TryCatch --> erro devolve mensagem
		//useUserStore().LogIn('Admin@example','xkhzkdrgs')
		useUserStore().LogIn("user@example", "ae3j0v2gu");

		//useUserStore().LogOff()

		//Returns True or false
		//useUserStore().CheckIfLoggedUserIsLogged()
		//useUserStore().CheckIfLoggedUserIsAdmin()

		useProjectStore().SetProject(1);

		//Devolve Projeto e estado
		//useUserStore().FindLoggedUserProject()
		//useUserStore().FindLoggedUserProjectState()

		useMessageStore().GetMessagesByReunionSetter(2);

		useReunionStore().GetReunionsByNameSetter("1");

		useReunionStore().SetReunion(1);

		useActivityStore().GetActivitysByProjectSetter(2);

		useExecutionStore().GetExecutionByActivitySetter(1);

		return {
			useThemeStore,
			useAreaStore,
			useMessageStore,
			useUserStore,
			useProjectStore,
			useReunionStore,
			useActivityStore,
			useExecutionStore,
		};
	},
};
</script>

<style lang="scss" scoped></style>
