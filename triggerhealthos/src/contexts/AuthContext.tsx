import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Role, AuthContextType, MockUser } from '../types';

// Mock users for testing (replace with real authentication in production)
const MOCK_USERS: MockUser[] = [
  {
    id: 'user-rec-001',
    name: 'Sarah Johnson',
    email: 'sarah@clinic.com',
    role: 'receptionist',
    isActive: true,
    password: 'receptionist123',
  },
  {
    id: 'user-int-001',
    name: 'Alex Chen',
    email: 'alex@clinic.com',
    role: 'intern',
    isActive: true,
    password: 'intern123',
  },
  {
    id: 'user-int-002',
    name: 'Maria Rodriguez',
    email: 'maria@clinic.com',
    role: 'intern',
    isActive: true,
    password: 'intern123',
  },
  {
    id: 'user-ther-001',
    name: 'Dr. David Wilson',
    email: 'david@clinic.com',
    role: 'therapist',
    isActive: true,
    password: 'therapist123',
  },
  {
    id: 'user-ther-002',
    name: 'Dr. Emily Davis',
    email: 'emily@clinic.com',
    role: 'therapist',
    isActive: true,
    password: 'therapist123',
  },
  {
    id: 'user-admin-001',
    name: 'Admin User',
    email: 'admin@clinic.com',
    role: 'admin',
    isActive: true,
    password: 'admin123',
  },
];

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('triggerhealthos_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id && user.role) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('triggerhealthos_user');
      }
    }
  }, []);

  // Login function
  const login = async (email: string, roleOrPassword: Role | string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo purposes, allow login by role or email/password
      let user: MockUser | undefined;

      if (roleOrPassword === 'receptionist' || roleOrPassword === 'intern' || 
          roleOrPassword === 'therapist' || roleOrPassword === 'admin') {
        // Quick role-based login for demo
        user = MOCK_USERS.find(u => u.role === roleOrPassword);
      } else {
        // Email/password login
        user = MOCK_USERS.find(u => u.email === email && u.password === roleOrPassword);
      }

      if (user && user.isActive) {
        const authUser: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        };

        // Save to localStorage
        localStorage.setItem('triggerhealthos_user', JSON.stringify(authUser));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: authUser });
      } else {
        throw new Error('Invalid credentials or inactive account');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('triggerhealthos_user');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for role-based access control
export const withRoleAccess = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: Role[]
) => {
  return (props: P) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-secondary-900">Access Denied</h3>
            <p className="text-secondary-600">Please log in to access this feature.</p>
          </div>
        </div>
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-secondary-900">Access Denied</h3>
            <p className="text-secondary-600">
              You don't have permission to access this feature.
            </p>
            <p className="text-sm text-secondary-500 mt-2">
              Required roles: {allowedRoles.join(', ')}
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// Helper function to check if user has role
export const hasRole = (user: User | null, role: Role): boolean => {
  return user?.role === role;
};

// Helper function to check if user has any of the roles
export const hasAnyRole = (user: User | null, roles: Role[]): boolean => {
  return user ? roles.includes(user.role) : false;
};

// Export mock users for testing
export { MOCK_USERS };
export default AuthContext;