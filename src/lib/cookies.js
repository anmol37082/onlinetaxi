/**
 * Cookie utility functions for consistent token handling
 * Replaces localStorage usage with cookie-based authentication
 */

export const cookieUtils = {
  /**
   * Get a cookie value by name
   */
  getCookie: (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  },

  /**
   * Set a cookie
   */
  setCookie: (name, value, options = {}) => {
    if (typeof document === 'undefined') return;

    const {
      path = '/',
      maxAge = 60 * 60 * 24 * 7, // 7 days
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'lax'
    } = options;

    let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}`;

    if (secure) cookieString += '; secure';
    if (sameSite) cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  },

  /**
   * Remove a cookie
   */
  removeCookie: (name, path = '/') => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  },

  /**
   * Get authentication token from cookie
   */
  getToken: () => {
    return cookieUtils.getCookie('token');
  },

  /**
   * Set authentication token in cookie
   */
  setToken: (token) => {
    cookieUtils.setCookie('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  /**
   * Remove authentication token
   */
  removeToken: () => {
    cookieUtils.removeCookie('token', '/');
    // Dispatch logout event for cross-tab synchronization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-logout'));
    }
  },

  /**
   * Get admin token from cookie
   */
  getAdminToken: () => {
    return cookieUtils.getCookie('adminToken');
  },

  /**
   * Set admin token in cookie
   */
  setAdminToken: (token) => {
    cookieUtils.setCookie('adminToken', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  /**
   * Remove admin token
   */
  removeAdminToken: () => {
    cookieUtils.removeCookie('adminToken', '/');
    // Dispatch logout event for cross-tab synchronization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-logout'));
    }
  }
};

/**
 * Verify JWT token and return decoded data
 * This function works on both client and server side
 */
export const verifyToken = (request) => {
  try {
    let token;

    // If request is provided (server-side), get token from cookies
    if (request) {
      const cookieHeader = request.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
    } else {
      // Client-side, get token from cookie
      token = cookieUtils.getToken();
    }

    if (!token) {
      return null;
    }

    // Simple JWT decode (base64 decode payload)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return null;
      }

      return {
        userId: payload.userId || payload.id,
        email: payload.email,
        role: payload.role || 'user'
      };
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      return null;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

/**
 * Verify admin JWT token and return decoded data
 * This function works on both client and server side
 */
export const verifyAdminToken = (request) => {
  try {
    let token;

    // If request is provided (server-side), get token from cookies
    if (request) {
      const cookieHeader = request.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/adminToken=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
    } else {
      // Client-side, get token from cookie
      token = cookieUtils.getAdminToken();
    }

    if (!token) {
      return null;
    }

    // Simple JWT decode (base64 decode payload)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(parts[1]));

      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return null;
      }

      return {
        adminId: payload.adminId,
        role: payload.role || 'admin'
      };
    } catch (decodeError) {
      console.error('Admin token decode error:', decodeError);
      return null;
    }
  } catch (error) {
    console.error('Admin token verification error:', error);
    return null;
  }
};

export default cookieUtils;
