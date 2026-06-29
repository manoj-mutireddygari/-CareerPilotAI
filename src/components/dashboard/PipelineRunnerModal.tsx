import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { fetchSavedAutomations, runSavedAutomation } from '../../lib/api';
import { completedDetails, createReadyPipeline, runSteps, setNodeStatus, sleep } from '../../lib/pipeline';
import type { AutomationNode, PipelineStatus } from '../../types/domain';
import { AutomationFlow } from './AutomationFlow';

interface PipelineRunnerModalProps {
  open: boolean;
  runSignal: number;
  onClose: () => void;
}

export function PipelineRunnerModal({ open, runSignal, onClose }: PipelineRunnerModalProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [pipelineNodes, setPipelineNodes] = useState<AutomationNode[]>(createReadyPipeline());
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [executionLines, setExecutionLines] = useState<string[]>(['Ready to run automation.']);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const markStep = (id: string, status: PipelineStatus, detail: string) => {
    setActiveNodeId(status === 'running' ? id : null);
    setPipelineNodes((current) => setNodeStatus(current, id, status, detail));
    setExecutionLines((current) => [`[${new Date().toLocaleTimeString()}] ${detail}`, ...current].slice(0, 9));
  };

  const executeRun = async () => {
    setRunning(true);
    setCompleted(false);
    setActiveNodeId(null);
    setExecutionLines([]);
    setPipelineNodes(createReadyPipeline());

    try {
      const userId = user?.uid || 'demo-user';
      const selectedId = localStorage.getItem('careerpilot_selected_automation_id') || '';
      const saved = await fetchSavedAutomations(userId);
      const automation = saved.automations.find((item) => item.id === selectedId) || saved.automations[0];

      if (!automation) {
        throw new Error('Save an automation first, then run it from the dashboard.');
      }

      localStorage.setItem('careerpilot_selected_automation_id', automation.id);
      const automationPromise = runSavedAutomation(userId, automation.id);

      for (const [id, detail] of runSteps) {
        markStep(id, 'running', detail);
        await sleep(650);
        markStep(id, 'completed', completedDetails[id]);
      }

      const response = await automationPromise;
      markStep('logs', 'completed', `Run completed: ${response.result.jobsMatched} matches, ${response.result.emailsSent} email sent`);
      notify('success', `Automation completed: ${response.result.jobsMatched} matches, ${response.result.emailsSent} email sent.`);
      setCompleted(true);
      window.setTimeout(onClose, 2000);
    } catch (error) {
      const failedStep = activeNodeId || 'logs';
      markStep(failedStep, 'failed', error instanceof Error ? error.message : 'Automation run failed');
      notify('error', error instanceof Error ? error.message : 'Automation run failed.');
    } finally {
      setActiveNodeId(null);
      setRunning(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPipelineNodes(createReadyPipeline());
      setExecutionLines(['Ready to run automation.']);
      setCompleted(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && runSignal > 0) {
      void executeRun();
    }
  }, [runSignal]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-xl">
      <section className="glass max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[8px] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-signal">Live Pipeline</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">n8n-style execution</h2>
            <p className="mt-2 text-sm text-white/55">Current step: <span className="font-bold text-skyglass">{pipelineNodes.find((node) => node.id === activeNodeId)?.label || (completed ? 'Completed' : running ? 'Finalizing' : 'Ready')}</span></p>
          </div>
          <div className="flex gap-3">
            <button onClick={executeRun} disabled={running} className="rounded-[8px] bg-mist px-4 py-2 text-sm font-bold text-ink disabled:opacity-60">
              {running ? 'Running...' : 'Run Now'}
            </button>
            <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 text-white/70 hover:bg-white/8">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-5">
          <AutomationFlow pipelineNodes={pipelineNodes} activeNodeId={activeNodeId} />
        </div>
        <div className="mt-5 rounded-[8px] border border-white/10 bg-black/25 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/42">Execution timeline</p>
          <div className="space-y-2 font-mono text-xs text-white/62">
            {executionLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
