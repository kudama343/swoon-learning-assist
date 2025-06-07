
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
    <div className="bg-swoon-white border-b border-swoon-mid-gray overflow-x-auto shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex space-x-2 sm:space-x-4 md:space-x-8 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`
                  flex flex-col items-center py-3 px-3 sm:px-4 border-b-2 transition-all duration-200 whitespace-nowrap group
                  ${isActive 
                    ? 'border-swoon-blue text-swoon-blue bg-swoon-light-blue/20' 
                    : 'border-transparent text-swoon-dark-gray hover:text-swoon-blue hover:border-swoon-blue/50 hover:bg-swoon-light-blue/10'
                  }
                `}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-1 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};