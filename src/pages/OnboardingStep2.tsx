
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OnboardingStep2 = () => {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [niche, setNiche] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const userType = localStorage.getItem('onboarding_user_type');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: companyName,
          website: website || null,
          niche,
          description,
          user_type: userType,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save profile. Please try again.",
        });
      } else {
        localStorage.removeItem('onboarding_user_type');
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-gray-900">CallBot AI</span>
          </div>
          <CardTitle className="text-2xl">Business Information</CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Enter your company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche">Business Niche *</Label>
              <Select value={niche} onValueChange={setNiche} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="software-company">Software Company</SelectItem>
                  <SelectItem value="ecommerce">Ecommerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Briefly describe your business and services"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingStep2;
