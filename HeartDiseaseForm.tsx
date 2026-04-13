import React, { useState } from 'react';
import { PatientInput } from './types';
import { 
  SEX_OPTIONS, 
  CP_OPTIONS, 
  FBS_OPTIONS, 
  RESTECG_OPTIONS, 
  EXANG_OPTIONS, 
  SLOPE_OPTIONS, 
  THAL_OPTIONS 
} from './constants';

interface HeartDiseaseFormProps {
  onSubmit: (data: PatientInput) => void;
  isLoading: boolean;
}

const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

const Select = ({ value, onChange, options, disabled }: any) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
  >
    {options.map((opt: any) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const NumberInput = ({ value, onChange, min, max, step, disabled, placeholder }: any) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    step={step}
    disabled={disabled}
    placeholder={placeholder}
    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
  />
);

export default function HeartDiseaseForm({ onSubmit, isLoading }: HeartDiseaseFormProps) {
  const [formData, setFormData] = useState<PatientInput>({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2,
  });

  const handleChange = (field: keyof PatientInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-900">Patient Clinical Data</h2>
        <p className="text-sm text-slate-500 mt-1">Enter the patient's physiological parameters for assessment.</p>
      </div>
      
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Demographics */}
        <div className="space-y-4 md:col-span-2 lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Demographics & Vitals</h3>
        </div>

        <InputGroup label="Age (years)">
          <NumberInput 
            value={formData.age} 
            onChange={(e: any) => handleChange('age', e.target.value)} 
            min="1" max="120" 
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Sex">
          <Select 
            value={formData.sex} 
            onChange={(e: any) => handleChange('sex', e.target.value)} 
            options={SEX_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Resting Blood Pressure (mmHg)">
          <NumberInput 
            value={formData.trestbps} 
            onChange={(e: any) => handleChange('trestbps', e.target.value)} 
            min="50" max="250" 
            placeholder="94-200"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Serum Cholesterol (mg/dl)">
          <NumberInput 
            value={formData.chol} 
            onChange={(e: any) => handleChange('chol', e.target.value)} 
            min="100" max="600"
            placeholder="126-564" 
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Fasting Blood Sugar > 120 mg/dl">
          <Select 
            value={formData.fbs} 
            onChange={(e: any) => handleChange('fbs', e.target.value)} 
            options={FBS_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>

        {/* Cardiac Metrics */}
        <div className="space-y-4 md:col-span-2 lg:col-span-3 mt-2">
           <div className="border-t border-slate-100 my-2"></div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cardiac Test Results</h3>
        </div>

        <InputGroup label="Chest Pain Type">
          <Select 
            value={formData.cp} 
            onChange={(e: any) => handleChange('cp', e.target.value)} 
            options={CP_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Resting ECG Results">
          <Select 
            value={formData.restecg} 
            onChange={(e: any) => handleChange('restecg', e.target.value)} 
            options={RESTECG_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Max Heart Rate (thalach)">
          <NumberInput 
            value={formData.thalach} 
            onChange={(e: any) => handleChange('thalach', e.target.value)} 
            min="50" max="250"
            placeholder="71-202"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Exercise Induced Angina">
          <Select 
            value={formData.exang} 
            onChange={(e: any) => handleChange('exang', e.target.value)} 
            options={EXANG_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="ST Depression (Oldpeak)">
          <NumberInput 
            value={formData.oldpeak} 
            onChange={(e: any) => handleChange('oldpeak', e.target.value)} 
            min="0" max="10" step="0.1"
            placeholder="0.0-6.2"
            disabled={isLoading}
          />
        </InputGroup>

         <InputGroup label="Slope of Peak Exercise ST">
          <Select 
            value={formData.slope} 
            onChange={(e: any) => handleChange('slope', e.target.value)} 
            options={SLOPE_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Major Vessels (ca) (0-3)">
           <NumberInput 
            value={formData.ca} 
            onChange={(e: any) => handleChange('ca', e.target.value)} 
            min="0" max="3" step="1"
            disabled={isLoading}
          />
        </InputGroup>

        <InputGroup label="Thalassemia (thal)">
          <Select 
            value={formData.thal} 
            onChange={(e: any) => handleChange('thal', e.target.value)} 
            options={THAL_OPTIONS}
            disabled={isLoading}
          />
        </InputGroup>
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <>
              <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Risk Factors'
          )}
        </button>
      </div>
    </form>
  );
}
