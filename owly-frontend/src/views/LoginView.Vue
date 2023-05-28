<script>
import { useUserStore } from "../stores/User";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
	setup() {
		const userStore = useUserStore();
		const router = useRouter();

		const email = ref("");
		const password = ref("");

		const login = async () => {
			await userStore.login({ email: email.value, password: password.value });

			if (!userStore.error) {
				router.push("/home");
			}
		};

		return {
			email,
			password,
			loading: userStore.loading,
			error: userStore.error,
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
				<b-button variant="primary" type="submit" :disabled="loading">{{
					loading ? "Loading..." : "Login"
				}}</b-button>
			</b-form>
			<div v-if="error" class="error">{{ error }}</div>
		</b-card>
	</div>
</template>

<style lang="scss" scoped></style>
