import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Settings, Bell, Shield, Users, Save, Plus, X } from 'lucide-react';

interface AdminFormData {
  username: string;
  password: string;
  email: string;
}

const SettingsPage: React.FC = () => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    username: '',
    password: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    setShowAdminForm(false);
    setFormData({ username: '', password: '', email: '' });
  };

  return (
    <AppLayout title="Settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Admin Settings</CardTitle>
              <Button 
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => setShowAdminForm(true)}
              >
                Add Admin
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Configure your admin dashboard settings and preferences.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <Bell className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">Notifications</h3>
                        <p className="text-gray-600 text-sm">
                          Configure email and system notifications
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">Security</h3>
                        <p className="text-gray-600 text-sm">
                          Manage security settings and permissions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-1">Users</h3>
                        <p className="text-gray-600 text-sm">
                          Manage admin users and roles
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Verification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-gray-700">Automatic document scanning</span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Use OCR to scan and pre-validate driver documents
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-gray-700">Email notifications for pending verifications</span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Receive email updates when new verification requests come in
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    <span className="ml-2 text-gray-700">Require all documents for verification</span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Only allow verification when all required documents are provided
                  </p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600" />
                    <span className="ml-2 text-gray-700">Two-step verification approval</span>
                  </label>
                  <p className="text-gray-500 text-sm mt-1 ml-6">
                    Require secondary admin approval for all verifications
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="primary" icon={<Save className="h-4 w-4" />}>
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">2025-06-10</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Environment</span>
                  <span className="font-medium">Production</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">System Status</h4>
                <div className="flex items-center">
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                  <span>All systems operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Admin</h2>
              <button
                onClick={() => setShowAdminForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAdminForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Add Admin
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default SettingsPage;