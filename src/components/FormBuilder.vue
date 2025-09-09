<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import { VueFlow, useVueFlow } from '@vue-flow/core'

import QuestionNode from './QuestionNode.vue'
import ChoiceNode from './ChoiceNode.vue'
import { useFormBuilder } from '../composables/useFormBuilder';

const nodes = ref<Node[]>([])

const edges = ref<Edge[]>([]);

const { addQuestion, removeQuestion } = useFormBuilder();

// onMounted(() => {
//   addQuestion()
// })

</script>

<template>
  <VueFlow v-model:nodes="nodes" :edges="edges">
    <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
    <template #node-question="questionNodeProps">
      <QuestionNode v-bind="questionNodeProps" />
    </template>
    <template #node-choice="choiceNodeProps">
      <ChoiceNode v-bind="choiceNodeProps" />
    </template>
  </VueFlow>
</template>
