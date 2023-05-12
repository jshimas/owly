<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<h1 class="m-5">Olá {{ UserStore.LoggedUserGetter.name }}</h1>
		<div class="w-100"></div>

		<h2 class="mx-5">Atividade recente em Reuniões</h2>
		<b-card-group class="mx-5" deck>
			<b-card
				@click="Router.push('/Reunion/' + Message.idReunion)"
				v-for="Message in ReunionStore.getRecentMessages(
					UserStore.LoggedUserGetter.id
				)"
				img-src="https://placekitten.com/1000/300"
				img-alt="Card image"
				class="Reunion"
				style="max-width: 30%"
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
						<small
							v-if="ReunionStore.GetReunionById(Message.idReunion).archived"
							>Estado: Arquivado</small
						>
						<small v-else>Estado: Ativo</small>
					</p>
				</b-card-text>
			</b-card>
		</b-card-group>
	</div>
</template>

<script>
import { useUserStore } from "../../stores/User";
import { useActivityStore } from "../../stores/Activity";
import { useMessageStore } from "../../stores/Message";
import { useReunionStore } from "../../stores/Reunion";
import { useRouter } from "vue-router";

export default {
	setup() {
		const Router = useRouter();
		const UserStore = useUserStore();
		const ActivityStore = useActivityStore();
		const MessageStore = useMessageStore();
		const ReunionStore = useReunionStore();

		if (UserStore.LoggedUserGetter?.admin == false) {
			Router.push("/Project");
		}

		return { UserStore, ActivityStore, MessageStore, ReunionStore, Router };
	},
};
</script>

<style lang="scss" scoped></style>
