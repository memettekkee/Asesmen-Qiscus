import Swal from 'sweetalert2'
import type { SweetAlertOptions } from 'sweetalert2'
import '../assets/alert.css'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
  customClass: {
    popup: `swal2-toast`
  }
})

function getToastClass(type: string) {
  return `swal2-icon-${type}`
}

export function useNotification() {
    const success = (message: string, duration = 2000) => {
      Toast.fire({
        icon: 'success',
        title: message,
        timer: duration,
        customClass: {
          popup: `swal2-toast ${getToastClass('success')}`
        }
      } as SweetAlertOptions)
    }
  
    const error = (message: string, duration = 2000) => {
      Toast.fire({
        icon: 'error',
        title: message,
        timer: duration,
        customClass: {
          popup: `swal2-toast ${getToastClass('error')}`
        }
      } as SweetAlertOptions)
    }
  
    const warning = (message: string, duration = 2000) => {
      Toast.fire({
        icon: 'warning',
        title: message,
        timer: duration,
        customClass: {
          popup: `swal2-toast ${getToastClass('warning')}`
        }
      } as SweetAlertOptions)
    }
  
    const info = (message: string, duration = 2000) => {
      Toast.fire({
        icon: 'info',
        title: message,
        timer: duration,
        customClass: {
          popup: `swal2-toast ${getToastClass('info')}`
        }
      } as SweetAlertOptions)
    }
  
    const confirm = async (
      title: string,
      text: string,
      confirmButtonText = 'Yes',
      cancelButtonText = 'Cancel'
    ) => {
      try {
        const result = await Swal.fire({
          title,
          text,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText,
          cancelButtonText,
          customClass: {
            container: 'compact-swal-container',
            popup: 'compact-swal',
            title: 'compact-swal-title',
            htmlContainer: 'compact-swal-content',
            actions: 'compact-swal-actions'
          },
          buttonsStyling: true
        } as SweetAlertOptions)
        
        return result.isConfirmed
      } catch (error) {
        console.error('Confirmation dialog error:', error)
        return false
      }
    }
  
    return {
      success,
      error,
      warning,
      info,
      confirm
    }
  }