
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Calendar, DollarSign } from 'lucide-react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const invoices = [
  {
    id: 'INV-001',
    date: '2024-01-15',
    amount: '$149.00',
    status: 'Paid',
    plan: 'Pro Plan'
  },
  {
    id: 'INV-002',
    date: '2023-12-15',
    amount: '$149.00',
    status: 'Paid',
    plan: 'Pro Plan'
  },
  {
    id: 'INV-003',
    date: '2023-11-15',
    amount: '$49.00',
    status: 'Paid',
    plan: 'Starter Plan'
  }
];

const Billing = () => {
  const handleManageBilling = () => {
    window.open('https://buy.stripe.com/test_cNi00l7QKgMw1rf6nb0gw01', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          <div className="mb-8 lg:ml-0 ml-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoices</h1>
            <p className="text-gray-600">Manage your billing information and download invoices</p>
          </div>

          <div className="space-y-6 lg:ml-0 ml-12">
            {/* Current Plan */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2" size={20} />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-semibold text-blue-900">Pro Plan</h3>
                    <p className="text-blue-700">$149/month • Next billing: Feb 15, 2024</p>
                    <p className="text-sm text-blue-600 mt-1">500 calls/month • Advanced AI voice</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="mt-4 flex gap-3">
                  <Button 
                    onClick={handleManageBilling}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Manage Billing
                  </Button>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    Change Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage This Month */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2" size={20} />
                  Usage This Month
                </CardTitle>
                <CardDescription>Your current usage and charges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">127</p>
                    <p className="text-sm text-gray-600">Calls Made</p>
                    <p className="text-xs text-green-600 mt-1">373 remaining</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">$149</p>
                    <p className="text-sm text-gray-600">Monthly Charge</p>
                    <p className="text-xs text-gray-500 mt-1">Fixed rate</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                    <p className="text-sm text-gray-600">Overage Fees</p>
                    <p className="text-xs text-green-600 mt-1">Within limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoice History */}
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Invoice History
                </CardTitle>
                <CardDescription>Download your past invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.id}</p>
                          <p className="text-sm text-gray-600">{invoice.plan}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{invoice.amount}</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
