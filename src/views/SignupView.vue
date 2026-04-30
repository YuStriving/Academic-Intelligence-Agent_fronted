<template>
  <div class="flex min-h-screen w-full items-center justify-center bg-theme-bg-sidebar py-8">
    <div class="relative mx-4 w-full max-w-lg">
      <div class="rounded-2xl bg-theme-bg-card p-10 shadow-2xl animate-fade-in transition-colors duration-300">
        <div class="mb-10 flex flex-col items-center">
          <h1 class="text-center text-3xl font-bold text-theme-text-primary">{{ $t('common.appName') }}</h1>
          <p class="mt-2 text-base text-theme-text-tertiary">{{ $t('signup.title') }}</p>
        </div>

        <div v-if="errorMessage" class="mb-6 rounded-lg border border-theme-border-error bg-theme-bg-error p-3">
          <span class="text-sm text-theme-text-error">{{ errorMessage }}</span>
        </div>
        <div v-if="successMessage" class="mb-6 rounded-lg border border-theme-border-success bg-theme-bg-success p-3">
          <span class="text-sm text-theme-text-success">{{ successMessage }}</span>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-theme-text-secondary">{{ $t('signup.usernameLabel') }}</label>
            <input
              v-model="username"
              type="text"
              :placeholder="$t('signup.usernamePlaceholder')"
              class="w-full rounded-xl border border-transparent bg-theme-bg-input px-4 py-3 text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none transition-colors focus:border-theme-border-focus focus:bg-theme-bg-input-focus"
              :class="{ 'border-theme-border-error': errors.username }"
              @input="clearError('username')"
            />
            <p v-if="errors.username" class="mt-1.5 text-xs text-theme-text-error">{{ errors.username }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-theme-text-secondary">{{ $t('signup.emailLabel') }}</label>
            <div class="flex gap-3">
              <input
                v-model="email"
                type="text"
                :placeholder="$t('signup.emailPlaceholder')"
                class="flex-1 rounded-xl border border-transparent bg-theme-bg-input px-4 py-3 text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none transition-colors focus:border-theme-border-focus focus:bg-theme-bg-input-focus"
                :class="{ 'border-theme-border-error': errors.email }"
                @input="clearError('email')"
              />
              <button
                type="button"
                class="px-4 py-3 bg-theme-btn-primary-bg text-theme-btn-primary-text rounded-xl text-sm font-medium hover:bg-theme-btn-primary-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                :disabled="isSendingCode || countdown > 0"
                @click="handleSendCode"
              >
                <template v-if="isSendingCode">{{ $t('signup.sending') }}</template>
                <template v-else-if="countdown > 0">{{ $t('signup.countdown', { seconds: countdown }) }}</template>
                <template v-else>{{ $t('signup.sendCode') }}</template>
              </button>
            </div>
            <p v-if="errors.email" class="mt-1.5 text-xs text-theme-text-error">{{ errors.email }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-theme-text-secondary">{{ $t('signup.verificationCodeLabel') }}</label>
            <input
              v-model="verificationCode"
              type="text"
              maxlength="6"
              :placeholder="$t('signup.verificationCodePlaceholder')"
              class="w-full rounded-xl border border-transparent bg-theme-bg-input px-4 py-3 text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none transition-colors focus:border-theme-border-focus focus:bg-theme-bg-input-focus"
              :class="{ 'border-theme-border-error': errors.verificationCode }"
              @input="clearError('verificationCode')"
            />
            <p v-if="errors.verificationCode" class="mt-1.5 text-xs text-theme-text-error">{{ errors.verificationCode }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-theme-text-secondary">{{ $t('signup.passwordLabel') }}</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('signup.passwordPlaceholder')"
                class="w-full rounded-xl border border-transparent bg-theme-bg-input px-4 py-3 pr-12 text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none transition-colors focus:border-theme-border-focus focus:bg-theme-bg-input-focus"
                :class="{ 'border-theme-border-error': errors.password }"
                @input="clearError('password')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1.5 text-xs text-theme-text-error">{{ errors.password }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-theme-text-secondary">{{ $t('signup.confirmPasswordLabel') }}</label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="$t('signup.confirmPasswordPlaceholder')"
                class="w-full rounded-xl border border-transparent bg-theme-bg-input px-4 py-3 pr-12 text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none transition-colors focus:border-theme-border-focus focus:bg-theme-bg-input-focus"
                :class="{ 'border-theme-border-error': errors.confirmPassword }"
                @input="clearError('confirmPassword')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1.5 text-xs text-theme-text-error">{{ errors.confirmPassword }}</p>
          </div>

          <div class="flex items-start gap-2">
            <input v-model="agreeTerms" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-theme-border-secondary text-theme-accent-primary focus:ring-theme-accent-primary" />
            <label class="text-sm text-theme-text-secondary">
              {{ $t('signup.agreeTerms') }}
              <a href="#" class="font-medium text-theme-text-link hover:underline">{{ $t('signup.termsOfService') }}</a>
              {{ $t('signup.and') }}
              <a href="#" class="font-medium text-theme-text-link hover:underline">{{ $t('signup.privacyPolicy') }}</a>
            </label>
          </div>

          <button
            type="submit"
            class="w-full rounded-xl bg-theme-btn-primary-bg py-3 text-sm font-medium text-theme-btn-primary-text transition-all duration-200 hover:bg-theme-btn-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading || !agreeTerms"
          >
            {{ isLoading ? $t('signup.creatingAccount') : $t('signup.signUp') }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <span class="text-sm text-theme-text-tertiary">{{ $t('signup.hasAccount') }} </span>
          <RouterLink to="/login" class="text-sm font-medium text-theme-text-link hover:underline">{{ $t('signup.signIn') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { authApi } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import type { ApiError } from '../api/types'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isSendingCode = ref(false)
const countdown = ref(0)

let countdownTimer: number | null = null

const errors = reactive({
  username: '',
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
})

function validateEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

function resetErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

function clearError(field: keyof typeof errors) {
  errors[field] = ''
  errorMessage.value = ''
}

function validateForm(): boolean {
  let isValid = true
  resetErrors()
  errorMessage.value = ''

  if (!username.value.trim()) {
    errors.username = t('signup.errors.usernameRequired')
    isValid = false
  } else if (username.value.trim().length < 3) {
    errors.username = t('signup.errors.usernameMinLength')
    isValid = false
  }

  if (!email.value.trim()) {
    errors.email = t('signup.errors.emailRequired')
    isValid = false
  } else if (!validateEmail(email.value.trim())) {
    errors.email = t('signup.errors.emailInvalid')
    isValid = false
  }

  if (!verificationCode.value.trim()) {
    errors.verificationCode = t('signup.errors.codeRequired')
    isValid = false
  }

  if (!password.value) {
    errors.password = t('signup.errors.passwordRequired')
    isValid = false
  } else if (password.value.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = t('signup.errors.confirmPasswordRequired')
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = t('signup.errors.passwordsNotMatch')
    isValid = false
  }

  if (!agreeTerms.value) {
    errorMessage.value = t('signup.errors.agreeTermsRequired')
    isValid = false
  }

  return isValid
}

async function handleSendCode() {
  if (!email.value.trim()) {
    errors.email = t('signup.errors.emailRequired')
    return
  }
  
  if (!validateEmail(email.value.trim())) {
    errors.email = t('signup.errors.emailInvalid')
    return
  }

  isSendingCode.value = true
  errorMessage.value = ''

  try {
    const res = await authApi.sendCode({
      emailOrUsername: email.value.trim(),
      scene: 'REGISTER',
    })

    successMessage.value = t('signup.codeSent')
    
    // 根据后端返回的expireTime设置倒计时
    countdown.value = Math.max(res.expireTime, 60)
    countdownTimer = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (err: any) {
    errorMessage.value = err?.message || t('signup.errors.codeSendFailed')
  } finally {
    isSendingCode.value = false
  }
}

async function handleSignup() {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const usernameValue = username.value.trim()
    const emailValue = email.value.trim().toLowerCase()

    const res = await authApi.register({
      username: usernameValue,
      email: emailValue,
      password: password.value,
      agreeTerms: agreeTerms.value,
      validateCode: verificationCode.value.trim(),
    })

    authStore.login(
      res.accessToken,           // ✅ 新结构：直接访问 accessToken
      '',                        // refreshToken 已在 HttpOnly Cookie 中，传空字符串
      {                         // ✅ 新结构：用户信息在 userInfoResponse 中
        id: res.userInfoResponse.id,
        email: res.userInfoResponse.email,
        name: res.userInfoResponse.nickname || res.userInfoResponse.username,
        username: res.userInfoResponse.username,
        academicId: res.userInfoResponse.academicId,
        avatarUrl: res.userInfoResponse.avatarUrl,
        school: res.userInfoResponse.school,
        bio: res.userInfoResponse.bio,
        gender: res.userInfoResponse.gender,
        createdAt: res.userInfoResponse.createdAt,
      },
      res.expiresIn             // ✅ 新结构：直接访问 expiresIn
    )

    successMessage.value = t('signup.accountCreated')

    router.push('/').catch(err => {
      if (err.name !== 'NavigationDuplicated' && err.name !== 'NavigationFailure') {
        window.location.href = '/'
      }
    })
  } catch (error: unknown) {
    const err = error as Partial<ApiError>
    const code = err.code
    const message = err.message || ''

    if (code === 40901) {
      errors.username = 'Username already exists'
      errorMessage.value = 'Username already exists'
    } else if (code === 40902) {
      errors.email = 'Email already exists'
      errorMessage.value = 'Email already exists'
    } else if (message.includes('Password is too short')) {
      errors.password = 'Password must be at least 8 characters'
      errorMessage.value = 'Password must be at least 8 characters'
    } else {
      errorMessage.value = message || t('signup.errors.registrationFailed')
    }
  } finally {
    isLoading.value = false
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s ease-out; }
</style>
