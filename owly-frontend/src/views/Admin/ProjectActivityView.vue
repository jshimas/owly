<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<h2>Activity view</h2>
		<b-button :to="`/Admin/Project/${Route.params.id}`">Voltar</b-button>

		<h3>Nome: {{ Activity.name }}</h3>

		<h4>Área</h4>
		{{ AreaStore.GetAreaById(Activity.idArea).name }}
		<h4>Objetivos</h4>
		{{ Activity.objetivos }}

		<h4>Ações</h4>
		{{ Activity.acoes }}
		<h4>Avaliação Indicadores</h4>
		{{ Activity.avaliacaoIndicadores }}
		<h4>Avaliação Instrumentos</h4>
		{{ Activity.avaliacaoInstrumentos }}
		<h4>recursos</h4>
		{{ Activity.recursos }}
		<h4>dataInicio</h4>
		{{ Activity.dataInicio }}
		<h4>dataFim</h4>
		{{ Activity.dataFim }}
		<h4>metas</h4>
		{{ Activity.metas }}
		<h4>diagonóstico</h4>
		{{ Activity.diagonóstico }}
	</div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useActivityStore } from "../../stores/Activity";
import { useUserStore } from "../../stores/User";
import { useAreaStore } from "../../stores/Area";

export default {
	setup() {
		//<RouterLink :to="`Project/EditActivity/${Route.params.id}`"> Edit The view </RouterLink>
		const UserStore = useUserStore();
		const Route = useRoute();
		const Router = useRouter();

		if (UserStore.LoggedUserGetter?.admin == false) {
			Router.push("/Project");
		}

		const ActivityStore = useActivityStore();
		const AreaStore = useAreaStore();

		const Activity = ActivityStore.GetActivityById(Route.params.idActivity);

		return { Activity, AreaStore, Route };
	},
};
</script>

<style lang="scss" scoped></style>
