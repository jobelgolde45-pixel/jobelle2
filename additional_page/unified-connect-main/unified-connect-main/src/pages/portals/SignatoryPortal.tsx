import { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { id: 'pending', label: 'Pending Signatures', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
  { id: 'completed', label: 'Completed', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
];

export default function SignatoryPortal() {
  const { profile } = useAuth();
  const [section, setSection] = useState('dashboard');
  const [nominations, setNominations] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data } = await supabase.from('nominations').select('*').order('created_at', { ascending: false });
    if (data) setNominations(data);
  };

  const signNomination = async (id: string) => {
    const { error } = await supabase.from('nominations').update({ signatory_remarks: 'Signed by authorized signatory', status: 'approved' as any }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Nomination signed!'); loadData(); }
  };

  const approved = nominations.filter((n) => n.status === 'approved');
  const pendingSign = nominations.filter((n) => n.status === 'pending_hrdd');
  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'AS';

  return (
    <PortalLayout title={section === 'dashboard' ? 'Signatory Dashboard' : section === 'pending' ? 'Pending Signatures' : 'Completed'}
      subtitle="DOTr-HRDD Authorized Signatory Portal" menuItems={menuItems} activeSection={section} onSectionChange={setSection}
      userInitials={initials} userName={profile?.full_name || 'Signatory'}>

      {section === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Awaiting Signature</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{pendingSign.length}</h3>
              <div className="mt-4 text-xs font-medium text-amber-600 bg-amber-50 inline-block px-2 py-1 rounded">Needs Signing</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Completed</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{approved.length}</h3>
              <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">Signed</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Total Forms</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{nominations.length}</h3>
            </div>
          </div>
        </div>
      )}

      {section === 'pending' && (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground text-xl">Pending Authorized Signature</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                <tr><th className="p-4">Employee</th><th className="p-4">Training</th><th className="p-4">Office</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingSign.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center">No forms awaiting signature.</td></tr>
                ) : pendingSign.map((n) => (
                  <tr key={n.id}>
                    <td className="p-4 font-medium text-foreground">{n.participant_name || 'N/A'}</td>
                    <td className="p-4">{n.training_title}</td>
                    <td className="p-4">{n.participant_office || 'N/A'}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => signNomination(n.id)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-brand-blue-light transition-all">
                        ✍️ Sign & Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === 'completed' && (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-foreground text-xl">Completed & Signed</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                <tr><th className="p-4">Employee</th><th className="p-4">Training</th><th className="p-4">Date</th><th className="p-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approved.map((n) => (
                  <tr key={n.id}>
                    <td className="p-4 font-medium text-foreground">{n.participant_name || 'N/A'}</td>
                    <td className="p-4">{n.training_title}</td>
                    <td className="p-4">{n.date_filed}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-600">APPROVED</span></td>
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
