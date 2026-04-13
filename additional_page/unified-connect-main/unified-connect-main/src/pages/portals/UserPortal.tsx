import { useState, useEffect } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { id: 'trainings', label: 'Trainings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    children: [
      { id: 'ldi', label: 'L&D Interventions' },
      { id: 'request-training', label: 'Request for Training' },
    ]
  },
  { id: 'competency', label: 'Competency', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" /></svg>,
    children: [
      { id: 'comp-intro', label: 'Introduction' },
      { id: 'job-analysis', label: 'Job Analysis Form' },
    ]
  },
  { id: 'reports', label: 'Reports', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { id: 'profile', label: 'My Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

export default function UserPortal() {
  const { profile, user } = useAuth();
  const [section, setSection] = useState('dashboard');
  const [trainings, setTrainings] = useState<any[]>([]);
  const [nominations, setNominations] = useState<any[]>([]);
  const [jaForms, setJaForms] = useState<any[]>([]);

  // Nomination form state
  const [nomForm, setNomForm] = useState({
    training_title: '', date_of_training: '', date_filed: new Date().toISOString().split('T')[0],
    competency_type: '', venue: '', participant_name: '', participant_id_number: '',
    participant_email: '', participant_position: '', participant_office: '', participant_supervisor: '',
    participant_salary_grade: '', participant_years_of_service: '', participant_contact: '',
    participant_gender: '', justification: '',
  });

  // JA Form state
  const [jaForm, setJaForm] = useState({
    full_name: '', position_title: '', office_division: '', section_unit: '',
    alternate_position: '', job_purpose: '', main_duties: '', tools_equipment: '',
    challenges: '', additional_comments: '',
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const [t, n, j] = await Promise.all([
      supabase.from('trainings').select('*').order('created_at', { ascending: false }),
      supabase.from('nominations').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('job_analysis_forms').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);
    if (t.data) setTrainings(t.data);
    if (n.data) setNominations(n.data);
    if (j.data) setJaForms(j.data);
  };

  const submitNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('nominations').insert({
      user_id: user.id,
      ...nomForm,
      status: 'pending_supervisor',
    });
    if (error) toast.error(error.message);
    else {
      toast.success('Nomination submitted successfully!');
      loadData();
      setSection('dashboard');
    }
  };

  const submitJAForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from('job_analysis_forms').insert({
      user_id: user.id,
      ...jaForm,
      status: 'submitted',
      date_submitted: new Date().toISOString().split('T')[0],
    });
    if (error) toast.error(error.message);
    else {
      toast.success('Job Analysis Form submitted!');
      loadData();
      setSection('dashboard');
    }
  };

  const initials = profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <PortalLayout
      title={section === 'dashboard' ? 'Dashboard' : section === 'ldi' ? 'L&D Interventions' : section === 'request-training' ? 'Nomination Form' : section === 'job-analysis' ? 'Job Analysis Form' : section === 'profile' ? 'My Profile' : 'Dashboard'}
      subtitle="DOTr-HRDD Learning Portal"
      menuItems={menuItems}
      activeSection={section}
      onSectionChange={setSection}
      userInitials={initials}
      userName={profile?.full_name || 'Employee'}
    >
      {section === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Available Trainings</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{trainings.length}</h3>
              <div className="mt-4 text-xs font-medium text-brand-600 bg-brand-100 inline-block px-2 py-1 rounded">Active Programs</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">My Nominations</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{nominations.length}</h3>
              <div className="mt-4 text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">Submitted</div>
            </div>
            <div className="quarter-card bg-card p-6 border border-border">
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Job Analysis Forms</p>
              <h3 className="text-4xl font-display font-bold text-foreground mt-2">{jaForms.length}</h3>
              <div className="mt-4 text-xs font-medium text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded">Filed</div>
            </div>
          </div>

          {/* Recent Nominations */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-bold text-foreground text-xl font-display">Recent Nominations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-xs uppercase font-bold border-b border-border">
                  <tr>
                    <th className="p-4">Training</th>
                    <th className="p-4">Date Filed</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {nominations.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No nominations yet. <button onClick={() => setSection('request-training')} className="text-brand-600 font-semibold hover:underline">Submit one now</button></td></tr>
                  ) : nominations.slice(0, 5).map((n) => (
                    <tr key={n.id}>
                      <td className="p-4 font-medium text-foreground">{n.training_title || 'Untitled'}</td>
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
        </div>
      )}

      {section === 'ldi' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">Learning & Development Interventions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.length === 0 ? (
              <div className="col-span-full bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">
                <p>No training programs available at the moment.</p>
              </div>
            ) : trainings.map((t) => (
              <div key={t.id} className="quarter-card bg-card p-6 border border-border">
                <h3 className="font-bold text-foreground text-lg mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.description || 'No description available.'}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <span>{t.date_start || 'TBA'}</span>
                  <span>•</span>
                  <span>{t.venue || 'TBA'}</span>
                </div>
                <button onClick={() => { setNomForm((f) => ({ ...f, training_title: t.title, date_of_training: t.date_start || '' })); setSection('request-training'); }}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-blue-light transition-all text-sm">
                  Apply / Nominate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'request-training' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-brand-600 to-brand-500 p-8 text-primary-foreground shadow-lg">
              <h2 className="text-3xl font-display font-bold mb-2">Nomination Form</h2>
              <p className="opacity-90">Please fill out all required fields to register for the training.</p>
            </div>

            <form onSubmit={submitNomination} className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">I. Training/Program Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Title of Training/Course</label>
                    <input type="text" value={nomForm.training_title} onChange={(e) => setNomForm((f) => ({ ...f, training_title: e.target.value }))} required
                      className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Date of Training</label>
                    <input type="text" value={nomForm.date_of_training} onChange={(e) => setNomForm((f) => ({ ...f, date_of_training: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Date of Filing</label>
                    <input type="date" value={nomForm.date_filed} onChange={(e) => setNomForm((f) => ({ ...f, date_filed: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Type of Competency</label>
                    <div className="space-y-2">
                      {['core', 'leadership', 'functional'].map((c) => (
                        <label key={c} className="flex items-center gap-2 text-foreground">
                          <input type="radio" name="competency" value={c} checked={nomForm.competency_type === c}
                            onChange={(e) => setNomForm((f) => ({ ...f, competency_type: e.target.value }))} className="text-brand-600 focus:ring-brand-500" />
                          {c.charAt(0).toUpperCase() + c.slice(1)} Competency
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Venue</label>
                    <textarea value={nomForm.venue} onChange={(e) => setNomForm((f) => ({ ...f, venue: e.target.value }))} rows={3}
                      className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">II. Participant&apos;s Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'participant_name', label: 'Name of Personnel' },
                    { key: 'participant_id_number', label: 'ID Number' },
                    { key: 'participant_email', label: 'Email Address' },
                    { key: 'participant_position', label: 'Position Title' },
                    { key: 'participant_office', label: 'Office/Unit' },
                    { key: 'participant_supervisor', label: 'Immediate Supervisor' },
                    { key: 'participant_salary_grade', label: 'Salary Grade' },
                    { key: 'participant_years_of_service', label: 'Yrs./Months in DOTr Service' },
                    { key: 'participant_contact', label: 'Contact/Viber Number' },
                    { key: 'participant_gender', label: 'Gender (Optional)' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                      <input type="text" value={(nomForm as any)[f.key]} onChange={(e) => setNomForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 mb-4">IV. Justification</h3>
                <textarea value={nomForm.justification} onChange={(e) => setNomForm((f) => ({ ...f, justification: e.target.value }))} rows={5}
                  placeholder="Explain why you should attend this training..."
                  className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-brand-blue-light transition-all shadow-lg text-base">
                Submit Nomination
              </button>
            </form>
          </div>
        </div>
      )}

      {section === 'comp-intro' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">Competency Framework</h2>
          <div className="bg-card rounded-2xl border border-border p-8 space-y-4">
            <p className="text-muted-foreground leading-relaxed">The DOTr Competency Framework is designed to identify, develop, and measure the competencies required for effective performance across all positions within the Department of Transportation.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {['Core Competency', 'Leadership Competency', 'Functional Competency'].map((c) => (
                <div key={c} className="bg-secondary/50 p-6 rounded-xl border border-border">
                  <h4 className="font-bold text-foreground mb-2">{c}</h4>
                  <p className="text-sm text-muted-foreground">Essential skills and knowledge areas for this competency domain.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === 'job-analysis' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-brand-600 to-brand-500 p-8 text-primary-foreground">
              <h2 className="text-3xl font-display font-bold mb-2">Job Analysis Form</h2>
              <p className="opacity-90">Document your job roles, responsibilities, and required competencies.</p>
            </div>
            <form onSubmit={submitJAForm} className="p-8 space-y-6">
              {[
                { key: 'full_name', label: 'Full Name' },
                { key: 'position_title', label: 'Position Title' },
                { key: 'office_division', label: 'Office/Service/Division' },
                { key: 'section_unit', label: 'Section/Project/Unit' },
                { key: 'alternate_position', label: 'Alternate Position' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                  <input type="text" value={(jaForm as any)[f.key]} onChange={(e) => setJaForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
              ))}
              {[
                { key: 'job_purpose', label: 'Job Purpose', rows: 4 },
                { key: 'main_duties', label: 'Main Duties and Responsibilities', rows: 6 },
                { key: 'tools_equipment', label: 'Tools and Equipment', rows: 3 },
                { key: 'challenges', label: 'Challenges and Critical Issues', rows: 4 },
                { key: 'additional_comments', label: 'Additional Comments', rows: 3 },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
                  <textarea value={(jaForm as any)[f.key]} onChange={(e) => setJaForm((prev) => ({ ...prev, [f.key]: e.target.value }))} rows={f.rows}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-card text-foreground focus:ring-2 focus:ring-brand-500 focus:outline-none" />
                </div>
              ))}
              <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-brand-blue-light transition-all shadow-lg text-base">
                Submit Job Analysis Form
              </button>
            </form>
          </div>
        </div>
      )}

      {section === 'reports' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">Reports</h2>
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">
            <p>Your training reports and certificates will appear here.</p>
          </div>
        </div>
      )}

      {section === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold font-display text-foreground">My Profile</h2>
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold border-2 border-brand-300">
                {initials}
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{profile?.full_name || 'Not set'}</h3>
                <p className="text-muted-foreground">{profile?.position_title || 'Employee'}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {[
                ['Office/Division', profile?.office_division],
                ['Salary Grade', profile?.salary_grade],
                ['Employment Status', profile?.employment_status],
                ['Contact Number', profile?.contact_number],
                ['Gender', profile?.gender],
                ['Years of Service', profile?.years_of_service],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
