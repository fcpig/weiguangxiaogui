<template>
  <view class="store-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <text class="nav-title">微光扬名</text>
      </view>
    </view>

    <view class="store-content">
      <view class="header-section">
        <view class="stats-card">
          <view class="stats-left">
            <view class="stats-icon-wrap">
              <text class="stats-icon">🏪</text>
            </view>
            <view class="stats-info">
              <text class="store-count">{{ storeCount }}</text>
              <text class="store-label">入驻商家</text>
            </view>
          </view>
          <view class="join-btn" @tap="handleJoin">
            <text class="btn-text">商家入驻</text>
          </view>
        </view>
      </view>

      <view class="store-list" v-if="storeList.length > 0">
        <view
          class="store-card"
          v-for="item in storeList"
          :key="item.id"
          @tap="handleStoreClick(item)"
        >
          <image class="store-image" src="/static/images/store.jpg" mode="aspectFill" />
          <view class="store-info">
            <text class="store-name">{{ item.merchant_name }}</text>
            <view class="store-stats">
              <view class="stat-item">
                <text class="stat-icon">📦</text>
                <text class="stat-label">剩余商品</text>
                <text class="stat-value">{{ item.remaining_goods }}</text>
              </view>
              <view class="stat-item">
                <text class="stat-icon">🎁</text>
                <text class="stat-label">总捐赠</text>
                <text class="stat-value">{{ item.total_donations }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-else-if="!loading">
        <view class="empty-icon-wrap">
          <text class="empty-icon">🏪</text>
        </view>
        <text class="empty-title">暂无入驻商家</text>
        <text class="empty-desc">成为第一个入驻商家，共同传递温暖</text>
      </view>

      <view class="loading-state" v-else-if="loading">
        <view class="loading-spinner-wrapper">
          <view class="loading-spinner"></view>
          <view class="loading-ring"></view>
        </view>
        <text class="loading-spinner-text">加载中...</text>
      </view>
    </view>

    <view class="bottom-safe-area"></view>

    <view v-if="isSlowLoading" class="loading-mask">
      <view class="loading-container">
        <view class="loading-spinner-wrapper">
          <view class="loading-spinner"></view>
          <view class="loading-ring"></view>
        </view>
        <text class="loading-text">{{ loadingText }}</text>
      </view>
    </view>

    <view class="store-popup" v-if="showPopup" @tap="closePopup">
      <view class="popup-mask"></view>
      <view class="popup-content" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">{{ popupTitle }}</text>
          <view class="popup-close" @tap="closePopup">
            <text class="close-icon">×</text>
          </view>
        </view>
        <view class="popup-body">
          <text class="popup-desc">{{ popupContent }}</text>
          <view class="popup-action" @tap="handlePopupAction">
            <text class="action-text">{{ popupActionText }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="custom-tabbar">
      <view class="tabbar-bg">
        <view class="tabbar-item" :class="{ active: activeTab === 0 }" @tap="switchTab(0)">
          <view class="tabbar-icon-wrap">
            <text class="tabbar-icon">🏠</text>
          </view>
          <text class="tabbar-text">首页</text>
        </view>

        <view class="tabbar-item" :class="{ active: activeTab === 1 }" @tap="switchTab(1)">
          <view class="tabbar-icon-wrap">
            <text class="tabbar-icon">🏪</text>
          </view>
          <text class="tabbar-text">商家</text>
        </view>

        <view class="tabbar-item center-item" :class="{ active: activeTab === 2 }" @tap="switchTab(2)">
          <view class="tabbar-icon-wrap center-icon">
            <text class="tabbar-icon">🧑</text>
          </view>
          <text class="tabbar-text">我的</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { insforgeAPI } from '@/utils/insforge.js'

interface StoreItem {
  id: string
  merchant_name: string
  remaining_goods: number
  total_donations: number
}

const statusBarHeight = ref(0)
const activeTab = ref(1)
const storeCount = ref(0)
const storeList = ref<StoreItem[]>([])
const loading = ref(false)
const isSlowLoading = ref(false)
const loadingText = ref('')
const showPopup = ref(false)
const popupTitle = ref('欢迎入驻')
const popupContent = ref('欢迎公益商家入驻\n微光扬名公益食物银行项目\n\n请联系邮箱：\nexample@abc.com')
const popupActionText = ref('复制邮箱')

let slowLoadingTimer: ReturnType<typeof setTimeout> | null = null

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

const handleJoin = () => {
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const handlePopupAction = () => {
  uni.setClipboardData({
    data: 'example@abc.com',
    success: () => {
      uni.showToast({
        title: '邮箱已复制',
        icon: 'success'
      })
    }
  })
  closePopup()
}

const handleStoreClick = (item: StoreItem) => {
  uni.showToast({
    title: item.merchant_name,
    icon: 'none'
  })
}

const switchTab = (index: number) => {
  activeTab.value = index
  const pages = ['/pages/index/index', '/pages/store/index', '/pages/my/index']
  uni.switchTab({
    url: pages[index]
  })
}

onShow(() => {
  activeTab.value = 1
})

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })
  uni.hideTabBar()
  loadStoreData()
})

const loadStoreData = async () => {
  startLoading('加载商家...')
  try {
    const merchantsResult = await insforgeAPI.select('merchants', {
      filters: { status: 'active' },
      order: { column: 'created_at', asc: false }
    })

    if (merchantsResult.error) {
      console.error('获取商家列表失败:', merchantsResult.error)
      uni.showToast({ title: '获取商家失败', icon: 'none' })
      return
    }

    const merchants = merchantsResult.data || []
    storeCount.value = merchants.length

    const itemsResult = await insforgeAPI.select('items', {
      filters: { status: 'available' }
    })

    const items = itemsResult.data || []
    const itemsByMerchant = {}
    items.forEach(item => {
      if (item.merchant_id) {
        if (!itemsByMerchant[item.merchant_id]) {
          itemsByMerchant[item.merchant_id] = 0
        }
        itemsByMerchant[item.merchant_id] += item.current_quantity || 0
      }
    })

    storeList.value = merchants.map(m => ({
      id: m.id,
      merchant_name: m.merchant_name,
      remaining_goods: itemsByMerchant[m.id] || 0,
      total_donations: m.total_donations || 0
    }))

  } catch (error) {
    console.error('加载商家数据失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    stopLoading()
  }
}
</script>

<style lang="scss" scoped>
.store-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%);
  padding-bottom: 160rpx;
}

.status-bar {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
}

.nav-header {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  padding: 20rpx 30rpx 50rpx;
  padding-top: 0;
  position: relative;
}

.nav-header::after {
  content: '';
  position: absolute;
  bottom: -24rpx;
  left: 0;
  right: 0;
  height: 48rpx;
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  transform: scaleY(0.5);
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 44rpx;
  position: relative;
  z-index: 2;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 4rpx;
}

.store-content {
  padding: 60rpx 30rpx 40rpx;
}

.header-section {
  margin-bottom: 40rpx;
}

.stats-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.stats-left {
  display: flex;
  align-items: center;
}

.stats-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.stats-icon {
  font-size: 52rpx;
}

.stats-info {
  display: flex;
  flex-direction: column;
}

.store-count {
  font-size: 48rpx;
  font-weight: 700;
  color: #171717;
  line-height: 1.2;
}

.store-label {
  font-size: 26rpx;
  color: #737373;
  margin-top: 4rpx;
}

.join-btn {
  height: 80rpx;
  padding: 0 40rpx;
  background: linear-gradient(135deg, #FF9A56 0%, #FF6B35 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.join-btn:active {
  transform: scale(0.96);
}

.btn-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.store-list {
  margin-top: 20rpx;
}

.list-title {
  margin-bottom: 24rpx;
}

.list-title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #404040;
}

.store-card {
  display: flex;
  padding: 24rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease;
}

.store-card:active {
  transform: scale(0.98);
}

.store-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  background: #F5F5F5;
  flex-shrink: 0;
}

.store-info {
  flex: 1;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.store-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #171717;
  margin-bottom: 16rpx;
  line-height: 1.3;
}

.store-stats {
  display: flex;
  gap: 40rpx;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 28rpx;
  margin-right: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #737373;
  margin-right: 8rpx;
}

.stat-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #F97316;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.empty-icon-wrap {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #FFF7ED 0%, #FEF3E2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #171717;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #737373;
  text-align: center;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
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

.loading-spinner-text {
  font-size: 28rpx;
  color: #666666;
  font-weight: 500;
}

.bottom-safe-area {
  height: 160rpx;
}

.custom-tabbar {
  position: fixed;
  bottom: -10rpx;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-bg {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 110rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 30%);
  padding: 0 40rpx 10rpx;
  position: relative;
}

.tabbar-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200rpx;
  height: 8rpx;
  background: #FFFFFF;
  border-radius: 0 0 100rpx 100rpx;
  pointer-events: none;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 8rpx 0;
  transition: all 0.2s ease;
  position: relative;
  z-index: 10;
}

.tabbar-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6rpx;
  transition: all 0.2s ease;
}

.center-item {
  position: relative;
}

.center-icon {
  width: 64rpx;
  height: 64rpx;
  background: transparent;
  margin-bottom: 6rpx;
}

.tabbar-icon {
  font-size: 40rpx;
}

.tabbar-text {
  font-size: 20rpx;
  color: #999999;
  font-weight: 500;
}

.tabbar-item.active .tabbar-icon-wrap {
  background: rgba(249, 115, 22, 0.1);
}

.tabbar-item.active .tabbar-icon {
  transform: scale(1.1);
}

.tabbar-item.active .tabbar-text {
  color: #F97316;
  font-weight: 600;
}

.store-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
  width: 600rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  overflow: hidden;
  margin: 0 60rpx;
}

.popup-header {
  background: linear-gradient(135deg, #E9D5FF 0%, #FCE7F3 100%);
  padding: 40rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.popup-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #6B21A8;
  letter-spacing: 2rpx;
}

.popup-close {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(168, 85, 247, 0.15);
  border-radius: 50%;
}

.close-icon {
  font-size: 40rpx;
  color: #6B21A8;
  line-height: 1;
}

.popup-body {
  padding: 50rpx 40rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup-desc {
  font-size: 30rpx;
  color: #404040;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
}

.popup-action {
  margin-top: 40rpx;
  padding: 24rpx 60rpx;
  background: linear-gradient(135deg, #E9D5FF 0%, #FCE7F3 100%);
  border-radius: 40rpx;
  border: 2rpx solid #D8B4FE;
}

.action-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #6B21A8;
}
</style>
