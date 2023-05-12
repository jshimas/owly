import { useLocalStorage } from "@vueuse/core";
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useThemeStore } from "./Theme.js";

export const useProjectStore = defineStore("Project", () => {
	const Projects = ref(
		useLocalStorage("Projects", [
			{
				id: 1,
				nameSchool: "Escola 1",
				nameProject: "Agricultura Sustentável",
				state: "Planeamento",
				collaborators: [1],
				level: "Bom",
				theme: 1,
			},
			{
				id: 2,
				nameSchool: "Escola 2",
				nameProject: "Agricultura",
				state: "Em Aprovação",
				collaborators: [],
				level: "Fraco",
				theme: 2,
			},
			{
				id: 3,
				nameSchool: "Escola 3",
				nameProject: "Sustentável",
				state: "Execução",
				collaborators: [],
				level: "Muito Bom",
				theme: 1,
			},
		])
	);

	/**
	 * Creates Project with random passowrd
	 * @param {Object} ProjectObj name of new project
	 */
	function CreateProject(ProjectObj) {
		Projects.value.push({
			id: Projects.value[Projects.value.length - 1].id + 1,
			nameSchool: ProjectObj.nameSchool,
			nameProject: "",
			state: "Planeamento",
			collaborators: [],
			level: "Mau",
			theme: 1,
		});
	}

	/**
	 * @param {Object} ProjectObj id and project name
	 */
	function ChangeProject(ProjectObj) {
		let projectIndex = Projects.value.findIndex(
			(project) => project.id == ProjectObj.id
		);
		Projects.value[projectIndex] = ProjectObj;
	}

	/**
	 * @param {Number} idProject Project Id
	 */
	function DeleteProject(idProject) {
		Projects.value = Projects.value.filter(
			(project) => project.id != idProject
		);
	}

	/**
	 * @type {Object} GetProjects returns all the projects
	 */
	const GetProjects = computed(() => {
		return Projects.value;
	});

	/** 
    @type {Object} Project
  */
	const Project = ref();
	/**
	 * @type {Function} GetProject Getter For Specific ProjectID
	 */
	const GetProject = computed({
		// getter
		get() {
			return Project.value;
		},
		// setter
		set(ID) {
			Project.value = Projects.value.find((project) => project.id == ID);
		},
	});

	function GetProjectFunction(ID) {
		return Projects.value.find((project) => project.id == ID);
	}

	/**
	 * Sets Parameter for GetProject
	 * @param {number} id Identifier for GetProject
	 */
	function SetProject(id) {
		GetProject.value = id;
	}

	function AddCollaborator(ProjectID, IdUser) {
		let Project = Projects.value.find((project) => project.id == ProjectID);
		console.log(Project);
		if (
			!Project.collaborators.some((collaboratorID) => collaboratorID == IdUser)
		) {
			Project.collaborators.push(IdUser);
		}
	}

	return {
		GetProjectFunction,
		GetProjects,
		GetProject,
		SetProject,
		CreateProject,
		ChangeProject,
		DeleteProject,
		AddCollaborator,
	};
});
