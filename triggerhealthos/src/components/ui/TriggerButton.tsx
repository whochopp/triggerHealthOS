import React, { useState } from 'react';
import { TriggerButtonProps } from '../../types';
import { useTrigger } from '../../contexts/TriggerContext';

const TriggerButton: React.FC<TriggerButtonProps> = ({
  trigger,
  label,
  description,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  requiresClientId = false,
  requiresConfirmation = false,
}) => {
  const { executeTrigger, isExecuting } = useTrigger();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [clientId, setClientId] = useState('');
  const [showClientIdInput, setShowClientIdInput] = useState(false);

  const isButtonDisabled = disabled || loading || isExecuting;

  const getButtonClasses = () => {
    const baseClasses = 'trigger-button';
    const variantClasses = {
      primary: 'trigger-button',
      secondary: 'trigger-button-secondary',
      success: 'trigger-button-success',
      warning: 'trigger-button-warning',
      danger: 'trigger-button-danger',
    };

    let classes = variantClasses[variant];
    
    if (isButtonDisabled) {
      classes += ' opacity-50 cursor-not-allowed';
    }

    return classes;
  };

  const handleButtonClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (requiresClientId && !clientId) {
      setShowClientIdInput(true);
      return;
    }

    if (requiresConfirmation && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    await handleTriggerExecution();
  };

  const handleTriggerExecution = async () => {
    try {
      const data = requiresClientId ? { client_id: clientId } : undefined;
      const result = await executeTrigger(trigger, data);
      
      if (result.success) {
        // Reset states
        setShowConfirmation(false);
        setShowClientIdInput(false);
        setClientId('');
        
        // Show success feedback
        console.log('Trigger executed successfully:', result);
      } else {
        console.error('Trigger execution failed:', result.error);
      }
    } catch (error) {
      console.error('Error executing trigger:', error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setShowClientIdInput(false);
    setClientId('');
  };

  if (showClientIdInput) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-secondary-300">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Client ID
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Enter Client ID (e.g., CL-001)"
            className="input-field"
            autoFocus
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleButtonClick}
            disabled={!clientId || isButtonDisabled}
            className={getButtonClasses()}
          >
            {isExecuting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Executing...
              </div>
            ) : (
              `Execute ${label}`
            )}
          </button>
          <button
            onClick={handleCancel}
            className="trigger-button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="space-y-4">
        <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
          <h3 className="text-lg font-semibold text-warning-900 mb-2">Confirm Action</h3>
          <p className="text-warning-800">
            Are you sure you want to execute "{label}"?
          </p>
          {description && (
            <p className="text-sm text-warning-700 mt-2">{description}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleTriggerExecution}
            disabled={isButtonDisabled}
            className={getButtonClasses()}
          >
            {isExecuting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Executing...
              </div>
            ) : (
              `Yes, Execute ${label}`
            )}
          </button>
          <button
            onClick={handleCancel}
            className="trigger-button-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={getButtonClasses()}
      >
        {isExecuting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Executing...
          </div>
        ) : (
          label
        )}
      </button>
      {description && (
        <p className="text-sm text-secondary-600 px-2">{description}</p>
      )}
    </div>
  );
};

export default TriggerButton;