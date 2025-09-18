<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

import { Position, Handle, useVueFlow } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import { useFormBuilder, QUESTION_TYPES, CHOICE_TYPES, VALUE_TYPES, CHOICE_HEIGHT } from '../composables/useFormBuilder'

const { addQuestionChoice, removeQuestionChoice, addConnection, setQuestionAsFormStart } = useFormBuilder;
const { updateNodeData, onConnect } = useVueFlow('vue-flow-project');

onConnect(({ source, target }) => {
  if (target != props.id) {
    return;
  }
  addConnection(source, target)
})

const props = defineProps<NodeProps>()

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
  <div class="w-full p-6 bg-white border-neutral border-2 rounded-xl min-h-full" :style="{ height: currentHeight }"
    ref="currentNode">
    <div class="flex flex-col gap-y-4 ">
      <div class="w-full flex justify-between items-center">
        <p>Question</p>
        <button v-if="!data.isStart" class="btn btn-xs text-xs" @click="setQuestionAsFormStart(id)">
          Make form start
        </button>
        <span v-else class="badge badge-primary text-xs font-semibold rounded-lg" >
          Form start
        </span>
      </div>
      <input type="text" class="no-drag ease form-input" @input="updateValue" ref='input' :value="data.value">
      <span v-html="data.value.replaceAll(' ', '&nbsp;')" class="invisible h-0 text-sm mx-4"></span>

      <div class="flex flex-col gap-y-2 w-full">
        <div class="flex gap-x-2 justify-start items-center w-full">
          <label v-for="type in QUESTION_TYPES" :key="id + '_question_' + type.value"
            :for="id + '_question_' + type.value" class="question-config-label">
            <p class="text-gray-700">{{ type.label }}</p>
            <input v-model="questionType" type="radio" :name="id + '_' + type.label" :value="type.value"
              :id="id + '_question_' + type.value" class="sr-only" />
          </label>
          <template v-if="questionType == 'choice'">
            <span>|</span>
            <label v-for="type in CHOICE_TYPES" :key="id + '_choice_' + type.value" :for="id + '_choice_' + type.value"
              class="question-config-label">
              <p class="text-gray-700">{{ type.label }}</p>
              <input v-model="choiceType" type="radio" :name="id + '_' + type.label" :value="type.value"
                :id="id + '_choice_' + type.value" class="sr-only" />
            </label>
          </template>
        </div>
        <div class="flex gap-x-2 justify-start items-center w-full">
          <label v-for="type in VALUE_TYPES" :key="id + '_value_' + type.value" :for="id + '_value_' + type.value"
            class="question-config-label">
            <p class="text-gray-700">{{ type.label }}</p>
            <input v-model="valueType" type="radio" :name="id + '_' + type.label" :value="type.value"
              :id="id + '_value_' + type.value" class="sr-only" />
          </label>
        </div>
      </div>

      <button v-if="questionType === 'choice'" class="nodrag btn btn-primary" @click="addChoice(id)">
        Add a choice</button>
    </div>

    <Handle type="target" :position="Position.Left" class="handle-target" />
    <Handle type="source" :position="Position.Right" class="handle-source" />
  </div>
</template>
