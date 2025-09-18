import { nanoid } from 'nanoid'
import { ref, type Ref } from 'vue'
import { useVueFlow, type VueFlowStore } from '@vue-flow/core'
import type { Node } from '@vue-flow/core'

export const QUESTION_TYPES = [
  { value: 'open', label: 'Open' },
  { value: 'choice', label: 'Choice' },
]
export const CHOICE_TYPES = [
  { value: 'one', label: 'One' },
  { value: 'multi', label: 'Multi' },
]
export const VALUE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
]

export const CHOICE_HEIGHT = 75

function useFormBuilder() {
  const startNodeId: Ref<string> = ref('')
  const instance: VueFlowStore = useVueFlow('vue-flow-project')

  const addQuestion = (x: number, y: number, isStart: boolean = false) => {
    const id = nanoid()

    /**
     * Align node position after drop, so it's centered to the mouse
     *
     * We can hook into events even in a callback, and we can remove the event listener after it's been called.
     */
    const { off } = instance.onNodesInitialized(() => {
      instance.updateNode(id, (node) => {
        return {
          position: {
            x: node.position.x - node.dimensions.width / 2,
            y: node.position.y - node.dimensions.height / 2,
          },
        }
      })

      off()
    })

    instance.addNodes({
      id,
      type: 'question',
      position: { x, y },
      data: {
        label: `Question ${id}`,
        value: '',
        choices: [],
        questionType: QUESTION_TYPES[0].value,
        choiceType: CHOICE_TYPES[0].value,
        valueType: VALUE_TYPES[0].value,
        next: '',
        nextEdge: '',
        isStart: isStart,
      },
    })
    if (isStart) {
      startNodeId.value = id
    }
    return id
  }

  const removeQuestion = (questionID: string) => {
    instance.removeNodes(questionID)
  }

  const addQuestionChoice = (parentID: string, y: number) => {
    const question = instance.findNode(parentID)
    if (!question) {
      return
    }
    const id = nanoid()
    const node = {
      id,
      position: { x: 10, y },
      data: {
        position: question.data.choices.length,
      },
      parentNode: parentID,
    }

    instance.addNodes({
      ...node,
      type: 'choice',
      extent: 'parent',
      draggable: false,
      width: () => {
        return (instance.findNode(parentID)?.dimensions.width ?? 230) - 30
      },
    })

    question.data.choices.push(node)
  }

  const reorderQuestionChoice = (parentID: string, choiceID: string, order: number) => {
    const question = instance.findNode(parentID)
    if (!question) {
      return
    }
    const choicesLength = question.data.choices.length

    if (order < 0 || order >= choicesLength) {
      return
    }
    const index = question.data.choices.findIndex((c: Node) => {
      return c.id == choiceID
    })

    const choice = question.data.choices[index]
    const initY = question.data.choices[order].position.y
    choice.data.position = order
    let i = order
    let step = 1
    let height = CHOICE_HEIGHT
    if (order > index) {
      step = -1
      height = -CHOICE_HEIGHT
    }
    while (i != index) {
      question.data.choices[i].position.y += height
      question.data.choices[i].data.position += step
      i += step
    }
    question.data.choices.splice(index, 1)
    choice.position.y = initY
    question.data.choices.splice(order, 0, choice)
  }

  const removeQuestionChoice = (choiceID: string) => {
    const choice = instance.findNode(choiceID)
    if (!choice) {
      return
    }
    const question = instance.findNode(choice.parentNode)
    if (!question) {
      return
    }

    instance.removeNodes(choiceID)
    let index = question.data.choices.findIndex((c: Node) => {
      return c.id == choiceID
    })
    if (index != -1) {
      question.data.choices.splice(index, 1)
      while (index < question.data.choices.length) {
        question.data.choices[index].position.y -= CHOICE_HEIGHT
        index++
      }
    }
  }

  const addConnection = (source: string, target: string) => {
    if (source === target) {
      return
    }

    const sourceNode = instance.findNode(source)
    const targetNode = instance.findNode(target)
    if (!sourceNode || !targetNode) {
      return
    }

    if (sourceNode.data.next === targetNode.id) {
      return
    }

    instance.removeEdges(sourceNode.data.nextEdge)

    sourceNode.data.next = targetNode.id
    const id = nanoid()
    instance.addEdges({ id, source, target })
    sourceNode.data.nextEdge = id
  }

  function setQuestionAsFormStart(nodeId: string) {
    if (startNodeId.value) {
      const node = instance.findNode(startNodeId.value)
      if (node) {
        node.data.isStart = false
      }
    }
    const node = instance.findNode(nodeId)
    if (!node) {
      return
    }
    node.data.isStart = true
    startNodeId.value = nodeId
  }

  const logInstance = () => {
    console.log(instance.getNodes.value)
    console.log(instance.getEdges.value)
  }

  const getInstance = (): VueFlowStore => {
    return instance
  }

  return {
    addQuestion,
    removeQuestion,
    addQuestionChoice,
    reorderQuestionChoice,
    removeQuestionChoice,
    addConnection,
    setQuestionAsFormStart,
    logInstance,
    getInstance,
  }
}

const formBuilder = useFormBuilder()

export {
  formBuilder as useFormBuilder
}
