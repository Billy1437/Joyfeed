export const formatTimeAgo = (created_at: string): string => {
  const now = new Date();
  const created = new Date(created_at);

  const diff = now.getTime() - created.getTime();

  //it is in milli seconds, so we divide (1000) to get seconds , and to get minutes we divide by 60 too
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return "just now";
  }
  // 60 * 60 * 1000 = 1 hour in milliseconds
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    return `${minutes}m ago`;
  }

  if (hours < 24) return `${hours}h ago`;
};

export const formatTimeRemaining = (expires_at: string): string => {
  const now = new Date();
  const expires = new Date(expires_at);

  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) {
    return "Expired";
  }

  const minutes = Math.floor(diff % (1000 * 60 * 60) /  (1000 * 60));

  const hours = Math.floor(diff / (1000 * 60 * 60));

  if(hours > 0){
    return `${hours}h ${minutes}m left`;
  }

  return `${minutes}m left`;
};

