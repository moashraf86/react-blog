export const getRelTime = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hr', seconds: 3600 },
    { name: 'min', seconds: 60 },
  ];

  const counter = intervals.find((interval) => seconds >= interval.seconds);

  if (counter) {
    const amount = Math.floor(seconds / counter.seconds);
    const suffix = amount > 1 ? 's' : '';
    return `${amount} ${counter.name}${suffix}`;
  }

  return 'Just now';
};
