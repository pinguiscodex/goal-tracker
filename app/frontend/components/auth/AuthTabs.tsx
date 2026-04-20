'use client';

import styles from './AuthTabs.module.css';

type AuthTab = 'login' | 'signup';

interface AuthTabsProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

export default function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <nav className={styles.authTabsBar} role="tablist" aria-label="Authentication mode">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'login'}
        className={`${styles.authTabsBar__tab} ${activeTab === 'login' ? styles['authTabsBar__tab--active'] : ''}`}
        onClick={() => onTabChange('login')}
      >
        Login
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'signup'}
        className={`${styles.authTabsBar__tab} ${activeTab === 'signup' ? styles['authTabsBar__tab--active'] : ''}`}
        onClick={() => onTabChange('signup')}
      >
        Sign Up
      </button>
    </nav>
  );
}
