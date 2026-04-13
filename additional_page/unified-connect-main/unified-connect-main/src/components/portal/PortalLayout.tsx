import { useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DOTR_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Department_of_Transportation_%28Philippines%29.svg/330px-Department_of_Transportation_%28Philippines%29.svg.png';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  children?: { id: string; label: string }[];
}

interface PortalLayoutProps {
  title: string;
  subtitle: string;
  menuItems: MenuItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: ReactNode;
  userInitials?: string;
  userName?: string;
}

export default function PortalLayout({ title, subtitle, menuItems, activeSection, onSectionChange, children, userInitials = 'U', userName = 'User' }: PortalLayoutProps) {
  const { signOut, setSelectedPortal } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMenu = (id: string) => {
    setExpandedMenus((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  };

  const handleSignOut = async () => {
    await signOut();
    setSelectedPortal(null);
  };

  const sidebarContent = (
    <>
      <div className="py-8 flex justify-start items-center gap-3 px-5">
        <img src={DOTR_LOGO} className="w-8 h-8" alt="Logo" />
        {sidebarOpen && <span className="text-xl font-bold text-foreground tracking-tight">DOTr-HRDD</span>}
      </div>

      <div className="flex flex-col overflow-y-auto flex-1 custom-scrollbar px-3">
        <nav className="mb-6">
          <h2 className="mb-4 text-xs uppercase text-muted-foreground font-semibold px-2">Menu</h2>
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`menu-item ${expandedMenus.includes(item.id) ? '' : 'menu-item-inactive'} justify-between w-full`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <svg className={`w-4 h-4 text-muted-foreground transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedMenus.includes(item.id) && (
                      <ul className="flex flex-col gap-1 mt-1 pl-6 animate-fade-in-up">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <button
                              onClick={() => { onSectionChange(child.id); setMobileSidebarOpen(false); }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === child.id ? 'text-primary font-semibold bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => { onSectionChange(item.id); setMobileSidebarOpen(false); }}
                    className={`menu-item w-full ${activeSection === item.id ? 'menu-item-active' : 'menu-item-inactive'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-4">
        <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-gradient-to-b from-card via-secondary/30 to-card border-r border-border transition-all duration-300 z-50 ${sidebarOpen ? 'w-[290px]' : 'w-[80px]'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}
      
      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-screen w-[290px] bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-[290px]' : 'lg:ml-[80px]'} min-h-screen`}>
        {/* Header */}
        <header className="sticky top-0 flex w-full bg-gradient-to-r from-card via-secondary/30 to-card border-b border-border z-30 h-16 sm:h-20 shadow-sm">
          <div className="flex items-center justify-between flex-grow px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => { if (window.innerWidth < 1024) setMobileSidebarOpen(!mobileSidebarOpen); else setSidebarOpen(!sidebarOpen); }}
                className="flex items-center justify-center w-10 h-10 text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
              <div className="hidden lg:block">
                <h2 className="text-xl font-bold font-display text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
              <div className="lg:hidden flex items-center font-bold text-foreground">
                <img src={DOTR_LOGO} className="w-8 h-8 mr-2" alt="Logo" />
                DOTr-HRDD
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="overflow-hidden rounded-full h-11 w-11 bg-brand-100 text-brand-600 border border-brand-300 flex items-center justify-center font-bold text-sm">
                {userInitials}
              </span>
              <span className="hidden sm:block text-sm font-medium text-foreground">{userName}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8 mx-auto w-full max-w-screen-2xl flex-1 overflow-y-auto custom-scrollbar">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
