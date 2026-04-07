'use client';

import { useState, useCallback } from 'react';
import { vescParser } from '@/lib/parser';
import { rulesEngine } from '@/lib/first-principles';
import { RadarChartWidget } from '@/components/RadarChart';
import { ParameterConfirmDialog } from '@/components/ParameterDialog';
import { VESCConfiguration, ValidationResult, RadarChartData } from '@/types';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [config, setConfig] = useState<VESCConfiguration | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [radarData, setRadarData] = useState<RadarChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const parsed = await vescParser.parseFile(file);
      setConfig(parsed);

      const results = rulesEngine.validate(parsed);
      setValidationResults(results);

      const radar = rulesEngine.generateRadarData(results);
      setRadarData(radar);

      setDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogOpen(false);
    // Here you would save to Supabase or apply configuration
    console.log('Configuration confirmed:', config);
  }, [config]);

  const handleCancel = useCallback(() => {
    setDialogOpen(false);
    setConfig(null);
    setValidationResults([]);
    setRadarData([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">SnapSpec.io</h1>
          <p className="text-sm text-muted-foreground">
            VESC Configuration Analysis & First Principles Validation
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <section className="mb-8">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".xml,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex flex-col items-center gap-4"
            >
              {loading ? (
                <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="w-12 h-12 text-muted-foreground" />
              )}
              <div>
                <p className="text-lg font-medium">
                  {loading ? 'Parsing...' : 'Upload VESC Configuration'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports XML and PDF formats
                </p>
              </div>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-900 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {config && !dialogOpen && (
          <section className="grid md:grid-cols-2 gap-8">
            {/* Configuration Info */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Configuration
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Firmware:</span>
                  <span className="font-medium">{config.firmwareVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hardware:</span>
                  <span className="font-medium">{config.hardwareType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parameters:</span>
                  <span className="font-medium">{config.parameters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium">{config.metadata.source}</span>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">
                Validation Overview
              </h2>
              <RadarChartWidget data={radarData} />
            </div>

            {/* Validation Results */}
            <div className="border rounded-lg p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">
                Validation Results ({validationResults.length})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validationResults.map((result, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded flex items-start gap-2 ${
                      result.severity === 'error' ? 'bg-red-50' :
                      result.severity === 'warning' ? 'bg-yellow-50' : 'bg-green-50'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        result.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    )}
                    <div>
                      <div className="font-medium">{result.parameter}</div>
                      <div className="text-sm text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Parameter Dialog */}
      <ParameterConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        parameters={config?.parameters || []}
        validationResults={validationResults}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
