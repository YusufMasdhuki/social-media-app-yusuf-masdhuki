import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Controller,
  Control,
  FieldValues,
  Path, // ⬅️ pakai Path<T>
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps<T extends FieldValues> {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  isPassword?: boolean;
  control: Control<T>;
  name: Path<T>; // ⬅️ perbaikan di sini
}

export const FormField = <T extends FieldValues>({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  isPassword = false,
  control,
  name,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='flex flex-col gap-0.5'>
      <Label htmlFor={id} className='text-sm'>
        {label}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className='relative'>
            <Input
              id={id}
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              placeholder={placeholder}
              className='h-12 rounded-xl border-neutral-900 pr-10'
              {...field}
            />
            {isPassword && (
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-300'
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            )}
          </div>
        )}
      />

      {error && <p className='text-sm text-red-500'>{error}</p>}
    </div>
  );
};
