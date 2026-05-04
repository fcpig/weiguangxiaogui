<template>
  <view class="my-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <text class="nav-title">微光扬名</text>
      </view>
    </view>

    <view class="my-content">
      <view class="user-card" @tap="handleUserCardClick">
        <view class="user-info">
          <view class="avatar-wrap">
            <view class="avatar">
              <text class="avatar-text">{{ isLoggedIn ? userInfo.avatarText : '👤' }}</text>
            </view>
            <view class="vip-badge" v-if="isVip">VIP</view>
          </view>
          <view class="user-details">
            <text class="username">{{ isLoggedIn ? userInfo.name : '点击登录' }}</text>
            <text class="user-desc">{{ isLoggedIn ? userInfo.phone : '登录后享受更多服务' }}</text>
          </view>
          <view class="arrow-right" v-if="!isLoggedIn">
            <text class="arrow-icon">›</text>
          </view>
          <view class="logout-btn" v-else @tap.stop="handleLogout">
            <text class="logout-text">退出</text>
          </view>
        </view>

        <view class="user-stats" v-if="isLoggedIn">
          <view class="stat-item">
            <text class="stat-value">{{ globalStats.totalClaims }}</text>
            <text class="stat-label">总领取</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">{{ globalStats.carbonSaved }}kg</text>
            <text class="stat-label">碳排放节省</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value green">{{ globalStats.remainingResources }}</text>
            <text class="stat-label">剩余物资</text>
          </view>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" v-for="(item, index) in menuList" :key="index" @tap="handleMenuClick(item)">
          <view class="menu-left">
            <view class="menu-icon-wrap" :style="{ background: item.bgColor }">
              <text class="menu-icon">{{ item.icon }}</text>
            </view>
            <text class="menu-text">{{ item.text }}</text>
          </view>
          <view class="menu-right">
            <text class="menu-badge" v-if="item.badge">{{ item.badge }}</text>
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" v-for="(item, index) in settingList" :key="index" @tap="handleMenuClick(item)">
          <view class="menu-left">
            <view class="menu-icon-wrap" :style="{ background: item.bgColor }">
              <text class="menu-icon">{{ item.icon }}</text>
            </view>
            <text class="menu-text">{{ item.text }}</text>
          </view>
          <view class="menu-right">
            <text class="menu-arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-safe-area"></view>

    <view class="info-popup" v-if="showPopup" @tap="closePopup">
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
import { insforgeAPI, TABLE_NAMES } from '@/utils/insforge.js'
import { getUserInfo, isLoggedIn as checkAuthLoggedIn, signOut } from '@/utils/auth.js'

const CARBON_FACTOR = 0.5

const statusBarHeight = ref(0)
const activeTab = ref(2)
const isVip = ref(false)
const isLoggedIn = ref(false)
const userInfo = ref({
  id: '',
  phone: '',
  name: '',
  avatarText: '👤'
})
const globalStats = ref({
  totalClaims: 0,
  carbonSaved: 0,
  remainingResources: 0
})

const showPopup = ref(false)
const popupTitle = ref('关于我们')
const popupContent = ref('微光扬名是一个公益组织\n致力于减少食物浪费\n帮助需要的人群获得食物\n\n感谢您的支持与关注')
const popupActionText = ref('复制邮箱')
const currentActionData = ref('')

const menuList = ref([
  { icon: '📦', text: '我的订单', bgColor: '#FFF7ED', badge: 0 },
  { icon: '📍', text: '收货地址', bgColor: '#FEF9C3', badge: 0 },
  { icon: '🔔', text: '消息通知', bgColor: '#F0FDF4', badge: 0 }
])

const settingList = ref([
  { icon: '⚙️', text: '设置', bgColor: '#F8FAFC' },
  { icon: '❓', text: '帮助与反馈', bgColor: '#FAF5FF' },
  { icon: '📝', text: '关于我们', bgColor: '#FEF9C3' }
])

const checkLoginStatus = () => {
  const loggedIn = checkAuthLoggedIn()
  const storedUser = getUserInfo()

  if (loggedIn && storedUser) {
    isLoggedIn.value = true
    userInfo.value = {
      id: storedUser.id || '',
      phone: storedUser.phone || '',
      name: storedUser.name || storedUser.phone,
      avatarText: storedUser.name ? storedUser.name.charAt(0) : '👤'
    }
  } else {
    isLoggedIn.value = false
  }
}

const loadGlobalStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]

    const claimsResult = await insforgeAPI.select(TABLE_NAMES.CLAIM_RECORDS, {})
    const claims = claimsResult.data || []
    globalStats.value.totalClaims = claims.length
    globalStats.value.carbonSaved = Math.round(claims.length * CARBON_FACTOR * 10) / 10

    const itemsResult = await insforgeAPI.select(TABLE_NAMES.ITEMS, {
      filters: { status: 'available' }
    })
    const items = itemsResult.data || []
    globalStats.value.remainingResources = items.reduce((sum, item) => sum + (item.current_quantity || 0), 0)

  } catch (error) {
    console.error('加载全局统计数据失败:', error)
  }
}

const handleUserCardClick = () => {
  if (!isLoggedIn.value) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        signOut()
        isLoggedIn.value = false
        userInfo.value = {
          id: '',
          phone: '',
          name: '',
          avatarText: '👤'
        }
        globalStats.value = {
          totalClaims: 0,
          carbonSaved: 0,
          remainingResources: 0
        }
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

const handleMenuClick = (item: any) => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    }, 500)
    return
  }

  if (item.text === '关于我们') {
    popupTitle.value = '关于我们'
    popupContent.value = '微光扬名是一个公益组织\n致力于减少食物浪费\n帮助需要的人群获得食物\n\n感谢您的支持与关注'
    popupActionText.value = '复制邮箱'
    currentActionData.value = 'contact@weiguangyangming.com'
    showPopup.value = true
  } else if (item.text === '帮助与反馈') {
    popupTitle.value = '帮助与反馈'
    popupContent.value = '如有疑问或建议\n请联系邮箱：\ncontact@weiguangyangming.com'
    popupActionText.value = '复制邮箱'
    currentActionData.value = 'contact@weiguangyangming.com'
    showPopup.value = true
  } else if (item.text === '设置') {
    uni.navigateTo({
      url: '/pages/settings/index'
    })
  } else {
    uni.showToast({
      title: `${item.text} - 功能开发中`,
      icon: 'none'
    })
  }
}

const closePopup = () => {
  showPopup.value = false
}

const handlePopupAction = () => {
  uni.setClipboardData({
    data: currentActionData.value,
    success: () => {
      uni.showToast({
        title: '邮箱已复制',
        icon: 'success'
      })
    }
  })
  closePopup()
}

const switchTab = (index: number) => {
  activeTab.value = index
  const pages = ['/pages/index/index', '/pages/store/index', '/pages/my/index']
  uni.switchTab({
    url: pages[index]
  })
}

onShow(() => {
  activeTab.value = 2
  checkLoginStatus()
  loadGlobalStats()
})

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })
  uni.hideTabBar()
  checkLoginStatus()
  loadGlobalStats()
})
</script>

<style lang="scss" scoped>
.my-container {
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

.my-content {
  padding: 60rpx 30rpx 40rpx;
}

.user-card {
  padding: 40rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
  margin-bottom: 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar-wrap {
  position: relative;
  margin-right: 24rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  font-size: 60rpx;
}

.vip-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
  color: #FFFFFF;
  font-size: 18rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 36rpx;
  font-weight: 700;
  color: #171717;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 26rpx;
  color: #737373;
}

.arrow-right {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 36rpx;
  color: #D4D4D4;
}

.user-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 30rpx;
  border-top: 2rpx solid #FFF7ED;
}

.logout-btn {
  padding: 8rpx 20rpx;
  background: #FEF2F2;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-text {
  font-size: 24rpx;
  color: #EF4444;
  font-weight: 500;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #F97316;
  margin-bottom: 8rpx;
}

.stat-value.green {
  color: #22C55E;
}

.stat-label {
  font-size: 24rpx;
  color: #737373;
}

.stat-divider {
  width: 2rpx;
  height: 60rpx;
  background: #FFF7ED;
}

.menu-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 30rpx;
  border-bottom: 2rpx solid #FFF7ED;
  transition: background-color 0.15s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #FFFBF5;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon-wrap {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.menu-icon {
  font-size: 32rpx;
}

.menu-text {
  font-size: 30rpx;
  color: #171717;
  font-weight: 500;
}

.menu-right {
  display: flex;
  align-items: center;
}

.menu-badge {
  min-width: 36rpx;
  height: 36rpx;
  background: #F97316;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: #FFFFFF;
  padding: 0 10rpx;
  margin-right: 16rpx;
}

.menu-arrow {
  font-size: 32rpx;
  color: #D4D4D4;
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

.info-popup {
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
