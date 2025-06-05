
import { Info, Calendar, BarChart3, FileText, TrendingUp, Settings, Plus } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

const tabs = [
  { id: 'details', label: 'Details', icon: Info },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'workboard', label: 'workboard', icon: BarChart3 },
  { id: 'noteboard', label: 'Noteboard', icon: FileText },
  { id: 'history', label: 'History', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'add', label: 'Add', icon: Plus },
];

export const NavigationTabs = ({ activeTab, onTabClick }: NavigationTabsProps) => {
  return (
    <div className="bg-swoon-white border-b border-swoon-mid-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`
                  flex flex-col items-center py-4 px-2 border-b-2 transition-colors
                  ${isActive 
                    ? 'border-swoon-blue text-swoon-blue' 
                    : 'border-transparent text-swoon-dark-gray hover:text-swoon-black hover:border-swoon-mid-gray'
                  }
                `}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};