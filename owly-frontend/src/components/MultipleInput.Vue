<template>
	<div>
		<template v-for="(value, index) in values" :key="index">
			<br />
			<label :for="'input-' + index">Value {{ index + 1 }}</label>
			<input v-model="values[index]" :id="'input-' + index" />
		</template>
		<br />
		<button @click="addField">Add Field</button>
		<button @click="saveValues">Save Values</button>
	</div>
</template>

<script>
import { ref, defineEmits } from "vue";

export default {
	props: {
		values: Array,
	},
	setup(props, context) {
		const values = ref(props.values);
		const updatedValues = ref(props.values);

		const emit = defineEmits(["update:values"]);

		function addField() {
			updatedValues.value.push("");
		}

		function saveValues() {
			values.value = updatedValues.value;
			context.emit("update:values", updatedValues.value);
		}

		return {
			values,
			updatedValues,
			addField,
			saveValues,
		};
	},
};
</script>

<style lang="scss" scoped></style>
