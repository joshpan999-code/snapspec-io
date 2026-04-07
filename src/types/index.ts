// SnapSpec.io Type Definitions

export interface VESCParameter {
  name: string;
  value: number;
  unit: string;
  min?: number;
  max?: number;
  category: string;
  description?: string;
}

export interface VESCConfiguration {
  firmwareVersion: string;
  hardwareType: string;
  parameters: VESCParameter[];
  metadata: {
    parsedAt: Date;
    source: 'xml' | 'pdf' | 'manual';
    fileName?: string;
  };
}

export interface ValidationResult {
  parameter: string;
  passed: boolean;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface FirstPrinciplesRule {
  id: string;
  name: string;
  category: string;
  description: string;
  equation: string;
  inputs: string[];
  output: string;
  validate: (params: Record<string, number>) => ValidationResult;
}

export interface RadarChartData {
  parameter: string;
  value: number;
  fullMark: number;
  status: 'safe' | 'warning' | 'danger';
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  config: VESCConfiguration;
  validationResults: ValidationResult[];
  createdAt: Date;
  updatedAt: Date;
}
