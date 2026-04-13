import { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { id: 'nominations', label: 'Nominations', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { id: 'job-analysis', label: 'Job Analysis Approvals', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
];

export default function SupervisorPortal() {
  const { profile } = useAuth();
  const [section, setSection] = useState('dashboard');
  const [nominations, setNominations] = useState<any[]>([]);
  const [jaForms, setJaForms] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [n, j] = await Promise.all([
      supabase.from('nominations').select('*').order('created_at', { ascending: false }),
      supabase.from('job_analysis_forms').select('*').order('created_at', { ascending: false }),
    ]);
    if (n.data) setNominations(n.data);
    if (j.data) setJaForms(j.data);
  };

  const updateNomination = async (id: string, status: string, remarks: string) => {
    const { error } = await supabase.from('nominations').update({ status: status as any, supervisor_remarks: remarks }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(`Nomination ${status}`); loadData(); }
  };

  const updateJAForm = async (id: string, status: string, remarks: string) => {
    const { error } = await supabase.from('job_analysis_forms').update({ status: status as any, supervisor_remarks: remarks }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(`JA Form ${status}`); loadData(); }
  };

  const pendingNoms = nominations.filter((n) => n.status === 'pending_supervisor');
  const pendingJA = jaForms.filter((j) => j.status === 'submitted');
  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'SV';

  return (
    <PortalLayout title={section === 'dashboard' ? 'Supervisor Dashboard' : section === 'nominations' ? 'Nominations' : 'Job Analysis Approvals'}
      subtitle="DOTr-HRDD Supervisor Console" menuItems={menuItems} activeSection={section} onSectionChange={setSection}
      userInitials={initials} userName={profile?.full_name || 'Supervisor'}>

      {section === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Pending Nominations</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{pendingNoms.length}</h3>
              <div className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">Needs Review</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Pending JA Forms</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{pendingJA.length}</h3>
              <div className="mt-4 text-xs font-medium text-brand-600 bg-brand-100 inline-block px-2 py-1 rounded">Needs Review</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Processed</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{nominations.filter((n) => n.status !== 'pending_supervisor' && n.status !== 'draft').length}</h3>
              <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">Completed</div>
            </div>
          </div>
        </div>
      )}

      {section === 'nominations' && (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground text-xl">Pending Supervisor Review</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                <tr><th className="p-4">Employee</th><th className="p-4">Training</th><th className="p-4">Status</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingNoms.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center">No pending nominations.</td></tr>
                ) : pendingNoms.map((n) => (
                  <tr key={n.id}>
                    <td className="p-4 font-medium text-foreground">{n.participant_name || 'N/A'}</td>
                    <td className="p-4">{n.training_title}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-amber-50 text-amber-600">PENDING</span></td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => updateNomination(n.id, 'pending_hrdd', 'Approved by supervisor')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100">Approve</button>
                      <button onClick={() => updateNomination(n.id, 'disapproved', 'Disapproved by supervisor')} className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-bold hover:bg-destructive/20">Disapprove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === 'job-analysis' && (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground text-xl">Job Analysis Form Approvals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                <tr><th className="p-4">Employee</th><th className="p-4">Position</th><th className="p-4">Office</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingJA.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center">No pending JA forms.</td></tr>
                ) : pendingJA.map((j) => (
                  <tr key={j.id}>
                    <td className="p-4 font-medium text-foreground">{j.full_name || 'N/A'}</td>
                    <td className="p-4">{j.position_title}</td>
                    <td className="p-4">{j.office_division}</td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => updateJAForm(j.id, 'approved', 'Approved by supervisor')} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100">Approve</button>
                      <button onClick={() => updateJAForm(j.id, 'returned', 'Returned by supervisor')} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100">Return</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
