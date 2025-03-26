import { useState } from 'react';

const sendEmail = async (data: { name: string; email: string; message: string }) => {
  let retries = 0;
  const maxRetries = 3;
  
  while (retries <= maxRetries) {
    try {
      const response = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      // Always try to parse the response body
      let result;
      try {
        const text = await response.text();
        result = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid server response');
      }

      // Log response details for debugging
      console.log('Email API Response:', {
        status: response.status,
        ok: response.ok,
        result
      });

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      return result;
    } catch (error) {
      console.error(`Email attempt ${retries + 1} failed:`, error);
      
      if (retries === maxRetries) {
        throw error;
      }
      
      retries++;
      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, retries) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Failed to send email after multiple attempts');
};

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormState {
  values: FormData;
  errors: Partial<FormData>;
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
}

export const useContactForm = () => {
  const [state, setState] = useState<FormState>({
    values: {
      name: '',
      email: '',
      message: '',
    },
    errors: {},
    isSubmitting: false,
    isSuccess: false,
    errorMessage: null,
  });

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    
    if (!state.values.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!state.values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.values.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!state.values.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value,
      },
      errors: {
        ...prev.errors,
        [name]: '',
      },
      errorMessage: null, // Clear any previous error message
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setState(prev => ({
        ...prev,
        errors,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isSubmitting: true,
      errorMessage: null,
    }));

    try {
      const result = await sendEmail(state.values);
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        values: {
          name: '',
          email: '',
          message: ''
        }
      }));
    } catch (error) {
      console.error('Form submission error:', error);
      
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        errorMessage: error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again.',
      }));
    }
  };

  return {
    ...state,
    handleChange,
    handleSubmit,
  };
};