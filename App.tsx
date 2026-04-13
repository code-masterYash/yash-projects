import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PatientInput, AnalysisResult, HeartData } from './types';
import HeartDiseaseForm from './HeartDiseaseForm';
import { DATASET } from './constants';

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: PatientInput) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Act as an expert cardiologist and machine learning model interpreter. 
        I will provide you with clinical data for a patient. 
        Analyze the heart disease risk factors based on the following feature descriptions:
        - age: Age in years
        - sex: 1 = male; 0 = female
        - cp: Chest pain type (0=Typical Angina, 1=Atypical Angina, 2=Non-anginal Pain, 3=Asymptomatic)
        - trestbps: Resting blood pressure (mmHg)
        - chol: Serum cholesterol (mg/dl)
        - fbs: Fasting blood sugar > 120 mg/dl (1=true, 0=false)
        - restecg: Resting ECG results (0=Normal, 1=ST-T abnormality, 2=LV hypertrophy)
        - thalach: Maximum heart rate achieved
        - exang: Exercise induced angina (1=yes, 0=no)
        - oldpeak: ST depression induced by exercise relative to rest
        - slope: Slope of the peak exercise ST segment (0=Upsloping, 1=Flat, 2=Downsloping)
        - ca: Number of major vessels (0-3) colored by flourosopy
        - thal: 0=Normal, 1=Fixed defect, 2=Reversable defect

        Patient Data:
        ${JSON.stringify(data, null, 2)}

        Provide a risk assessment in JSON format with risk level, probability (0-100), reasoning, recommendations, and contributing factors.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Critical'] },
              probability: { type: Type.NUMBER, description: "Percentage probability of heart disease presence (0-100)" },
              reasoning: { type: Type.STRING, description: "A concise explanation of why this risk level was assigned based on the features." },
              recommendations: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "List of 3-5 actionable medical or lifestyle recommendations." 
              },
              contributingFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of the specific input fields that contributed most to the risk."
              }
            }
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text) as AnalysisResult;
        setAnalysis(result);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to analyze data. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-2">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">CardioPredict AI</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Advanced heart disease risk assessment powered by machine learning. 
            Enter clinical parameters to receive an instant analysis.
          </p>
        </div>

        {/* Main Form */}
        <HeartDiseaseForm onSubmit={handleAnalyze} isLoading={isAnalyzing} />

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-1 h-2 w-full ${
              analysis.riskLevel === 'Critical' ? 'bg-red-600' :
              analysis.riskLevel === 'High' ? 'bg-orange-500' :
              analysis.riskLevel === 'Moderate' ? 'bg-yellow-500' :
              'bg-emerald-500'
            }`}></div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Analysis Result</h2>
                  <p className="text-slate-500 mt-1">Based on the provided clinical features</p>
                </div>
                
                <div className={`flex items-center px-5 py-2 rounded-full border ${
                  analysis.riskLevel === 'Critical' ? 'bg-red-50 border-red-200 text-red-700' :
                  analysis.riskLevel === 'High' ? 'bg-orange-50 border-orange-200 text-orange-800' :
                  analysis.riskLevel === 'Moderate' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  <span className="text-3xl font-bold mr-2">{analysis.probability}%</span>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold tracking-wide opacity-80">Risk Level</span>
                    <span className="font-bold">{analysis.riskLevel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Clinical Reasoning
                  </h3>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {analysis.reasoning}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Key Contributing Factors
                    </h3>
                    <ul className="space-y-2">
                      {analysis.contributingFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-center text-slate-700">
                          <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                          <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start text-slate-700">
                          <svg className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
