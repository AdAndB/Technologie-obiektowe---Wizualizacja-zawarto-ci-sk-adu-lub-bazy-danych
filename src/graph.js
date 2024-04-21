import React, { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodes,
    useEdges,
    addEdge,
    removeElements,
    ControlsProvider,
    isNode,
    isEdge,
    useStore,
} from 'react-flow-renderer';


const initialElements = [
    { id: '1', type: 'tableNode', data: { label: '1' }, position: { x: 0, y: 0 } },
    { id: '2', type: 'tableNode', data: { label: '2' }, position: { x: 0, y: 100 } },
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
];

const TableNode = ({ data }) => {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', background: '#fff', minWidth: '200px', minHeight: '100px' }}>
            <table>
                <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Data 1</td>
                    <td>Data 2</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();

export default function App() {
    const reactFlowWrapper = useStore((store) => store.reactFlowWrapper);

    const onConnect = (params) => console.log('onConnect', params);
    const onElementsRemove = (elementsToRemove) => console.log('remove', elementsToRemove);
    const onSelectionChange = (elements) => console.log('selection change', elements);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                elements={initialElements}
                onConnect={onConnect}
                onElementsRemove={onElementsRemove}
                onSelectionChange={onSelectionChange}
                onLoad={onLoad}
                nodeTypes={{ tableNode: TableNode }}
            >
                <MiniMap />
                <Controls />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
