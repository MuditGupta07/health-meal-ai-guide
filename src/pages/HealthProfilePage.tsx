
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HealthProfileForm } from "@/components/health/HealthProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getHealthProfile, saveHealthProfile } from "@/services/recipeService";
import { toast } from "sonner";

const HealthProfilePage = () => {
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user already has a health profile
    const profile = getHealthProfile();
    if (profile) {
      setExistingProfile(profile);
    }
  }, []);
  
  const handleSaveProfile = (data: any) => {
    try {
      saveHealthProfile(data);
      toast.success("Health profile saved successfully!");
      
      // Redirect to recipes page after a short delay
      setTimeout(() => {
        navigate("/recipes");
      }, 1500);
    } catch (error) {
      console.error("Error saving health profile:", error);
      toast.error("Failed to save health profile. Please try again.");
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {existingProfile ? "Update Your Health Profile" : "Create Your Health Profile"}
                </CardTitle>
                <CardDescription>
                  We'll use this information to provide personalized recipe recommendations that support your health.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <HealthProfileForm 
                  existingData={existingProfile} 
                  onSave={handleSaveProfile} 
                />
              </CardContent>
            </Card>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Why We Need This Information</h2>
              <p className="text-muted-foreground mb-4">
                Your health profile helps our AI system recommend recipes that are appropriate for your specific medical conditions and dietary needs. We take your privacy seriously - this information is stored locally on your device and is never shared.
              </p>
              
              <h3 className="font-medium mb-2">How We Use Your Information</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                <li>Filter out recipes with ingredients you're allergic to</li>
                <li>Prioritize recipes that support your specific health conditions</li>
                <li>Suggest alternatives for ingredients that may be problematic for you</li>
                <li>Provide nutritional context relevant to your health conditions</li>
              </ul>
              
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> While our recommendations are based on research and doctor-approved guidelines, they should not replace medical advice from your healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HealthProfilePage;
