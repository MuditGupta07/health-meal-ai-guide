
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

export function RecipeFilters({ onFilterChange }: FiltersProps) {
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [diet, setDiet] = useState<string>("");
  
  const healthConditionOptions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "heart-disease", label: "Heart Disease" },
    { id: "hypertension", label: "Hypertension" },
    { id: "pcos", label: "PCOS" },
    { id: "cholesterol", label: "High Cholesterol" }
  ];
  
  const allergyOptions = [
    { id: "dairy", label: "Dairy" },
    { id: "gluten", label: "Gluten" },
    { id: "nuts", label: "Nuts" },
    { id: "eggs", label: "Eggs" },
    { id: "soy", label: "Soy" },
    { id: "shellfish", label: "Shellfish" }
  ];
  
  const dietOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "paleo", label: "Paleo" },
    { value: "keto", label: "Keto" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "dash", label: "DASH" },
  ];
  
  const toggleHealthCondition = (value: string) => {
    setHealthConditions(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  const toggleAllergy = (value: string) => {
    setAllergies(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  const handleDietChange = (value: string) => {
    setDiet(value);
  };
  
  const applyFilters = () => {
    onFilterChange({
      healthConditions,
      allergies,
      diet
    });
  };
  
  const resetFilters = () => {
    setHealthConditions([]);
    setAllergies([]);
    setDiet("");
    onFilterChange({
      healthConditions: [],
      allergies: [],
      diet: ""
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="health-conditions">
            <AccordionTrigger>Health Conditions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {healthConditionOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id} 
                      checked={healthConditions.includes(option.id)}
                      onCheckedChange={() => toggleHealthCondition(option.id)}
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="allergies">
            <AccordionTrigger>Allergies & Intolerances</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {allergyOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id} 
                      checked={allergies.includes(option.id)}
                      onCheckedChange={() => toggleAllergy(option.id)}
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="space-y-2">
          <Label htmlFor="diet">Diet Type</Label>
          <Select value={diet} onValueChange={handleDietChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select diet type" />
            </SelectTrigger>
            <SelectContent>
              {dietOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active filters */}
      {(healthConditions.length > 0 || allergies.length > 0 || diet) && (
        <div className="bg-health-light p-3 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters} 
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {healthConditions.map((condition) => {
              const label = healthConditionOptions.find(o => o.id === condition)?.label;
              return (
                <Badge key={condition} variant="secondary" className="flex items-center gap-1">
                  {label}
                  <button onClick={() => toggleHealthCondition(condition)} className="text-xs">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {allergies.map((allergy) => {
              const label = allergyOptions.find(o => o.id === allergy)?.label;
              return (
                <Badge key={allergy} variant="secondary" className="flex items-center gap-1">
                  No {label}
                  <button onClick={() => toggleAllergy(allergy)} className="text-xs">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {diet && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {dietOptions.find(o => o.value === diet)?.label}
                <button onClick={() => setDiet("")} className="text-xs">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button onClick={applyFilters} className="bg-health-teal hover:bg-health-teal/90">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

// Import Badge
import { Badge } from "@/components/ui/badge";
