<template>
	<button @click="state = !state"><IconArrowRightVue /></button>

	<ul v-if="state">
		<slot></slot>
	</ul>
</template>

<script>
import IconArrowRightVue from "./icons/IconArrowRight.vue";
import { ref } from "vue";

export default {
	components: {
		IconArrowRightVue,
	},
	setup() {
		const state = ref(false);

		return {
			state,
		};
	},
};
</script>

<style lang="scss" scoped>
button {
	background: none;
	outline: none;
	border: none;
}
</style>
