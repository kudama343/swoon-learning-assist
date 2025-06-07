import { User, ShoppingCart, FileText, Users, Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import headerIcon from './assets/header-icon.png'; // Adjust the path based on your file structure

export const TopNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-swoon-blue shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Company */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:opacity-80 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <img src={headerIcon} alt="Header Icon" className="w-15 sm:w-15 h-5 sm:h-6" />
            
            <div className="text-white">
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-90">ACME Company</span>
              <span className="ml-1 sm:ml-2 text-xs bg-swoon-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">v4.0.20</span>
            </div>
          </div>

          {/* Right side - Navigation and User (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Icons */}
            <div className="flex items-center space-x-4 text-white">
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
                <Users className="w-5 h-5" />
                <span className="text-xs">People</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Sessions</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs">Orders</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
                <FileText className="w-5 h-5" />
                <span className="text-xs">Surveys</span>
              </div>
            </div>

            {/* Notification and User */}
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-white cursor-pointer hover:opacity-80" />
              <div className="bg-swoon-white/20 rounded-lg px-3 py-2 text-white">
                <span className="text-sm font-medium">root</span>
                <div className="text-xs opacity-90">Root</div>
              </div>
              <div className="w-8 h-8 bg-swoon-white rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-swoon-blue" />
              </div>
            </div>
          </div>

          {/* Mobile - Only Bell and User */}
          <div className="flex md:hidden items-center space-x-2">
            <Bell className="w-5 h-5 text-white cursor-pointer hover:opacity-80" />
            <div className="w-7 h-7 bg-swoon-white rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-swoon-blue" />
            </div>
          </div>
        </div>

        {/* Mobile Menu - Navigation Icons */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-swoon-white/20">
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80 py-2">
                <Users className="w-6 h-6 mb-1" />
                <span className="text-xs">People</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80 py-2">
                <FileText className="w-6 h-6 mb-1" />
                <span className="text-xs">Sessions</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80 py-2">
                <ShoppingCart className="w-6 h-6 mb-1" />
                <span className="text-xs">Orders</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80 py-2">
                <FileText className="w-6 h-6 mb-1" />
                <span className="text-xs">Surveys</span>
              </div>
            </div>
            
            {/* Mobile User Info */}
            <div className="mt-4 pt-3 border-t border-swoon-white/20">
              <div className="bg-swoon-white/20 rounded-lg px-3 py-2 text-white text-center">
                <span className="text-sm font-medium">root</span>
                <div className="text-xs opacity-90">Root</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};