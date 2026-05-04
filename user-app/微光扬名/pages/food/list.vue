<template>
  <view class="food-claim-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <view class="nav-back" @tap="handleBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">食物领取</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <view class="claim-content">
      <view class="step-indicator">
        <view class="step-item" :class="{ active: step >= 1, completed: step > 1 }">
          <view class="step-circle">1</view>
          <text class="step-text">选择小柜</text>
        </view>
        <view class="step-line" :class="{ active: step > 1 }"></view>
        <view class="step-item" :class="{ active: step >= 2, completed: step > 2 }">
          <view class="step-circle">2</view>
          <text class="step-text">选择物资</text>
        </view>
        <view class="step-line" :class="{ active: step > 2 }"></view>
        <view class="step-item" :class="{ active: step >= 3 }">
          <view class="step-circle">3</view>
          <text class="step-text">领取成功</text>
        </view>
      </view>

      <view class="step-content">
        <view v-if="step === 1" class="step-1-cabinet">
          <view class="section-title">
            <text class="section-title-icon">🏪</text>
            <text>请选择领取小柜</text>
          </view>

          <view class="cabinet-list">
            <view
              v-for="cabinet in cabinetList"
              :key="cabinet.id"
              class="cabinet-card"
              :class="{ selected: selectedCabinet?.id === cabinet.id }"
              @tap="selectCabinet(cabinet)"
            >
              <view class="cabinet-icon">
                <text>🗄️</text>
              </view>
              <view class="cabinet-info">
                <text class="cabinet-name">{{ cabinet.location_name }}</text>
                <text class="cabinet-code">{{ cabinet.cabinet_code }}</text>
              </view>
              <view class="cabinet-slots">
                <text class="slots-text">{{ cabinet.distance ? (cabinet.distance < 1000 ? cabinet.distance + '米' : (cabinet.distance / 1000).toFixed(1) + '公里') : '--' }}</text>
              </view>
              <view v-if="selectedCabinet?.id === cabinet.id" class="selected-check">
                <text>✓</text>
              </view>
            </view>
          </view>

          <view class="action-btn-wrapper">
            <button
              class="next-btn"
              :disabled="!selectedCabinet"
              @tap="goToStep2"
            >
              下一步
            </button>
          </view>
        </view>

        <view v-if="step === 2" class="step-2-items">
          <view class="section-title">
            <text class="section-title-icon">📦</text>
            <text>请选择领取物资</text>
          </view>

          <view class="selected-cabinet-tip">
            <text>小柜：{{ selectedCabinet.location_name }}</text>
            <text class="change-btn" @tap="step = 1">修改</text>
          </view>

          <view class="category-tabs">
            <view
              v-for="cat in categories"
              :key="cat.value"
              class="category-tab"
              :class="{ active: selectedCategory === cat.value }"
              @tap="selectedCategory = cat.value"
            >
              <text>{{ cat.label }}</text>
            </view>
          </view>

          <view class="items-list">
            <view
              v-for="item in filteredItems"
              :key="item.id"
              class="item-card"
              :class="{ selected: selectedItem?.id === item.id, disabled: item.current_quantity <= 0 }"
              @tap="selectItem(item)"
            >
              <view class="item-icon">
                <text>{{ getCategoryIcon(item.category) }}</text>
              </view>
              <view class="item-info">
                <text class="item-name">{{ item.item_name }}</text>
                <text class="item-category">{{ getCategoryName(item.category) }}</text>
              </view>
              <view class="item-stock">
                <text class="stock-text">剩余数量：{{ item.current_quantity }}</text>
              </view>
              <view v-if="selectedItem?.id === item.id" class="item-selected-check">
                <text>✓</text>
              </view>
              <view v-if="item.current_quantity <= 0" class="item-empty-tag">
                <text>已领完</text>
              </view>
            </view>
          </view>

          <view class="action-btn-wrapper">
            <button
              class="claim-btn"
              :disabled="!selectedItem"
              @tap="showClaimModal"
            >
              立刻领取
            </button>
          </view>
        </view>

        <view v-if="step === 3" class="step-3-success">
          <view class="success-icon" :class="{ 'door-opened': claimResult?.doorOpened }">
            <text>🎉</text>
          </view>
          <text class="success-title" :class="{ 'door-opened-title': claimResult?.doorOpened }">
            {{ claimResult?.doorOpened ? '已开门' : '领取成功！' }}
          </text>
          <view class="success-info">
            <view class="success-info-item">
              <text class="info-label">物资名称</text>
              <text class="info-value">{{ claimResult?.item_name }}</text>
            </view>
            <view class="success-info-item">
              <text class="info-label">领取小柜</text>
              <text class="info-value">{{ claimResult?.location_name }}</text>
            </view>
            <view class="success-info-item">
              <text class="info-label">柜子编号</text>
              <text class="info-value">{{ claimResult?.cabinet_code }}</text>
            </view>
          </view>
          <view class="success-tip door-opened-tip" v-if="claimResult?.doorOpened">
            <text>请尽快领取物资并关闭柜门，谢谢您</text>
          </view>
          <view class="success-tip" v-else>
            <text>请到对应小柜领取您的物资</text>
          </view>
          <view class="action-btn-wrapper">
            <button class="back-home-btn" @tap="goHome">
              返回首页
            </button>
          </view>
        </view>

        <view v-if="showModal" class="modal-mask" @tap="closeModal">
          <view class="modal-content" @tap.stop>
            <view class="modal-header">
              <text class="modal-title">确认领取</text>
              <view class="modal-close" @tap="closeModal">
                <text>✕</text>
              </view>
            </view>
            
            <view class="modal-body">
              <view class="confirm-tip">
                <text class="confirm-icon">📍</text>
                <text class="confirm-text">请确认您已到达小柜位置</text>
              </view>
              
              <view class="location-info">
                <view class="location-row">
                  <text class="location-label">您的位置</text>
                  <text class="location-value">当前位置（模拟）</text>
                </view>
                <view class="location-row">
                  <text class="location-label">小柜位置</text>
                  <text class="location-value">{{ selectedCabinet?.location_name }}</text>
                </view>
                <view class="distance-row">
                  <text class="distance-label">距离</text>
                  <text class="distance-value">358米</text>
                </view>
              </view>
              
              <view class="verify-section" v-if="verifyStatus">
                <view class="verify-title" v-if="verifyStatus === 'checking'">位置检验中...</view>
                <view class="verify-title success" v-else-if="verifyStatus === 'success'">检验成功</view>
                <view class="status-icon-wrapper">
                  <text class="status-icon" v-if="verifyStatus === 'checking'">🔄</text>
                  <text class="status-icon" v-else-if="verifyStatus === 'success'">✓</text>
                </view>
              </view>
            </view>

            <view class="modal-footer">
              <view class="modal-btn-group">
                <button class="cancel-btn" @tap="closeModal">取消</button>
                <button 
                  class="verify-btn" 
                  :disabled="!!verifyStatus"
                  @tap="handleVerifyAndClaim"
                >
                  确认开柜
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="isSlowLoading" class="loading-mask">
      <view class="loading-container">
        <view class="loading-spinner-wrapper">
          <view class="loading-spinner"></view>
          <view class="loading-ring"></view>
        </view>
        <text class="loading-text">{{ loadingText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCabinetList, getCabinetItems, claimItem, openDoor } from '../../utils/api.js'
import { getUserInfo, isLoggedIn as checkAuthLoggedIn } from '../../utils/auth.js'

interface Cabinet {
  id: string
  cabinet_code: string
  location_name: string
  location_lat?: number
  location_lng?: number
  total_slots: number
  status: string
  distance: number
}

interface Item {
  id: string
  cabinet_id: string
  item_code: string
  item_name: string
  category: string
  current_quantity: number
  max_capacity: number
  status: string
  expiry_date?: string
}

const statusBarHeight = ref(0)
const step = ref(1)
const loading = ref(false)
const showModal = ref(false)
const verifyStatus = ref('')
const isSlowLoading = ref(false)
const loadingText = ref('')

let slowLoadingTimer: ReturnType<typeof setTimeout> | null = null

const cabinetList = ref<Cabinet[]>([])
const selectedCabinet = ref<Cabinet | null>(null)
const items = ref<Item[]>([])
const selectedItem = ref<Item | null>(null)
const selectedCategory = ref('all')

const claimResult = ref<{
  item_name: string
  cabinet_code: string
  location_name: string
  doorOpened?: boolean
} | null>(null)

const categories = [
  { label: '全部', value: 'all' },
  { label: '🍞 食品', value: 'food' },
  { label: '🥤 饮料', value: 'drink' },
  { label: '🧴 日用品', value: 'daily' }
]

const filteredItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return items.value
  }
  return items.value.filter(item => item.category === selectedCategory.value)
})

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    food: '🍞',
    drink: '🥤',
    daily: '🧴'
  }
  return icons[category] || '📦'
}

const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    food: '食品',
    drink: '饮料',
    daily: '日用品'
  }
  return names[category] || '其他'
}

const startLoading = (text: string = '加载中...') => {
  loadingText.value = text
  loading.value = true
  isSlowLoading.value = false
  if (slowLoadingTimer) {
    clearTimeout(slowLoadingTimer)
    slowLoadingTimer = null
  }
  slowLoadingTimer = setTimeout(() => {
    if (loading.value) {
      isSlowLoading.value = true
    }
  }, 500)
}

const stopLoading = () => {
  loading.value = false
  if (slowLoadingTimer) {
    clearTimeout(slowLoadingTimer)
    slowLoadingTimer = null
  }
  isSlowLoading.value = false
  loadingText.value = ''
}

const handleBack = () => {
  if (step.value > 1 && step.value < 3) {
    step.value--
  } else {
    uni.navigateBack()
  }
}

const selectCabinet = (cabinet: Cabinet) => {
  selectedCabinet.value = cabinet
}

const goToStep2 = async () => {
  if (!selectedCabinet.value) return

  startLoading('加载物资中...')
  try {
    const cabinetCode = selectedCabinet.value.cabinet_code
    const result = await getCabinetItems(cabinetCode)
    items.value = result
    selectedItem.value = null
    step.value = 2
  } catch (error) {
    console.error('获取物资列表失败:', error)
    uni.showToast({
      title: '加载物资失败',
      icon: 'none'
    })
  } finally {
    stopLoading()
  }
}

const selectItem = (item: Item) => {
  if (item.current_quantity <= 0) return
  selectedItem.value = item
}

const showClaimModal = () => {
  if (!selectedItem.value) return
  verifyStatus.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  verifyStatus.value = ''
}

const handleVerifyAndClaim = async () => {
  if (verifyStatus.value) return

  verifyStatus.value = 'checking'

  const currentUser = getUserInfo()
  if (!currentUser || !currentUser.id) {
    verifyStatus.value = ''
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return
  }

  startLoading('正在开门...')

  try {
    const doorResult = await openDoor(
      selectedCabinet.value?.cabinet_code || '1',
      currentUser.id,
      currentUser.phone || '13800138000'
    )

    stopLoading()

    if (doorResult.code === 200 || doorResult.code === 300) {
      verifyStatus.value = 'success'
      await new Promise(resolve => setTimeout(resolve, 1000))
      showModal.value = false
      await handleClaim(true)
    } else {
      verifyStatus.value = ''
      stopLoading()
      uni.showModal({
        title: '开门失败',
        content: doorResult.message || '无法打开柜门，请稍后重试',
        showCancel: false,
        confirmText: '确定'
      })
    }
  } catch (error) {
    stopLoading()
    verifyStatus.value = ''
    console.error('开门失败:', error)
    uni.showToast({
      title: '开门失败，请重试',
      icon: 'none'
    })
  }
}

const handleClaim = async (doorOpened: boolean = false) => {
  if (!selectedItem.value) return

  const currentUser = getUserInfo()
  if (!currentUser || !currentUser.id) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return
  }

  startLoading('领取中...')
  try {
    const result = await claimItem(selectedItem.value.id, currentUser.id)

    if (result.success) {
      claimResult.value = {
        ...result.data,
        doorOpened
      }
      const itemIndex = items.value.findIndex(i => i.id === selectedItem.value?.id)
      if (itemIndex !== -1) {
        items.value[itemIndex].current_quantity--
      }
      step.value = 3
    } else {
      uni.showToast({
        title: result.message || '领取失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('领取失败:', error)
    uni.showToast({
      title: '领取失败，请重试',
      icon: 'none'
    })
  } finally {
    stopLoading()
  }
}

const goHome = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}

const checkLoginAndLoadData = () => {
  const isLoggedIn = checkAuthLoggedIn()
  const currentUser = getUserInfo()

  if (!isLoggedIn || !currentUser) {
    uni.showModal({
      title: '提示',
      content: '请先登录后再进行食物领取',
      confirmText: '去登录',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/index'
          })
        } else {
          uni.navigateBack()
        }
      }
    })
    return false
  }
  return true
}

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })

  if (checkLoginAndLoadData()) {
    loadCabinets()
  }
})

const loadCabinets = async () => {
  try {
    const result = await Promise.race([
      getCabinetList(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('请求超时')), 10000)
      )
    ])
    cabinetList.value = result.map((cabinet: Cabinet) => ({
      ...cabinet,
      distance: Math.floor(Math.random() * 600) + 200
    }))
  } catch (error) {
    console.error('加载小柜列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    cabinetList.value = []
  }
}
</script>

<style lang="scss" scoped>
.food-claim-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%);
}

.status-bar {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
}

.nav-header {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  padding: 20rpx 30rpx 40rpx;
  padding-top: 0;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 44rpx;
  padding: 0 20rpx;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 36rpx;
  color: #FFFFFF;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 4rpx;
}

.nav-placeholder {
  width: 60rpx;
}

.claim-content {
  margin: 30rpx;
  padding-bottom: 200rpx;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50rpx;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.step-item.active {
  opacity: 1;
}

.step-item.completed {
  opacity: 1;
}

.step-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #E5E5E5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 12rpx;
  transition: all 0.3s ease;
}

.step-item.active .step-circle {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
}

.step-item.completed .step-circle {
  background: #22C55E;
}

.step-text {
  font-size: 22rpx;
  color: #737373;
}

.step-item.active .step-text {
  color: #F97316;
  font-weight: 600;
}

.step-line {
  width: 80rpx;
  height: 4rpx;
  background: #E5E5E5;
  margin: 0 20rpx;
  margin-bottom: 40rpx;
  transition: all 0.3s ease;
}

.step-line.active {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #404040;
}

.section-title-icon {
  margin-right: 12rpx;
  font-size: 36rpx;
}

.cabinet-list {
  margin-bottom: 30rpx;
}

.cabinet-card {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.cabinet-card.selected {
  border-color: #FF9955;
  background: #FFF7ED;
}

.cabinet-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-right: 24rpx;
}

.cabinet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cabinet-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #171717;
  margin-bottom: 8rpx;
}

.cabinet-code {
  font-size: 24rpx;
  color: #737373;
}

.cabinet-slots {
  padding: 8rpx 20rpx;
  background: #F3F4F6;
  border-radius: 20rpx;
}

.slots-text {
  font-size: 24rpx;
  color: #737373;
}

.selected-check {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  width: 40rpx;
  height: 40rpx;
  background: #FF9955;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: bold;
}

.action-btn-wrapper {
  margin-top: 40rpx;
}

.next-btn,
.claim-btn,
.back-home-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(249, 115, 22, 0.3);
}

.next-btn[disabled],
.claim-btn[disabled] {
  background: #D1D5DB;
  box-shadow: none;
}

.selected-cabinet-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #FFF7ED;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #F97316;
}

.change-btn {
  color: #3B82F6;
  font-weight: 600;
}

.category-tabs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 30rpx;
}

.category-tab {
  padding: 16rpx 28rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #737373;
  border: 2rpx solid #E5E5E5;
  transition: all 0.2s ease;
}

.category-tab.active {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  color: #FFFFFF;
  border-color: transparent;
}

.items-list {
  margin-bottom: 30rpx;
}

.item-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.item-card.selected {
  border-color: #FF9955;
  background: #FFF7ED;
}

.item-card.disabled {
  opacity: 0.5;
}

.item-icon {
  width: 72rpx;
  height: 72rpx;
  background: #F3F4F6;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #171717;
  margin-bottom: 6rpx;
}

.item-category {
  font-size: 22rpx;
  color: #737373;
}

.item-stock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 16rpx;
}

.stock-text {
  font-size: 24rpx;
  color: #737373;
}

.item-selected-check {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  width: 36rpx;
  height: 36rpx;
  background: #FF9955;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 22rpx;
  font-weight: bold;
}

.item-empty-tag {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  padding: 6rpx 16rpx;
  background: #FEE2E2;
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #DC2626;
}

.step-3-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 30rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.success-icon {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
  margin-bottom: 40rpx;
}

.success-icon.door-opened {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
}

.success-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #171717;
  margin-bottom: 50rpx;
}

.success-title.door-opened-title {
  color: #F59E0B;
}

.success-info {
  width: 100%;
  padding: 30rpx;
  background: #F9FAFB;
  border-radius: 20rpx;
  margin-bottom: 40rpx;
}

.success-info-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #E5E5E5;
}

.success-info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #737373;
}

.info-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #171717;
}

.success-tip {
  padding: 20rpx 40rpx;
  background: #FEF3C7;
  border-radius: 12rpx;
  margin-bottom: 40rpx;
}

.success-tip text {
  font-size: 26rpx;
  color: #92400E;
}

.success-tip.door-opened-tip {
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
  padding: 24rpx 40rpx;
}

.success-tip.door-opened-tip text {
  color: #DC2626;
  font-weight: 600;
  font-size: 28rpx;
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4rpx);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 80rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.3);
}

.loading-spinner-wrapper {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 30rpx;
}

.loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8rpx solid transparent;
  border-top-color: #FF9955;
  border-right-color: #FF824D;
  animation: spin 1s linear infinite;
}

.loading-ring {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  width: 140rpx;
  height: 140rpx;
  border: 4rpx solid rgba(255, 153, 85, 0.2);
  border-radius: 50%;
  animation: ring-pulse 2s ease-out infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #666666;
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ring-pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  width: 620rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 2rpx solid #E5E5E5;
}

.modal-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #171717;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  border-radius: 50%;
}

.modal-close text {
  font-size: 24rpx;
  color: #737373;
}

.modal-body {
  padding: 30rpx;
}

.confirm-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
  background: #FEF3C7;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
}

.confirm-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.confirm-text {
  font-size: 28rpx;
  color: #92400E;
  font-weight: 500;
}

.location-info {
  background: #F9FAFB;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.location-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 2rpx solid #E5E5E5;
}

.location-row:last-child {
  border-bottom: none;
}

.location-label {
  font-size: 26rpx;
  color: #737373;
}

.location-value {
  font-size: 26rpx;
  color: #171717;
  font-weight: 500;
}

.distance-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  background: #FFF7ED;
  margin: 16rpx -24rpx -24rpx;
  padding: 20rpx 24rpx;
  border-radius: 0 0 16rpx 16rpx;
}

.distance-label {
  font-size: 26rpx;
  color: #737373;
}

.distance-value {
  font-size: 32rpx;
  color: #F97316;
  font-weight: 700;
}

.verify-section {
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.verify-title {
  font-size: 32rpx;
  color: #737373;
  font-weight: 500;
  text-align: center;
}

.verify-title.success {
  color: #22C55E;
  font-weight: 600;
}

.status-icon-wrapper {
  margin-top: 20rpx;
}

.status-icon {
  font-size: 48rpx;
  animation: pulse 0.8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.modal-btn-group {
  display: flex;
  gap: 20rpx;
}

.cancel-btn {
  flex: 1;
  height: 96rpx;
  background: #F3F4F6;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #737373;
  border: none;
}

.verify-btn {
  flex: 1;
  height: 96rpx;
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(249, 115, 22, 0.3);
}

.verify-btn[disabled] {
  background: #D1D5DB;
  box-shadow: none;
}
</style>
