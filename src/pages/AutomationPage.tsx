import { Edit3, Save, Star, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  createSavedAutomation,
  deleteSavedAutomation,
  fetchSavedAutomations,
  updateSavedAutomation,
  uploadResume,
  type SavedAutomation
} from '../lib/api';
import { parseSteps, sleep } from '../lib/pipeline';

export function AutomationPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [resume, setResume] = useState<File | null>(null);
  const [automationName, setAutomationName] = useState('Daily AI Career Search');
  const [recipientEmail, setRecipientEmail] = useState(user?.email || '');
  const [domains, setDomains] = useState('AI Engineer, Full Stack Developer, Data Analyst');
  const [locations, setLocations] = useState('Bengaluru, Hyderabad, Remote');
  const [expectedSalary, setExpectedSalary] = useState('₹18L+');
  const [experienceLevel, setExperienceLevel] = useState('Entry to Mid Level');
  const [automationTime, setAutomationTime] = useState('20:00');
  const [busy, setBusy] = useState(false);
  const [parseStatus, setParseStatus] = useState('Waiting for PDF upload');
  const [savedAutomations, setSavedAutomations] = useState<SavedAutomation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState('');

  const userId = user?.uid || 'demo-user';
  const selectedAutomationKey = `careerpilot_selected_automation_id:${userId}`;

  const loadAutomations = async () => {
    try {
      const response = await fetchSavedAutomations(userId);
      setSavedAutomations(response.automations);
      const storedSelectedId = localStorage.getItem(selectedAutomationKey) || '';
      const storedAutomationExists = response.automations.some((automation) => automation.id === storedSelectedId);

      if (storedAutomationExists) {
        setSelectedId(storedSelectedId);
      } else if (response.automations[0]) {
        setSelectedId(response.automations[0].id);
        localStorage.setItem(selectedAutomationKey, response.automations[0].id);
      } else {
        setSelectedId('');
        localStorage.removeItem(selectedAutomationKey);
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Unable to load saved automations.');
    }
  };

  useEffect(() => {
    void loadAutomations();
  }, [userId]);

  const handleResumeUpload = async () => {
    if (!resume) {
      notify('error', 'Select a PDF resume before uploading.');
      return;
    }

    setBusy(true);
    try {
      for (const [, detail] of parseSteps) {
        setParseStatus(detail);
        await sleep(420);
      }
      const response = await uploadResume(userId, resume);
      setParseStatus(`Profile saved with ${Array.isArray((response.profile as { skills?: unknown[] }).skills) ? (response.profile as { skills: unknown[] }).skills.length : 'AI'} skills`);
      notify('success', 'Resume parsed and saved. You can run automation now.');
    } catch (error) {
      setParseStatus(error instanceof Error ? error.message : 'Resume upload failed');
      notify('error', error instanceof Error ? error.message : 'Resume upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () => {
    const payload = {
      userId,
      name: automationName,
      recipientEmail,
      domains: domains.split(',').map((item) => item.trim()).filter(Boolean),
      locations: locations.split(',').map((item) => item.trim()).filter(Boolean),
      expectedSalary,
      experienceLevel,
      automationTime
    };

    if (!recipientEmail) {
      notify('error', 'Recipient email is required before saving automation.');
      return;
    }

    setBusy(true);
    const request = editingId ? updateSavedAutomation(editingId, payload) : createSavedAutomation(payload);
    request
      .then((response) => {
        const id = editingId || ('id' in response ? response.id : '');
        if (id) {
          setSelectedId(id);
          localStorage.setItem(selectedAutomationKey, id);
        }
        setEditingId(null);
        notify('success', 'duplicate' in response && response.duplicate ? 'This automation already exists, so I selected it.' : editingId ? 'Automation updated.' : 'Automation saved.');
        return loadAutomations();
      })
      .catch((error) => notify('error', error instanceof Error ? error.message : 'Unable to save automation.'))
      .finally(() => setBusy(false));
  };

  const handleEdit = (automation: SavedAutomation) => {
    setEditingId(automation.id);
    setSelectedId(automation.id);
    localStorage.setItem(selectedAutomationKey, automation.id);
    setAutomationName(automation.name || 'Daily AI Career Search');
    setRecipientEmail(automation.recipientEmail);
    setDomains(automation.domains.join(', '));
    setLocations(automation.locations.join(', '));
    setExpectedSalary(automation.expectedSalary || '');
    setExperienceLevel(automation.experienceLevel || '');
    setAutomationTime(automation.automationTime || '20:00');
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      await deleteSavedAutomation(id);
      if (selectedId === id) {
        localStorage.removeItem(selectedAutomationKey);
        setSelectedId('');
      }
      if (editingId === id) setEditingId(null);
      notify('success', 'Automation deleted.');
      await loadAutomations();
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Unable to delete automation.');
    } finally {
      setBusy(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    localStorage.setItem(selectedAutomationKey, id);
    notify('success', 'Selected automation will run from the dashboard button.');
  };

  return (
    <div className="space-y-6 pb-20">
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1fr]">
        <div className="glass rounded-[8px] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-signal">Step 1</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Resume parsing</h2>
          <label className="mt-6 grid cursor-pointer place-items-center rounded-[8px] border border-dashed border-white/20 bg-black/25 p-8 text-center">
            <UploadCloud className="h-9 w-9 text-signal" />
            <span className="mt-3 font-bold text-white">{resume ? resume.name : 'Upload Resume PDF'}</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={(event) => setResume(event.target.files?.[0] || null)} />
          </label>
          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={busy}
            className="mt-3 w-full rounded-[8px] border border-white/10 px-4 py-3 text-sm font-bold text-white/70 hover:bg-white/8 disabled:opacity-60"
          >
            Parse & Save Resume
          </button>
          <p className="mt-3 rounded-[8px] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/58">{parseStatus}</p>
        </div>

        <form className="glass rounded-[8px] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-signal">Step 2</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">{editingId ? 'Edit automation' : 'Save automation'}</h2>
          <label className="mt-6 block text-sm font-bold text-white/70">
            Automation Name
            <input value={automationName} onChange={(event) => setAutomationName(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <label className="mt-4 block text-sm font-bold text-white/70">
            Send Recommendations To
            <input type="email" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <label className="mt-4 block text-sm font-bold text-white/70">
            Preferred Domains
            <input value={domains} onChange={(event) => setDomains(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <label className="mt-4 block text-sm font-bold text-white/70">
            Preferred Locations
            <input value={locations} onChange={(event) => setLocations(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <label className="mt-4 block text-sm font-bold text-white/70">
            Expected Salary
            <input value={expectedSalary} onChange={(event) => setExpectedSalary(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <label className="mt-4 block text-sm font-bold text-white/70">
            Experience Level
            <input value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <label className="mt-4 block text-sm font-bold text-white/70">
            Automation Time
            <input type="time" value={automationTime} onChange={(event) => setAutomationTime(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-signal/60" />
          </label>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handleSave} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-mist px-5 font-bold text-ink disabled:opacity-60">
              <Save className="h-4 w-4" /> {editingId ? 'Update Automation' : 'Save Automation'}
            </button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} className="rounded-[8px] border border-white/10 px-5 font-bold text-white/70 hover:bg-white/8">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="glass rounded-[8px] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-signal">Step 3</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-white">Saved automations</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {savedAutomations.map((automation) => (
            <article key={automation.id} className={`rounded-[8px] border p-5 ${selectedId === automation.id ? 'border-signal/50 bg-signal/10' : 'border-white/10 bg-black/25'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">{automation.name || automation.domains[0]}</h3>
                  <p className="mt-2 text-sm text-white/55">{automation.domains.join(', ')}</p>
                  <p className="mt-1 text-sm text-white/45">{automation.locations.join(', ')} · {automation.automationTime || '20:00'}</p>
                  <p className="mt-1 text-sm text-white/45">To: {automation.recipientEmail}</p>
                </div>
                {selectedId === automation.id && <Star className="h-5 w-5 fill-signal text-signal" />}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => handleSelect(automation.id)} className="rounded-[8px] bg-mist px-3 py-2 text-xs font-bold text-ink">
                  Use for Run Button
                </button>
                <button onClick={() => handleEdit(automation)} className="inline-flex items-center gap-2 rounded-[8px] border border-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/8">
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(automation.id)} className="inline-flex items-center gap-2 rounded-[8px] border border-ember/25 px-3 py-2 text-xs font-bold text-ember hover:bg-ember/10">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
          {!savedAutomations.length && (
            <div className="rounded-[8px] border border-dashed border-white/15 bg-black/20 p-8 text-center text-white/55">
              No saved automations yet. Save one above, then the dashboard Run button can execute it.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
