/**
 * ============================================
 * API 响应处理工具
 * ============================================
 * 统一的 API 响应格式和处理机制
 */

/**
 * 成功响应对象
 * @typedef {Object} SuccessResponse
 * @property {boolean} success - 总是 true
 * @property {*} data - 响应数据
 * @property {Object} meta - 元信息
 * @property {number} meta.timestamp - 响应时间戳
 */

/**
 * 失败响应对象
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - 总是 false
 * @property {Object} error - 错误信息
 * @property {string} error.message - 错误消息
 * @property {string} error.name - 错误类型名称
 * @property {Object} error.details - 详细信息
 * @property {boolean} retryable - 是否可重试
 */

/**
 * 创建成功响应
 * @param {*} data - 响应数据
 * @param {Object} meta - 元信息 (可选)
 * @returns {SuccessResponse} 成功响应对象
 * 
 * @example
 * const response = createSuccessResponse([...], { count: 3 });
 * // => { success: true, data: [...], meta: { timestamp: 1234567890, count: 3 } }
 */
export function createSuccessResponse(data, meta = {}) {
  return {
    success: true,
    data,
    meta: {
      timestamp: Date.now(),
      ...meta,
    },
  };
}

/**
 * 创建错误响应
 * @param {Error|string} error - 错误对象或错误消息
 * @param {boolean} retryable - 是否可重试
 * @returns {ErrorResponse} 错误响应对象
 * 
 * @example
 * const response = createErrorResponse(new Error("Not found"), false);
 * // => { success: false, error: { message: "Not found", ... }, retryable: false }
 */
export function createErrorResponse(error, retryable = false) {
  const errorObj = typeof error === 'string' ? new Error(error) : error;
  
  return {
    success: false,
    error: {
      message: errorObj.message,
      name: errorObj.name,
      details: errorObj.details || {},
    },
    retryable,
  };
}

/**
 * 检查响应是否成功
 * @param {SuccessResponse|ErrorResponse} response - 响应对象
 * @returns {boolean} 是否成功
 */
export function isSuccessResponse(response) {
  return response && response.success === true;
}

/**
 * 检查响应是否失败
 * @param {SuccessResponse|ErrorResponse} response - 响应对象
 * @returns {boolean} 是否失败
 */
export function isErrorResponse(response) {
  return response && response.success === false;
}

/**
 * 从响应中提取数据
 * 如果成功返回数据，失败则返回 null
 * @param {SuccessResponse|ErrorResponse} response - 响应对象
 * @returns {*} 数据或 null
 * 
 * @example
 * const data = extractData(response);
 */
export function extractData(response) {
  return isSuccessResponse(response) ? response.data : null;
}

/**
 * 从响应中提取错误
 * 如果失败返回错误对象，成功则返回 null
 * @param {SuccessResponse|ErrorResponse} response - 响应对象
 * @returns {Object|null} 错误对象或 null
 */
export function extractError(response) {
  return isErrorResponse(response) ? response.error : null;
}

/**
 * 映射多个响应
 * 收集成功响应的数据，忽略失败响应
 * @param {Array} responses - 响应数组
 * @param {boolean} strict - 严格模式 (任何错误都中止)
 * @returns {*} 映射结果
 * 
 * @example
 * const results = mapResponses([res1, res2, res3]);
 * // => [data1, data2, data3]
 */
export function mapResponses(responses, strict = false) {
  return responses.reduce((acc, response) => {
    if (isSuccessResponse(response)) {
      acc.push(response.data);
    } else if (strict) {
      throw new Error(`Response failed: ${response.error.message}`);
    }
    return acc;
  }, []);
}

/**
 * 缓存相关的辅助类
 * 用于管理响应缓存
 */
export class ResponseCache {
  constructor(ttl = 60000) { // 默认 60 秒 TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * 获取缓存的响应
   * @param {string} key - 缓存键
   * @returns {*} 缓存的响应或 undefined
   */
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) {
      return undefined;
    }

    // 检查是否过期
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {*} data - 缓存数据
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 清空缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 删除特定的缓存
   * @param {string} key - 缓存键
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * 获取缓存大小
   * @returns {number}
   */
  size() {
    return this.cache.size;
  }
}

export default {
  createSuccessResponse,
  createErrorResponse,
  isSuccessResponse,
  isErrorResponse,
  extractData,
  extractError,
  mapResponses,
  ResponseCache,
};
