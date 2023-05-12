<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto ">
		<b-button type="button" variant="clear" @click="ReturnToActivityPage()" >⬅️</b-button>

		<b-form @submit="UpdateActivityOnSubmit">
			<b-form-group label="Nome">
				<b-input required v-model="formdata.name"></b-input>
			</b-form-group>

			<b-form-group label="Area">
				<b-select required :options="AreaList" v-model="formdata.idArea"></b-select>
			</b-form-group>

			<b-form-group label="Objetivos">

				
				<b-textarea required v-model="formdata.objetivos"></b-textarea>
			</b-form-group>

			<b-form-group label="Diagonóstico">
				<b-textarea  required v-model="formdata.diagonóstico"></b-textarea>
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
				<b-form-datepicker required :max="formdata.dataFim" v-model="formdata.dataInicio"></b-form-datepicker>
			</b-form-group>
			<b-form-group label="Data Fim">
				<b-form-datepicker required :min="formdata.dataInicio" v-model="formdata.dataFim"></b-form-datepicker>
			</b-form-group>
			<b-form-group label="Avaliacao Indicadores">
				<b-textarea required v-model="formdata.avaliacaoIndicadores"></b-textarea>
			</b-form-group>
			<b-form-group label="Avaliacao Instrumentos">
				<b-textarea required v-model="formdata.avaliacaoInstrumentos"></b-textarea>
			</b-form-group>
			
			<b-button variant="success" type="submit">Editar</b-button>
			
			<b-button variant="danger" type="button"  @click="DeleteActivity">Apagar</b-button>

			<b-button variant="secondary" @click="ReturnToActivityPage()" type="button">Voltar</b-button>
		</b-form>
	</div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRoute, useRouter, } from "vue-router";
import { useActivityStore } from "../../stores/Activity";
import { useUserStore } from "../../stores/User";
import { useAreaStore } from "../../stores/Area";
import MultipleInput from "../../components/MultipleInput.vue";
import { containsProp } from "@vueuse/shared";
import router from "../../router";

export default {
	components:{
		MultipleInput
	},
	setup() {
		
		const UserStore = useUserStore();
		const activityStore = useActivityStore();
		const areaStore = useAreaStore();
		const Route = useRoute();
		const Router = useRouter();
		if(UserStore.LoggedUserGetter.admin == true) {
          Router.push('/admin')
        }

		const Actvity = activityStore.GetActivityById(Route.params.id);

		const AreaList = areaStore.GetAreas.map((area) => ({
			value: area.id,
			text: area.name,
		}));

		const formdata = reactive({
			idArea: Actvity.idArea,
			name: Actvity.name,
			diagonóstico: Actvity.diagonóstico,
			objetivos: Actvity.objetivos,
			metas: Actvity.metas,
			acoes: Actvity.acoes,
			recursos: Actvity.recursos,
			dataInicio: Actvity.dataInicio,
			dataFim: Actvity.dataFim,
			avaliacaoIndicadores: Actvity.avaliacaoIndicadores,
			avaliacaoInstrumentos: Actvity.avaliacaoInstrumentos,
		});

		function UpdateActivityOnSubmit(event) {
			event.preventDefault();
			
			console.log(formdata);
			
             activityStore.ChangeActivity({
				 idProject: UserStore.FindLoggedUserProject().id,
				 id : Actvity.id,
                 idArea : formdata.idArea,
                 name : formdata.name,
                 diagonóstico: formdata.diagonóstico,
                 objetivos: formdata.objetivos,
                 metas : formdata.metas, 
                 acoes : formdata.acoes,
                 recursos: formdata.recursos,
                 dataInicio : formdata.dataInicio,
                 dataFim : formdata.dataFim,
                 avaliacaoIndicadores: formdata.avaliacaoIndicadores,
                 avaliacaoInstrumentos: formdata.avaliacaoInstrumentos,
             })

			 Router.push(`/Project/Activity/${Actvity.id}`)
		}	

		function ReturnToActivityPage() {
			Router.push(`/Project/Activity/${Actvity.id}`)

		}

		function DeleteActivity(){
			activityStore.DeleteActivity(Actvity.id)
			router.push("/project")
		}

		return { Actvity, formdata, UpdateActivityOnSubmit, AreaList, ReturnToActivityPage,DeleteActivity };
	},
};
</script>

<style lang="scss" scoped></style>
