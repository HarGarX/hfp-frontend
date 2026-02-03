import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center">
              {index > 0 && (
                <div
                  className={cn(
                    "h-0.5 w-16 md:w-24 mr-2",
                    index <= currentStep ? "bg-indigo-600" : "bg-gray-300"
                  )}
                />
              )}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index < currentStep
                    ? "bg-indigo-600 text-white"
                    : index === currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-gray-500"
                )}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-16 md:w-24 ml-2",
                    index < currentStep ? "bg-indigo-600" : "bg-gray-300"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs font-medium",
                index <= currentStep ? "text-indigo-600" : "text-gray-500"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}