import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from 'reactflow';
import 'reactflow/dist/style.css';
import type { AutomationNode } from '../../types/domain';

const colors = {
  waiting: '#ffffff33',
  running: '#8FD7FF',
  completed: '#50E3C2',
  failed: '#FF7A3D'
};

interface AutomationFlowProps {
  pipelineNodes: AutomationNode[];
  activeNodeId?: string | null;
}

export function AutomationFlow({ pipelineNodes, activeNodeId }: AutomationFlowProps) {
  const nodes: Node[] = pipelineNodes.map((node, index) => ({
    id: node.id,
    position: { x: (index % 5) * 245, y: Math.floor(index / 5) * 180 },
    data: {
      label: (
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/42">{node.status}</p>
            {node.status === 'completed' && <span className="grid h-5 w-5 place-items-center rounded-full bg-signal text-[11px] font-black text-ink">✓</span>}
            {node.status === 'failed' && <span className="grid h-5 w-5 place-items-center rounded-full bg-ember text-[11px] font-black text-ink">!</span>}
          </div>
          <p className="mt-1 font-display text-lg font-bold text-white">{node.label}</p>
          <p className="mt-2 min-h-8 text-xs leading-4 text-white/50">{node.detail}</p>
        </div>
      )
    },
    style: {
      width: 210,
      borderRadius: 8,
      border: `1px solid ${colors[node.status]}`,
      background: node.id === activeNodeId ? 'rgba(143,215,255,0.14)' : 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(18px)',
      color: '#fff',
      padding: 14,
      boxShadow: node.status === 'running' ? '0 0 42px rgba(143, 215, 255, 0.42)' : node.status === 'completed' ? '0 0 24px rgba(80, 227, 194, 0.16)' : 'none'
    }
  }));

  const edges: Edge[] = pipelineNodes.slice(0, -1).map((node, index) => ({
    id: `${node.id}-${pipelineNodes[index + 1].id}`,
    source: node.id,
    target: pipelineNodes[index + 1].id,
    animated: pipelineNodes[index + 1].status === 'running' || node.status === 'running',
    markerEnd: { type: MarkerType.ArrowClosed, color: node.status === 'completed' ? '#50E3C2' : '#ffffff55' },
    style: { stroke: node.status === 'completed' || node.status === 'running' ? '#50E3C2' : '#ffffff33', strokeWidth: node.status === 'running' ? 3 : 2 }
  }));

  return (
    <div className="h-[460px] overflow-hidden rounded-[8px] border border-white/10 bg-black/20">
      <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false}>
        <Background color="rgba(255,255,255,0.12)" gap={28} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
