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

		const UserStore = useUserStore();

		const RoutesThatDontNeedSideNav = ["/", "/Login"];

		watch(route, async (newRoute, OldRoute) => {
			if (
				RoutesThatDontNeedSideNav.some(
					(routePath) => routePath == newRoute.fullPath
				)
			) {
				NavState.value = false;
			} else {
				NavState.value = true;
			}

			if (
				!RoutesThatDontNeedSideNav.some(
					(routePath) => routePath == newRoute.fullPath
				) &&
				UserStore.LoggedUserGetter.id == undefined
			) {
				router.push("/Login");
			}
		});

		const NavState = ref(true);

		return { Navbar, NavState };
	},
};
</script>

<template>
	<Navbar v-if="NavState" />

	<RouterView />
</template>

<style scoped></style>
