import { defineStore } from "pinia";
import { useProjectStore } from "./Project";
import UsersApi from "../APIs/UsersApi";
import VueCookies from "vue-cookies";

const defaultState = {
	user: null,
	loading: false,
	error: null,
};

export const useUserStore = defineStore("user", {
	state: () => ({ ...defaultState }),

	actions: {
		async login(credentials) {
			try {
				this.loading = true;

				// Call the API to login
				const userApi = new UsersApi();
				const r = await userApi.login(credentials);
				console.log(r.data);
				VueCookies.set("jwt", r.data.token, new Date(r.data.expIn * 1000))

				// Get the current user
				const res = await userApi.getCurrentUser();
				console.log(res.data.user);
				this.user = res.data.user;

				// Get the user's project
				const projectStore = useProjectStore();
				await projectStore.fetchUserProject();
			} catch (error) {
				this.error = error.response.data.message;
			} finally {
				this.loading = false;
			}
		},

		logout() {
			VueCookies.remove("jwt");
			Object.assign(this, defaultState);
		},
	},
});
