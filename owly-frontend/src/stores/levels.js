import { useLocalStorage } from "@vueuse/core";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useLevelsStore = defineStore("Levels", () => {
	const Levels = ref(
		useLocalStorage("Levels", [
			{
				id: 1,
				name: "Mau",
				params: { MinActivities: 0, MinAreas: 0 },
			},
			{
				id: 2,
				name: "Mediocre",
				params: { MinActivities: 2, MinAreas: 2 },
			},
			{
				id: 3,
				name: "Bom",
				params: { MinActivities: 4, MinAreas: 3 },
			},
			{
				id: 4,
				name: "Muito Bom",
				params: { MinActivities: 5, MinAreas: 4 },
			},
		])
	);

	function GetLevels(level) {
		return Levels.value;
	}

	function CheckLevel(numberOfActivities, numberOfAreas) {
		let returnLevel;

		Levels.value.forEach((level) => {
			if (
				level.params.MinActivities <= numberOfActivities &&
				level.params.MinAreas <= numberOfAreas
			) {
				returnLevel = level;
			}
		});

		return returnLevel;
	}

	function EditLevel(levelObj) {
		let LevelToEdit = Levels.value.findIndex(
			(level) => level.id == levelObj.id
		);
		Levels.value[LevelToEdit] = levelObj;
	}

	function DeleteLevel(levelId) {
		let LevelToDelete = Levels.value.findIndex((level) => level.id == levelId);
		Levels.value.splice(LevelToDelete, 1);
	}

	function AddLevel(levelObj) {
		levelObj.id = Levels.value[Levels.value.length - 1].id + 1;
		Levels.value.push(levelObj);
	}

	return {
		DeleteLevel,
		AddLevel,
		EditLevel,
		CheckLevel,
		GetLevels,
	};
});
