import { request } from "./request.js"

export default {
  // ==================== ServantClass 相关接口 ====================

  /**
   * 创建从者职介
   * @param {Object} dto - 从者职介数据 {enName, name}
   */
  create(dto) {
    return request({
      url: "/servant-class",
      method: "post",
      data: dto,
    })
  },

  /**
   * 查询所有从者职介
   */
  findAll() {
    return request({
      url: "/servant-class",
      method: "get",
    })
  },

  /**
   * 根据 ID 查询从者职介
   * @param {number} id - 从者职介 ID
   */
  findById(id) {
    return request({
      url: `/servant-class/${id}`,
      method: "get",
    })
  },

  /**
   * 更新从者职介
   * @param {number} id - 从者职介 ID
   * @param {Object} dto - 从者职介数据 {enName, name}
   */
  update(id, dto) {
    return request({
      url: `/servant-class/${id}`,
      method: "put",
      data: dto,
    })
  },

  /**
   * 软删除从者职介（支持批量删除）
   * @param {number[]} ids - 从者职介 ID 数组
   */
  delete(ids) {
    return request({
      url: "/servant-class",
      method: "delete",
      data: ids,
    })
  },

  /**
   * 恢复已删除的从者职介（支持批量恢复）
   * @param {number[]} ids - 从者职介 ID 数组
   */
  restore(ids) {
    return request({
      url: "/servant-class/restore",
      method: "post",
      data: ids,
    })
  },

  // ==================== ServantClassDamageRatio 相关接口 ====================

  /**
   * 根据 ID 查询克制关系
   * @param {number} id - 克制关系 ID
   */
  findDamageRatioById(id) {
    return request({
      url: `/servant-class/damage-ratio/${id}`,
      method: "get",
    })
  },

  /**
   * 根据攻击者和防御者 ID 查询克制关系
   * @param {number} attackerId - 攻击者 ID
   * @param {number} defenderId - 防御者 ID
   */
  findDamageRatioByAttackerAndDefender(attackerId, defenderId) {
    return request({
      url: "/servant-class/damage-ratio",
      method: "get",
      params: { attackerId, defenderId },
    })
  },

  /**
   * 获取克制倍率
   * @param {number} attackerId - 攻击者 ID
   * @param {number} defenderId - 防御者 ID
   */
  getDamageRatio(attackerId, defenderId) {
    return request({
      url: "/servant-class/damage-ratio/ratio",
      method: "get",
      params: { attackerId, defenderId },
    })
  },

  /**
   * 保存或更新克制关系
   * @param {Object} dto - 克制关系数据 {attackerId, attackerName, defenderId, defenderName, param}
   */
  saveDamageRatio(dto) {
    return request({
      url: "/servant-class/damage-ratio",
      method: "post",
      data: dto,
    })
  },

  /**
   * 更新克制关系
   * @param {number} id - 克制关系 ID
   * @param {Object} entity - 克制关系实体
   */
  updateDamageRatio(id, entity) {
    return request({
      url: `/servant-class/damage-ratio/${id}`,
      method: "put",
      data: entity,
    })
  },

  /**
   * 软删除克制关系（支持批量删除）
   * @param {number[]} ids - 克制关系 ID 数组
   */
  deleteDamageRatio(ids) {
    return request({
      url: "/servant-class/damage-ratio",
      method: "delete",
      data: ids,
    })
  },

  /**
   * 恢复已删除的克制关系（支持批量恢复）
   * @param {number[]} ids - 克制关系 ID 数组
   */
  restoreDamageRatio(ids) {
    return request({
      url: "/servant-class/damage-ratio/restore",
      method: "post",
      data: ids,
    })
  },
}
