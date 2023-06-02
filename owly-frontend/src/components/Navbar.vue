<template>
	<div v-if="!userStore.user">Loading...</div>
	<div
		v-else
		class="sticky-top d-flex flex-column vh-100 pt-5 pb-5 justify-content-between align-items-md-center NavbarGreen"
	>
		<div>
			<div class="mb-5 d-flex flex-column align-items-center mx-5">
				<img src="../assets/imgs/GroupOwlyLogoExtended.svg" class="w-100" />
			</div>

			<div class="mb-5 d-flex flex-column align-items-center">
				<!-- <b-img
					@click="Router.push('/Profile/EditProfile')"
					to="/Profile/EditProfile"
					rounded="circle"
					v-bind="{
						blank: true,
						blankColor: '#777',
						height: '75px',
						width: '75px',
					}"
					:src="userStore.LoggedUserGetter.picture"
				></b-img> -->
				<p>{{ userStore.user.firstname }} {{ userStore.user.lastname }}</p>
			</div>
			<div v-if="userStore.user.role === 'admin'">
				<ul>
					<li>
						<RouterLink to="/admin">Home</RouterLink>
					</li>
					<li>
						<RouterLink to="/meetings">Meetings</RouterLink>
					</li>
					<li>
						<RouterLink :to="`/profile/${userStore.user.id}`"
							>Profile</RouterLink
						>
					</li>
					<li>
						<RouterLink to="">Admin</RouterLink>
						<Dropdown>
							<li><RouterLink to="/admin/users">Users</RouterLink></li>
							<li><RouterLink to="/admin/schools">Schools</RouterLink></li>
						</Dropdown>
					</li>
				</ul>
			</div>

			<div v-else>
				<ul>
					<li>
						<RouterLink to="/home">Home</RouterLink>
					</li>
					<li>
						<RouterLink to="/meetings">Meetings</RouterLink>
					</li>
					<li>
						<RouterLink :to="`/profile/${userStore.user.id}`"
							>Profile</RouterLink
						>
					</li>
					<li>
						<RouterLink to="/project">Project</RouterLink>
					</li>
				</ul>
			</div>
		</div>

		<div><b-button variant="danger" @click="logout">Log out</b-button></div>
	</div>
</template>

<script>
import { useUserStore } from "../stores/User";
import { useProjectStore } from "../stores/Project";
import Dropdown from "./Dropdown.vue";
import { RouterLink, useRouter } from "vue-router";

export default {
	components: {
		Dropdown,
		RouterLink,
	},
	setup() {
		const userStore = useUserStore();
		const projectStore = useProjectStore();

		const Router = useRouter();

		function logout() {
			userStore.logout();
			Router.push("/login");
		}

		return { userStore, projectStore, logout, Router };
	},
};
</script>

<style lang="scss" scoped>
li {
	list-style: none;
}
</style>
