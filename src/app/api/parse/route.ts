import { NextRequest, NextResponse } from 'next/server';
import { VESCConfiguration } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, fileName } = body;

    if (type === 'pdf') {
      // PDF parsing - requires pdf-parse (server-side only)
      const pdfParse = (await import('pdf-parse')).default;
      
      const buffer = Buffer.from(data);
      const pdfData = await pdfParse(buffer);
      
      // Extract parameters from PDF text
      const parameters = extractParametersFromText(pdfData.text);
      
      const config: VESCConfiguration = {
        firmwareVersion: extractValue(pdfData.text, 'Firmware', 'Unknown'),
        hardwareType: extractValue(pdfData.text, 'Hardware', 'Unknown'),
        parameters,
        metadata: {
          parsedAt: new Date(),
          source: 'pdf',
          fileName,
        },
      };

      return NextResponse.json(config);
    }

    return NextResponse.json(
      { error: 'Unsupported parse type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    );
  }
}

function extractParametersFromText(text: string) {
  const parameters: VESCConfiguration['parameters'] = [];
  
  // Common VESC parameter patterns
  const patterns = [
    /(?:Motor Current|Current Max)[:\s]+(\d+\.?\d*)\s*(A|amp)?/gi,
    /(?:Battery Current|Battery Max)[:\s]+(\d+\.?\d*)\s*(A|amp)?/gi,
    /(?:Voltage|Battery Voltage)[:\s]+(\d+\.?\d*)\s*(V|volt)?/gi,
    /(?:KV|Motor KV)[:\s]+(\d+\.?\d*)\s*(rpm\/V)?/gi,
    /(?:Temperature|Temp)[:\s]+(\d+\.?\d*)\s*(°C|C)?/gi,
    /(?:FOC Angle)[:\s]+(\d+\.?\d*)\s*(°|deg)?/gi,
    /(?:PID\s*Kp)[:\s]+(\d+\.?\d*)/gi,
    /(?:PID\s*Ki)[:\s]+(\d+\.?\d*)/gi,
    /(?:PID\s*Kd)[:\s]+(\d+\.?\d*)/gi,
  ];

  const categories = ['Motor', 'Battery', 'FOC', 'Control', 'Temperature', 'General'];
  
  patterns.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const paramName = match[0].split(/[:\s]/)[0];
      parameters.push({
        name: paramName,
        value: parseFloat(match[1]),
        unit: match[2] || '',
        category: categories[index % categories.length],
      });
    }
  });

  return parameters;
}

function extractValue(text: string, key: string, fallback: string): string {
  const regex = new RegExp(`${key}[:\\s]+([\\w.-]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1] : fallback;
}
