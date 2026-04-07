'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { VESCParameter, ValidationResult } from '@/types';
import { cn } from '@/lib/utils';
import { Check, AlertTriangle, X, Info } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parameters: VESCParameter[];
  validationResults: ValidationResult[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ParameterConfirmDialog({
  open,
  onOpenChange,
  parameters,
  validationResults,
  onConfirm,
  onCancel,
}: Props) {
  const errors = validationResults.filter(r => r.severity === 'error');
  const warnings = validationResults.filter(r => r.severity === 'warning');
  const passed = validationResults.filter(r => r.passed);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <Dialog.Title className="text-xl font-semibold">
            Configuration Review
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground">
            Review parameters and validation results before applying
          </Dialog.Description>

          {/* Summary */}
          <div className="flex gap-4 py-4 border-y">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span>{passed.length} Passed</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              <span>{warnings.length} Warnings</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <X className="w-5 h-5" />
              <span>{errors.length} Errors</span>
            </div>
          </div>

          {/* Parameters List */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            <h4 className="font-medium text-sm sticky top-0 bg-background py-1">
              Parameters ({parameters.length})
            </h4>
            {parameters.slice(0, 20).map((param, i) => (
              <div key={i} className="flex justify-between text-sm py-1 px-2 rounded hover:bg-muted">
                <span className="font-medium">{param.name}</span>
                <span className="text-muted-foreground">
                  {param.value} {param.unit}
                </span>
              </div>
            ))}
            {parameters.length > 20 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                ... and {parameters.length - 20} more
              </div>
            )}
          </div>

          {/* Validation Results */}
          <div className="max-h-48 overflow-y-auto space-y-2">
            <h4 className="font-medium text-sm sticky top-0 bg-background py-1">
              Validation Results
            </h4>
            {validationResults.map((result, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2 text-sm p-2 rounded',
                  result.severity === 'error' && 'bg-red-50 text-red-900',
                  result.severity === 'warning' && 'bg-yellow-50 text-yellow-900',
                  result.severity === 'info' && 'bg-green-50 text-green-900'
                )}
              >
                {result.severity === 'error' && <X className="w-4 h-4 mt-0.5" />}
                {result.severity === 'warning' && <AlertTriangle className="w-4 h-4 mt-0.5" />}
                {result.severity === 'info' && <Info className="w-4 h-4 mt-0.5" />}
                <div className="flex-1">
                  <div className="font-medium">{result.parameter}</div>
                  <div className="text-xs opacity-80">{result.message}</div>
                  {result.suggestion && (
                    <div className="text-xs mt-1 italic">💡 {result.suggestion}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={errors.length > 0}
              className={cn(
                'px-4 py-2 rounded-md transition',
                errors.length > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {errors.length > 0 ? 'Fix Errors First' : 'Apply Configuration'}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
