import { HeartDataRow } from './types';

export const parseCSV = (csvText: string): HeartDataRow[] => {
  const lines = csvText.trim().split('\n');
  // Skip header
  const dataLines = lines.slice(1);
  return dataLines.map(line => {
    const [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, target] = line.split(',').map(Number);
    return {
      age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal, target
    };
  });
};

export const getAverageMetrics = (data: HeartDataRow[], target: number) => {
  const filtered = data.filter(d => d.target === target);
  if (filtered.length === 0) return { age: 0, chol: 0, thalach: 0, trestbps: 0 };
  
  const sum = filtered.reduce((acc, curr) => ({
    age: acc.age + curr.age,
    chol: acc.chol + curr.chol,
    thalach: acc.thalach + curr.thalach,
    trestbps: acc.trestbps + curr.trestbps
  }), { age: 0, chol: 0, thalach: 0, trestbps: 0 });

  return {
    age: Math.round(sum.age / filtered.length),
    chol: Math.round(sum.chol / filtered.length),
    thalach: Math.round(sum.thalach / filtered.length),
    trestbps: Math.round(sum.trestbps / filtered.length)
  };
};
