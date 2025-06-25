import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import { AuthState, User, LoginCredentials, RegisterData } from '@/types/auth';
import { LOGIN, REGISTER } from '@/graphql/mutations/auth';
import { GET_ME } from '@/graphql/queries/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_AUTHENTICATED'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'LOGOUT':
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const client = useApolloClient();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await client.query({
            query: GET_ME,
            errorPolicy: 'all',
          });
          
          if (data?.me) {
            dispatch({ type: 'SET_USER', payload: data.me });
            dispatch({ type: 'SET_TOKEN', payload: token });
          } else {
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, [client]);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await client.mutate({
        mutation: LOGIN,
        variables: {
          usernameOrEmail: credentials.usernameOrEmail,
          password: credentials.password,
        },
      });

      if (data?.login) {
        const { user, accessToken } = data.login;
        localStorage.setItem('token', accessToken);
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_TOKEN', payload: accessToken });
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await client.mutate({
        mutation: REGISTER,
        variables: {
          userInput: {
            email: userData.email,
            username: userData.username,
            fullName: userData.fullName,
            password: userData.password,
            role: userData.role,
            phone: userData.phone,
            department: userData.department,
            position: userData.position,
          },
        },
      });

      if (data?.register) {
        const { user, accessToken } = data.register;
        localStorage.setItem('token', accessToken);
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_TOKEN', payload: accessToken });
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    client.clearStore();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};