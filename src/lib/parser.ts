// VESC Configuration Parser
// Supports XML and PDF formats

import { VESCConfiguration, VESCParameter } from '@/types';

export class VESCParser {
  /**
   * Parse VESC XML configuration file
   */
  async parseXML(xmlContent: string, fileName?: string): Promise<VESCConfiguration> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    
    const parameters: VESCParameter[] = [];
    
    // Extract firmware info
    const firmwareVersion = this.extractText(doc, 'firmware_version') || 'Unknown';
    const hardwareType = this.extractText(doc, 'hardware') || 'Unknown';
    
    // Parse all parameter groups
    const groups = doc.querySelectorAll('group');
    groups.forEach(group => {
      const category = group.getAttribute('name') || 'General';
      
      group.querySelectorAll('param').forEach(param => {
        parameters.push({
          name: param.getAttribute('name') || '',
          value: parseFloat(param.getAttribute('value') || '0'),
          unit: param.getAttribute('unit') || '',
          min: param.getAttribute('min') ? parseFloat(param.getAttribute('min')!) : undefined,
          max: param.getAttribute('max') ? parseFloat(param.getAttribute('max')!) : undefined,
          category,
          description: param.getAttribute('description') || undefined,
        });
      });
    });
    
    // Also check for flat parameters
    doc.querySelectorAll('parameter').forEach(param => {
      const name = param.getAttribute('name') || param.tagName;
      if (!parameters.find(p => p.name === name)) {
        parameters.push({
          name,
          value: parseFloat(param.textContent || '0'),
          unit: param.getAttribute('unit') || '',
          category: param.getAttribute('category') || 'General',
          description: param.getAttribute('description') || undefined,
        });
      }
    });
    
    return {
      firmwareVersion,
      hardwareType,
      parameters,
      metadata: {
        parsedAt: new Date(),
        source: 'xml',
        fileName,
      },
    };
  }

  /**
   * Parse VESC PDF configuration report
   */
  async parsePDF(pdfBuffer: ArrayBuffer, fileName?: string): Promise<VESCConfiguration> {
    // PDF parsing requires server-side processing
    // This is a placeholder for client-side, actual parsing done via API route
    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'pdf', 
        data: Array.from(new Uint8Array(pdfBuffer)),
        fileName 
      }),
    });
    
    if (!response.ok) {
      throw new Error('PDF parsing failed');
    }
    
    return response.json();
  }

  /**
   * Auto-detect file type and parse
   */
  async parseFile(file: File): Promise<VESCConfiguration> {
    const fileName = file.name;
    
    if (fileName.endsWith('.xml')) {
      const content = await file.text();
      return this.parseXML(content, fileName);
    }
    
    if (fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer();
      return this.parsePDF(buffer, fileName);
    }
    
    throw new Error(`Unsupported file type: ${fileName}`);
  }

  /**
   * Extract text content from XML element
   */
  private extractText(doc: Document, selector: string): string | null {
    const element = doc.querySelector(selector);
    return element?.textContent || null;
  }
}

// Singleton instance
export const vescParser = new VESCParser();
