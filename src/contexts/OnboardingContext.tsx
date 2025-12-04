import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface OnboardingContextType {
  isOnboarding: boolean;
  onboardingCompleted: boolean;
  startOnboarding: () => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  setTotalSteps: (steps: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has completed onboarding
      const { data: userData } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      const completed = userData?.onboarding_completed ?? false;
      setOnboardingCompleted(completed);

      // If not completed, check if we should start onboarding
      // (e.g., after password change or first login)
      if (!completed) {
        const shouldStart = localStorage.getItem('start_onboarding') === 'true';
        if (shouldStart) {
          localStorage.removeItem('start_onboarding');
          setIsOnboarding(true);
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep(0);
  };

  const completeOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mark onboarding as completed in database
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) throw error;

      setOnboardingCompleted(true);
      setIsOnboarding(false);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const skipOnboarding = async () => {
    // Same as complete, but mark as skipped
    await completeOnboarding();
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        onboardingCompleted,
        startOnboarding,
        completeOnboarding,
        skipOnboarding,
        currentStep,
        setCurrentStep,
        totalSteps,
        setTotalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

