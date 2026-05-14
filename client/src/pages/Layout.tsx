
import type { FC, ReactNode } from 'react';
import { CreditCard, LayoutDashboard, LogOut, Settings, ShoppingBasket, UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AppLogo } from '../components/AppLogo';
import { NavItem, MobileNavItem } from '../components/NavItem';
import strings from './nls/layout_strings.json';

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/', label: strings.menuDashboard, icon: LayoutDashboard },
  { path: '/expenses', label: strings.menuExpenses, icon: CreditCard },
  { path: '/grocery', label: strings.menuGrocery, icon: ShoppingBasket },
  { path: '/accounts', label: strings.menuProducts, icon: ShoppingBasket },
  { path: '/settings', label: strings.menuSettings, icon: Settings },
];

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: strings.pageDashboardTitle, subtitle: strings.pageDashboardSubtitle },
  '/expenses': { title: strings.pageExpensesTitle, subtitle: strings.pageExpensesSubtitle },
  '/grocery': { title: strings.pageGroceryTitle, subtitle: strings.pageGrocerySubtitle },
  '/grocery/add': { title: 'Track New Items', subtitle: 'Add new products to your price tracker' },
  '/settings': { title: strings.pageSettingsTitle, subtitle: strings.pageSettingsSubtitle },
  '/accounts': { title: strings.pageProductTitle, subtitle: strings.pageProductSubtitle },
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { logout, user, theme } = useStore();
  const location = useLocation();

  const { title, subtitle } = pageTitles[location.pathname] ?? {
    title: strings.pageDefaultTitle,
    subtitle: strings.pageDefaultSubtitle,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside style={{ backgroundColor: theme?.navColor }} className="w-64 border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <AppLogo />
            <span className="text-xl font-bold tracking-tight" style={{ color: theme?.buttonColor }}>{strings.appName}</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                activeColor={theme?.buttonColor}
                textColor={theme?.textColor}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate" style={{ color: theme?.textColor }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: theme ? `${theme.textColor}88` : undefined }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
            style={{ color: '#fff', backgroundColor: theme?.buttonColor }}
          >
            <LogOut className="w-4 h-4" />
            {strings.signOut}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div style={{ backgroundColor: theme?.navColor }} className="md:hidden fixed top-0 w-full border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <AppLogo size="sm" />
          <span className="font-bold" style={{ color: theme?.buttonColor }}>{strings.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium hidden sm:block" style={{ color: theme?.textColor }}>{user?.name}</span>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div style={{ backgroundColor: theme?.navColor }} className="md:hidden fixed bottom-0 w-full border-t border-slate-200 z-20 flex justify-around py-3 px-2">
        {menuItems.map((item) => (
          <MobileNavItem
            key={item.path}
            path={item.path}
            label={item.label}
            icon={item.icon}
            activeColor={theme?.buttonColor}
            textColor={theme?.textColor}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </header>

        {children}
      </main>
    </div>
  );
};
