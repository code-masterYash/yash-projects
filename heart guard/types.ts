
// Data shape from the CSV
export interface HeartDataRow {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
  target: number;
}

// User input shape
export interface PatientData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number; // Resting Blood Pressure
  chol: number;     // Cholesterol
  fbs: number;      // Fasting Blood Sugar > 120
  restecg: number;
  thalach: number;  // Max Heart Rate
  exang: number;    // Exercise Induced Angina
  oldpeak: number;  // ST depression
  slope: number;
  ca: number;       // Number of major vessels
  thal: number;
}

export interface KeyFactor {
  factor: string;
  influence: number; // 1-10 scale
}

// Prediction result from Gemini
export interface PredictionResponse {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  probability: number; // 0-100
  explanation: string;
  recommendations: string[];
  keyFactors: KeyFactor[];
}
