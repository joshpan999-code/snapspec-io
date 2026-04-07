'use client';

import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { RadarChartData } from '@/types';

interface Props {
  data: RadarChartData[];
  title?: string;
}

export function RadarChartWidget({ data, title }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="parameter" 
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#888', fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      
      {/* Status Legend */}
      <div className="flex justify-center gap-4 mt-4">
        {data.map(item => (
          <div key={item.parameter} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              item.status === 'safe' ? 'bg-green-500' :
              item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-muted-foreground">{item.parameter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
