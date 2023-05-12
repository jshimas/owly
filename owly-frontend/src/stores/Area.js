import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";

export const useAreaStore = defineStore("Area", () => {
	const Areas = ref(
		useLocalStorage("Areas", [
			{
				id: 1,
				name: "Poupança de Água",
			},
			{
				id: 2,
				name: "Poupança de Eletricidade",
			},
		])
	);

	/**
	 * @param {String} name name of new Area
	 */
	function CreateArea(name) {
		console.log(Areas.value[Areas.value.length - 1].id + 1)
		Areas.value.push({
			id: Areas.value[Areas.value.length - 1].id + 1,
			name: name,
		});
	}

	/**
	 * @param {Object} AreaObj id and Area name
	 */
	function ChangeArea(AreaObj) {
		let AreaIndex = Areas.value.findIndex((Area) => Area.id == AreaObj.id);
		Areas.value[AreaIndex] = AreaObj;
	}

	/**
	 * @param {Number} idArea Area Id
	 */
	function DeleteArea(idArea) {
		Areas.value = Areas.value.filter((Area) => Area.id != idArea);
	}

	/**
	 * @type {Object} GetAreas returns all the Areas
	 */
	const GetAreas = computed(() => {
		return Areas.value;
	});

	const GetAreasAsFormList = computed(() => {
		return Areas.value.map((Area) => ({ value: Area.id, text: Area.name }));
	});

	/** 
    @type {Object} Area
  */
	const Area = ref();

	/**
	 * @type {Function} GetArea Getter For Specific Area
	 */
	const GetArea = computed({
		// getter
		get() {
			return Area.value;
		},
		// setter
		set(ID) {
			Area.value = Areas.value.find((Area) => Area.id == ID);
		},
	});

	/**
	 * Sets Parameter for GetArea
	 * @param {number} id Identifier for GetArea
	 */
	function SetArea(id) {
		GetArea.value = id;
	}

	function GetAreaById(id) {
		return Areas.value.find((Area) => Area.id == id);
	}

	return {
		GetAreas,
		GetArea,
		SetArea,
		CreateArea,
		ChangeArea,
		DeleteArea,
		GetAreaById,
		GetAreasAsFormList,
	};
});
