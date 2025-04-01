
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const healthProfileSchema = z.object({
  age: z.string().min(1, { message: "Age is required" }),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    required_error: "Please select a gender",
  }),
  height: z.string().min(1, { message: "Height is required" }),
  weight: z.string().min(1, { message: "Weight is required" }),
  activityLevel: z.enum(["sedentary", "lightly-active", "moderately-active", "very-active", "extremely-active"], {
    required_error: "Please select an activity level",
  }),
  healthConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  dietaryPreferences: z.enum(["omnivore", "vegetarian", "vegan", "pescatarian", "other"], {
    required_error: "Please select a dietary preference",
  }),
  otherDietaryInfo: z.string().optional(),
  medications: z.string().optional(),
});

type HealthProfileFormValues = z.infer<typeof healthProfileSchema>;

const defaultValues: Partial<HealthProfileFormValues> = {
  activityLevel: "moderately-active",
  dietaryPreferences: "omnivore",
  healthConditions: [],
  allergies: [],
};

interface HealthProfileFormProps {
  existingData?: Partial<HealthProfileFormValues>;
  onSave: (data: HealthProfileFormValues) => void;
}

export function HealthProfileForm({ existingData, onSave }: HealthProfileFormProps) {
  const form = useForm<HealthProfileFormValues>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: { ...defaultValues, ...existingData },
  });
  
  const healthConditionsOptions = [
    { id: "diabetes", label: "Diabetes" },
    { id: "heart-disease", label: "Heart Disease" },
    { id: "hypertension", label: "Hypertension" },
    { id: "pcos", label: "PCOS" },
    { id: "cholesterol", label: "High Cholesterol" },
    { id: "thyroid", label: "Thyroid Issues" },
    { id: "ibs", label: "IBS" },
  ];
  
  const allergyOptions = [
    { id: "dairy", label: "Dairy" },
    { id: "gluten", label: "Gluten" },
    { id: "nuts", label: "Nuts" },
    { id: "eggs", label: "Eggs" },
    { id: "soy", label: "Soy" },
    { id: "shellfish", label: "Shellfish" },
  ];
  
  const activityLevelDescriptions: Record<string, string> = {
    "sedentary": "Little to no exercise",
    "lightly-active": "Light exercise 1-3 days/week",
    "moderately-active": "Moderate exercise 3-5 days/week",
    "very-active": "Hard exercise 6-7 days/week",
    "extremely-active": "Very hard exercise & physical job or training twice a day",
  };
  
  const onSubmit = (data: HealthProfileFormValues) => {
    onSave(data);
    toast.success("Health profile saved successfully!");
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your height" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter your weight" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="activityLevel"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Activity Level</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {["sedentary", "lightly-active", "moderately-active", "very-active", "extremely-active"].map((level) => (
                    <FormItem key={level} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={level} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <span className="font-medium">
                          {level.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {activityLevelDescriptions[level]}
                        </span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="healthConditions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Health Conditions</FormLabel>
                <FormDescription>
                  Select any health conditions you have been diagnosed with
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {healthConditionsOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="healthConditions"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="allergies"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Allergies & Intolerances</FormLabel>
                <FormDescription>
                  Select any allergies or food intolerances you have
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="allergies"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dietaryPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preferences</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dietary preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="omnivore">Omnivore (Eat Everything)</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch("dietaryPreferences") === "other" && (
          <FormField
            control={form.control}
            name="otherDietaryInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Dietary Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide details about your dietary preferences"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Medications (Optional)</FormLabel>
              <FormDescription>
                List any medications that might interact with certain foods
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="E.g., Blood thinners, insulin, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-health-teal hover:bg-health-teal/90"
        >
          Save Health Profile
        </Button>
      </form>
    </Form>
  );
}
