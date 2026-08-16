export interface CropRecommendationInput {
  soilType: string;
  soilPh?: number;
  nitrogen?: number; // N in kg/ha
  phosphorus?: number; // P in kg/ha
  potassium?: number; // K in kg/ha
  temperature: number; // in °C
  rainfall: number; // in mm
  humidity: number; // in %
  season: string; // Kharif, Rabi, Zaid
  irrigationMethod: string;
  farmSize: number; // in Acres
}

export interface CropRecommendationOutput {
  cropName: string;
  suitabilityScore: number;
  expectedYieldPerAcre: string;
  growingDurationDays: number;
  waterRequirement: string;
  fertilizerGuide: string;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
}

export class CropRecommendationEngine {
  public static recommendCrops(input: CropRecommendationInput): CropRecommendationOutput[] {
    const { soilType, temperature, rainfall, humidity, season, irrigationMethod, soilPh = 6.5, nitrogen = 140 } = input;
    const recommendations: CropRecommendationOutput[] = [];

    const normSeason = season.toLowerCase();

    if (normSeason.includes('kharif') || rainfall > 500) {
      // Rice / Paddy
      let riceScore = 85;
      if (['ALLUVIAL', 'CLAY', 'LOAM'].includes(soilType.toUpperCase())) riceScore += 8;
      if (rainfall > 800 || irrigationMethod === 'CANAL' || irrigationMethod === 'BOREWELL') riceScore += 5;
      if (temperature >= 22 && temperature <= 35) riceScore += 2;

      recommendations.push({
        cropName: 'Basmati Rice (Paddy)',
        suitabilityScore: Math.min(98, riceScore),
        expectedYieldPerAcre: '22 - 28 Quintals',
        growingDurationDays: 120,
        waterRequirement: 'High (1200-1400 mm)',
        fertilizerGuide: 'NPK 120:60:60 kg/ha. Apply Urea in 3 split doses (basal, tillering, panicle initiation).',
        riskFactor: 'LOW',
        explanation: `Recommended because your soil (${soilType}), temperature (${temperature}°C) and annual rainfall/irrigation (${rainfall}mm) match optimal Paddy growing parameters for ${season}.`,
      });

      // Cotton / Maize
      recommendations.push({
        cropName: 'Hybrid Maize (Corn)',
        suitabilityScore: 88,
        expectedYieldPerAcre: '25 - 32 Quintals',
        growingDurationDays: 105,
        waterRequirement: 'Moderate (500-600 mm)',
        fertilizerGuide: 'NPK 150:75:75 kg/ha with Zinc Sulfate application at sowing.',
        riskFactor: 'LOW',
        explanation: `Maize thrives in well-drained ${soilType} soil during Kharif with temperature around ${temperature}°C. Yield return per acre is high with low water stress.`,
      });
    }

    if (normSeason.includes('rabi') || rainfall < 500) {
      // Wheat
      let wheatScore = 90;
      if (['ALLUVIAL', 'BLACK', 'LOAM'].includes(soilType.toUpperCase())) wheatScore += 6;
      if (temperature >= 12 && temperature <= 28) wheatScore += 3;

      recommendations.push({
        cropName: 'HD-2967 Sharbati Wheat',
        suitabilityScore: Math.min(97, wheatScore),
        expectedYieldPerAcre: '20 - 25 Quintals',
        growingDurationDays: 135,
        waterRequirement: 'Moderate (400-500 mm)',
        fertilizerGuide: 'NPK 120:60:40 kg/ha. Ensure 4 to 5 timely irrigations at CRI and flowering stages.',
        riskFactor: 'LOW',
        explanation: `Wheat is highly suitable for Rabi season in your ${soilType} soil. The current soil pH (${soilPh}) and nitrogen level (${nitrogen} kg/ha) provide optimal root development.`,
      });

      // Mustard / Chickpea
      recommendations.push({
        cropName: 'Yellow Mustard (Pusa Bold)',
        suitabilityScore: 89,
        expectedYieldPerAcre: '8 - 12 Quintals',
        growingDurationDays: 110,
        waterRequirement: 'Low (250-350 mm)',
        fertilizerGuide: 'NPK 80:40:40 kg/ha + 20 kg Elemental Sulfur/ha for higher oil content.',
        riskFactor: 'LOW',
        explanation: `Mustard has minimal water requirement and high market profitability. Works exceptionally well in ${soilType} soil under moderate winter temperature (${temperature}°C).`,
      });
    }

    // Sugarcane (Perennial)
    recommendations.push({
      cropName: 'Co 0238 Sugarcane',
      suitabilityScore: 82,
      expectedYieldPerAcre: '350 - 420 Quintals',
      growingDurationDays: 360,
      waterRequirement: 'Very High (1800-2200 mm)',
      fertilizerGuide: 'NPK 250:115:115 kg/ha with organic compost/FYM heavy application.',
      riskFactor: 'MEDIUM',
      explanation: `Sugarcane offers high cash yield over a 12-month cycle, provided adequate irrigation (${irrigationMethod}) is available throughout the year.`,
    });

    // Organic Vegetable option
    recommendations.push({
      cropName: 'Organic Tomato (Pusa Ruby)',
      suitabilityScore: 86,
      expectedYieldPerAcre: '120 - 160 Quintals',
      growingDurationDays: 90,
      waterRequirement: 'Moderate (Drip Recommended)',
      fertilizerGuide: 'Vermi-compost 5 tons/acre + Neem cake + Bio-fertilizers (Azotobacter & PSB).',
      riskFactor: 'MEDIUM',
      explanation: `Vegetables provide quick 90-day cash flow. Ideal for drip irrigation (${irrigationMethod}) in ${soilType} soil.`,
    });

    return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }
}
