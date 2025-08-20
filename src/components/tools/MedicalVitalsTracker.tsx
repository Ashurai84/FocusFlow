import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Droplets, Wind, Clock, TrendingUp, AlertTriangle, Save, Download } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { analyticsService } from '../../services/analytics';
import { useAuthStore } from '../../store/auth';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VitalSigns {
  id: string;
  timestamp: Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  notes?: string;
}

interface VitalRanges {
  systolic: { min: number; max: number; critical: { min: number; max: number } };
  diastolic: { min: number; max: number; critical: { min: number; max: number } };
  heartRate: { min: number; max: number; critical: { min: number; max: number } };
  temperature: { min: number; max: number; critical: { min: number; max: number } };
  respiratoryRate: { min: number; max: number; critical: { min: number; max: number } };
  oxygenSaturation: { min: number; max: number; critical: { min: number; max: number } };
}

export function MedicalVitalsTracker() {
  const [vitals, setVitals] = useState<VitalSigns[]>([]);
  const [currentVitals, setCurrentVitals] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    notes: ''
  });
  const [selectedPatient, setSelectedPatient] = useState('Patient 1');
  const [viewMode, setViewMode] = useState<'input' | 'trends' | 'analysis'>('input');
  const { user } = useAuthStore();

  // Normal ranges for adults
  const normalRanges: VitalRanges = {
    systolic: { min: 90, max: 120, critical: { min: 70, max: 180 } },
    diastolic: { min: 60, max: 80, critical: { min: 40, max: 120 } },
    heartRate: { min: 60, max: 100, critical: { min: 40, max: 150 } },
    temperature: { min: 36.1, max: 37.2, critical: { min: 35, max: 40 } },
    respiratoryRate: { min: 12, max: 20, critical: { min: 8, max: 30 } },
    oxygenSaturation: { min: 95, max: 100, critical: { min: 85, max: 100 } }
  };

  useEffect(() => {
    // Load vitals from localStorage
    const savedVitals = localStorage.getItem(`vitals-${selectedPatient}`);
    if (savedVitals) {
      setVitals(JSON.parse(savedVitals).map((v: any) => ({
        ...v,
        timestamp: new Date(v.timestamp)
      })));
    }
  }, [selectedPatient]);

  useEffect(() => {
    // Save vitals to localStorage
    localStorage.setItem(`vitals-${selectedPatient}`, JSON.stringify(vitals));
  }, [vitals, selectedPatient]);

  const handleInputChange = (field: string, value: string) => {
    setCurrentVitals(prev => ({ ...prev, [field]: value }));
  };

  const addVitalSigns = () => {
    const { systolic, diastolic, heartRate, temperature, respiratoryRate, oxygenSaturation, notes } = currentVitals;
    
    // Validation
    if (!systolic || !diastolic || !heartRate || !temperature || !respiratoryRate || !oxygenSaturation) {
      toast.error('Please fill in all vital signs');
      return;
    }

    const newVitals: VitalSigns = {
      id: Date.now().toString(),
      timestamp: new Date(),
      systolic: parseFloat(systolic),
      diastolic: parseFloat(diastolic),
      heartRate: parseFloat(heartRate),
      temperature: parseFloat(temperature),
      respiratoryRate: parseFloat(respiratoryRate),
      oxygenSaturation: parseFloat(oxygenSaturation),
      notes: notes || undefined
    };

    setVitals(prev => [newVitals, ...prev]);
    setCurrentVitals({
      systolic: '',
      diastolic: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      notes: ''
    });

    // Check for critical values
    checkCriticalValues(newVitals);

    // Log tool usage
    if (user) {
      analyticsService.logToolUsage(
        user.id,
        'Vital Signs Tracker',
        'Medical',
        2,
        { patient: selectedPatient, vitals: newVitals }
      );
    }

    toast.success('Vital signs recorded successfully');
  };

  const checkCriticalValues = (vitals: VitalSigns) => {
    const alerts: string[] = [];

    if (vitals.systolic < normalRanges.systolic.critical.min || vitals.systolic > normalRanges.systolic.critical.max) {
      alerts.push(`Critical systolic BP: ${vitals.systolic} mmHg`);
    }
    if (vitals.diastolic < normalRanges.diastolic.critical.min || vitals.diastolic > normalRanges.diastolic.critical.max) {
      alerts.push(`Critical diastolic BP: ${vitals.diastolic} mmHg`);
    }
    if (vitals.heartRate < normalRanges.heartRate.critical.min || vitals.heartRate > normalRanges.heartRate.critical.max) {
      alerts.push(`Critical heart rate: ${vitals.heartRate} bpm`);
    }
    if (vitals.temperature < normalRanges.temperature.critical.min || vitals.temperature > normalRanges.temperature.critical.max) {
      alerts.push(`Critical temperature: ${vitals.temperature}°C`);
    }
    if (vitals.oxygenSaturation < normalRanges.oxygenSaturation.critical.min) {
      alerts.push(`Critical oxygen saturation: ${vitals.oxygenSaturation}%`);
    }

    if (alerts.length > 0) {
      toast.error(`⚠️ CRITICAL VALUES DETECTED:\n${alerts.join('\n')}`, {
        duration: 10000,
      });
    }
  };

  const getVitalStatus = (value: number, ranges: { min: number; max: number; critical: { min: number; max: number } }) => {
    if (value < ranges.critical.min || value > ranges.critical.max) {
      return { status: 'critical', color: 'text-red-500', bg: 'bg-red-100' };
    }
    if (value < ranges.min || value > ranges.max) {
      return { status: 'abnormal', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    }
    return { status: 'normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const exportData = () => {
    const dataStr = JSON.stringify(vitals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vitals-${selectedPatient}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Data exported successfully');
  };

  const getChartData = (vitalType: keyof Omit<VitalSigns, 'id' | 'timestamp' | 'notes'>) => {
    const last24Hours = vitals
      .filter(v => new Date().getTime() - v.timestamp.getTime() < 24 * 60 * 60 * 1000)
      .reverse();

    return {
      labels: last24Hours.map(v => v.timestamp.toLocaleTimeString()),
      datasets: [
        {
          label: getVitalLabel(vitalType),
          data: last24Hours.map(v => v[vitalType]),
          borderColor: getVitalColor(vitalType),
          backgroundColor: getVitalColor(vitalType) + '20',
          tension: 0.4,
        },
      ],
    };
  };

  const getVitalLabel = (vitalType: string) => {
    const labels = {
      systolic: 'Systolic BP (mmHg)',
      diastolic: 'Diastolic BP (mmHg)',
      heartRate: 'Heart Rate (bpm)',
      temperature: 'Temperature (°C)',
      respiratoryRate: 'Respiratory Rate (breaths/min)',
      oxygenSaturation: 'Oxygen Saturation (%)'
    };
    return labels[vitalType as keyof typeof labels] || vitalType;
  };

  const getVitalColor = (vitalType: string) => {
    const colors = {
      systolic: '#ef4444',
      diastolic: '#f97316',
      heartRate: '#ec4899',
      temperature: '#8b5cf6',
      respiratoryRate: '#06b6d4',
      oxygenSaturation: '#10b981'
    };
    return colors[vitalType as keyof typeof colors] || '#6b7280';
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vital Signs Trends (Last 24 Hours)',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="text-red-500 mr-3" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vital Signs Tracker</h2>
            <p className="text-gray-600">Monitor and track patient vital signs</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Patient Selector */}
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Patient 1">Patient 1</option>
            <option value="Patient 2">Patient 2</option>
            <option value="Patient 3">Patient 3</option>
          </select>
          
          {/* View Mode */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: 'input', label: 'Input', icon: Heart },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'analysis', label: 'Analysis', icon: Activity }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon size={16} className="mr-1" />
                {label}
              </button>
            ))}
          </div>
          
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Input Mode */}
      {viewMode === 'input' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Heart className="mr-2 text-red-500" size={20} />
              Record Vital Signs
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Blood Pressure */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Systolic"
                    value={currentVitals.systolic}
                    onChange={(e) => handleInputChange('systolic', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="flex items-center text-gray-500">/</span>
                  <input
                    type="number"
                    placeholder="Diastolic"
                    value={currentVitals.diastolic}
                    onChange={(e) => handleInputChange('diastolic', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  placeholder="60-100"
                  value={currentVitals.heartRate}
                  onChange={(e) => handleInputChange('heartRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="36.5"
                  value={currentVitals.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Respiratory Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  placeholder="12-20"
                  value={currentVitals.respiratoryRate}
                  onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Oxygen Saturation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="number"
                  placeholder="95-100"
                  value={currentVitals.oxygenSaturation}
                  onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  placeholder="Additional observations..."
                  value={currentVitals.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={addVitalSigns}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save size={20} className="mr-2" />
              Record Vital Signs
            </button>
          </div>

          {/* Recent Readings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2 text-blue-500" size={20} />
              Recent Readings
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {vitals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No vital signs recorded yet</p>
              ) : (
                vitals.slice(0, 10).map((vital) => (
                  <div key={vital.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {vital.timestamp.toLocaleString()}
                      </span>
                      {(vital.systolic < normalRanges.systolic.critical.min || 
                        vital.systolic > normalRanges.systolic.critical.max ||
                        vital.heartRate < normalRanges.heartRate.critical.min ||
                        vital.heartRate > normalRanges.heartRate.critical.max) && (
                        <AlertTriangle className="text-red-500" size={16} />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className={`p-2 rounded ${getVitalStatus(vital.systolic, normalRanges.systolic).bg}`}>
                        <div className="font-medium">BP</div>
                        <div className={getVitalStatus(vital.systolic, normalRanges.systolic).color}>
                          {vital.systolic}/{vital.diastolic}
                        </div>
                      </div>
                      <div className={`p-2 rounded ${getVitalStatus(vital.heartRate, normalRanges.heartRate).bg}`}>
                        <div className="font-medium">HR</div>
                        <div className={getVitalStatus(vital.heartRate, normalRanges.heartRate).color}>
                          {vital.heartRate} bpm
                        </div>
                      </div>
                      <div className={`p-2 rounded ${getVitalStatus(vital.temperature, normalRanges.temperature).bg}`}>
                        <div className="font-medium">Temp</div>
                        <div className={getVitalStatus(vital.temperature, normalRanges.temperature).color}>
                          {vital.temperature}°C
                        </div>
                      </div>
                    </div>
                    
                    {vital.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        {vital.notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trends Mode */}
      {viewMode === 'trends' && (
        <div className="space-y-6">
          {vitals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available for trends</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(['systolic', 'heartRate', 'temperature', 'oxygenSaturation'] as const).map((vitalType) => (
                <div key={vitalType} className="bg-gray-50 rounded-lg p-4">
                  <Line data={getChartData(vitalType)} options={chartOptions} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analysis Mode */}
      {viewMode === 'analysis' && (
        <div className="space-y-6">
          {vitals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available for analysis</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Summary Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Readings:</span>
                    <span className="font-semibold">{vitals.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Latest Reading:</span>
                    <span className="font-semibold">
                      {vitals[0]?.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Avg Heart Rate:</span>
                    <span className="font-semibold">
                      {Math.round(vitals.reduce((sum, v) => sum + v.heartRate, 0) / vitals.length)} bpm
                    </span>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Critical Alerts</h3>
                <div className="space-y-2">
                  {vitals.slice(0, 5).map((vital) => {
                    const alerts = [];
                    if (vital.systolic > normalRanges.systolic.critical.max) {
                      alerts.push('High BP');
                    }
                    if (vital.heartRate > normalRanges.heartRate.critical.max) {
                      alerts.push('High HR');
                    }
                    if (vital.oxygenSaturation < normalRanges.oxygenSaturation.critical.min) {
                      alerts.push('Low O2');
                    }
                    
                    return alerts.length > 0 ? (
                      <div key={vital.id} className="text-sm">
                        <span className="text-red-700 font-medium">
                          {vital.timestamp.toLocaleTimeString()}:
                        </span>
                        <span className="text-red-600 ml-2">
                          {alerts.join(', ')}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Normal Ranges Reference */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Normal Ranges</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Systolic BP:</span>
                    <span>90-120 mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Diastolic BP:</span>
                    <span>60-80 mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Heart Rate:</span>
                    <span>60-100 bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Temperature:</span>
                    <span>36.1-37.2°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Respiratory:</span>
                    <span>12-20 /min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">O2 Saturation:</span>
                    <span>95-100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}