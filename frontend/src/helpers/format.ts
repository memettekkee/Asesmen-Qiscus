export const formatMessageTime = (timestamp: string | null | undefined) => {
    if (!timestamp) return '';
    
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const messageDay: any = stripTime(messageDate);
    const today: any = stripTime(now);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const diff = Math.floor((today - messageDay) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    if (diff === 1) {
      return 'Yesterday';
    }
    
    if (diff < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'long' });
    }
    
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
    
    return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }

export const formatDate = (dateString: any) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };