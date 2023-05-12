import { useLocalStorage } from "@vueuse/core";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useActivityStore = defineStore("Activity", () => {
	const Activitys = ref(
		useLocalStorage("Activitys", [
			{
				id: 1,
				idProject: 3,
				idArea: 1,
				name: "Instalar canos novos",
				diagonóstico: "texto",
				objetivos: "texto",
				metas: "texto",
				acoes: "1 - Cenas",
				recursos: "texto",
				dataInicio: new Date(),
				dataFim: new Date(),
				avaliacaoIndicadores: "texto",
				avaliacaoInstrumentos: "texto",
			},
			{
				id: 2,
				idProject: 1,
				idArea: 1,
				name: "Instalar canos novos",
				diagonóstico: "texto",
				objetivos: "texto",
				metas: "texto",
				acoes: "1 - Cenas",
				recursos: "texto",
				dataInicio: new Date(),
				dataFim: new Date(),
				avaliacaoIndicadores: "texto",
				avaliacaoInstrumentos: "texto",
			},
			{
				id: 3,
				idProject: 1,
				idArea: 2,
				name: "Montar Paineis Solares",
				diagonóstico: "texto",
				objetivos: "texto",
				metas: "texto",
				acoes: "1 - Cenas",
				recursos: "texto",
				dataInicio: new Date(),
				dataFim: new Date(),
				avaliacaoIndicadores: "texto",
				avaliacaoInstrumentos: "texto",
			},
		])
	);

	/**
   * @param {Object} Activity Objeto Atividade 
   * @param {Number} Activity.idProject
   * @param {Number} Activity.idArea
   * @param {String} Activity.name
   * @param {String} Activity.diagonóstico
   * @param {String} Activity.objetivos
   * @param {String} Activity.metas
   * @param {Array} Activity.acoes
   * @param {String} Activity.recursos
   * @param {Date} Activity.dataInicio
   * @param {Date} Activity.dataFim
   * @param {String} Activity.avaliacaoIndicadores
   * @param {String} Activity.avaliacaoInstrumentos
 
   */
	function CreateActivity(Activity) {
		Activitys.value.push({
			id: Activitys.value[Activitys.value.length - 1].id + 1,
			idProject: Activity.idProject,
			idArea: Activity.idArea,
			name: Activity.name,
			diagonóstico: Activity.diagonóstico,
			objetivos: Activity.objetivos,
			metas: Activity.metas,
			acoes: Activity.Array,
			recursos: Activity.recursos,
			dataInicio: Activity.dataInicio,
			dataFim: Activity.dataFim,
			avaliacaoIndicadores: Activity.avaliacaoIndicadores,
			avaliacaoInstrumentos: Activity.avaliacaoInstrumentos,

			/** NAO ESQUECER PARA APRESENTACAO FRONTEND
       * 
      .toLocaleString([],{ 
        hour12:false,
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      
      */
		});
	}

	/**
	 * @param {Object} ActivityObj Contains id, idProject, idAuthor, text
	 */
	function ChangeActivity(ActivityObj) {
		let ActivityIndex = Activitys.value.findIndex(
			(Activity) => Activity.id == ActivityObj.id
		);

		Activitys.value[ActivityIndex] = ActivityObj;
	}

	function GetActivityById(id) {
		return Activitys.value.find((Activity) => Activity.id == id);
	}

	/**
	 * @param {Number} idActivity Activity Id
	 */
	function DeleteActivity(idActivity) {
		Activitys.value = Activitys.value.filter(
			(Activity) => Activity.id != idActivity
		);
	}

	/**
	 * @type {Object} GetActivitys returns all the Activitys
	 */
	const GetActivitys = computed(() => {
		return Activitys.value;
	});

	/** 
    @type {Object} Activitys
  */
	const ActivityArray = ref();
	/**
	 * @type {Function} GetActivitysByProject Getter for activitys that correspond to idProject
	 */
	const GetActivitysByProject = computed({
		// getter
		get() {
			return ActivityArray.value;
		},
		// setter
		set(idProject) {
			ActivityArray.value = Activitys.value.filter(
				(Activity) => Activity.idProject == idProject
			);
		},
	});

	/**
	 * Sets Parameter for GetActivity
	 * @param {number} idProject Identifier for GetActivity (id of Project)
	 */
	function GetActivitysByProjectSetter(idProject) {
		GetActivitysByProject.value = idProject;
	}

	function GetActivitysByProjectFunction(idProject) {
		return Activitys.value.filter(
			(Activity) => Activity.idProject == idProject
		);
	}

	function GetActivitysByProjectFunctionAsFormList(idProject) {
		return Activitys.value
			.filter((Activity) => Activity.idProject == idProject)
			.map((Activity) => ({ value: Activity.id, text: Activity.name }));
	}

	function GetActivitysByProjectID(idProject) {
		return Activitys.value.filter(
			(Activity) => Activity.idProject == idProject
		);
	}

	function GetActivityCountByProjectID(ProjectID) {
		let activityCount = 0;

		Activitys.value.forEach((Activity) => {
			if (Activity.idProject == ProjectID) {
				activityCount++;
			}
		});

		return activityCount;
	}

	function GetAreaCountByProjectID(ProjectID) {
		let AreaArray = [];

		Activitys.value.forEach((Activity) => {
			if (Activity.idProject == ProjectID) {
				if (!AreaArray.find((el) => el == Activity.idArea)) {
					AreaArray.push(Activity.idArea);
				}
			}
		});

		return AreaArray.length;
	}

	return {
		GetActivitysByProjectID,
		GetActivitysByProjectFunction,
		GetActivitys,
		GetActivitysByProject,
		GetActivitysByProjectSetter,
		CreateActivity,
		ChangeActivity,
		DeleteActivity,
		GetActivityById,
		GetActivitysByProjectFunctionAsFormList,
		GetAreaCountByProjectID,
		GetActivityCountByProjectID,
	};
});
