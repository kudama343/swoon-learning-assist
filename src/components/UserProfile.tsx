
import { Play } from 'lucide-react';

export const UserProfile = () => {
  return (
    <div className="bg-swoon-white border-b border-swoon-mid-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left side - User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-swoon-blue rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-swoon-black">Kelly Bundy</h1>
              <div className="flex items-center space-x-4 text-sm text-swoon-dark-gray">
                <span>Student-Athlete</span>
                <span>kelly.bundy@swoonlearning.com</span>
                <span>+17777777777</span>
              </div>
            </div>
          </div>

          {/* Right side - Credits and Members */}
          <div className="text-right">
            <div className="text-lg font-semibold text-swoon-black">-1:00 hours</div>
            <div className="text-sm text-swoon-dark-gray">Credits Remaining</div>
            <div className="mt-2">
              <div className="text-sm text-swoon-dark-gray mb-1">Members</div>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 bg-swoon-blue rounded-full flex items-center justify-center text-white text-xs font-bold">TA</div>
                <div className="w-8 h-8 bg-swoon-red rounded-full flex items-center justify-center text-white text-xs font-bold">AE</div>
                <div className="w-8 h-8 bg-swoon-pink rounded-full flex items-center justify-center text-white text-xs font-bold">AB</div>
                <div className="w-8 h-8 bg-swoon-blue rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};