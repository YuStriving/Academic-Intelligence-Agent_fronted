<template>
  <div class="flex items-center justify-center min-h-screen w-full bg-theme-bg-sidebar">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-theme-bg-sidebar-active rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-theme-bg-sidebar-active rounded-full opacity-10 blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md mx-4">
      <div class="bg-theme-bg-card rounded-2xl shadow-2xl p-8 animate-fade-in transition-colors duration-300">
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 flex items-center justify-center mb-4 bg-theme-bg-primary rounded-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="1.5" class="w-8 h-8">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-theme-text-primary text-center">{{ $t('common.appName') }}</h1>
          <p class="text-sm text-theme-text-tertiary mt-1">{{ $t('login.title') }}</p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-3 bg-theme-bg-error border border-theme-border-error rounded-lg flex items-center gap-2 animate-shake">
          <svg class="w-5 h-5 text-theme-text-error flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span class="text-sm text-theme-text-error">{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-theme-text-secondary mb-1.5">{{ $t('login.emailLabel') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="email"
                type="text"
                :placeholder="$t('login.emailPlaceholder')"
                class="w-full pl-10 pr-4 py-3 bg-theme-bg-input border border-transparent rounded-xl text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none focus:border-theme-border-focus focus:bg-theme-bg-input-focus transition-colors"
                :class="{'border-theme-border-error': errors.email}"
                @input="clearError('email')"
              />
            </div>
            <p v-if="errors.email" class="mt-1.5 text-xs text-theme-text-error">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-text-secondary mb-1.5">{{ $t('login.passwordLabel') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="$t('login.passwordPlaceholder')"
                class="w-full pl-10 pr-12 py-3 bg-theme-bg-input border border-transparent rounded-xl text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none focus:border-theme-border-focus focus:bg-theme-bg-input-focus transition-colors"
                :class="{'border-theme-border-error': errors.password}"
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

          <div class="flex items-center justify-between">
            <a href="#" class="text-sm text-theme-text-link hover:underline font-medium" @click.prevent="showForgotPasswordModal = true">{{ $t('login.forgotPassword') }}</a>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-theme-btn-primary-bg text-theme-btn-primary-text rounded-xl font-medium text-sm hover:bg-theme-btn-primary-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-accent-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
              <path d="M12 2a10 10 0 019.95 9" stroke-linecap="round"/>
            </svg>
            {{ isLoading ? $t('login.signingIn') : $t('login.signIn') }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-theme-text-tertiary">{{ $t('login.noAccount') }} </span>
          <a href="#" class="text-sm text-theme-text-link hover:underline font-medium" @click.prevent="navigateToSignup">{{ $t('login.signUp') }}</a>
        </div>
      </div>
    </div>

    <!-- 忘记密码弹窗 -->
    <div v-if="showForgotPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeForgotPasswordModal">
      <div class="relative w-full max-w-md mx-4 bg-theme-bg-card rounded-2xl shadow-2xl p-8 animate-fade-in">
        <button
          class="absolute top-4 right-4 text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
          @click="closeForgotPasswordModal"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div class="text-center mb-6">
          <div class="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-theme-bg-primary rounded-xl">
            <svg class="w-6 h-6 text-theme-accent-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-theme-text-primary">{{ $t('login.forgotPasswordModal.title') }}</h2>
          <p class="text-sm text-theme-text-tertiary mt-1">{{ $t('login.forgotPasswordModal.subtitle') }}</p>
        </div>

        <div v-if="forgotPasswordError" class="mb-4 p-3 bg-theme-bg-error border border-theme-border-error rounded-lg flex items-center gap-2">
          <svg class="w-4 h-4 text-theme-text-error flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span class="text-sm text-theme-text-error">{{ forgotPasswordError }}</span>
        </div>

        <div v-if="forgotPasswordSuccess" class="mb-4 p-3 bg-theme-bg-success border border-theme-border-success rounded-lg">
          <span class="text-sm text-theme-text-success">{{ forgotPasswordSuccess }}</span>
        </div>

        <form @submit.prevent="handleResetPassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-theme-text-secondary mb-1.5">{{ $t('login.forgotPasswordModal.emailOrUsernameLabel') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="forgotPasswordForm.emailOrUsername"
                type="text"
                :placeholder="$t('login.forgotPasswordModal.emailOrUsernamePlaceholder')"
                class="w-full pl-10 pr-4 py-3 bg-theme-bg-input border border-transparent rounded-xl text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none focus:border-theme-border-focus focus:bg-theme-bg-input-focus transition-colors"
                :class="{'border-theme-border-error': forgotPasswordErrors.emailOrUsername}"
                @input="clearForgotPasswordError('emailOrUsername')"
              />
            </div>
            <p v-if="forgotPasswordErrors.emailOrUsername" class="mt-1.5 text-xs text-theme-text-error">{{ forgotPasswordErrors.emailOrUsername }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-text-secondary mb-1.5">{{ $t('login.forgotPasswordModal.verificationCodeLabel') }}</label>
            <div class="flex gap-3">
              <div class="relative flex-1">
                <input
                  v-model="forgotPasswordForm.code"
                  type="text"
                  maxlength="6"
                  :placeholder="$t('login.forgotPasswordModal.verificationCodePlaceholder')"
                  class="w-full px-4 py-3 bg-theme-bg-input border border-transparent rounded-xl text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none focus:border-theme-border-focus focus:bg-theme-bg-input-focus transition-colors"
                  :class="{'border-theme-border-error': forgotPasswordErrors.code}"
                  @input="clearForgotPasswordError('code')"
                />
              </div>
              <button
                type="button"
                class="px-4 py-3 bg-theme-btn-primary-bg text-theme-btn-primary-text rounded-xl text-sm font-medium hover:bg-theme-btn-primary-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                :disabled="isSendingCode || countdown > 0"
                @click="handleSendCode"
              >
                <template v-if="isSendingCode">{{ $t('login.forgotPasswordModal.sending') }}</template>
                <template v-else-if="countdown > 0">{{ $t('login.forgotPasswordModal.countdown', { seconds: countdown }) }}</template>
                <template v-else>{{ $t('login.forgotPasswordModal.sendCode') }}</template>
              </button>
            </div>
            <p v-if="forgotPasswordErrors.code" class="mt-1.5 text-xs text-theme-text-error">{{ forgotPasswordErrors.code }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-text-secondary mb-1.5">{{ $t('login.forgotPasswordModal.newPasswordLabel') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="forgotPasswordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                :placeholder="$t('login.forgotPasswordModal.newPasswordPlaceholder')"
                class="w-full pl-10 pr-12 py-3 bg-theme-bg-input border border-transparent rounded-xl text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none focus:border-theme-border-focus focus:bg-theme-bg-input-focus transition-colors"
                :class="{'border-theme-border-error': forgotPasswordErrors.newPassword}"
                @input="clearForgotPasswordError('newPassword')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
                @click="showNewPassword = !showNewPassword"
              >
                <svg v-if="showNewPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <p v-if="forgotPasswordErrors.newPassword" class="mt-1.5 text-xs text-theme-text-error">{{ forgotPasswordErrors.newPassword }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-text-secondary mb-1.5">{{ $t('login.forgotPasswordModal.confirmPasswordLabel') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="forgotPasswordForm.confirmPassword"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                :placeholder="$t('login.forgotPasswordModal.confirmPasswordPlaceholder')"
                class="w-full pl-10 pr-12 py-3 bg-theme-bg-input border border-transparent rounded-xl text-sm text-theme-text-primary placeholder-theme-text-tertiary outline-none focus:border-theme-border-focus focus:bg-theme-bg-input-focus transition-colors"
                :class="{'border-theme-border-error': forgotPasswordErrors.confirmPassword}"
                @input="clearForgotPasswordError('confirmPassword')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"
                @click="showConfirmNewPassword = !showConfirmNewPassword"
              >
                <svg v-if="showConfirmNewPassword" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <p v-if="forgotPasswordErrors.confirmPassword" class="mt-1.5 text-xs text-theme-text-error">{{ forgotPasswordErrors.confirmPassword }}</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              class="flex-1 py-3 border border-theme-border-secondary text-theme-text-secondary rounded-xl font-medium text-sm hover:bg-theme-bg-sidebar-active transition-all duration-200"
              @click="closeForgotPasswordModal"
            >
              {{ $t('login.forgotPasswordModal.cancel') }}
            </button>
            <button
              type="submit"
              class="flex-1 py-3 bg-theme-btn-primary-bg text-theme-btn-primary-text rounded-xl font-medium text-sm hover:bg-theme-btn-primary-hover transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              :disabled="isResettingPassword"
            >
              <svg v-if="isResettingPassword" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
                <path d="M12 2a10 10 0 019.95 9" stroke-linecap="round"/>
              </svg>
              {{ isResettingPassword ? $t('login.forgotPasswordModal.resetting') : $t('login.forgotPasswordModal.resetPassword') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { authApi } from '../api/auth'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const errors = reactive({
  email: '',
  password: '',
})

function validateEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || value.length >= 3
}

function validateForm(): boolean {
  let isValid = true

  if (!email.value.trim()) {
    errors.email = t('login.errors.emailRequired')
    isValid = false
  } else if (!validateEmail(email.value)) {
    errors.email = t('login.errors.emailInvalid')
    isValid = false
  }

  if (!password.value) {
    errors.password = t('login.errors.passwordRequired')
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = t('login.errors.passwordMinLength')
    isValid = false
  }

  return isValid
}

function clearError(field: 'email' | 'password') {
  errors[field] = ''
  errorMessage.value = ''
}

async function handleLogin() {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await authApi.login({
      emailOrUsername: email.value,
      password: password.value,
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

    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (err: any) {
    errorMessage.value = err?.message || t('login.errors.invalidCredentials')
  } finally {
    isLoading.value = false
  }
}

function navigateToSignup() {
  router.push('/signup')
}

// ==================== 忘记密码功能 ====================

const showForgotPasswordModal = ref(false)
const forgotPasswordError = ref('')
const forgotPasswordSuccess = ref('')
const isSendingCode = ref(false)
const isResettingPassword = ref(false)
const countdown = ref(0)
const showNewPassword = ref(false)
const showConfirmNewPassword = ref(false)

let countdownTimer: number | null = null

const forgotPasswordForm = reactive({
  emailOrUsername: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})

const forgotPasswordErrors = reactive({
  emailOrUsername: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})

function clearForgotPasswordError(field: keyof typeof forgotPasswordErrors) {
  forgotPasswordErrors[field] = ''
  forgotPasswordError.value = ''
  forgotPasswordSuccess.value = ''
}

function closeForgotPasswordModal() {
  showForgotPasswordModal.value = false
  forgotPasswordForm.emailOrUsername = ''
  forgotPasswordForm.code = ''
  forgotPasswordForm.newPassword = ''
  forgotPasswordForm.confirmPassword = ''
  forgotPasswordError.value = ''
  forgotPasswordSuccess.value = ''
  countdown.value = 0
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  Object.keys(forgotPasswordErrors).forEach(key => {
    forgotPasswordErrors[key as keyof typeof forgotPasswordErrors] = ''
  })
}

function validateForgotPasswordForm(): boolean {
  let isValid = true
  Object.keys(forgotPasswordErrors).forEach(key => {
    forgotPasswordErrors[key as keyof typeof forgotPasswordErrors] = ''
  })
  forgotPasswordError.value = ''

  if (!forgotPasswordForm.emailOrUsername.trim()) {
    forgotPasswordErrors.emailOrUsername = t('login.forgotPasswordModal.errors.emailOrUsernameRequired')
    isValid = false
  }

  if (!forgotPasswordForm.code.trim()) {
    forgotPasswordErrors.code = t('login.forgotPasswordModal.errors.codeRequired')
    isValid = false
  }

  if (!forgotPasswordForm.newPassword) {
    forgotPasswordErrors.newPassword = t('login.forgotPasswordModal.errors.newPasswordRequired')
    isValid = false
  } else if (forgotPasswordForm.newPassword.length < 8) {
    forgotPasswordErrors.newPassword = t('login.forgotPasswordModal.errors.newPasswordMinLength')
    isValid = false
  }

  if (!forgotPasswordForm.confirmPassword) {
    forgotPasswordErrors.confirmPassword = t('login.forgotPasswordModal.errors.confirmPasswordRequired')
    isValid = false
  } else if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
    forgotPasswordErrors.confirmPassword = t('login.forgotPasswordModal.errors.passwordsNotMatch')
    isValid = false
  }

  return isValid
}

async function handleSendCode() {
  if (!forgotPasswordForm.emailOrUsername.trim()) {
    forgotPasswordErrors.emailOrUsername = t('login.forgotPasswordModal.errors.emailOrUsernameRequired')
    return
  }

  isSendingCode.value = true
  forgotPasswordError.value = ''
  forgotPasswordSuccess.value = ''

  try {
    const res = await authApi.sendCode({
      emailOrUsername: forgotPasswordForm.emailOrUsername.trim(),
      scene: 'FORGETPASSWORD',
    })

    forgotPasswordSuccess.value = t('login.forgotPasswordModal.codeSent')
    
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
    const msg = err?.message || ''
    if (msg.includes('timeout')) {
      forgotPasswordError.value = '验证码时限已过'
    } else {
      forgotPasswordError.value = msg || t('login.forgotPasswordModal.codeSendFailed')
    }
  } finally {
    isSendingCode.value = false
  }
}

async function handleResetPassword() {
  if (!validateForgotPasswordForm()) return

  isResettingPassword.value = true
  forgotPasswordError.value = ''
  forgotPasswordSuccess.value = ''

  try {
    await authApi.forgetPassword({
      emailOrUsername: forgotPasswordForm.emailOrUsername.trim(),
      newPassword: forgotPasswordForm.newPassword,
      code: forgotPasswordForm.code,
    })

    forgotPasswordSuccess.value = t('login.forgotPasswordModal.passwordResetSuccess')
    
    // 延迟关闭弹窗并跳转登录
    setTimeout(() => {
      closeForgotPasswordModal()
      email.value = forgotPasswordForm.emailOrUsername
    }, 1500)
  } catch (err: any) {
    forgotPasswordError.value = err?.message || t('login.forgotPasswordModal.passwordResetFailed')
  } finally {
    isResettingPassword.value = false
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
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
