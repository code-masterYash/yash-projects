export enum Sex {
  Female = 0,
  Male = 1,
}

export enum ChestPainType {
  TypicalAngina = 0,
  AtypicalAngina = 1,
  NonAnginalPain = 2,
  Asymptomatic = 3,
}

export interface HeartData {
  age: number;
  sex: number;
  cp: number; // Chest Pain Type
  trestbps: number; // Resting Blood Pressure
  chol: number; // Serum Cholesterol
  fbs: number; // Fasting Blood Sugar > 120 mg/dl (1 = true; 0 = false)
  restecg: number; // Resting ECG results
  thalach: number; // Max heart rate achieved
  exang: number; // Exercise induced angina (1 = yes; 0 = no)
  oldpeak: number; // ST depression induced by exercise
  slope: number; // Slope of peak exercise ST segment
  ca: number; // Number of major vessels (0-3) colored by flourosopy
  thal: number; // 0 = normal; 1 = fixed defect; 2 = reversable defect
  target?: number; // 0 = no disease, 1 = disease (Optional for input)
}

export type PatientInput = Omit<HeartData, 'target'>;

export interface AnalysisResult {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  probability: number;
  reasoning: string;
  recommendations: string[];
  contributingFactors: string[];
}
