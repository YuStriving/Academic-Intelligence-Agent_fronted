<template>
  <div class="flex items-center justify-center min-h-screen w-full bg-[#1a2538]">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-[#2d4059] rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#2d4059] rounded-full opacity-10 blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md mx-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        <div class="flex flex-col items-center mb-8">
          <div class="w-14 h-14 flex items-center justify-center mb-4 bg-[#f5f5f0] rounded-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1a2538" stroke-width="1.5" class="w-8 h-8">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-[#1a2538] text-center">Academic Intelligence Agent</h1>
          <p class="text-sm text-gray-500 mt-1">Sign in to continue your research</p>
        </div>

        <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-shake">
          <svg class="w-5 h-5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span class="text-sm text-red-600">{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Email / Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="email"
                type="text"
                placeholder="Email / Username"
                class="w-full pl-10 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a2538] focus:bg-white transition-colors"
                :class="{'border-red-400': errors.email}"
                @input="clearError('email')"
              />
            </div>
            <p v-if="errors.email" class="mt-1.5 text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                class="w-full pl-10 pr-12 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#1a2538] focus:bg-white transition-colors"
                :class="{'border-red-400': errors.password}"
                @input="clearError('password')"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
            <p v-if="errors.password" class="mt-1.5 text-xs text-red-500">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="rememberMe" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-[#1a2538] focus:ring-[#1a2538]" />
              <span class="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-[#1a2538] hover:underline font-medium">Forgot Password?</a>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#1a2538] text-white rounded-xl font-medium text-sm hover:bg-[#2d4059] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a2538] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
              <path d="M12 2a10 10 0 019.95 9" stroke-linecap="round"/>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-gray-500">Don't have an account? </span>
          <a href="#" class="text-sm text-[#1a2538] hover:underline font-medium" @click.prevent="navigateToSignup">Sign Up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
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
    errors.email = 'Email or username is required'
    isValid = false
  } else if (!validateEmail(email.value)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!password.value) {
    errors.password = 'Password is required'
    isValid = false
  } else if (password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters'
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
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email.value && password.value.length >= 6) {
          resolve()
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1500)
    })

    const mockToken = 'mock-jwt-token-' + Date.now()
    authStore.login(mockToken, {
      email: email.value,
      name: email.value.split('@')[0] || 'User',
    })

    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch {
    errorMessage.value = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}

function navigateToSignup() {
  router.push('/signup')
}
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
