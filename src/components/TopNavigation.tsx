
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const TopNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-swoon-white border-b border-swoon-mid-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-swoon-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-swoon-black hidden sm:block">Swoon Learning</span>
              <span className="text-lg font-bold text-swoon-black sm:hidden">Swoon</span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-swoon-dark-gray w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments, subjects..."
                className="w-full pl-10 pr-4 py-2 border border-swoon-mid-gray rounded-lg focus:outline-none focus:border-swoon-blue bg-swoon-light-gray"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-swoon-dark-gray" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-swoon-red rounded-full"></span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-swoon-dark-gray" />
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Search className="w-5 h-5 text-swoon-dark-gray" />
            </Button>
          </div>
        </div>

        {/* Mobile Search - Shown when mobile menu is open */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-swoon-mid-gray">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-swoon-dark-gray w-4 h-4" />
              <input
                type="text"
                placeholder="Search assignments, subjects..."
                className="w-full pl-10 pr-4 py-2 border border-swoon-mid-gray rounded-lg focus:outline-none focus:border-swoon-blue bg-swoon-light-gray"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};