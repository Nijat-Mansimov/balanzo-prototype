import React, { useState } from 'react';
import { AuthScreenType, UserProfile } from '../../types';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { OtpVerifyScreen } from './OtpVerifyScreen';
import { ResetPasswordScreen } from './ResetPasswordScreen';

interface AuthFlowProps {
  initialView?: AuthScreenType;
  initialData?: { name?: string; currency?: string; avatarUrl?: string; initials?: string };
  onLogin: (user: Partial<UserProfile>) => void;
  onRegister: (newUser: Partial<UserProfile>) => void;
  onOpenLanguageModal?: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({
  initialView = 'login',
  initialData,
  onLogin,
  onRegister,
  onOpenLanguageModal,
}) => {
  const [currentView, setCurrentView] = useState<AuthScreenType>(initialView);
  const [recoveryEmail, setRecoveryEmail] = useState<string>('mansimovnijat@gmail.com');

  React.useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  return (
    <div className="h-full bg-white dark:bg-neutral-900 overflow-y-auto">
      {currentView === 'login' && (
        <LoginScreen
          onLogin={onLogin}
          onNavigate={(view) => setCurrentView(view)}
          onOpenLanguageModal={onOpenLanguageModal}
        />
      )}

      {currentView === 'register' && (
        <RegisterScreen
          initialData={initialData}
          onRegister={onRegister}
          onNavigate={(view) => setCurrentView(view)}
          onOpenLanguageModal={onOpenLanguageModal}
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPasswordScreen
          onNavigate={(view) => setCurrentView(view)}
          onCodeSent={(email) => {
            setRecoveryEmail(email);
          }}
        />
      )}

      {currentView === 'otp-verify' && (
        <OtpVerifyScreen
          email={recoveryEmail}
          onNavigate={(view) => setCurrentView(view)}
          onVerified={() => setCurrentView('reset-password')}
        />
      )}

      {currentView === 'reset-password' && (
        <ResetPasswordScreen
          email={recoveryEmail}
          onNavigate={(view) => setCurrentView(view)}
          onPasswordResetSuccess={(user) => {
            onLogin(user);
          }}
        />
      )}
    </div>
  );
};
