<template>
  <view class="settings-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <view class="back-btn" @tap="handleBack">
          <text class="back-icon">‹</text>
        </view>
        <text class="nav-title">设置</text>
        <view class="nav-placeholder"></view>
      </view>
    </view>

    <view class="settings-content">
      <view class="settings-section">
        <view class="section-title">辅助功能</view>
        <view class="settings-item">
          <view class="item-left">
            <view class="item-icon-wrap" style="background: #FFF7ED;">
              <text class="item-icon">♿</text>
            </view>
            <view class="item-text-wrap">
              <text class="item-title">无障碍模式</text>
              <text class="item-desc">开启后自动进行AI语音播报</text>
            </view>
          </view>
          <view class="item-right">
            <switch
              :checked="accessibilityMode"
              @change="handleAccessibilityChange"
              color="#F97316"
              style="transform: scale(0.8);"
            />
          </view>
        </view>
      </view>

      <view class="settings-section">
        <view class="section-title">关于</view>
        <view class="settings-item">
          <view class="item-left">
            <view class="item-icon-wrap" style="background: #FFF7ED;">
              <text class="item-icon">ℹ️</text>
            </view>
            <view class="item-text-wrap">
              <text class="item-title">版本信息</text>
              <text class="item-desc">当前版本 1.0.0</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { insforgeAPI, TABLE_NAMES } from '@/utils/insforge.js'
import { getUserInfo, isLoggedIn } from '@/utils/auth.js'

const statusBarHeight = ref(0)
const accessibilityMode = ref(false)
const userId = ref('')

const handleBack = () => {
  uni.navigateBack()
}

const loadUserSettings = async () => {
  if (!isLoggedIn()) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
    return
  }

  const userInfo = getUserInfo()
  if (userInfo && userInfo.id) {
    userId.value = userInfo.id
    try {
      const result = await insforgeAPI.select(TABLE_NAMES.USERS, {
        columns: 'accessibility_mode',
        filters: {
          id: userId.value
        }
      })

      if (result.data && result.data.length > 0) {
        accessibilityMode.value = result.data[0].accessibility_mode || false
      }
    } catch (error) {
      console.error('加载用户设置失败:', error)
    }
  }
}

const handleAccessibilityChange = async (e: any) => {
  const newValue = e.detail.value
  accessibilityMode.value = newValue

  try {
    const result = await insforgeAPI.update(
      TABLE_NAMES.USERS,
      { accessibility_mode: newValue },
      { id: userId.value }
    )

    if (result.error) {
      accessibilityMode.value = !newValue
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      })
    } else {
      uni.showToast({
        title: newValue ? '已开启无障碍模式' : '已关闭无障碍模式',
        icon: 'success'
      })
    }
  } catch (error) {
    console.error('保存设置失败:', error)
    accessibilityMode.value = !newValue
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })
  loadUserSettings()
})
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%);
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
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
}

.back-icon {
  font-size: 40rpx;
  color: #FFFFFF;
  font-weight: 600;
  line-height: 1;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 4rpx;
}

.nav-placeholder {
  width: 64rpx;
}

.settings-content {
  padding: 60rpx 30rpx 40rpx;
}

.settings-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 26rpx;
  color: #737373;
  padding: 24rpx 30rpx 16rpx;
  font-weight: 500;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 30rpx;
  border-bottom: 2rpx solid #FFF7ED;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.item-icon {
  font-size: 36rpx;
}

.item-text-wrap {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 30rpx;
  color: #171717;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #737373;
}

.item-right {
  display: flex;
  align-items: center;
}
</style>