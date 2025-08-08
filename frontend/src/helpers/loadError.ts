import { ref } from 'vue';

export function useLoadingState() {
  const isLoading = ref(false);
  const error = ref('');
  
  const startLoading = () => {
    isLoading.value = true;
    error.value = '';
  };
  
  const stopLoading = () => {
    isLoading.value = false;
  };
  
  const setError = (errorMessage: string) => {
    error.value = errorMessage;
    isLoading.value = false;
  };
  
  const clearError = () => {
    error.value = '';
  };
  
  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError,
    clearError
  };
}