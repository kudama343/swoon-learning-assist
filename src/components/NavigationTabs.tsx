
import { Info, Calendar, BarChart3, FileText, TrendingUp, Settings, Plus } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

const tabs = [
  { id: 'details', label: 'Details', icon: Info },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'workboard', label: 'Workboard', icon: BarChart3 },
  { id: 'noteboard', label: 'Noteboard', icon: FileText },
  { id: 'history', label: 'History', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'add', label: 'Add', icon: Plus },
];

export const NavigationTabs = ({ activeTab, onTabClick }: NavigationTabsProps) => {
  return (
    <div className="bg-swoon-white border-b border-swoon-mid-gray overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 md:space-x-8 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`
                  flex flex-col items-center py-3 md:py-4 px-2 border-b-2 transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'border-swoon-blue text-swoon-blue' 
                    : 'border-transparent text-swoon-dark-gray hover:text-swoon-black hover:border-swoon-mid-gray'
                  }
                `}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5 mb-1" />
                <span className="text-xs md:text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};