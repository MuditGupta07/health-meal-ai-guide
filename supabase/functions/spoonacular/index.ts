
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SPOONACULAR_API_KEY = Deno.env.get('SPOONACULAR_API_KEY');
    if (!SPOONACULAR_API_KEY) {
      throw new Error('SPOONACULAR_API_KEY is not set');
    }

    // Parse request body
    const requestData = await req.json().catch(() => ({}));
    const endpoint = requestData.endpoint;

    console.log(`Processing request for endpoint: ${endpoint}`, requestData);

    if (!endpoint) {
      throw new Error('Endpoint parameter is required');
    }

    let apiUrl;
    let queryParams = new URLSearchParams();
    queryParams.append('apiKey', SPOONACULAR_API_KEY);

    // Configure the appropriate Spoonacular API endpoint based on the request
    switch (endpoint) {
      case 'search':
        apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
        
        if (requestData.query) queryParams.append('query', requestData.query);
        if (requestData.diet) queryParams.append('diet', requestData.diet);
        if (requestData.intolerances && requestData.intolerances.length > 0) {
          queryParams.append('intolerances', requestData.intolerances.join(','));
        }
        if (requestData.maxReadyTime) queryParams.append('maxReadyTime', requestData.maxReadyTime);
        
        // Add health filters if any
        if (requestData.healthConditions && requestData.healthConditions.length > 0) {
          // Map health conditions to appropriate Spoonacular parameters
          const conditions = requestData.healthConditions;
          
          if (conditions.includes('diabetes')) {
            queryParams.append('maxSugar', '10');
            if (!queryParams.has('diet')) queryParams.append('diet', 'low-carb');
          }
          
          if (conditions.includes('heart-disease') || conditions.includes('hypertension')) {
            queryParams.append('maxSodium', '500');
          }
          
          if (conditions.includes('cholesterol')) {
            queryParams.append('maxCholesterol', '50');
            queryParams.append('maxSaturatedFat', '8');
          }
        }
        
        queryParams.append('addRecipeNutrition', 'true');
        queryParams.append('number', '10');
        break;
        
      case 'recipe':
        if (!requestData.id) throw new Error('Recipe ID is required');
        apiUrl = `https://api.spoonacular.com/recipes/${requestData.id}/information`;
        queryParams.append('includeNutrition', 'true');
        break;
        
      case 'generate':
        apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
        
        // Process AI-generated recipe requirements
        if (requestData.ingredients && requestData.ingredients.length > 0) {
          queryParams.append('includeIngredients', requestData.ingredients.join(','));
        }
        
        if (requestData.mealType) queryParams.append('type', requestData.mealType);
        if (requestData.diet) queryParams.append('diet', requestData.diet);
        if (requestData.intolerances) queryParams.append('intolerances', requestData.intolerances.join(','));
        
        queryParams.append('addRecipeNutrition', 'true');
        queryParams.append('number', '3');
        queryParams.append('sort', 'random');
        break;
        
      default:
        throw new Error(`Invalid endpoint: ${endpoint}`);
    }

    console.log(`Calling Spoonacular API: ${apiUrl}?${queryParams.toString()}`);

    // Make request to Spoonacular API
    const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spoonacular API error: ${response.status} - ${errorText}`);
      throw new Error(`Spoonacular API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Received response from Spoonacular:", JSON.stringify(data).substring(0, 200) + "...");

    // Store AI-generated recipes in database if it's a generation request
    if (endpoint === 'generate' && requestData.userId) {
      try {
        await supabaseClient
          .from('recipe_generations')
          .insert({
            user_id: requestData.userId,
            prompt: JSON.stringify({
              ingredients: requestData.ingredients,
              mealType: requestData.mealType,
              diet: requestData.diet,
              intolerances: requestData.intolerances
            }),
            result: data,
            ai_model: 'spoonacular'
          });
      } catch (dbError) {
        console.error("Error storing recipe generation:", dbError);
        // Continue even if database storage fails
      }
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in spoonacular function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
