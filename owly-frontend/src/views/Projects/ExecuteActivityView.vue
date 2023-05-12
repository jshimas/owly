<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		
		<h1 class="m-5">
			Executar Atividade
		</h1>
		
		<b-form class="text-white card p-3 w-75 mx-5" @submit="onSubmit">
			<b-form-group
				label="Atividade a Executar:"
				label-for="selecionadorAtividade"
			>
				<b-form-select 
					
					id="selecionadorAtividade"
					v-model="formData.idActivity"
					:options="ProjectActivityListAreaAndId"
					required
				/>
			</b-form-group>

			<b-form-group
				label="Descritivo da execução da atividade: "
				label-for="textareaDescritivo"
			>
				<b-form-textarea
					id="textareaDescritivo"
					v-model="formData.description"
					placeholder="Descritivo..."
					rows="3"
					required
				></b-form-textarea>
			</b-form-group>

			<b-form-group label="Escolher Imagem" label-for="ImagePicker">
				<b-form-file
					v-model="formData.image"
					id="ImagePicker"
					placeholder="Escolha uma imagem (jpeg,png,gif)"
					accept="image/jpeg, image/png, image/gif"
				></b-form-file>
			</b-form-group>

			<div class="my-1">
				<b-button type="submit" @click="" variant="success">Criar</b-button>
				<b-button type="button" to="/Project/Executions" variant="secondary">Voltar</b-button>

			</div>
		</b-form>

	</div>
</template>

<script>
import { reactive, ref } from "vue";
import { useExecutionStore } from "../../stores/Execution";
import { useUserStore } from "../../stores/User";
import { useActivityStore } from "../../stores/Activity";
import { useRouter, useRoute } from "vue-router";

export default {
	setup() {
		const ActivityStore = useActivityStore();
		const ExecutionStore = useExecutionStore();
		const UserStore = useUserStore();
		const Router = useRouter();
		if(UserStore.LoggedUserGetter.admin == true) {
          Router.push('/admin')
        }
	


		const formData = reactive({
			idActivity: '',
			description: '' ,
			image: '' ,
		});

		function onSubmit(event) {
			event.preventDefault();

			ExecutionStore.CreateExecution({
				
				idActivity: formData.idActivity,
				description: formData.description,
				image: formData.image })	
				
				Router.push('/Project/Executions')
			}
			

		const ProjectActivityList = ActivityStore.GetActivitysByProjectFunction(
			UserStore.FindLoggedUserProject().id
		);

		const ProjectActivityListAreaAndId = ProjectActivityList.map(
			(Activity) => ({ value: Activity.id, text: Activity.name })
		);

		return {
			ProjectActivityListAreaAndId,
			formData,
			onSubmit,
		
		};
	},
};
</script>

<style lang="scss" scoped></style>
