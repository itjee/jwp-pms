import React from 'react';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {[
              { name: 'Profile', icon: User, current: true },
              { name: 'Notifications', icon: Bell, current: false },
              { name: 'Security', icon: Shield, current: false },
              { name: 'Appearance', icon: Palette, current: false },
            ].map((item) => (
              <a
                key={item.name}
                href="#"
                className={`${
                  item.current
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-lg`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Profile Settings
            </h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input" placeholder="Your full name" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="your@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="label">Phone</label>
                  <input type="tel" className="input" placeholder="Your phone number" />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input type="text" className="input" placeholder="Your department" />
                </div>
              </div>

              <div>
                <label className="label">Bio</label>
                <textarea rows={4} className="input" placeholder="Tell us about yourself"></textarea>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;