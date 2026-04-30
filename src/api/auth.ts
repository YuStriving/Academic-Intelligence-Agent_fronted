/**
 * 认证相关API
 * 
 * 后端实现参照：
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/register
 * - GET  /api/v1/auth/me
 * - POST /api/v1/auth/logout
 */
import { http } from './client'
import type {
  LoginRequest,
  LogoutOrRefreshRequest,
  RegisterRequest,
  AuthNoRefreshTokenResponse,
  AuthAccessToken,
  UserInfo,
  PasswordResetRequest,
  ForgetPasswordRequest,
  SendCodeRequest,
  SendCodeResponse,
  UpdateUserProfileRequest,
  DeleteAccountRequest,
} from './types'

export const authApi = {
  /**
   * 用户登录
   * POST /api/v1/auth/login
   *
   * 返回: AuthNoRefreshTokenResponse（不含 refreshToken，已在 HttpOnly Cookie 中）
   */
  login(data: LoginRequest): Promise<AuthNoRefreshTokenResponse> {
    return http.post<AuthNoRefreshTokenResponse>('/api/v1/auth/login', data)
  },

  /**
   * 用户注册
   * POST /api/v1/auth/register
   *
   * 返回: AuthNoRefreshTokenResponse（不含 refreshToken，已在 HttpOnly Cookie 中）
   */
  register(data: RegisterRequest): Promise<AuthNoRefreshTokenResponse> {
    return http.post<AuthNoRefreshTokenResponse>('/api/v1/auth/register', data)
  },

  /**
   * 获取当前用户信息
   * GET /api/v1/auth/me
   */
  getMe(): Promise<UserInfo> {
    return http.get<UserInfo>('/api/v1/auth/me')
  },

  /**
   * 用户登出
   * POST /api/v1/auth/logout
   */
  logout(data: LogoutOrRefreshRequest): Promise<void> {
    return http.post<void>('/api/v1/auth/logout', data)
  },

  /**
   * 刷新访问令牌
   * POST /api/v1/auth/refresh
   *
   * 说明: refreshToken 已在 HttpOnly Cookie 中，无需手动传递
   *
   * 返回: AuthAccessToken（只包含新的 accessToken 和过期时间）
   */
  refresh(data: LogoutOrRefreshRequest): Promise<AuthAccessToken> {
    return http.post<AuthAccessToken>('/api/v1/auth/refresh', data)
  },

  /**
   * 重置密码
   * POST /api/v1/auth/reset/password
   * 
   */
  resetPassword(data: PasswordResetRequest): Promise<void> {
    return http.post<void>('/api/v1/auth/reset/password', data);
  },

  /**
   * 用户全设备登出
   * POST /api/v1/auth/logout/all
   * 
   * 说明: 使该用户所有设备的令牌失效，用户需要在所有设备重新登录
   */
  logoutAll(data: LogoutOrRefreshRequest): Promise<void> {
    return http.post<void>('/api/v1/auth/logout/all', data);
  },

  /**
   * 发送验证码
   * POST /api/v1/auth/sendCode
   * 
   * 说明: 用于忘记密码或注册时发送验证码
   * 场景参数:
   * - scene = "RESETPASSWORD": 忘记密码场景
   * - scene = "REGISTER": 注册场景
   */
  sendCode(data: SendCodeRequest): Promise<SendCodeResponse> {
    return http.post<SendCodeResponse>('/api/v1/auth/sendCode', data);
  },

  /**
   * 忘记密码（无需旧密码，通过验证码重置）
   * POST /api/v1/auth/forget/password
   * 
   * 说明: 用户忘记密码时，通过邮箱/用户名+验证码+新密码来重置
   */
  forgetPassword(data: ForgetPasswordRequest): Promise<void> {
    return http.post<void>('/api/v1/auth/forget/password', data);
  },

  /**
   * 更新用户资料
   * PATCH /api/v1/user/profile/update
   *
   * 说明: 只传发生变更的字段，未变更的字段传 null
   * 修改邮箱时需要传入 validateCode 验证码
   */
  updateProfile(data: UpdateUserProfileRequest): Promise<UserInfo> {
    return http.patch<UserInfo>('/api/v1/user/profile/update', data);
  },

  /**
   * 删除账号（需要验证码确认）
   * DELETE /api/v1/user/profile/user/delete
   *
   * 对应后端: UserController.deleteUser()
   * 请求体: UserDeletedRequest { emailOrUserName, scene, validateCode }
   *
   * 说明: 用户删除自己的账号，需要邮箱/用户名 + 验证场景 + 验证码三重验证
   * 验证码场景: scene = "DELETEACCOUNT"
   *
   * 成功后前端应执行 logout 并跳转到登录页
   */
  deleteAccount(data: DeleteAccountRequest): Promise<void> {
    return http.delete<void>('/api/v1/user/profile/user/delete', { data });
  },
}
