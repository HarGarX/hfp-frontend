'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

// Generic form wrapper component
interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      {children}
    </form>
  );
}

// Form field wrapper with error handling
interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export function FormField({ children, error, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Form section for grouping related fields
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

// Form actions (buttons) section
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center', 
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={cn('flex items-center space-x-2 pt-4', alignClasses[align], className)}>
      {children}
    </div>
  );
}