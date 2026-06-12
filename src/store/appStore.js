/**
 * ============================================
 * 应用状态管理 Store
 * ============================================
 * 使用观察者模式实现简单的状态管理
 * 
 * 使用方法:
 *   import { appStore } from './store/appStore.js';
 *   
 *   // 获取状态
 *   const state = appStore.getState();
 *   
 *   // 修改状态
 *   appStore.setLanguage('en');
 *   
 *   // 订阅状态变化
 *   const unsubscribe = appStore.subscribe((state) => {
 *     console.log('状态已更新:', state);
 *   });
 *   
 *   // 取消订阅
 *   unsubscribe();
 */

/**
 * 简单的 Store 实现
 * 基于观察者模式
 */
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = [];
    this.history = []; // 用于调试
  }

  /**
   * 获取当前状态（浅拷贝）
   * @returns {Object} 状态对象
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 获取特定的状态值
   * @param {string} key - 状态键
   * @param {*} defaultValue - 默认值
   * @returns {*} 状态值
   */
  getStateValue(key, defaultValue = undefined) {
    return this.state[key] !== undefined ? this.state[key] : defaultValue;
  }

  /**
   * 更新状态
   * @param {Object} newState - 新状态对象
   * @private
   */
  setState(newState) {
    const oldState = this.getState();
    this.state = { ...this.state, ...newState };

    // 记录状态变化历史（用于调试）
    if (this.history.length > 20) {
      this.history.shift(); // 保留最后 20 条记录
    }
    this.history.push({
      timestamp: Date.now(),
      oldState,
      newState,
      currentState: this.getState(),
    });

    // 通知所有订阅者
    this.notify();
  }

  /**
   * 订阅状态变化
   * @param {Function} callback - 回调函数，参数为新状态
   * @returns {Function} 取消订阅函数
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.warn('[Store] Subscriber must be a function');
      return () => {}; // 返回空函数
    }

    this.subscribers.push(callback);

    // 返回取消订阅函数
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  /**
   * 通知所有订阅者
   * @private
   */
  notify() {
    const state = this.getState();
    this.subscribers.forEach(callback => {
      try {
        callback(state);
      } catch (err) {
        console.error('[Store] Subscriber error:', err);
      }
    });
  }

  /**
   * 获取订阅者数量（用于调试）
   * @returns {number}
   */
  getSubscriberCount() {
    return this.subscribers.length;
  }

  /**
   * 获取状态变化历史（用于调试）
   * @returns {Array}
   */
  getHistory() {
    return [...this.history];
  }
}

/**
 * 应用全局状态
 */
class AppStore extends Store {
  constructor() {
    super({
      currentLanguage: 'zh', // 当前语言
      currentFilter: 'all', // 当前过滤器
      lightboxOpen: false, // 灯箱是否打开
      lightboxIndex: 0, // 灯箱当前索引
      theme: 'dark', // 主题
      isLoading: false, // 是否加载中
      error: null, // 错误信息
    });
  }

  // ===== 语言操作 =====
  /**
   * 设置语言
   * @param {string} lang - 语言代码 (zh 或 en)
   */
  setLanguage(lang) {
    if (['zh', 'en'].includes(lang)) {
      this.setState({ currentLanguage: lang });
      // 同步到 localStorage
      try {
        localStorage.setItem('language', lang);
      } catch (_e) {
        // 降级处理
      }
    } else {
      console.warn('[AppStore] Invalid language:', lang);
    }
  }

  /**
   * 获取当前语言
   * @returns {string}
   */
  getLanguage() {
    return this.getStateValue('currentLanguage', 'zh');
  }

  // ===== 过滤操作 =====
  /**
   * 设置过滤器
   * @param {string} filter - 过滤器值 (all, architecture, animation, video)
   */
  setFilter(filter) {
    this.setState({ currentFilter: filter });
  }

  /**
   * 获取当前过滤器
   * @returns {string}
   */
  getFilter() {
    return this.getStateValue('currentFilter', 'all');
  }

  // ===== 灯箱操作 =====
  /**
   * 打开灯箱
   * @param {number} index - 项目索引
   */
  openLightbox(index) {
    this.setState({ lightboxOpen: true, lightboxIndex: index });
  }

  /**
   * 关闭灯箱
   */
  closeLightbox() {
    this.setState({ lightboxOpen: false });
  }

  /**
   * 检查灯箱是否打开
   * @returns {boolean}
   */
  isLightboxOpen() {
    return this.getStateValue('lightboxOpen', false);
  }

  /**
   * 获取灯箱索引
   * @returns {number}
   */
  getLightboxIndex() {
    return this.getStateValue('lightboxIndex', 0);
  }

  /**
   * 移动到下一个项目（灯箱）
   * @param {number} total - 总项目数
   */
  nextLightbox(total) {
    const current = this.getLightboxIndex();
    const next = (current + 1) % total;
    this.setState({ lightboxIndex: next });
  }

  /**
   * 移动到上一个项目（灯箱）
   * @param {number} total - 总项目数
   */
  prevLightbox(total) {
    const current = this.getLightboxIndex();
    const prev = (current - 1 + total) % total;
    this.setState({ lightboxIndex: prev });
  }

  // ===== 主题操作 =====
  /**
   * 设置主题
   * @param {string} theme - 主题名 (dark, light)
   */
  setTheme(theme) {
    if (['dark', 'light'].includes(theme)) {
      this.setState({ theme });
    }
  }

  /**
   * 获取当前主题
   * @returns {string}
   */
  getTheme() {
    return this.getStateValue('theme', 'dark');
  }

  // ===== 加载状态操作 =====
  /**
   * 设置加载状态
   * @param {boolean} isLoading
   */
  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  /**
   * 检查是否加载中
   * @returns {boolean}
   */
  isLoading() {
    return this.getStateValue('isLoading', false);
  }

  // ===== 错误处理操作 =====
  /**
   * 设置错误信息
   * @param {string|null} error - 错误消息或 null
   */
  setError(error) {
    this.setState({ error });
  }

  /**
   * 获取错误信息
   * @returns {string|null}
   */
  getError() {
    return this.getStateValue('error', null);
  }

  /**
   * 清除错误信息
   */
  clearError() {
    this.setState({ error: null });
  }

  // ===== 重置操作 =====
  /**
   * 重置所有状态到初始值
   */
  reset() {
    this.setState({
      currentLanguage: 'zh',
      currentFilter: 'all',
      lightboxOpen: false,
      lightboxIndex: 0,
      theme: 'dark',
      isLoading: false,
      error: null,
    });
  }
}

/**
 * 创建全局 Store 实例
 */
export const appStore = new AppStore();

/**
 * 初始化 Store
 * 从 localStorage 恢复之前保存的状态
 */
export function initializeStore() {
  try {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      appStore.setLanguage(savedLanguage);
    }
  } catch (_e) {
    // 降级处理
  }

  console.log('[Store] Initialized');
}

export default appStore;
