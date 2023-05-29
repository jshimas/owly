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
		const emailError = ref(null);
		const passwordError = ref(null);

		const error = computed(() => userStore.error);
		const loading = computed(() => userStore.loading);

		const login = async () => {
			// Reset error messages
			emailError.value = null;
			passwordError.value = null;

			// Validate email and password
			if (!email.value) {
				emailError.value = "Email is required.";
			}

			if (!password.value) {
				passwordError.value = "Password is required.";
			}

			// Perform login if there are no validation errors
			if (!emailError.value && !passwordError.value) {
				await userStore.login({ email: email.value, password: password.value });

				if (!userStore.error) {
					router.push("/home");
				}
			}
		};

		return {
			email,
			password,
			loading,
			error,
			login,
			emailError,
			passwordError,
		};
	},
};
</script>

<template>
	<div
		class="w-100 vh-100 d-flex justify-content-center align-items-center backgroundPages"
	>
		<b-card class="w-25">
			<b-form @submit.prevent="login" class="was-validated">
				<b-form-group
					label="Email"
					label-for="email-input"
					class="has-validation"
					:state="emailError ? false : null"
					:invalid-feedback="emailError"
				>
					<b-input
						id="email-input"
						v-model="email"
						type="email"
						:state="emailError ? false : null"
						required
						aria-required="true"
					></b-input>
				</b-form-group>
				<b-form-group
					label="Password"
					label-for="password-input"
					:state="passwordError ? false : null"
					:invalid-feedback="passwordError"
				>
					<b-input
						id="password-input"
						v-model="password"
						type="password"
						:state="passwordError ? false : null"
						required
						aria-required="true"
					></b-input>
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
