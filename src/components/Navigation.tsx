import { AiOutlineShopping, AiOutlineHistory, AiOutlineFire, AiOutlineLogout } from 'react-icons/ai';
import type { Page } from '@/types';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  mpBalance: number;
}

const NAV_ITEMS: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'workout', label: 'ENTRAINEMENT', icon: <AiOutlineFire size={16} /> },
  { page: 'shop', label: 'BOUTIQUE', icon: <AiOutlineShopping size={16} /> },
  { page: 'history', label: 'HISTORIQUE', icon: <AiOutlineHistory size={16} /> },
];

export function Navigation({ currentPage, onPageChange, mpBalance }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-obsidian border-b border-steel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rosso" />
            <span
              className="font-display text-lg text-polar tracking-widest"
              style={{ letterSpacing: '0.15em' }}
            >
              MY MERIDIAN
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => onPageChange(item.page)}
                className={
                  'flex items-center gap-2 px-4 py-2 font-display text-sm tracking-widest transition-colors ' +
                  (currentPage === item.page
                    ? 'text-polar border-b border-rosso'
                    : 'text-ash hover:text-polar')
                }
                style={{ letterSpacing: '0.083em' }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* MP Balance */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-rosso text-sm" style={{ letterSpacing: '0.083em' }}>
                {mpBalance} MP
              </span>
            </div>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.confirm('Reinitialiser toutes les donnees ?')) {
                  window.location.reload();
                }
              }}
              className="text-ash hover:text-polar transition-colors"
              title="Deconnexion"
            >
              <AiOutlineLogout size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="sm:hidden flex items-center justify-around border-t border-steel">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className={
              'flex items-center gap-1.5 px-3 py-2.5 font-display text-xs tracking-widest transition-colors ' +
              (currentPage === item.page
                ? 'text-polar border-b-2 border-rosso'
                : 'text-ash')
            }
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
