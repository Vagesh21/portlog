import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Track analytics event
 * @param {string} eventType - Type of event ('page_view' or 'click')
 * @param {string} page - Page path
 */
export const trackEvent = async (eventType, page) => {
  try {
    await axios.post(`${API}/analytics/track`, {
      event_type: eventType,
      page: page,
      device_type: getDeviceType()
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

/**
 * Track page view
 * @param {string} page - Page path
 */
export const trackPageView = (page) => {
  trackEvent('page_view', page);
};

/**
 * Track click event
 * @param {string} page - Page where click occurred
 */
export const trackClick = (page) => {
  trackEvent('click', page);
};

/**
 * Get device type from user agent
 * @returns {string} - 'mobile', 'tablet', or 'desktop'
 */
const getDeviceType = () => {
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Get analytics stats for admin dashboard
 * @param {string} timeRange - '7d', '30d', or 'all'
 * @returns {Promise} - Analytics data
 */
export const getAnalyticsStats = async (timeRange = '7d') => {
  try {
    const response = await axios.get(`${API}/analytics/stats`, {
      params: { time_range: timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};
