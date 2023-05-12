<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<b-table
			class="table b-table bg-white mx-5 w-75 table-bordered"
			:fields="fields"
			:items="items"
		>
			<template #cell(acoes)="acoes">
				<b-button
					id="EditLevelBtn"
					v-b-modal.EditLevel
					variant="success"
					@click="
						LevelToEdit = LevelStore.GetLevels().find(
							(level) => level.id == acoes.item.id
						);
						modalShow = !modalShow;
					"
				>
					Editar
				</b-button>

				<b-button
					v-if="acoes.item.id != 1"
					type="submit"
					class="mt-2"
					variant="danger"
					@click="DeleteLevel(acoes.item.id)"
				>
					Eliminar</b-button
				>
			</template>
		</b-table>

		<b-form @submit="CreateLevel">
			<b-form-group label="Nome">
				<b-input v-model="formData.name"></b-input>
			</b-form-group>
			<b-form-group label="Minimo De Atividades">
				<b-input
					:min="0"
					type="number"
					v-model="formData.params.MinActivities"
				></b-input>
			</b-form-group>
			<b-form-group label="Minimo De Areas">
				<b-input
					:min="0"
					type="number"
					v-model="formData.params.MinAreas"
				></b-input>
			</b-form-group>
			<b-button type="submit" class="mt-2" variant="success">Criar</b-button>
		</b-form>
	</div>

	<div>
		<b-modal v-model="modalShow" hide-footer :title="'Editar Nivel '">
			<b-form @submit="EditLevelSubmit">
				<b-form-group label="Nome">
					<b-input v-model="LevelToEdit.name"></b-input>
				</b-form-group>
				<b-form-group label="Minimo De Atividades">
					<b-input
						:min="0"
						v-model="LevelToEdit.params.MinActivities"
					></b-input>
				</b-form-group>
				<b-form-group label="Minimo De Areas">
					<b-input :min="0" v-model="LevelToEdit.params.MinAreas"></b-input>
				</b-form-group>
				<b-button
					type="submit"
					class="mt-2"
					variant="success"
					@click="modalShow = !modalShow"
					>Editar</b-button
				>
				<b-button
					class="mt-2"
					variant="secondary"
					@click="modalShow = !modalShow"
					>Fechar</b-button
				>
			</b-form>
		</b-modal>
	</div>
</template>

<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useLevelsStore } from "../../stores/levels";
import { useUserStore } from "../../stores/User";

export default {
	setup() {
		const LevelStore = useLevelsStore();
		const Router = useRouter();
		const UserStore = useUserStore();
		if (UserStore.LoggedUserGetter?.admin == false) {
			Router.push("/Project");
		}

		const items = ref(
			LevelStore.GetLevels().map((el) => ({
				id: el.id,
				name: el.name,
				minActivites: el.params.MinActivities,
				MinAreas: el.params.MinAreas,
			}))
		);
		const fields = [
			"id",
			"name",
			{ key: "MinAreas" },
			{ key: "minActivites" },
			"acoes",
		];
		/**Editar Nivel */
		/**
		 * EditLevel({
            id: 3,
            name: "Bom",
            params: { MinActivities: 4 , MinAreas: 3 }}
            )

		 */
		const modalShow = ref(false);
		const LevelToEdit = ref(null);

		function EditLevelSubmit() {
			event.preventDefault();

			LevelStore.EditLevel(LevelToEdit);

			items.value = LevelStore.GetLevels().map((el) => ({
				id: el.id,
				name: el.name,
				minActivites: el.params.MinActivities,
				MinAreas: el.params.MinAreas,
			}));
		}

		function DeleteLevel(id) {
			LevelStore.DeleteLevel(id);
			items.value = LevelStore.GetLevels().map((el) => ({
				id: el.id,
				name: el.name,
				minActivites: el.params.MinActivities,
				MinAreas: el.params.MinAreas,
			}));
		}

		const formData = reactive({
			name: "",
			params: {
				MinActivities: 0,
				MinAreas: 0,
			},
		});
		function CreateLevel() {
			event.preventDefault();

			LevelStore.AddLevel({ name: formData.name, params: formData.params });

			items.value = LevelStore.GetLevels().map((el) => ({
				id: el.id,
				name: el.name,
				minActivites: el.params.MinActivities,
				MinAreas: el.params.MinAreas,
			}));

			formData.name = "";
			formData.params.MinActivities = 0;
			formData.params.MinAreas = 0;
		}

		return {
			items,
			fields,
			modalShow,
			LevelStore,
			LevelToEdit,
			EditLevelSubmit,
			DeleteLevel,
			formData,
			CreateLevel,
		};
	},
};
</script>

<style lang="scss" scoped></style>
