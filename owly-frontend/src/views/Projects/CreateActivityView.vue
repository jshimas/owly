<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<b-button type="button" variant="clear" @click="ReturnToProjectPage()"
			>⬅️</b-button
		>

		<b-form @submit="UpdateActivityOnSubmit">
			<b-form-group label="Nome">
				<b-input required v-model="formdata.name"></b-input>
			</b-form-group>

			<b-form-group label="Area">
				<b-select
					required
					:options="AreaList"
					v-model="formdata.idArea"
				></b-select>
			</b-form-group>

			<b-form-group label="Objetivos">
				<b-textarea required v-model="formdata.objetivos"></b-textarea>
			</b-form-group>

			<b-form-group label="Diagonóstico">
				<b-textarea required v-model="formdata.diagonóstico"></b-textarea>
			</b-form-group>
			<b-form-group label="Recursos">
				<b-textarea required v-model="formdata.recursos"></b-textarea>
			</b-form-group>
			<b-form-group label="Metas">
				<b-textarea required v-model="formdata.metas"></b-textarea>
			</b-form-group>
			<b-form-group label="Ações">
				<b-textarea required v-model="formdata.acoes"></b-textarea>
			</b-form-group>
			<b-form-group label="Data Inicio">
				<b-form-datepicker
					required
					:max="formdata.dataFim"
					v-model="formdata.dataInicio"
				></b-form-datepicker>
			</b-form-group>
			<b-form-group label="Data Fim">
				<b-form-datepicker
					required
					:min="formdata.dataInicio"
					v-model="formdata.dataFim"
				></b-form-datepicker>
			</b-form-group>
			<b-form-group label="Avaliacao Indicadores">
				<b-textarea
					required
					v-model="formdata.avaliacaoIndicadores"
				></b-textarea>
			</b-form-group>
			<b-form-group label="Avaliacao Instrumentos">
				<b-textarea
					required
					v-model="formdata.avaliacaoInstrumentos"
				></b-textarea>
			</b-form-group>

			<b-button variant="success" type="submit">Criar</b-button>

			<b-button variant="secondary" @click="ReturnToProjectPage()" type="button"
				>Voltar</b-button
			>
		</b-form>
	</div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useActivityStore } from "../../stores/Activity";
import { useUserStore } from "../../stores/User";
import { useAreaStore } from "../../stores/Area";
import MultipleInput from "../../components/MultipleInput.vue";
import { containsProp } from "@vueuse/shared";

export default {
	components: {
		MultipleInput,
	},
	setup() {
		const UserStore = useUserStore();
		const activityStore = useActivityStore();
		const areaStore = useAreaStore();
		const Route = useRoute();
		const Router = useRouter();
		if (UserStore.LoggedUserGetter.admin == true) {
			Router.push("/admin");
		}

		const AreaList = areaStore.GetAreas.map((area) => ({
			value: area.id,
			text: area.name,
		}));

		const formdata = reactive({
			idArea: "",
			name: "",
			diagonóstico: "",
			objetivos: "",
			metas: "",
			acoes: "",
			recursos: "",
			dataInicio: "",
			dataFim: "",
			avaliacaoIndicadores: "",
			avaliacaoInstrumentos: "",
		});

		function UpdateActivityOnSubmit(event) {
			event.preventDefault();

			console.log(formdata);

			activityStore.CreateActivity({
				idProject: UserStore.FindLoggedUserProject().id,
				idArea: formdata.idArea,
				name: formdata.name,
				diagonóstico: formdata.diagonóstico,
				objetivos: formdata.objetivos,
				metas: formdata.metas,
				acoes: formdata.acoes,
				recursos: formdata.recursos,
				dataInicio: formdata.dataInicio,
				dataFim: formdata.dataFim,
				avaliacaoIndicadores: formdata.avaliacaoIndicadores,
				avaliacaoInstrumentos: formdata.avaliacaoInstrumentos,
			});

			Router.push(`/Project`);
		}

		function ReturnToProjectPage() {
			Router.push(`/Project`);
		}

		return { formdata, UpdateActivityOnSubmit, AreaList, ReturnToProjectPage };
	},
};
</script>

<style lang="scss" scoped></style>
