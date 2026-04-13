import { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { id: 'nominations', label: 'Nominations', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { id: 'trainings', label: 'Training Programs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
  { id: 'master-list', label: 'Master List', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
];

export default function HRDDAdminPortal() {
  const { profile } = useAuth();
  const [section, setSection] = useState('dashboard');
  const [nominations, setNominations] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [jaForms, setJaForms] = useState<any[]>([]);

  // Create training form
  const [newTraining, setNewTraining] = useState({ title: '', description: '', date_start: '', date_end: '', venue: '', mode: '', provider: '', competency_type: '' });
  const [showCreateTraining, setShowCreateTraining] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [n, t, j] = await Promise.all([
      supabase.from('nominations').select('*').order('created_at', { ascending: false }),
      supabase.from('trainings').select('*').order('created_at', { ascending: false }),
      supabase.from('job_analysis_forms').select('*').order('created_at', { ascending: false }),
    ]);
    if (n.data) setNominations(n.data);
    if (t.data) setTrainings(t.data);
    if (j.data) setJaForms(j.data);
  };

  const createTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('trainings').insert(newTraining);
    if (error) toast.error(error.message);
    else { toast.success('Training created!'); setShowCreateTraining(false); setNewTraining({ title: '', description: '', date_start: '', date_end: '', venue: '', mode: '', provider: '', competency_type: '' }); loadData(); }
  };

  const updateNomination = async (id: string, status: string) => {
    const { error } = await supabase.from('nominations').update({ status: status as any, hrdd_remarks: `${status} by HRDD Admin` }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(`Nomination ${status}`); loadData(); }
  };

  const pendingHRDD = nominations.filter((n) => n.status === 'pending_hrdd');
  const approved = nominations.filter((n) => n.status === 'approved');
  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'SA';

  return (
    <PortalLayout title={section === 'dashboard' ? 'Executive Dashboard' : section === 'nominations' ? 'Nomination Approvals' : section === 'trainings' ? 'Training Programs' : 'Master List'}
      subtitle="Human Resource Development Division" menuItems={menuItems} activeSection={section} onSectionChange={setSection}
      userInitials={initials} userName={profile?.full_name || 'HRDD Admin'}>

      {section === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="quarter-card bg-card p-6 border border-border relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-100 rounded-full blur-2xl" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider relative z-10">Pending HRDD Action</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2 relative z-10">{pendingHRDD.length}</h3>
              <div className="mt-4 text-xs font-medium text-brand-600 bg-brand-100 inline-block px-2 py-1 rounded">Needs Review</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider relative z-10">Total Finalized</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2 relative z-10">{approved.length}</h3>
              <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">Approved</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl" />
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider relative z-10">Total Applications</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2 relative z-10">{nominations.length}</h3>
            </div>
            <div className="quarter-card bg-gradient-to-br from-foreground/90 to-foreground p-6 border-none text-primary-foreground relative overflow-hidden">
              <p className="text-primary-foreground/60 text-xs font-bold uppercase tracking-wider">Completion Rate</p>
              <h3 className="text-4xl font-display font-bold mt-2">{nominations.length > 0 ? Math.round((approved.length / nominations.length) * 100) : 0}%</h3>
              <p className="text-xs text-primary-foreground/60 mt-4">Based on approved vs total</p>
            </div>
          </div>
        </div>
      )}

      {section === 'nominations' && (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground text-xl">Pending HRDD Final Approval</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                <tr><th className="p-4">Employee</th><th className="p-4">Training</th><th className="p-4">Status</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingHRDD.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center">No pending approvals from supervisors.</td></tr>
                ) : pendingHRDD.map((n) => (
                  <tr key={n.id}>
                    <td className="p-4 font-medium text-foreground">{n.participant_name || 'N/A'}</td>
                    <td className="p-4">{n.training_title}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-brand-100 text-brand-600">PENDING HRDD</span></td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => updateNomination(n.id, 'approved')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100">Approve</button>
                      <button onClick={() => updateNomination(n.id, 'disapproved')} className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-bold hover:bg-destructive/20">Disapprove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === 'trainings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-display text-foreground">Training Programs</h2>
            <button onClick={() => setShowCreateTraining(!showCreateTraining)} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-blue-light transition-all text-sm">
              + Create Training
            </button>
          </div>

          {showCreateTraining && (
            <div className="bg-card rounded-2xl border border-border p-8 animate-fade-in-up">
              <h3 className="font-bold text-foreground text-lg mb-4">New Training Program</h3>
              <form onSubmit={createTraining} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                  <input type="text" value={newTraining.title} onChange={(e) => setNewTraining((f) => ({ ...f, title: e.target.value }))} required
                    className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea value={newTraining.description} onChange={(e) => setNewTraining((f) => ({ ...f, description: e.target.value }))} rows={3}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
                {[
                  { key: 'date_start', label: 'Start Date', type: 'date' },
                  { key: 'date_end', label: 'End Date', type: 'date' },
                  { key: 'venue', label: 'Venue', type: 'text' },
                  { key: 'mode', label: 'Mode (Online/F2F)', type: 'text' },
                  { key: 'provider', label: 'Provider', type: 'text' },
                  { key: 'competency_type', label: 'Competency Type', type: 'text' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                    <input type={f.type} value={(newTraining as any)[f.key]} onChange={(e) => setNewTraining((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-brand-blue-light transition-all">
                    Create Training
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((t) => (
              <div key={t.id} className="quarter-card bg-card p-6 border border-border">
                <h3 className="font-bold text-foreground text-lg mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.description || 'No description'}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>📅 {t.date_start || 'TBA'} - {t.date_end || 'TBA'}</p>
                  <p>📍 {t.venue || 'TBA'}</p>
                  <p>🎓 {t.provider || 'TBA'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'master-list' && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-bold text-foreground text-xl">Nomination Forms Master List</h3>
              <p className="text-sm text-muted-foreground mt-1">All submitted nominations</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                  <tr><th className="p-4">Employee</th><th className="p-4">Training</th><th className="p-4">Date</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {nominations.map((n) => (
                    <tr key={n.id}>
                      <td className="p-4 font-medium text-foreground">{n.participant_name || 'N/A'}</td>
                      <td className="p-4">{n.training_title}</td>
                      <td className="p-4">{n.date_filed}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${n.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : n.status === 'disapproved' ? 'bg-destructive/10 text-destructive' : 'bg-amber-50 text-amber-600'}`}>
                          {n.status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-bold text-foreground text-xl">Job Analysis Forms Master List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                  <tr><th className="p-4">Employee</th><th className="p-4">Position</th><th className="p-4">Office</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jaForms.map((j) => (
                    <tr key={j.id}>
                      <td className="p-4 font-medium text-foreground">{j.full_name || 'N/A'}</td>
                      <td className="p-4">{j.position_title}</td>
                      <td className="p-4">{j.office_division}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${j.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {(j.status || 'draft').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
