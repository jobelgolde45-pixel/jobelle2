import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import UserPortal from '@/pages/portals/UserPortal';
import SupervisorPortal from '@/pages/portals/SupervisorPortal';
import HRDDAdminPortal from '@/pages/portals/HRDDAdminPortal';
import SignatoryPortal from '@/pages/portals/SignatoryPortal';

export default function Index() {
  const { user, loading, selectedPortal } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  if (!selectedPortal) return <Login />;

  switch (selectedPortal) {
    case 'user': return <UserPortal />;
    case 'supervisor': return <SupervisorPortal />;
    case 'hrdd_admin': return <HRDDAdminPortal />;
    case 'signatory': return <SignatoryPortal />;
    default: return <Login />;
  }
}
