import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Save, Plus, X } from 'lucide-react';

interface AdminFormData {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

const SettingsPage: React.FC = () => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [formData, setFormData] = useState<AdminFormData>({
    username: '',
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8092/api/usermanager/api/auth/registerAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add admin');
      }

      const data = await response.json();
      console.log('Admin added successfully:', data);

      setAlertMessage('Successfully admin registered!');
      setTimeout(() => setAlertMessage(null), 5000);

      setFormData({ username: '', fullName: '', phone: '', email: '', password: '' });
      setShowAdminForm(false);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error adding admin, please try again.');
      setTimeout(() => setAlertMessage(null), 5000);
    }
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
              <p className="text-gray-600 mb-6">Configure your admin dashboard settings and preferences.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[{
                  title: 'Notifications',
                  desc: 'Configure email and system notifications',
                  icon: <Save className="h-6 w-6 text-blue-600" />,
                  bg: 'bg-blue-100',
                }, {
                  title: 'Security',
                  desc: 'Manage security settings and permissions',
                  icon: <Save className="h-6 w-6 text-green-600" />,
                  bg: 'bg-green-100',
                }, {
                  title: 'Users',
                  desc: 'Manage admin users and roles',
                  icon: <Save className="h-6 w-6 text-purple-600" />,
                  bg: 'bg-purple-100',
                }].map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className={`${item.bg} p-3 rounded-lg mr-4`}>
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {[{
                  label: 'Automatic document scanning',
                  desc: 'Use OCR to scan and pre-validate driver documents',
                  checked: true
                }, {
                  label: 'Email notifications for pending verifications',
                  desc: 'Receive email updates when new verification requests come in',
                  checked: true
                }, {
                  label: 'Require all documents for verification',
                  desc: 'Only allow verification when all required documents are provided',
                  checked: true
                }, {
                  label: 'Two-step verification approval',
                  desc: 'Require secondary admin approval for all verifications',
                  checked: false
                }].map((setting, index) => (
                  <div key={index}>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600"
                        defaultChecked={setting.checked}
                      />
                      <span className="ml-2 text-gray-700">{setting.label}</span>
                    </label>
                    <p className="text-gray-500 text-sm mt-1 ml-6">{setting.desc}</p>
                  </div>
                ))}
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
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">1.0.0</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">May 2, 2025</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {alertMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {alertMessage}
        </div>
      )}

      {showAdminForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Admin</h2>
              <button onClick={() => setShowAdminForm(false)}>
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />}>
                  Register Admin
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
