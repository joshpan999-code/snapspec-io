import { NextRequest, NextResponse } from 'next/server';
import { rulesEngine } from '@/lib/first-principles';
import { VESCConfiguration } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const config: VESCConfiguration = await request.json();
    
    const results = rulesEngine.validate(config);
    const radarData = rulesEngine.generateRadarData(results);
    
    const summary = {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      errors: results.filter(r => r.severity === 'error').length,
      warnings: results.filter(r => r.severity === 'warning').length,
    };

    return NextResponse.json({
      results,
      radarData,
      summary,
      isValid: summary.errors === 0,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate configuration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const rules = rulesEngine.getRules();
  
  return NextResponse.json({
    rules: rules.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      equation: r.equation,
    })),
  });
}
