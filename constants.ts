import { HeartData } from './types';

// A representative subset of the provided dataset for visualization purposes.
export const DATASET: HeartData[] = [
  {age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 1, target: 1},
  {age: 37, sex: 1, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 2, target: 1},
  {age: 41, sex: 0, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 2, target: 1},
  {age: 56, sex: 1, cp: 1, trestbps: 120, chol: 236, fbs: 0, restecg: 1, thalach: 178, exang: 0, oldpeak: 0.8, slope: 2, ca: 0, thal: 2, target: 1},
  {age: 57, sex: 0, cp: 0, trestbps: 120, chol: 354, fbs: 0, restecg: 1, thalach: 163, exang: 1, oldpeak: 0.6, slope: 2, ca: 0, thal: 2, target: 1},
  {age: 57, sex: 1, cp: 0, trestbps: 140, chol: 192, fbs: 0, restecg: 1, thalach: 148, exang: 0, oldpeak: 0.4, slope: 1, ca: 0, thal: 1, target: 1},
  {age: 56, sex: 0, cp: 1, trestbps: 140, chol: 294, fbs: 0, restecg: 0, thalach: 153, exang: 0, oldpeak: 1.3, slope: 1, ca: 0, thal: 2, target: 1},
  {age: 44, sex: 1, cp: 1, trestbps: 120, chol: 263, fbs: 0, restecg: 1, thalach: 173, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 1},
  {age: 52, sex: 1, cp: 2, trestbps: 172, chol: 199, fbs: 1, restecg: 1, thalach: 162, exang: 0, oldpeak: 0.5, slope: 2, ca: 0, thal: 3, target: 1},
];

export const SEX_OPTIONS = [
  { value: 1, label: 'Male' },
  { value: 0, label: 'Female' },
];

export const CP_OPTIONS = [
  { value: 0, label: 'Typical Angina' },
  { value: 1, label: 'Atypical Angina' },
  { value: 2, label: 'Non-anginal Pain' },
  { value: 3, label: 'Asymptomatic' },
];

export const FBS_OPTIONS = [
  { value: 0, label: 'False (< 120 mg/dl)' },
  { value: 1, label: 'True (> 120 mg/dl)' },
];

export const RESTECG_OPTIONS = [
  { value: 0, label: 'Normal' },
  { value: 1, label: 'ST-T Wave Abnormality' },
  { value: 2, label: 'Left Ventricular Hypertrophy' },
];

export const EXANG_OPTIONS = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Yes' },
];

export const SLOPE_OPTIONS = [
  { value: 0, label: 'Upsloping' },
  { value: 1, label: 'Flat' },
  { value: 2, label: 'Downsloping' },
];

export const THAL_OPTIONS = [
  { value: 0, label: 'Normal' },
  { value: 1, label: 'Fixed Defect' },
  { value: 2, label: 'Reversable Defect' },
  { value: 3, label: 'Other/Unknown' },
];
