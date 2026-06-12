/**
 * ============================================
 * Store 模块入口
 * ============================================
 * 统一导出所有状态管理模块
 */

export { appStore, initializeStore } from './appStore.js';

export default {
  app: () => import('./appStore.js'),
};
