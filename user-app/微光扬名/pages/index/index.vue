<template>
  <view class="home-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <text class="nav-title">微光扬名</text>
      </view>
    </view>

    <swiper
      class="banner-swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
      :circular="true"
      indicator-color="rgba(255, 255, 255, 0.5)"
      indicator-active-color="#FFFFFF"
    >
      <swiper-item v-for="(item, index) in bannerList" :key="index">
        <image class="banner-image" :src="item.image" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <view class="action-card">
      <view class="action-buttons">
        <view class="action-btn food-claim" @tap="handleFoodClaim">
          <view class="action-icon">
            <text class="icon-text">🍽️</text>
          </view>
          <text class="action-title">食物领取</text>
          <text class="action-desc">减少浪费，传递温暖</text>
        </view>

        <view class="action-btn map-search" @tap="handleMapSearch">
          <view class="action-icon">
            <text class="icon-text">🗺️</text>
          </view>
          <text class="action-title">地图查找</text>
          <text class="action-desc">查找附近食物柜</text>
        </view>
      </view>
    </view>

    <view class="stats-section">
      <view class="stats-title">
        <text class="stats-title-text">📊 今日概览</text>
      </view>

      <view class="stats-row">
        <view class="stats-card food-card">
          <view class="stats-icon">🥖</view>
          <view class="stats-info">
            <text class="stats-value">{{ stats.remainingFood }}</text>
            <text class="stats-label">剩余食物</text>
          </view>
        </view>

        <view class="stats-card drink-card">
          <view class="stats-icon">🥤</view>
          <view class="stats-info">
            <text class="stats-value">{{ stats.remainingDrinks }}</text>
            <text class="stats-label">饮品类</text>
          </view>
        </view>
      </view>

      <view class="stats-row">
        <view class="stats-card donate-card">
          <view class="stats-icon">🎁</view>
          <view class="stats-info">
            <text class="stats-value">{{ stats.todayDonations }}</text>
            <text class="stats-label">今日捐赠</text>
          </view>
        </view>

        <view class="stats-card claim-card">
          <view class="stats-icon">🤝</view>
          <view class="stats-info">
            <text class="stats-value">{{ stats.todayClaims }}</text>
            <text class="stats-label">今日领取</text>
          </view>
        </view>
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

    <view class="custom-tabbar">
      <view class="tabbar-bg">
        <view
          class="tabbar-item"
          :class="{ active: activeTab === 0 }"
          @tap="switchTab(0)"
        >
          <view class="tabbar-icon-wrap">
            <text class="tabbar-icon">🏠</text>
          </view>
          <text class="tabbar-text">首页</text>
        </view>

        <view
          class="tabbar-item"
          :class="{ active: activeTab === 1 }"
          @tap="switchTab(1)"
        >
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
import { getHomeStats } from '../../utils/api.js'

const statusBarHeight = ref(0)
const activeTab = ref(0)
const isSlowLoading = ref(false)
const loadingText = ref('')
const loading = ref(false)

const bannerList = ref([
  { image: '/static/banners/banner1.jpg' },
  { image: '/static/banners/banner2.jpg' },
  { image: '/static/banners/banner3.jpg' }
])

const stats = ref({
  remainingFood: 0,
  remainingDrinks: 0,
  todayDonations: 0,
  todayClaims: 0
})

let slowLoadingTimer: ReturnType<typeof setTimeout> | null = null

const startLoading = (text: string = '加载中...') => {
  loadingText.value = text
  isSlowLoading.value = false
  loading.value = true
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

const handleFoodClaim = () => {
  uni.navigateTo({
    url: '/pages/food/list'
  })
}

const handleMapSearch = () => {
  uni.navigateTo({
    url: '/pages/map/index'
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
  activeTab.value = 0
})

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })

  uni.hideTabBar()

  loadStats()
})

const loadStats = async () => {
  startLoading('加载中...')

  try {
    const data = await getHomeStats()
    stats.value = {
      remainingFood: data.remainingFood,
      remainingDrinks: data.remainingDrinks,
      todayDonations: data.todayDonations,
      todayClaims: data.todayClaims
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '数据加载失败',
      icon: 'none'
    })
  } finally {
    stopLoading()
  }
}
</script>

<style lang="scss" scoped>
.home-container {
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
  border-bottom-left-radius: 0;
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

.banner-swiper {
  margin: 60rpx 30rpx 40rpx;
  height: 280rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(249, 115, 22, 0.2);
  position: relative;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.action-card {
  margin: 0 30rpx 40rpx;
  padding: 40rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.action-buttons {
  display: flex;
  gap: 30rpx;
}

.action-btn {
  flex: 1;
  padding: 40rpx 30rpx;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.15s ease;
}

.action-btn:active {
  transform: scale(0.96);
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.icon-text {
  font-size: 52rpx;
}

.food-claim {
  background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);

  .action-icon {
    background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
  }

  .action-title {
    color: #059669;
  }
}

.map-search {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);

  .action-icon {
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  }

  .action-title {
    color: #2563EB;
  }
}

.action-title {
  font-size: 32rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.action-desc {
  font-size: 24rpx;
  color: #737373;
}

.stats-section {
  margin: 0 30rpx;
}

.stats-title {
  margin-bottom: 24rpx;
}

.stats-title-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #404040;
}

.stats-row {
  display: flex;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.stats-card {
  flex: 1;
  padding: 32rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.stats-icon {
  font-size: 52rpx;
  margin-right: 20rpx;
}

.stats-info {
  display: flex;
  flex-direction: column;
}

.stats-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #171717;
  line-height: 1.2;
}

.stats-label {
  font-size: 24rpx;
  color: #737373;
  margin-top: 4rpx;
}

.food-card .stats-value {
  color: #F97316;
}

.drink-card .stats-value {
  color: #3B82F6;
}

.donate-card .stats-value {
  color: #22C55E;
}

.claim-card .stats-value {
  color: #8B5CF6;
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

.loading-text {
  font-size: 28rpx;
  color: #666666;
  font-weight: 500;
}
</style>
