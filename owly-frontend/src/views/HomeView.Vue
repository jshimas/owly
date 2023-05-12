<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<h1 class="mt-5 ml-5">Olá {{ UserStore.LoggedUserGetter.name }}</h1>
		<div class="w-100">
			<div class="card m-5 p-5 text-white">
				<div>
					<h2>
						<span
							>Projeto {{ UserStore.FindLoggedUserProject().nameProject }}</span
						>
					</h2>
					<h4 class="RubikFont">
						<b-badge pill class="mr-2">{{
							ThemeStore.GetThemeId(UserStore.FindLoggedUserProject().theme)
								.name
						}}</b-badge>
						<b-badge pill class="mr-2">{{
							UserStore.FindLoggedUserProject().nameSchool
						}}</b-badge>
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
					</h4>
				</div>

				<div>
					<h3>Estado Do Projeto</h3>
					<p>{{ UserStore.FindLoggedUserProject().state }}</p>
					<h3>Número de Atividades</h3>
					<p>
						{{
							ActivityStore.GetActivityCountByProjectID(
								UserStore.FindLoggedUserProject().id
							)
						}}
					</p>
					<h3>Número de áreas abrangidas</h3>
					<p>
						{{
							ActivityStore.GetAreaCountByProjectID(
								UserStore.FindLoggedUserProject().id
							)
						}}
					</p>
					<h3>Número de colaboradores</h3>
					<p>{{ UserStore.FindLoggedUserProject().collaborators.length }}</p>
				</div>
				<b-button variant="default" @click="Router.push('/Project')"
					>Ver Projeto</b-button
				>
			</div>
		</div>

		<h2 class="mx-5">Atividade recente em Reuniões</h2>
		<b-card-group class="mx-5 mb-5">
			<b-card
				@click="Router.push('/Reunion/' + Message.idReunion)"
				v-for="Message in ReunionStore.getRecentMessages(
					UserStore.LoggedUserGetter.id
				)"
				img-src="https://picsum.photos/seed/picsum/1000/500"
				img-alt="Card image"
				class="mx-2 Reunion"
				img-top
			>
				<b-card-text>
					<h4>{{ ReunionStore.GetReunionById(Message.idReunion).name }}</h4>
					<p>
						<span v-if="Message.author == UserStore.LoggedUserGetter.id"
							>Você enviou uma mensagem</span
						>
						<span v-else
							>Você recebeu uma mensagem de
							{{ UserStore.GetUserFunc(Message.author).name }}</span
						>
						{{
							new Date(Message.date)
								.toLocaleString("default", {
									hour: "2-digit",
									minute: "2-digit",
									day: "2-digit",
									month: "2-digit",
									year: "numeric",
								})
								.replace(",", "")
						}}
					</p>
				</b-card-text>
			</b-card>
		</b-card-group>
	</div>
</template>

<script>
import { useThemeStore } from "../stores/Theme";
import { useUserStore } from "../stores/User";
import { useActivityStore } from "../stores/Activity";
import { useLevelsStore } from "../stores/levels";
import { useMessageStore } from "../stores/Message";
import { useReunionStore } from "../stores/Reunion";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
	setup() {
		const Router = useRouter();
		const editName = ref(false);
		const ThemeStore = useThemeStore();
		const ReunionStore = useReunionStore();
		const MessageStore = useMessageStore();
		const UserStore = useUserStore();
		const ActivityStore = useActivityStore();
		const LevelsStore = useLevelsStore();

		const editTheme = ref(true);

		if (UserStore.LoggedUserGetter.admin == true) {
			Router.push("/admin");
		}

		return {
			UserStore,
			ActivityStore,
			LevelsStore,
			MessageStore,
			ReunionStore,
			Router,
			editName,
			ThemeStore,
			editTheme,
		};
	},
};
</script>

<style lang="scss" scoped></style>
