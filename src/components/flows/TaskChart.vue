<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Controls } from '@vue-flow/controls';
import CustomNode from './CustomNode.vue';
import { Background } from '@vue-flow/background';

const props = defineProps({
    workflowId: {
        type: String,
        required: true,
    },
})

const { updateNode } = useVueFlow()
const data = ref(null)
const nodes = ref([])
const edges = ref([])
const selectedNodeId = ref(null) // Reactive variable to store selected node ID
const emit = defineEmits(['node-selected'])
let intervalId = null; // Variable to store the interval ID

const fetchData = async () => {
    const data_url = `http://127.0.0.1:5000/api/workflows/${props.workflowId}`;
    const nodeWidth = 100;

    try {
        const response = await fetch(data_url)
        data.value = await response.json()

        if (data.value && data.value.tasks) {
            const tasks = data.value.tasks;
            const inDegree = new Map();
            const taskMap = new Map();
            const levels = new Map();

            // Initialize in-degree and task map
            tasks.forEach(task => {
                inDegree.set(task.id, task.previous.length);
                taskMap.set(task.id, task);
            });

            // Initialize queue with tasks that have no dependencies
            const queue = tasks.filter(task => task.previous.length === 0);

            const sortedTasks = [];
            while (queue.length > 0) {
                const task = queue.shift();
                sortedTasks.push(task);

                // Reduce in-degree of dependent tasks
                tasks.forEach(t => {
                    if (t.previous.includes(task.id)) {
                        inDegree.set(t.id, inDegree.get(t.id) - 1);
                        if (inDegree.get(t.id) === 0) {
                            queue.push(t);
                        }
                    }
                });
            }

            // Calculate levels for each task
            sortedTasks.forEach(task => {
                if (task.previous.length === 0) {
                    levels.set(task.id, 0);
                } else {
                    const maxLevel = Math.max(...task.previous.map(prev => levels.get(prev)));
                    levels.set(task.id, maxLevel + 1);
                }
            });

            // Group tasks by level
            const tasksByLevel = Array.from(levels.entries()).reduce((acc, [taskId, level]) => {
                if (!acc[level]) acc[level] = [];
                acc[level].push(taskMap.get(taskId));
                return acc;
            }, {});

            // Create task nodes
            const taskNodes = [];
            Object.keys(tasksByLevel).forEach(level => {
                const tasksAtLevel = tasksByLevel[level];
                tasksAtLevel.forEach((task, index) => {
                    taskNodes.push({
                        id: task.id,
                        type: 'custom',
                        position: { x: level * (nodeWidth + 50), y: index * 50 },
                        data: {
                            status: task.status,
                            name: task.key,
                            begin: task.previous.length === 0,
                            end: !tasks.some(t => t.previous.includes(task.id)),
                            result: task.result,
                        },
                    });
                });
            });

            // Create task edges
            const taskEdges = tasks.flatMap(task =>
                task.previous.map(prev => ({
                    id: `${prev}-${task.id}`,
                    source: prev,
                    target: task.id,
                }))
            );

            nodes.value = taskNodes;
            edges.value = taskEdges;

            // // if workflow status is not pending and progress, clear the interval
            // if (data.value.status !== 'pending' && data.value.status !== 'progress') {
            //     clearInterval(intervalId);
            // }
        } else {
            console.error('Data does not contain tasks:', data.value);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData();
    intervalId = setInterval(fetchData, 15000); // Set up the interval to refresh data every 1 second
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId); // Clear the interval when the component is destroyed
    }
});

watch(() => props.workflowId, fetchData)

const defaultNodeStyle = {
    backgroundColor: '#fff',
    // backgroundColor: 'transparent',
}

const selectedNodeStyle = {
    backgroundColor: "#f0f0f0",
}

// Node click event handler set selected color node to the clicked node
function onNodeClick({ event, node }) {
    console.log('Node clicked:', node)
    selectedNodeId.value = node.id // Update selected node ID
    emit('node-selected', node) // Emit the selected node data
    // Reset all nodes to default style
    nodes.value.forEach((n) => {
        updateNode(n.id, {
            style: {
                ...n.style,
                backgroundColor: defaultNodeStyle.backgroundColor,
            },
        })
    })
    // Apply selected style to the clicked node
    updateNode(node.id, {
        style: {
            ...node.style,
            backgroundColor: selectedNodeStyle.backgroundColor,
        },
    })
}
</script>

<template>
    <VueFlow :nodes="nodes" :edges="edges" fit-view-on-init class="validationflow" @node-click="onNodeClick">
        <template #node-custom="props">
            <CustomNode :id="props.id" :data="props.data" />
        </template>
        <Background />
        <Controls />
    </VueFlow>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.2/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.2/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

html,
body,
#app {
    margin: 0;
    height: 100%;
}

.vue-flow__minimap {
    transform: scale(75%);
    transform-origin: bottom right;
}

.validationflow .vue-flow__node {
    width: 100px;
    border-radius: 0;
    padding: 10px;
    background-color: #fff;
    color: #555;
    border: 1px solid #ddd;
    /*make border inner*/
    box-shadow: 0 0 0 1px #fff;
    text-align: center;
    font-size: 8px;
}

.validationflow .vue-flow__handle {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: #7f7f7f7f;
    border: 2px solid #fff;
    cursor: pointer;
}

.validationflow .vue-flow__node-custom {
    background: #fff;
}

.vue-flow__node-custom .node-bar {
    height: 3px;
    width: 100px;
    background-color: blue;
    margin-left: -11px;
    margin-top: -15%;
}

.validationflow .vue-flow__node-custom .node-content {
    text-align: center;
    margin-top: 10px;
}

.validationflow .vue-flow__handle-connecting {
    background: #ff6060;
}

.validationflow .vue-flow__handle-valid {
    background: #5d9;
}
</style>