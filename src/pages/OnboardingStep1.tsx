
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

const OnboardingStep1 = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (userType) {
      localStorage.setItem('onboarding_user_type', userType);
      navigate('/onboarding/step-2');
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
          <CardTitle className="text-2xl">Who are you?</CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-8 h-2 bg-blue-600 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={userType} onValueChange={setUserType}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-semibold">Individual</div>
                  <div className="text-sm text-gray-600">Personal use or small business</div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="enterprise" id="enterprise" />
              <Label htmlFor="enterprise" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-semibold">Enterprise</div>
                  <div className="text-sm text-gray-600">Large organization or team</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          <Button 
            onClick={handleNext} 
            className="w-full" 
            disabled={!userType}
          >
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingStep1;
