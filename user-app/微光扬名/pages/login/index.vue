<template>
  <view class="login-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <text class="nav-title">{{ isRegisterMode ? '注册' : '登录' }}</text>
        <view class="back-btn" @tap="goBack">
          <text class="back-icon">‹</text>
        </view>
      </view>
    </view>

    <view class="login-content">
      <view class="logo-section">
        <view class="logo-wrap">
          <text class="logo-icon">🌟</text>
        </view>
        <text class="app-name">微光扬名</text>
        <text class="app-desc">{{ isRegisterMode ? '创建账号，开始领取爱心物资' : '欢迎回来，登录领取爱心物资' }}</text>
      </view>

      <view class="form-section">
        <view class="form-item" v-if="isRegisterMode">
          <view class="form-label">姓名</view>
          <input
            class="form-input"
            type="text"
            v-model="loginForm.name"
            placeholder="请输入您的姓名"
          />
        </view>

        <view class="form-item">
          <view class="form-label">手机号</view>
          <input
            class="form-input"
            type="text"
            inputmode="numeric"
            v-model="loginForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>

        <view class="form-item">
          <view class="form-label">密码</view>
          <input
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            v-model="loginForm.password"
            placeholder="请输入密码"
          />
          <view class="password-toggle" @tap="showPassword = !showPassword">
            <text class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
          </view>
        </view>

        <view class="form-item" v-if="isRegisterMode">
          <view class="form-label">确认密码</view>
          <input
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            v-model="loginForm.confirmPassword"
            placeholder="请再次输入密码"
          />
        </view>

        <view class="form-item error-item" v-if="errorMsg">
          <text class="error-text">{{ errorMsg }}</text>
        </view>

        <button class="login-btn" @tap="isRegisterMode ? handleRegister() : handleLogin()">
          <text class="login-btn-text" v-if="!loading">{{ isRegisterMode ? '注册' : '登录' }}</text>
          <view class="login-btn-loading" v-else>
            <view class="btn-loading-spinner"></view>
            <text class="btn-loading-text">{{ isRegisterMode ? '注册中...' : '登录中...' }}</text>
          </view>
        </button>

        <view class="tips-section">
          <text class="tips-text" @tap="toggleMode">{{ isRegisterMode ? '已有账号？立即登录' : '没有账号？立即注册' }}</text>
        </view>
      </view>
    </view>

    <view class="bottom-safe-area"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { signInWithPhone, signUp, AUTH_STORAGE_KEY, USER_INFO_KEY } from '../../utils/auth.js'

const statusBarHeight = ref(0)
const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref('')
const isRegisterMode = ref(false)

const loginForm = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  name: ''
})

onLoad((options) => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })
  if (options.mode === 'register') {
    isRegisterMode.value = true
  }
})

const goBack = () => {
  uni.navigateBack()
}

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  errorMsg.value = ''
  loginForm.value = {
    phone: '',
    password: '',
    confirmPassword: '',
    name: ''
  }
}

const validateForm = () => {
  if (!loginForm.value.phone) {
    errorMsg.value = '请输入手机号'
    return false
  }
  if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    errorMsg.value = '请输入正确的手机号'
    return false
  }
  if (!loginForm.value.password) {
    errorMsg.value = '请输入密码'
    return false
  }
  if (loginForm.value.password.length < 6) {
    errorMsg.value = '密码长度不能少于6位'
    return false
  }
  if (isRegisterMode.value) {
    if (!loginForm.value.name) {
      errorMsg.value = '请输入姓名'
      return false
    }
    if (loginForm.value.password !== loginForm.value.confirmPassword) {
      errorMsg.value = '两次输入的密码不一致'
      return false
    }
  }
  errorMsg.value = ''
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMsg.value = ''

  try {
    const result = await signInWithPhone(loginForm.value.phone, loginForm.value.password)

    if (result.success) {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })

      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      errorMsg.value = result.message || '登录失败'
    }
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMsg.value = error.message || '网络错误，请重试'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMsg.value = ''

  try {
    const result = await signUp(
      loginForm.value.phone,
      loginForm.value.password,
      loginForm.value.name
    )

    if (result.success) {
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      })

      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      errorMsg.value = result.message || '注册失败'
    }
  } catch (error: any) {
    console.error('注册失败:', error)
    errorMsg.value = error.message || '网络错误，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
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

.back-btn {
  position: absolute;
  left: 20rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.back-icon {
  font-size: 48rpx;
  color: #FFFFFF;
  font-weight: bold;
  line-height: 1;
}

.login-content {
  padding: 80rpx 40rpx 40rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo-wrap {
  width: 160rpx;
  height: 160rpx;
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(249, 115, 22, 0.3);
}

.logo-icon {
  font-size: 80rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #171717;
  margin-bottom: 8rpx;
}

.app-desc {
  font-size: 28rpx;
  color: #737373;
  text-align: center;
  line-height: 1.5;
}

.form-section {
  background: #FFFFFF;
  border-radius: 32rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.06);
}

.form-item {
  margin-bottom: 32rpx;
  position: relative;
}

.form-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #404040;
  margin-bottom: 16rpx;
}

.form-input {
  height: 88rpx;
  background: #F8F8F8;
  border-radius: 16rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  color: #171717;
}

.form-input::placeholder {
  color: #999999;
}

.password-toggle {
  position: absolute;
  right: 30rpx;
  bottom: 24rpx;
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-icon {
  font-size: 36rpx;
}

.error-item {
  background: #FEF2F2;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 24rpx;
}

.error-text {
  font-size: 26rpx;
  color: #EF4444;
}

.login-btn {
  height: 88rpx;
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(249, 115, 22, 0.3);
}

.login-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.login-btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-loading-spinner {
  width: 36rpx;
  height: 36rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-top-color: #FFFFFF;
  border-radius: 50%;
  animation: btn-spin 0.8s linear infinite;
  margin-right: 16rpx;
}

.btn-loading-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

.login-btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.tips-section {
  display: flex;
  justify-content: center;
}

.tips-text {
  font-size: 24rpx;
  color: #999999;
}

.bottom-safe-area {
  height: 60rpx;
}
</style>
