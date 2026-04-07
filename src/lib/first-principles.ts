// First Principles Rules Engine for VESC Configuration Validation
// Based on fundamental physics and electrical engineering principles

import { VESCConfiguration, ValidationResult, FirstPrinciplesRule, RadarChartData } from '@/types';

/**
 * Core First Principles Rules
 */
export const firstPrinciplesRules: FirstPrinciplesRule[] = [
  {
    id: 'fp-001',
    name: 'Motor Current vs Battery Current',
    category: 'Power',
    description: 'Motor current should not exceed battery current rating for safe operation',
    equation: 'I_motor ≤ I_battery_max',
    inputs: ['motor_current_max', 'battery_current_max'],
    output: 'current_safety',
    validate: (params) => {
      const motorCurrent = params.motor_current_max || 0;
      const batteryCurrent = params.battery_current_max || 0;
      const ratio = batteryCurrent > 0 ? motorCurrent / batteryCurrent : 0;
      
      return {
        parameter: 'Motor Current',
        passed: ratio <= 1.5,
        rule: 'fp-001',
        message: ratio <= 1.5 
          ? `Motor current ratio (${ratio.toFixed(2)}) is within safe limits`
          : `Motor current exceeds safe ratio (${ratio.toFixed(2)}x battery rating)`,
        severity: ratio > 2 ? 'error' : ratio > 1.5 ? 'warning' : 'info',
        suggestion: ratio > 1.5 ? 'Consider reducing motor current max or upgrading battery' : undefined,
      };
    },
  },
  {
    id: 'fp-002',
    name: 'KV Rating vs Voltage',
    category: 'Motor',
    description: 'Motor KV and voltage determine max RPM - must not exceed mechanical limits',
    equation: 'RPM_max = KV × V_battery',
    inputs: ['motor_kv', 'battery_voltage'],
    output: 'max_rpm',
    validate: (params) => {
      const kv = params.motor_kv || 0;
      const voltage = params.battery_voltage || 0;
      const maxRPM = kv * voltage;
      const safeRPM = 50000; // Typical BLDC limit
      
      return {
        parameter: 'Max RPM',
        passed: maxRPM <= safeRPM,
        rule: 'fp-002',
        message: `Max RPM: ${maxRPM.toFixed(0)} (${maxRPM <= safeRPM ? 'within' : 'exceeds'} safe limit of ${safeRPM})`,
        severity: maxRPM > safeRPM * 1.2 ? 'error' : maxRPM > safeRPM ? 'warning' : 'info',
        suggestion: maxRPM > safeRPM ? 'Lower KV motor or reduce voltage recommended' : undefined,
      };
    },
  },
  {
    id: 'fp-003',
    name: 'Battery Voltage vs Motor Rating',
    category: 'Voltage',
    description: 'Battery voltage should not exceed motor voltage rating',
    equation: 'V_battery ≤ V_motor_rated',
    inputs: ['battery_voltage', 'motor_voltage_max'],
    output: 'voltage_safety',
    validate: (params) => {
      const batteryV = params.battery_voltage || 0;
      const motorV = params.motor_voltage_max || 0;
      
      return {
        parameter: 'Voltage Match',
        passed: batteryV <= motorV,
        rule: 'fp-003',
        message: batteryV <= motorV 
          ? `Battery voltage (${batteryV}V) within motor rating (${motorV}V)`
          : `Battery voltage (${batteryV}V) exceeds motor rating (${motorV}V) - DANGER!`,
        severity: batteryV > motorV ? 'error' : 'info',
        suggestion: batteryV > motorV ? 'Use lower voltage battery or higher rated motor' : undefined,
      };
    },
  },
  {
    id: 'fp-004',
    name: 'Thermal Derating',
    category: 'Temperature',
    description: 'Current should be derated at high temperatures',
    equation: 'I_derated = I_max × (1 - (T - T_rated) / T_coefficient)',
    inputs: ['motor_current_max', 'temperature', 'temperature_rated'],
    output: 'thermal_current',
    validate: (params) => {
      const temp = params.temperature || 25;
      const tempRated = params.temperature_rated || 25;
      const current = params.motor_current_max || 0;
      
      const tempDelta = temp - tempRated;
      const derating = Math.max(0, 1 - tempDelta * 0.01); // 1% per degree over rated
      const deratedCurrent = current * derating;
      
      return {
        parameter: 'Thermal Derating',
        passed: derating >= 0.7,
        rule: 'fp-004',
        message: tempDelta > 0 
          ? `At ${temp}°C, current should be derated to ${deratedCurrent.toFixed(1)}A (${(derating * 100).toFixed(0)}%)`
          : `Temperature within rated range, no derating needed`,
        severity: derating < 0.5 ? 'error' : derating < 0.7 ? 'warning' : 'info',
        suggestion: derating < 0.7 ? 'Improve cooling or reduce current limits' : undefined,
      };
    },
  },
  {
    id: 'fp-005',
    name: 'FOC Angle Calibration',
    category: 'FOC',
    description: 'FOC angle should be properly calibrated for optimal efficiency',
    equation: '0° ≤ FOC_angle ≤ 90°',
    inputs: ['foc_angle'],
    output: 'foc_calibration',
    validate: (params) => {
      const angle = params.foc_angle ?? 0;
      
      return {
        parameter: 'FOC Angle',
        passed: angle >= 0 && angle <= 90,
        rule: 'fp-005',
        message: angle >= 0 && angle <= 90 
          ? `FOC angle (${angle}°) is within valid range`
          : `FOC angle (${angle}°) is outside valid range (0-90°)`,
        severity: angle < 0 || angle > 90 ? 'error' : 'info',
        suggestion: angle < 0 || angle > 90 ? 'Run FOC calibration routine' : undefined,
      };
    },
  },
  {
    id: 'fp-006',
    name: 'PID Tuning Stability',
    category: 'Control',
    description: 'PID gains should provide stable control without oscillation',
    equation: 'Kp × Ki < stability_threshold',
    inputs: ['pid_kp', 'pid_ki', 'pid_kd'],
    output: 'pid_stability',
    validate: (params) => {
      const kp = params.pid_kp || 0;
      const ki = params.pid_ki || 0;
      const kd = params.pid_kd || 0;
      
      // Simplified stability check
      const stabilityIndex = kp * ki;
      const dampingRatio = kd > 0 ? kd / (2 * Math.sqrt(kp * ki || 1)) : 0;
      
      return {
        parameter: 'PID Stability',
        passed: stabilityIndex < 1000 && dampingRatio > 0.3,
        rule: 'fp-006',
        message: `Kp=${kp.toFixed(2)}, Ki=${ki.toFixed(2)}, Kd=${kd.toFixed(2)} - Damping: ${dampingRatio.toFixed(2)}`,
        severity: dampingRatio < 0.1 ? 'error' : dampingRatio < 0.3 ? 'warning' : 'info',
        suggestion: dampingRatio < 0.3 ? 'Consider retuning PID for better stability' : undefined,
      };
    },
  },
];

/**
 * Rules Engine Class
 */
export class RulesEngine {
  private rules: FirstPrinciplesRule[];

  constructor(rules: FirstPrinciplesRule[] = firstPrinciplesRules) {
    this.rules = rules;
  }

  /**
   * Validate configuration against all rules
   */
  validate(config: VESCConfiguration): ValidationResult[] {
    const params = this.extractParameters(config);
    const results: ValidationResult[] = [];

    for (const rule of this.rules) {
      try {
        const result = rule.validate(params);
        results.push(result);
      } catch (error) {
        results.push({
          parameter: rule.name,
          passed: false,
          rule: rule.id,
          message: `Validation error: ${error}`,
          severity: 'error',
        });
      }
    }

    return results;
  }

  /**
   * Validate against specific category
   */
  validateCategory(config: VESCConfiguration, category: string): ValidationResult[] {
    const categoryRules = this.rules.filter(r => r.category === category);
    const engine = new RulesEngine(categoryRules);
    return engine.validate(config);
  }

  /**
   * Generate radar chart data from validation results
   */
  generateRadarData(results: ValidationResult[]): RadarChartData[] {
    const categories = [...new Set(this.rules.map(r => r.category))];
    
    return categories.map(category => {
      const categoryResults = results.filter(r => 
        this.rules.find(rule => rule.id === r.rule)?.category === category
      );
      
      const passedCount = categoryResults.filter(r => r.passed).length;
      const totalCount = categoryResults.length || 1;
      const score = (passedCount / totalCount) * 100;
      
      let status: 'safe' | 'warning' | 'danger' = 'safe';
      if (score < 50) status = 'danger';
      else if (score < 80) status = 'warning';
      
      return {
        parameter: category,
        value: Math.round(score),
        fullMark: 100,
        status,
      };
    });
  }

  /**
   * Extract parameters from VESC configuration
   */
  private extractParameters(config: VESCConfiguration): Record<string, number> {
    const params: Record<string, number> = {};
    
    for (const param of config.parameters) {
      // Normalize parameter names
      const normalizedName = param.name
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/_+/g, '_');
      
      params[normalizedName] = param.value;
      
      // Also store with original name
      params[param.name] = param.value;
    }
    
    return params;
  }

  /**
   * Get all available rules
   */
  getRules(): FirstPrinciplesRule[] {
    return this.rules;
  }

  /**
   * Add custom rule
   */
  addRule(rule: FirstPrinciplesRule): void {
    this.rules.push(rule);
  }
}

// Singleton instance
export const rulesEngine = new RulesEngine();
