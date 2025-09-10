<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

import { Position, Handle, useVueFlow } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { useFormBuilder, QUESTION_TYPES, CHOICE_TYPES, VALUE_TYPES, CHOICE_HEIGHT } from '../composables/useFormBuilder'

const { addQuestionChoice, removeQuestionChoice, addConnection } = useFormBuilder();
const { updateNodeData, onConnect } = useVueFlow();

onConnect(({ source, target }) => {
  if (target != props.id) {
    return;
  }
  addConnection(source, target)
})

const props = defineProps<NodeProps>()

// question data
const questionType = computed({
  get: () => props.data.questionType,
  set: (questionType) => {
    updateNodeData(props.id, { questionType })
  },
})
const choiceType = computed({
  get: () => props.data.choiceType,
  set: (choiceType) => updateNodeData(props.id, { choiceType }),
})
const valueType = computed({
  get: () => props.data.valueType,
  set: (valueType) => updateNodeData(props.id, { valueType }),
})

watch([questionType, valueType], () => {
  nodeHeight.value = 0;
  props.data.choices.map((n) => n.id).forEach((n) => {
    removeQuestionChoice(n);
  });
});

// node data
const nodeHeight = ref(0);
const nodeWidth = ref(0);
const currentNode = ref(null);

onMounted(() => {
  nodeWidth.value = currentNode.value.scrollWidth - 20;
});

function updateValue(elem) {
  updateNodeData(props.id, { value: elem.target.value });
  nodeWidth.value = currentNode.value.scrollWidth - 20;
}

function addChoice(questionID: string) {
  if (nodeHeight.value === 0) {
    nodeHeight.value = currentNode.value.scrollHeight;
  }
  const y = props.data.choices.length > 0 ? props.data.choices[props.data.choices.length - 1].position.y + CHOICE_HEIGHT
    : nodeHeight.value;
  addQuestionChoice(questionID, y);
}

const currentHeight = computed<string>(() => {
  return props.data.choices.length > 0 ? `${nodeHeight.value + (props.data.choices.length * CHOICE_HEIGHT)}px` : '100%';
});

</script>

<template>
  <div class="w-full p-2 border-black border-1 rounded-xl min-h-full" :style="{ height: currentHeight }"
    ref="currentNode">
    <div class="flex flex-col gap-y-4 ">
      <p>Question</p>
      <input type="text" class="no-drag ease form-input" @input="updateValue" ref='input'
        :value="data.value">
      <span v-html="data.value.replaceAll(' ', '&nbsp;')" class="invisible h-0 text-sm mx-4"></span>

      <div class="flex flex-col gap-y-2 w-full">
        <div class="flex gap-x-2 justify-start items-center w-full">
          <label v-for="type in QUESTION_TYPES" :key="id + '_question_' + type.value" :for="id + '_question_' + type.value" class="question-config-label">
            <p class="text-gray-700">{{ type.label }}</p>
            <input v-model="questionType" type="radio" :name="id + '_' + type.label" :value="type.value"
              :id="id + '_question_' + type.value" class="sr-only" />
          </label>
          <template v-if="questionType == 'choice'">
            <span>|</span>
            <label v-for="type in CHOICE_TYPES" :key="id + '_choice_' + type.value" :for="id + '_choice_' + type.value" class="question-config-label">
              <p class="text-gray-700">{{ type.label }}</p>
              <input v-model="choiceType" type="radio" :name="id + '_' + type.label" :value="type.value"
                :id="id + '_choice_' + type.value" class="sr-only" />
            </label>
          </template>
        </div>
        <div class="flex gap-x-2 justify-start items-center w-full">
          <label v-for="type in VALUE_TYPES" :key="id + '_value_' + type.value" :for="id + '_value_' + type.value" class="question-config-label">
            <p class="text-gray-700">{{ type.label }}</p>
            <input v-model="valueType" type="radio" :name="id + '_' + type.label" :value="type.value"
              :id="id + '_value_' + type.value" class="sr-only" />
          </label>
        </div>
      </div>

      <button v-if="questionType === 'choice'"
        class="nodrag text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
        font-medium rounded-lg text-sm py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        @click="addChoice(id)">
        Add a choice</button>
    </div>

    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.vue-flow__handle {
  height: 24px;
  width: 10px;
  background: #aaa;
  border-radius: 4px
}
</style>
