
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface NutrientInfo {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface NutritionLabelProps {
  calories: number;
  carbs: NutrientInfo;
  protein: NutrientInfo;
  fat: NutrientInfo;
  fiber: NutrientInfo;
  nutrients: NutrientInfo[];
}

export function NutritionLabel({
  calories,
  carbs,
  protein,
  fat,
  fiber,
  nutrients
}: NutritionLabelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Nutrition Facts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-b pb-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Calories</span>
            <span className="text-lg font-bold">{calories}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <NutrientRow label="Carbs" nutrient={carbs} />
          <NutrientRow label="Protein" nutrient={protein} />
          <NutrientRow label="Fat" nutrient={fat} />
          <NutrientRow label="Fiber" nutrient={fiber} />
        </div>
        
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-medium text-sm mb-2">Vitamins & Minerals</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {nutrients.slice(0, 6).map((nutrient, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{nutrient.name}</span>
                <span className="font-medium">{nutrient.percentOfDailyNeeds.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface NutrientRowProps {
  label: string;
  nutrient: NutrientInfo;
}

function NutrientRow({ label, nutrient }: NutrientRowProps) {
  const percent = nutrient.percentOfDailyNeeds;
  
  let progressColor = "bg-health-blue";
  if (percent < 10) progressColor = "bg-health-green";
  if (percent > 50) progressColor = "bg-health-teal";
  if (percent > 80) progressColor = "bg-amber-500";
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {nutrient.amount}{nutrient.unit} 
          <span className="text-muted-foreground ml-1">
            ({percent.toFixed(0)}%)
          </span>
        </span>
      </div>
      <Progress 
        value={Math.min(percent, 100)} 
        className="h-1.5"
        indicatorClassName={progressColor}
      />
    </div>
  );
}
