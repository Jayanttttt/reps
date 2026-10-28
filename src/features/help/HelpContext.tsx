import React, { createContext, useContext, useState, ReactNode } from 'react';

export type HelpTabId = 'home' | 'planner' | 'workout' | 'records' | 'reports' | 'goals';

interface HelpContextType {
  isOpen: boolean;
  activeHelpTab: HelpTabId;
  setActiveHelpTab: (tab: HelpTabId) => void;
  openHelp: (tab?: HelpTabId) => void;
  closeHelp: () => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState<HelpTabId>('home');

  const openHelp = (tab?: HelpTabId) => {
    if (tab) {
      setActiveHelpTab(tab);
    }
    setIsOpen(true);
  };

  const closeHelp = () => {
    setIsOpen(false);
  };

  return (
    <HelpContext.Provider value={{ isOpen, activeHelpTab, setActiveHelpTab, openHelp, closeHelp }}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}
