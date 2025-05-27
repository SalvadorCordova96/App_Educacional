import React from 'react';

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('');
};
