<template>
	<div class="w-100 vh-100 column BackgroundLandingPage">
		<div
			class="w-100 d-flex justify-content-end align-items-center position-sticky"
		>
			<IconOwlyLogo
				width="100"
				height="100"
				:class="'position-relative'"
				:style="'left: 50px; z-index:990'"
			/>
			<b-navbar variant="light" class="p-3 my-5 w-90 pl-5">
				<b-button class="" to="/login"> Login </b-button>
			</b-navbar>
		</div>

		<div class="text-white" style="margin: 200px; max-width: 400px">
			<h1>Bem vindo ao Owly!</h1>
			<h3 class="RubikFont">
				Owly é uma aplicação que permite a gestão de uma forma eficaz e
				interativa do Projeto Eco-Escolas.
			</h3>
			<b-button to="/login">Fazer Login</b-button>
		</div>
		<div class="w-100"></div>
	</div>
</template>

<script>
import IconOwlyLogo from "../components/icons/IconOwlyLogo.vue";

import { useMessageStore } from "../stores/Message";
import { useThemeStore } from "../stores/Theme";
import { useAreaStore } from "../stores/Area";
import { useReunionStore } from "../stores/Reunion";
import { useExecutionStore } from "../stores/Execution";
import { useActivityStore } from "../stores/Activity";
import { useProjectStore } from "../stores/Project";
import { useUserStore } from "../stores/User";

export default {
	components: {
		IconOwlyLogo,
	},
	setup() {
		//SETUP THE STORES
		useMessageStore();
		useThemeStore();
		useAreaStore();
		useReunionStore();
		useExecutionStore();
		useActivityStore();
		useProjectStore();
		useUserStore();

		return {};
	},
};
</script>

<style lang="scss" scoped></style>
