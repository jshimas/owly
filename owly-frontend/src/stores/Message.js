import { useLocalStorage } from "@vueuse/core";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMessageStore = defineStore("Messages", () => {
	const Messages = ref(
		useLocalStorage("Messages", [
			{
				id: 1,
				text: "Olá !! Temos que começar a poupar eletricidade",
				image: "",
				author: 1,
				idReunion: 1,
				date: new Date(),
			},
			{
				id: 2,
				text: "Concordo com isso !",
				image: "",
				author: 2,
				idReunion: 1,
				date: new Date(),
			},
		])
	);

	/**
	 * @param {String} Text Text of new Message
	 */
	function CreateMessage(Message) {
		Messages.value.push({
			id: Messages.value[Messages.value.length - 1].id + 1,
			text: Message.text,
			image: Message.image,
			idReunion: Message.idReunion,
			author: Message.author,
			date: new Date(),
		});
	}

	/**
	 * @param {Object} MessageObj Contains id, idReunion, idAuthor, text
	 */
	function ChangeMessage(MessageObj) {
		let MessageIndex = Messages.value.findIndex(
			(Message) => Message.id == MessageObj.id
		);
		Messages.value[MessageIndex] = MessageObj;
	}

	/**
	 * @param {Number} idMessage Message Id
	 */
	function DeleteMessage(idMessage) {
		Messages.value = Messages.value.filter(
			(Message) => Message.id != idMessage
		);
	}

	const GetMessages = computed(() => {
		return Messages.value;
	});

	function GetMessagesByReunion(idReunion) {
		let MessagesArray = Messages.value.filter(
			(Message) => Message.idReunion == idReunion
		);

		return MessagesArray;
	}

	function GetMostRecentMessagesByReunion(idReunion) {
		return Messages.value.reduce((prev, current) => {
			if (prev.idReunion !== idReunion) prev = current;
			if (
				current.idReunion === idReunion &&
				new Date(prev.date) < new Date(current.date)
			)
				prev = current;
			return prev;
		});
	}

	function Get3MostRecentMessages() {
		let sortedMessages = Messages.value.sort(
			(a, b) => new Date(b.date) - new Date(a.date)
		);
		let recentMessages = [];
		let idReunions = [];
		for (let i = 0; i < sortedMessages.length; i++) {
			if (!idReunions.includes(sortedMessages[i].idReunion)) {
				recentMessages.push(sortedMessages[i]);
				idReunions.push(sortedMessages[i].idReunion);
			}
			if (recentMessages.length === 3) break;
		}

		return recentMessages;
	}

	function getRecentMessagesByAuthor(author) {
		// filter messages by author
		const filteredMessages = Messages.value.filter((m) => m.author === author);

		// create a Set to store unique idReunion
		const idReunionSet = new Set();

		// sort messages by date in descending order
		const sortedMessages = filteredMessages.sort((a, b) => b.date - a.date);

		// use the reduce method to iterate over the sorted messages
		// and keep track of the 3 most recent messages with unique idReunion
		const recentMessages = sortedMessages.reduce((acc, m) => {
			if (!idReunionSet.has(m.idReunion)) {
				idReunionSet.add(m.idReunion);
				acc.push(m);
			}
			if (acc.length >= 3) {
				return acc;
			}
			return acc;
		}, []);

		return recentMessages;
	}

	function getRecentMessagesByAuthors(authors) {
		// create a Set to store unique idReunion
		const idReunionSet = new Set();
		let recentMessages = [];
		// iterate over authors
		for (let i = 0; i < authors.length; i++) {
			// filter messages by author
			const filteredMessages = Messages.value.filter(
				(m) => m.author === authors[i]
			);
			// sort messages by date in descending order
			const sortedMessages = filteredMessages.sort((a, b) => b.date - a.date);
			// use the reduce method to iterate over the sorted messages
			// and keep track of the 3 most recent messages with unique idReunion
			recentMessages = recentMessages.concat(
				sortedMessages.reduce((acc, m) => {
					if (!idReunionSet.has(m.idReunion)) {
						idReunionSet.add(m.idReunion);
						acc.push(m);
					}
					if (acc.length >= 3) {
						return acc;
					}
					return acc;
				}, [])
			);
		}
		recentMessages = recentMessages.sort((a, b) => b.date - a.date);
		return recentMessages.slice(0, 3);
	}

	return {
		getRecentMessagesByAuthors,
		getRecentMessagesByAuthor,
		Get3MostRecentMessages,
		GetMostRecentMessagesByReunion,
		GetMessages,
		GetMessagesByReunion,
		CreateMessage,
		ChangeMessage,
		DeleteMessage,
	};
});
