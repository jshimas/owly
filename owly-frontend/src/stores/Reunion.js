import { useLocalStorage } from "@vueuse/core";
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMessageStore } from "./Message.js";


export const useReunionStore = defineStore("Reunion", () => {
	const MessageStore = useMessageStore()
	const Reunions = ref(
		useLocalStorage("Reunions", [
			{
				id: 1,
				name: "Reuniao 1",
				picture: "",
				leader: 1,
				collaborators: [1,2]
			},
			{
				id: 2,
				name: "Reuniao 2",
				picture: "",
				leader: 2,
				collaborators: [1,2],
				archived: true
			},
		])
	);

	/**
	 * Creates Reunion with random passowrd
	 * @param {Object} ReunionObj name of new reunion
	 */
	function CreateReunion(ReunionObj) {
		Reunions.value.push({
			id: Reunions.value[Reunions.value.length - 1].id + 1,
			name: ReunionObj.name,
			picture: ReunionObj.picture,
			collaborators: ReunionObj.collaborators,
			leader : ReunionObj.leader,
			archived: false
		});
	}

	/**
	 * @param {Object} ReunionObj id and reunion name
	 */
	function ChangeReunion(ReunionObj) {
		let reunionIndex = Reunions.value.findIndex(
			(reunion) => reunion.id == ReunionObj.id
		);
		Reunions.value[reunionIndex] = ReunionObj;
	}

	/**
	 * @param {Number} idReunion Reunion Id
	 */
	function DeleteReunion(idReunion) {
		Reunions.value = Reunions.value.filter(
			(reunion) => reunion.id != idReunion
		);
	}

	/**
	 * @type {Object} GetReunions returns all the reunions
	 */
	const GetReunions = computed(() => {
		return Reunions.value;
	});

	function GetReunionsByCollaboratorID(collaboratorID) {
		return Reunions.value.filter(reunion => reunion.collaborators.some(ColID => ColID != collaboratorID))
	
	}

	function joinCollaboratorsInArray(id){
		let list = [];
		GetReunionsByCollaboratorID(id).forEach( Reunion => list.push(...Reunion.collaborators))

		list = [...new Set(list)]
		return list
	}
	

	function GetReunionById(id){
		return Reunions.value.find((reunion) => reunion.id == id)
	}

	function getReunionsOfCollaborator(collaboratorID){
		let ReunionsOfCollaborator = []

		GetReunions.value.forEach(Reunion => {
			if(Reunion.collaborators.some(ColID => ColID == collaboratorID)){
				ReunionsOfCollaborator.push(Reunion) 
		}

		
		})

		return ReunionsOfCollaborator
	}
	
	function FilterMostRecentMessages(id){
		let messages = []

		getReunionsOfCollaborator(id).forEach(Reunion => messages.push(...MessageStore.GetMessagesByReunion(Reunion.id)))
		
		return messages
	}

	function getRecentMessages(id) {

		let messages = FilterMostRecentMessages(id)
		// Sort the messages by date in descending order
		let sortedMessages = messages.sort(function(a, b) {
			return new Date(b.date) - new Date(a.date);
		});
		let result = []
		let idReunions = []
	
		// Iterate through the sorted messages
		for (let i = 0; i < sortedMessages.length; i++) {
			if(!idReunions.some(id => id == sortedMessages[i].idReunion )){
				result.push(sortedMessages[i])
				idReunions.push(sortedMessages[i].idReunion)
			}
		// Return the first 3 messages with different idReunion
		if (result.length === 3) {
			break;
		}
		
			}
		return result;
	}

	console.log(getRecentMessages(1),'Messages')

	

	return {
		getRecentMessages,
		joinCollaboratorsInArray,
		GetReunionsByCollaboratorID,
		GetReunionById,
		GetReunions,
		CreateReunion,
		ChangeReunion,
		DeleteReunion,
	
	};
});
