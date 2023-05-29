<script>
import { useUserStore } from "../stores/User";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export default {
	setup() {
		const userStore = useUserStore();
		const router = useRouter();

		const email = ref("");
		const password = ref("");
		const error = computed(() => userStore.error);
		const loading = computed(() => userStore.loading);

		const login = async () => {
			await userStore.login({ email: email.value, password: password.value });

			if (userStore.user) {
				router.push("/home");
			}
		};

		return {
			email,
			password,
			loading,
			error,
			login,
		};
	},
};
</script>

<template>
	<div
		class="w-100 vh-100 d-flex justify-content-center align-items-center backgroundPages"
	>
		<b-card class="w-25">
			<b-form @submit.prevent="login">
				<b-form-group>
					<b-label>Email</b-label>
					<b-input v-model="email" type="email" aria-required="true" />
				</b-form-group>
				<b-form-group>
					<b-label>Password</b-label>
					<b-input v-model="password" type="password" aria-required="true" />
				</b-form-group>
				<div class="text-danger" v-if="error">{{ error }}</div>
				<b-button variant="primary" type="submit" :disabled="loading">{{
					loading ? "Loading..." : "Login"
				}}</b-button>
			</b-form>
		</b-card>
	</div>
</template>

<style lang="scss" scoped></style>
