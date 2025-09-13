export const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time parts for accurate date comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Handle future dates (just in case)
    if (date > today) {
      return dateString.split('T')[0];
    }
    
    // Format relative date
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };