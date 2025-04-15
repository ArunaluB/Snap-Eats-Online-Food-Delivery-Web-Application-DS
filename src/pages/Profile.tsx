import { UserIcon, PhoneIcon, StarIcon, SettingsIcon } from 'lucide-react';
export function Profile() {
  return <div className="mb-16">
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 flex items-center space-x-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <UserIcon className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-gray-500">Driver ID: #12345</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <PhoneIcon className="h-5 w-5 text-gray-500" />
            <span>+1 234 567 8900</span>
          </div>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <StarIcon className="h-5 w-5 text-gray-500" />
            <span>Rating: 4.8</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-5 w-5 text-gray-500" />
            <span>Settings</span>
          </div>
        </div>
      </div>
    </div>;
}
