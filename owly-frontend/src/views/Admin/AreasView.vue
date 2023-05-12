<template>
	<div class="w-100 vh-100 backgroundPages overflow-auto">
		<div>
			<!-- AREAS -->
			<b-table
				class="table b-table bg-white mx-5 w-75 table-bordered"
				per-page="5"
				:current-page="AreaTablePage"
				:fields="fields"
				:items="AreaStore.GetAreas"
			>
				<template #cell(acoes)="acoes">
					<b-button
						@click="AreaStore.DeleteArea(acoes.item.id)"
						variant="danger"
					>
						Eliminar
					</b-button>
				</template>
			</b-table>
			<p>Página {{ AreaTablePage }}</p>
			<b-button
				variant="none"
				@click="0 != AreaTablePage - 1 ? AreaTablePage-- : null"
				>◀️</b-button
			>
			<b-button
				variant="none"
				@click="
					AreaTablePage * 5 <= AreaStore.GetAreas.length
						? AreaTablePage++
						: null
				"
				>▶️</b-button
			>

			<b-form @submit="CreateNewArea()">
				<h5>Adicionar Area</h5>
				<b-form-group label="Nome">
					<b-input required v-model="NewAreaName"></b-input>
				</b-form-group>

				<b-button type="submit" variant="success">Adicionar</b-button>
			</b-form>
			<br />

			<!-- THEMES -->
			<b-table
				per-page="5"
				class="table b-table bg-white mx-5 w-75 table-bordered"
				:current-page="ThemeTablePage"
				:fields="fields"
				:items="ThemeStore.GetThemes"
			>
				<template #cell(acoes)="acoes">
					<b-button
						@click="ThemeStore.DeleteTheme(acoes.item.id)"
						variant="danger"
					>
						Eliminar
					</b-button>
				</template>
			</b-table>
			<p>Página {{ ThemeTablePage }}</p>
			<b-button
				variant="none"
				@click="0 != ThemeTablePage - 1 ? ThemeTablePage-- : null"
				>◀️</b-button
			>
			<b-button
				variant="none"
				@click="
					ThemeTablePage * 5 <= ThemeStore.GetThemes.length
						? ThemeTablePage++
						: null
				"
				>▶️</b-button
			>

			<b-form @submit="CreateNewTheme()">
				<h5>Adicionar Tema</h5>
				<b-form-group label="Nome">
					<b-input required v-model="NewThemeName"></b-input>
				</b-form-group>

				<b-button type="submit" variant="success">Adicionar</b-button>
			</b-form>
			<br />
		</div>
	</div>
</template>

<script>
import { useUserStore } from "../../stores/User";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAreaStore } from "../../stores/Area";
import { useThemeStore } from "../../stores/Theme";

export default {
	setup() {
		const AreaStore = useAreaStore();
		const ThemeStore = useThemeStore();
		const Router = useRouter();
		const UserStore = useUserStore();

		if (UserStore.LoggedUserGetter?.admin == false) {
			Router.push("/Project");
		}

		const fields = [
			{
				key: "id",
				sortable: true,
				label: "ID",
			},
			{
				key: "name",
				label: "Nome",
				sortable: true,
			},
			{
				key: "acoes",
				sortable: false,
				label: "Ações",
			},
		];

		const AreaTablePage = ref(1);
		const ThemeTablePage = ref(1);
		const NewAreaName = ref("");
		const NewThemeName = ref("");

		function CreateNewArea() {
			event.preventDefault();

			AreaStore.CreateArea(NewAreaName.value);
		}

		function CreateNewTheme() {
			event.preventDefault();

			ThemeStore.CreateTheme(NewThemeName.value);
		}

		return {
			AreaStore,
			ThemeStore,
			fields,
			AreaTablePage,
			ThemeTablePage,
			NewAreaName,
			NewThemeName,
			CreateNewArea,
			CreateNewTheme,
		};
	},
};
</script>

<style lang="scss" scoped></style>
