<script setup>
import { Panel, useVueFlow } from '@vue-flow/core'
import Icon from './Icon.vue'

const flowKey = 'vue-flow-project'

const { nodes, addNodes, dimensions, toObject, fromObject } = useVueFlow(flowKey)

function onSave() {
  localStorage.setItem(flowKey, JSON.stringify(toObject()))
}

function onRestore() {
  const flow = JSON.parse(localStorage.getItem(flowKey))

  if (flow) {
    fromObject(flow)
  }
}

</script>

<template>
  <Panel position="top-right">
    <div class="buttons">
      <button title="save graph" @click="onSave">
        <Icon name="save" />
      </button>
      <button title="restore graph" @click="onRestore">
        <Icon name="restore" />
      </button>
    </div>
  </Panel>
</template>
