/**
 * ============================================
 * 事件管理器
 * ============================================
 * 统一管理所有事件监听器，防止内存泄漏
 * 
 * 使用方法:
 *   import { eventManager } from './utils/eventManager.js';
 *   
 *   // 直接添加监听器
 *   eventManager.on(element, 'click', handler);
 *   
 *   // 事件委托（推荐）
 *   eventManager.delegate(document, 'click', '.button', handler);
 *   
 *   // 一次性事件
 *   eventManager.once(element, 'load', handler);
 *   
 *   // 页面卸载时清理所有监听器
 *   window.addEventListener('beforeunload', () => {
 *     eventManager.cleanup();
 *   });
 */

/**
 * 事件监听器信息
 * @typedef {Object} ListenerInfo
 * @property {Element} target - 事件目标
 * @property {string} event - 事件名称
 * @property {Function} handler - 事件处理函数
 * @property {Object} options - 事件选项
 * @property {boolean} isDelegated - 是否是委托事件
 * @property {string} selector - 委托选择器
 */

/**
 * 事件管理器类
 * 提供统一的事件监听器管理接口
 */
export class EventManager {
  constructor() {
    /**
     * 存储所有监听器信息
     * @type {Array<ListenerInfo>}
     */
    this.listeners = [];

    /**
     * 存储 once 事件的映射
     * @type {Map<string, Function>}
     */
    this.onceHandlers = new Map();
  }

  /**
   * 添加事件监听器
   * @param {Element} target - 事件目标元素
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   * @param {Object} options - 事件选项 (可选)
   * @returns {Function} 移除监听器的函数
   * 
   * @example
   * const remove = eventManager.on(button, 'click', (e) => {
   *   console.log('Clicked!');
   * });
   * // 移除: remove();
   */
  on(target, event, handler, options = {}) {
    if (!target || !event || !handler) {
      console.warn('[EventManager] Missing required parameters');
      return () => {};
    }

    try {
      target.addEventListener(event, handler, options);
      this.listeners.push({
        target,
        event,
        handler,
        options,
        isDelegated: false,
      });

      // 返回移除函数
      return () => this.off(target, event, handler);
    } catch (err) {
      console.error('[EventManager] Error adding listener:', err);
      return () => {};
    }
  }

  /**
   * 事件委托
   * 推荐使用此方法处理动态生成的元素
   * @param {Element} target - 委托目标（通常是 document 或父元素）
   * @param {string} event - 事件名称
   * @param {string} selector - CSS 选择器
   * @param {Function} handler - 事件处理函数
   * @returns {Function} 移除监听器的函数
   * 
   * @example
   * eventManager.delegate(document, 'click', '.button', (e) => {
   *   console.log('Button clicked:', e.target);
   * });
   */
  delegate(target, event, selector, handler) {
    if (!target || !event || !selector || !handler) {
      console.warn('[EventManager] Missing required parameters');
      return () => {};
    }

    const listener = (e) => {
      const element = e.target.closest(selector);
      if (element) {
        try {
          handler.call(element, e);
        } catch (err) {
          console.error('[EventManager] Delegated handler error:', err);
        }
      }
    };

    try {
      target.addEventListener(event, listener);
      this.listeners.push({
        target,
        event,
        handler: listener,
        isDelegated: true,
        selector,
      });

      return () => this.off(target, event, listener);
    } catch (err) {
      console.error('[EventManager] Error adding delegated listener:', err);
      return () => {};
    }
  }

  /**
   * 一次性事件监听器
   * @param {Element} target - 事件目标
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   * @returns {Function} 移除监听器的函数
   * 
   * @example
   * eventManager.once(window, 'load', () => {
   *   console.log('Page loaded!');
   * });
   */
  once(target, event, handler) {
    if (!target || !event || !handler) {
      console.warn('[EventManager] Missing required parameters');
      return () => {};
    }

    const listener = (e) => {
      try {
        handler(e);
      } finally {
        this.off(target, event, listener);
      }
    };

    const key = `${target}:${event}`;
    this.onceHandlers.set(key, listener);

    return this.on(target, event, listener);
  }

  /**
   * 移除事件监听器
   * @param {Element} target - 事件目标
   * @param {string} event - 事件名称
   * @param {Function} handler - 事件处理函数
   */
  off(target, event, handler) {
    if (!target || !event || !handler) {
      console.warn('[EventManager] Missing required parameters');
      return;
    }

    try {
      target.removeEventListener(event, handler);
      this.listeners = this.listeners.filter(
        l => !(l.target === target && l.event === event && l.handler === handler)
      );
    } catch (err) {
      console.error('[EventManager] Error removing listener:', err);
    }
  }

  /**
   * 清理所有事件监听器
   * 通常在页面卸载时调用
   */
  cleanup() {
    this.listeners.forEach(({ target, event, handler }) => {
      try {
        target.removeEventListener(event, handler);
      } catch (err) {
        console.error('[EventManager] Error during cleanup:', err);
      }
    });

    this.listeners = [];
    this.onceHandlers.clear();
    console.log('[EventManager] Cleanup complete');
  }

  /**
   * 获取当前监听器数量（用于调试）
   * @returns {number}
   */
  getListenerCount() {
    return this.listeners.length;
  }

  /**
   * 获取监听器信息（用于调试）
   * @returns {Array}
   */
  getListeners() {
    return [...this.listeners];
  }

  /**
   * 按事件名称获取监听器数量
   * @param {string} eventName - 事件名称
   * @returns {number}
   */
  getListenerCountByEvent(eventName) {
    return this.listeners.filter(l => l.event === eventName).length;
  }
}

/**
 * 全局事件管理器实例
 */
export const eventManager = new EventManager();

/**
 * 初始化事件管理器
 * 设置页面卸载时的清理
 */
export function initializeEventManager() {
  // 在页面卸载时清理所有监听器
  window.addEventListener('beforeunload', () => {
    eventManager.cleanup();
  });

  console.log('[EventManager] Initialized');
}

export default eventManager;
