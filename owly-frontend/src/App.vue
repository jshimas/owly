<script>
import Navbar from "./components/Navbar.vue";
import { useRoute, useRouter } from "vue-router";
import { watch, ref } from "vue";
import { useUserStore } from "./stores/User";

export default {
	components: {
		Navbar,
	},
	setup() {
		const route = useRoute();
		const router = useRouter();
		const userStore = useUserStore();

		const showNavbar = ref(true);
		const RoutesThatDontNeedSideNav = ["/", "/login"];

		watch(route, async (newRoute, oldRoute) => {
			if (RoutesThatDontNeedSideNav.includes(newRoute.fullPath)) {
				showNavbar.value = false;
			} else {
				showNavbar.value = true;
				if (!userStore.user.id) {
					router.push("/login");
				}
			}
		});

		return { Navbar, showNavbar };
	},
};
</script>

<template>
	<Navbar v-if="showNavbar" />
	<RouterView />
</template>

<style scoped></style>
