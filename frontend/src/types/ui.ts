export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}