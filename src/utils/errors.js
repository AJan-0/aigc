/**
 * ============================================
 * 错误处理工具
 * ============================================
 * 统一的错误类和处理机制
 */

/**
 * API 错误类
 * 用于捕获和处理 API 相关的错误
 */
export class APIError extends Error {
  /**
   * @param {string} message - 错误消息
   * @param {number} status - HTTP 状态码
   * @param {Object} details - 额外的错误详情
   */
  constructor(message, status = 500, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
    
    // 根据状态码判断是否可重试
    this.retryable = status >= 500 || status === 408 || status === 429;
  }

  /**
   * 判断是否可以重试
   * @returns {boolean}
   */
  isRetryable() {
    return this.retryable;
  }

  /**
   * 转换为 JSON 格式
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details,
      retryable: this.retryable,
    };
  }
}

/**
 * 验证错误类
 * 用于表单和数据验证错误
 */
export class ValidationError extends Error {
  /**
   * @param {string} message - 错误消息
   * @param {string} field - 字段名称
   * @param {*} value - 字段值
   */
  constructor(message, field = '', value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }

  /**
   * 转换为 JSON 格式
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      field: this.field,
      value: this.value,
    };
  }
}

/**
 * 网络错误类
 * 用于处理网络连接相关的错误
 */
export class NetworkError extends Error {
  /**
   * @param {string} message - 错误消息
   * @param {Object} originalError - 原始错误对象
   */
  constructor(message = 'Network request failed', originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
    this.retryable = true; // 网络错误通常可以重试
  }

  /**
   * 判断是否可以重试
   * @returns {boolean}
   */
  isRetryable() {
    return this.retryable;
  }
}

/**
 * 转换为用户友好的错误消息
 * @param {Error} error - 错误对象
 * @returns {string} 用户友好的错误消息
 */
export function getUserFriendlyMessage(error) {
  if (error instanceof ValidationError) {
    return `${error.field} 字段验证失败: ${error.message}`;
  }
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        return '请求参数错误，请检查输入';
      case 401:
        return '未授权，请重新登录';
      case 403:
        return '禁止访问此资源';
      case 404:
        return '请求的资源不存在';
      case 429:
        return '请求过于频繁，请稍后再试';
      case 500:
        return '服务器错误，请稍后再试';
      case 503:
        return '服务暂时不可用，请稍后再试';
      default:
        return error.message || '请求失败，请稍后重试';
    }
  }
  
  if (error instanceof NetworkError) {
    return '网络连接失败，请检查您的网络';
  }
  
  return error?.message || '发生未知错误，请稍后重试';
}

/**
 * 判断错误是否可以重试
 * @param {Error} error - 错误对象
 * @returns {boolean}
 */
export function isRetryableError(error) {
  if (error instanceof APIError) {
    return error.isRetryable();
  }
  if (error instanceof NetworkError) {
    return error.isRetryable();
  }
  return false;
}

export default {
  APIError,
  ValidationError,
  NetworkError,
  getUserFriendlyMessage,
  isRetryableError,
};
