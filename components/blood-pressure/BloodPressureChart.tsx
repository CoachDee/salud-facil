
import React, { useState } from 'react';
import { BloodPressureReading } from '../../types';
import { useTranslation, useLanguage } from '../../context/LanguageContext';

interface BloodPressureChartProps {
  readings: BloodPressureReading[];
}

const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ readings }) => {
    const t = useTranslation();
    const { language } = useLanguage();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (readings.length < 2) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
                <p className="text-center text-gray-600 mt-4">{t('needMoreReadings')}</p>
            </div>
        );
    }

    const sortedReadings = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const allValues = sortedReadings.flatMap(r => [r.systolic, r.diastolic, r.pulse]);
    const minY = Math.min(...allValues) - 15;
    const maxY = Math.max(...allValues) + 15;

    const chartHeight = 220;
    const chartWidth = 500; // Increased width for better spacing
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };

    const effectiveChartWidth = chartWidth - padding.left - padding.right;
    const effectiveChartHeight = chartHeight - padding.top - padding.bottom;

    const getX = (index: number) => padding.left + (index / (sortedReadings.length - 1)) * effectiveChartWidth;
    const getY = (value: number) => chartHeight - padding.bottom - ((value - minY) / (maxY - minY)) * effectiveChartHeight;

    const generatePath = (dataKey: keyof BloodPressureReading) => sortedReadings.map((r, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(r[dataKey] as number)}`).join(' ');

    const hoveredData = hoveredIndex !== null ? sortedReadings[hoveredIndex] : null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6 overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('bloodPressureChart')}</h3>
            <div className="flex justify-center items-center relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                         <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* Y-Axis Grid Lines & Labels */}
                    {[...Array(6)].map((_, i) => {
                        const value = Math.round(minY + (i / 5) * (maxY - minY));
                        const yPos = getY(value);
                        return (
                            <g key={`y-grid-${i}`} className="text-gray-400">
                                <line x1={padding.left} y1={yPos} x2={chartWidth - padding.right} y2={yPos} stroke="currentColor" strokeDasharray="2,3" strokeOpacity={0.5} />
                                <text x={padding.left - 8} y={yPos + 4} textAnchor="end" fontSize="10" fill="currentColor">{value}</text>
                            </g>
                        );
                    })}

                    {/* X-Axis Labels */}
                    {sortedReadings.map((r, i) => (
                        <text key={`x-label-${i}`} x={getX(i)} y={chartHeight - padding.bottom + 15} textAnchor="middle" fontSize="10" fill="#666">
                           {new Date(r.date).toLocaleDateString(language, { month: 'numeric', day: 'numeric' })}
                        </text>
                    ))}

                    {/* Area Fills */}
                    <path d={`${generatePath('systolic')} L ${getX(sortedReadings.length - 1)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`} fill="url(#systolicGradient)" />
                    <path d={`${generatePath('diastolic')} L ${getX(sortedReadings.length - 1)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`} fill="url(#diastolicGradient)" />
                    
                    {/* Data Lines */}
                    <path d={generatePath('systolic')} fill="none" stroke="#ef4444" strokeWidth="2" />
                    <path d={generatePath('diastolic')} fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <path d={generatePath('pulse')} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Data Points & Hover Area*/}
                    {sortedReadings.map((r, i) => (
                        <g key={`point-group-${i}`}>
                             <rect x={getX(i) - 10} y={padding.top} width="20" height={effectiveChartHeight} fill="transparent" onMouseOver={() => setHoveredIndex(i)} onMouseOut={() => setHoveredIndex(null)} />
                            <circle cx={getX(i)} cy={getY(r.systolic)} r="3" fill="#ef4444" className="pointer-events-none" />
                            <circle cx={getX(i)} cy={getY(r.diastolic)} r="3" fill="#3b82f6" className="pointer-events-none" />
                            <circle cx={getX(i)} cy={getY(r.pulse)} r="3" fill="#22c55e" className="pointer-events-none" />
                        </g>
                    ))}
                    
                    {/* Tooltip */}
                    {hoveredData && hoveredIndex !== null && (
                        <g transform={`translate(${getX(hoveredIndex)}, ${getY(hoveredData.systolic) - 10})`} className="pointer-events-none">
                            <rect x={-55} y={-60} width={110} height={55} rx="4" fill="rgba(0,0,0,0.7)" />
                            <text x="0" y="-45" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                                {new Date(hoveredData.date).toLocaleDateString(language, { month: 'short', day: 'numeric' })}
                            </text>
                             <text x="-50" y="-28" fill="#ef4444" fontSize="10">{t('systolicShort')}:</text>
                             <text x="50" y="-28" textAnchor="end" fill="white" fontSize="10">{hoveredData.systolic}</text>
                             <text x="-50" y="-16" fill="#3b82f6" fontSize="10">{t('diastolicShort')}:</text>
                             <text x="50" y="-16" textAnchor="end" fill="white" fontSize="10">{hoveredData.diastolic}</text>
                             <text x="-50" y="-4" fill="#22c55e" fontSize="10">{t('pulseShort')}:</text>
                             <text x="50" y="-4" textAnchor="end" fill="white" fontSize="10">{hoveredData.pulse}</text>
                        </g>
                    )}
                </svg>
            </div>
             {/* Legend */}
            <div className="flex justify-center items-center space-x-4 mt-2 text-xs text-gray-600">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>{t('systolicShort')}</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>{t('diastolicShort')}</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>{t('pulseShort')}</div>
            </div>
        </div>
    );
};

export default BloodPressureChart;
