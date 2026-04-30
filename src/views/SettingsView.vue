<template>
  <div class="flex h-screen overflow-hidden bg-theme-bg-primary transition-colors duration-300">
    <Sidebar />
    <div class="flex flex-1 overflow-hidden">
      <main class="flex-1 flex flex-col bg-theme-bg-primary overflow-hidden transition-colors duration-300">
        <div class="flex-1 overflow-y-auto p-8">
          <div class="max-w-4xl mx-auto space-y-6 pb-24">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-bold text-theme-text-primary"><span class="text-lg font-normal text-theme-text-secondary ml-2">{{ $t('settings.subtitle') }}</span></h1>
                <p class="text-sm text-theme-text-secondary mt-1">{{ $t('settings.description') }}</p>
              </div>
              <button @click="handleResetAll" class="text-sm text-theme-text-secondary hover:text-theme-text-primary underline transition-colors">{{ $t('settings.restoreDefaults') }}</button>
            </div>

            <!-- Profile -->
            <section class="settings-section">
              <div class="flex items-center justify-between mb-4">
                <h2 class="section-title"><svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.profile') }}</h2>
                <button v-if="!isEditingProfile" @click="startEditingProfile" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ $t('settings.editProfile') }}
                </button>
                <div v-else class="flex items-center gap-2">
                  <button @click="cancelEditingProfile" class="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary border border-theme-border-primary">
                    {{ $t('settings.cancel') }}
                  </button>
                  <button @click="saveEditingProfile" :disabled="isSavingProfile" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isSavingProfile" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,14" stroke-dashoffset="0"/></svg>
                    {{ $t('settings.save') }}
                  </button>
                </div>
              </div>
              <div v-if="isEditingProfile && profileSaveError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ profileSaveError }}</div>
              <div v-if="isEditingProfile && profileSaveSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{{ profileSaveSuccess }}</div>
              <div class="flex items-start gap-6">
                <div class="relative group cursor-pointer">
                  <div class="w-24 h-24 rounded-full bg-theme-bg-input overflow-hidden flex items-center justify-center border-2 border-theme-border-primary shadow-md">
                    <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" />
                    <svg v-else class="w-10 h-10 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <div v-if="isEditingProfile" class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span class="text-white text-xs font-medium">{{ $t('common.edit') }}</span></div>
                  <input v-if="isEditingProfile" ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
                </div>
                <div class="flex-1 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="field-label">{{ $t('settings.username') }}</label><input v-model="settings.username" type="text" disabled class="field-input-disabled" /></div>
                    <div>
                      <label class="field-label">{{ $t('settings.academicId') }}</label>
                      <input v-model="settings.academicId" type="text" :disabled="!isEditingProfile" :class="isEditingProfile ? 'field-input' : 'field-input-disabled'" />
                      <p v-if="isEditingProfile" class="mt-1.5 text-xs text-amber-500 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {{ $t('settings.academicIdHint') }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="field-label">{{ $t('settings.nickname') }}</label><input v-model="settings.nickname" type="text" :disabled="!isEditingProfile" :class="isEditingProfile ? 'field-input' : 'field-input-disabled'" :placeholder="$t('settings.nicknamePlaceholder')" /></div>
                    <div>
                      <label class="field-label">{{ $t('settings.email') }}</label>
                      <div v-if="isEditingProfile">
                        <input v-model="settings.email" type="email" :class="isEmailChanged ? 'field-input border-amber-400' : 'field-input'" :placeholder="$t('settings.emailPlaceholder')" />
                        <div v-if="isEmailChanged" class="mt-2 flex items-center gap-2">
                          <input v-model="profileEmailCode" type="text" class="flex-1 field-input" :placeholder="$t('settings.codePlaceholder')" />
                          <button @click="handleSendEmailCode" :disabled="isSendingEmailCode" class="px-3 py-2 text-xs font-medium rounded-lg transition-colors flex-shrink-0 whitespace-nowrap" :class="isSendingEmailCode ? 'bg-theme-bg-active text-theme-text-disabled cursor-not-allowed' : 'bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover'">
                            {{ isSendingEmailCode ? `${emailCodeCountdown}s` : $t('settings.sendCode') }}
                          </button>
                        </div>
                        <p v-if="isEmailChanged" class="mt-1.5 text-xs text-amber-500 flex items-center gap-1">
                          <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          {{ $t('settings.emailChangedHint') }}
                        </p>
                      </div>
                      <input v-else v-model="settings.email" type="email" disabled class="field-input-disabled" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div><label class="field-label">{{ $t('settings.gender') }}</label>
                      <select v-if="isEditingProfile" v-model="settings.gender" class="field-input cursor-pointer">
                        <option value="男">{{ $t('settings.male') }}</option>
                        <option value="女">{{ $t('settings.female') }}</option>
                        <option value="未知">{{ $t('settings.unknown') }}</option>
                      </select>
                      <input v-else v-model="settings.gender" type="text" disabled class="field-input-disabled" />
                    </div>
                    <div><label class="field-label">{{ $t('settings.school') }}</label><input v-model="settings.school" type="text" :disabled="!isEditingProfile" :class="isEditingProfile ? 'field-input' : 'field-input-disabled'" :placeholder="$t('settings.schoolPlaceholder')" /></div>
                  </div>
                  <div><label class="field-label">{{ $t('settings.bio') }}</label><textarea v-model="settings.bio" rows="3" :disabled="!isEditingProfile" :class="isEditingProfile ? 'field-input resize-none' : 'field-input-disabled resize-none'" :placeholder="$t('settings.bioPlaceholder')"></textarea></div>
                </div>
              </div>
            </section>

            <!-- Search Preferences -->
            <section class="settings-section">
              <div class="flex items-center justify-between mb-4">
                <h2 class="section-title"><svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854-.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.searchPreferences') }}</h2>
                <button v-if="!isEditingPreferences" @click="startEditingPreferences" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ $t('settings.editPreferences') }}
                </button>
                <div v-else class="flex items-center gap-2">
                  <button @click="cancelEditingPreferences" :disabled="isSavingPreferences" class="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary border border-theme-border-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ $t('settings.cancel') }}
                  </button>
                  <button @click="saveSearchPreferences" :disabled="isSavingPreferences" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isSavingPreferences" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,14" stroke-dashoffset="0"/></svg>
                    {{ isSavingPreferences ? $t('settings.saving') : $t('settings.savePreferences') }}
                  </button>
                </div>
              </div>

              <!-- 错误提示 -->
              <div v-if="isEditingPreferences && preferencesSaveError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ preferencesSaveError }}</div>

              <!-- 成功提示 -->
              <div v-if="isEditingPreferences && preferencesSaveSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{{ preferencesSaveSuccess }}</div>
              
              <!-- 加载状态指示器 -->
              <div v-if="isLoadingPreferences" class="flex items-center justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-theme-accent-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-theme-text-secondary">{{ $t('settings.loading') }}</span>
              </div>

              <div v-else class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="field-label">{{ $t('settings.defaultYearRange') }}</label><div class="flex items-center gap-2"><input v-model.number="settings.yearRangeStart" type="number" min="2015" :disabled="!isEditingPreferences" :class="isEditingPreferences ? 'field-input' : 'field-input-disabled'" :placeholder="$t('settings.yearRangeStart')" @blur="onYearRangeStartBlur" /><span class="text-theme-text-tertiary">-</span><input v-model.number="settings.yearRangeEnd" type="number" :min="settings.yearRangeStart + 1" :disabled="!isEditingPreferences" :class="isEditingPreferences ? 'field-input' : 'field-input-disabled'" :placeholder="$t('settings.yearRangeEnd')" @blur="onYearRangeEndBlur" /></div></div>
                  <div>
                    <label class="field-label">{{ $t('settings.maxResults') }}</label>
                    <input
                      v-model.number="settings.maxResults"
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      :disabled="!isEditingPreferences"
                      :class="isEditingPreferences ? 'field-input' : 'field-input-disabled'"
                      @blur="onMaxResultsBlur"
                    />
                    <p class="text-xs text-theme-text-tertiary mt-1">{{ $t('settings.maxResultsRangeHint') }}</p>
                    <p v-if="maxResultsComplianceHint" class="text-xs text-amber-600 mt-1">{{ maxResultsComplianceHint }}</p>
                  </div>
                </div>
                <div><div class="flex items-center justify-between mb-2"><label class="text-sm font-medium text-theme-text-primary">{{ $t('settings.matchScoreLabel') }}</label></div><MatchScoreSlider v-model="settings.minMatchScore" :min="40" :max="80" :step="5" :disabled="!isEditingPreferences" /></div>
                <div><label class="field-label">{{ $t('settings.searchSources') }}</label><div class="flex flex-wrap gap-3"><div v-for="source in searchSources" :key="source.id" class="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border transition-all select-none" :class="[isEditingPreferences ? 'cursor-pointer hover:border-theme-border-secondary' : 'cursor-not-allowed opacity-75', settings.sources.includes(source.id) ? 'border-theme-accent-primary bg-theme-accent-light text-theme-accent-primary' : 'border-theme-border-primary bg-theme-bg-card text-theme-text-secondary']" @click="isEditingPreferences && toggleSource(source.id)"><div class="w-4 h-4 rounded border flex items-center justify-center transition-colors" :class="settings.sources.includes(source.id) ? 'bg-theme-accent-primary border-theme-accent-primary' : 'border-theme-border-secondary bg-theme-bg-card'"><svg v-if="settings.sources.includes(source.id)" class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg></div><span class="text-sm">{{ source.label }}</span></div></div></div>
                <div class="grid grid-cols-2 gap-4 pt-2 border-t border-theme-border-secondary">
                  <div><label class="field-label">{{ $t('settings.defaultSort') }}</label><select v-model="settings.defaultSort" :disabled="!isEditingPreferences" :class="isEditingPreferences ? 'field-input cursor-pointer' : 'field-input-disabled cursor-not-allowed'"><option value="relevance">{{ $t('settings.relevance') }}</option><option value="date_desc">{{ $t('settings.newestFirst') }}</option><option value="date_asc">{{ $t('settings.oldestFirst') }}</option><option value="citations">{{ $t('settings.mostCited') }}</option></select></div>
                  <div><label class="field-label">{{ $t('settings.paperTypeFilter') }}</label><select v-model="settings.paperType" :disabled="!isEditingPreferences" :class="isEditingPreferences ? 'field-input cursor-pointer' : 'field-input-disabled cursor-not-allowed'"><option value="all">{{ $t('settings.allTypes') }}</option><option value="journal">{{ $t('settings.journalArticles') }}</option><option value="conference">{{ $t('settings.conferencePapers') }}</option><option value="preprint">{{ $t('settings.preprints') }}</option></select></div>
                </div>
              </div>
            </section>

            <!-- RAG Config -->
            <section class="settings-section">
              <div class="flex items-center justify-between mb-4">
                <h2 class="section-title"><svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.ragConfiguration') }}</h2>
                <button v-if="!isEditingAiRag" @click="startEditingAiRag" :disabled="isLoadingAiRag" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ $t('settings.editConfig') }}
                </button>
                <div v-else class="flex items-center gap-2">
                  <button @click="cancelEditingAiRag" :disabled="isSavingAiRag" class="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-theme-text-secondary hover:text-theme-text-primary border border-theme-border-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ $t('settings.cancel') }}
                  </button>
                  <button @click="saveAiRagConfig" :disabled="isSavingAiRag" class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg v-if="isSavingAiRag" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,14" stroke-dashoffset="0"/></svg>
                    {{ isSavingAiRag ? $t('settings.saving') : $t('settings.save') }}
                  </button>
                </div>
              </div>

              <!-- 错误/成功提示 -->
              <div v-if="isEditingAiRag && aiRagSaveError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ aiRagSaveError }}</div>
              <div v-if="isEditingAiRag && aiRagSaveSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{{ aiRagSaveSuccess }}</div>

              <!-- 加载状态 -->
              <div v-if="isLoadingAiRag" class="flex items-center justify-center py-8">
                <svg class="animate-spin h-6 w-6 text-theme-accent-primary mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-theme-text-secondary">{{ $t('settings.loading') }}</span>
              </div>

              <div v-else class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="field-label">{{ $t('settings.maxContextPapers') }}</label><input v-model.number="settings.maxContextPapers" type="number" min="1" max="10" :disabled="!isEditingAiRag" :class="isEditingAiRag ? 'field-input' : 'field-input-disabled'" /></div>
                  <div><label class="field-label">{{ $t('settings.responseLengthLimit') }}</label><input v-model.number="settings.responseLength" type="number" min="100" max="10000" step="100" :disabled="!isEditingAiRag" :class="isEditingAiRag ? 'field-input' : 'field-input-disabled'" /></div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="field-label">{{ $t('settings.llmModel') }}</label><select v-model="settings.llmModel" :disabled="!isEditingAiRag" :class="isEditingAiRag ? 'field-input cursor-pointer' : 'field-input-disabled cursor-not-allowed'"><option value="deepseek">DeepSeek</option><option value="tongyi">Tongyi</option></select></div>
                  <div><label class="field-label">{{ $t('settings.citationFormat') }}</label><select v-model="settings.citationFormat" :disabled="!isEditingAiRag" :class="isEditingAiRag ? 'field-input cursor-pointer' : 'field-input-disabled cursor-not-allowed'"><option value="apa">APA</option><option value="mla">MLA</option><option value="chicago">Chicago</option><option value="ieee">IEEE</option></select></div>
                </div>
                <div><label class="field-label">{{ $t('settings.apiKey') }} <span class="text-theme-text-tertiary font-normal">({{ $t('settings.apiKeyEncrypted') }})</span></label><div class="relative"><input :value="isEditingAiRag ? settings.apiKey : aiRagDisplayApiKey" @input="(e: Event) => { if (isEditingAiRag) settings.apiKey = (e.target as HTMLInputElement).value }" :type="showApiKey ? 'text' : 'password'" :disabled="!isEditingAiRag" :class="[isEditingAiRag ? 'field-input' : 'field-input-disabled', 'w-full pr-10 pl-3.5 py-2.5 font-mono tracking-wider']" :placeholder="isEditingAiRag ? (aiRagDisplayApiKey || originalAiRagConfig?.hasApiKey ? '输入新密钥留空则保留原密钥' : 'sk-xxxxxxxxxxxxxxxxxxxxxxxx') : ''" /><button type="button" @click="showApiKey = !showApiKey" class="absolute inset-y-0 right-0 pr-3 flex items-center text-theme-text-tertiary hover:text-theme-text-secondary transition-colors"><svg v-if="showApiKey" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke-linecap="round" stroke-linejoin="round"/></svg><svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
                <div class="space-y-4 pt-2 border-t border-theme-border-secondary">
                  <div class="flex items-center justify-between"><div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.includeCitations') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.includeCitationsDesc') }}</p></div><label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" v-model="settings.includeCitations" :disabled="!isEditingAiRag" class="sr-only peer" /><div class="theme-switch" :class="{ 'pointer-events-none opacity-60': !isEditingAiRag }"></div></label></div>
                </div>
              </div>
            </section>

            <!-- Security -->
            <section class="settings-section">
              <h2 class="section-title"><svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.security') }}</h2>
              <div class="pt-2 border-t border-theme-border-secondary"><button @click="openPasswordModal" class="w-full flex items-center justify-between p-4 bg-theme-bg-input rounded-lg hover:bg-theme-bg-hover transition-colors text-left group"><div><label class="text-sm text-theme-text-primary font-medium group-hover:text-theme-accent-primary transition-colors">{{ $t('settings.changePassword') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.changePasswordDesc') }}</p></div><svg class="w-5 h-5 text-theme-text-tertiary group-hover:text-theme-accent-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
            </section>

            <!-- Language -->
            <section class="settings-section">
              <h2 class="section-title"><svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M3 5.621v16.128c0 .562.562.871 1.046.616l8.25-4.356M21 5.621v11.628c0 .562-.562.871-1.046.616l-8.25-4.356M21 5.621v-.001" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.language') }}</h2>
              <div class="flex items-center justify-between">
                <div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.languageDesc') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ locale === 'zh' ? $t('settings.chinese') : $t('settings.english') }}</p></div>
                <div class="flex items-center gap-3 bg-theme-bg-input p-1 rounded-lg">
                  <button @click="switchLanguage('zh')" class="px-4 py-2 text-sm font-medium rounded-md transition-all" :class="locale === 'zh' ? 'bg-theme-bg-card text-theme-accent-primary shadow-sm' : 'text-theme-text-secondary hover:text-theme-text-primary'">{{ $t('settings.chinese') }}</button>
                  <button @click="switchLanguage('en')" class="px-4 py-2 text-sm font-medium rounded-md transition-all" :class="locale === 'en' ? 'bg-theme-bg-card text-theme-accent-primary shadow-sm' : 'text-theme-text-secondary hover:text-theme-text-primary'">{{ $t('settings.english') }}</button>
                </div>
              </div>
            </section>

            <!-- Appearance -->
            <section class="settings-section">
              <h2 class="section-title"><svg class="w-5 h-5 text-theme-text-tertiary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.appearance') }}</h2>
              <div class="space-y-5">
                <!-- Theme Mode -->
                <div class="flex items-center justify-between">
                  <div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.themeMode') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.themeModeDesc') }}</p></div>
                  <div class="flex items-center gap-2">
                    <button v-for="mode in themeModes" :key="mode.value" @click="themeStore.setTheme(mode.value)" class="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all" :class="themeStore.currentTheme === mode.value ? 'btn-selected' : 'btn-unselected'">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><component :is="mode.icon" /></svg>
                      {{ $t(mode.labelKey) }}
                    </button>
                  </div>
                </div>
                <!-- Font Size -->
                <div class="flex items-center justify-between">
                  <div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.fontSize') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.fontSizeDesc') }}</p></div>
                  <div class="flex items-center gap-2">
                    <button v-for="size in fontSizeOptions" :key="size.value" @click="appearanceStore.setFontSize(size.value)" class="px-3.5 py-2 text-xs font-medium rounded-lg border transition-all" :class="appearanceStore.fontSize === size.value ? 'btn-selected' : 'btn-unselected'">{{ $t(size.labelKey) }}</button>
                  </div>
                </div>
                <!-- Spacing Mode -->
                <div class="flex items-center justify-between">
                  <div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.spacingMode') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.spacingModeDesc') }}</p></div>
                  <div class="flex items-center gap-2">
                    <button v-for="spacing in spacingOptions" :key="spacing.value" @click="appearanceStore.setSpacingMode(spacing.value)" class="px-3 py-2 text-xs font-medium rounded-lg border transition-all" :class="appearanceStore.spacingMode === spacing.value ? 'btn-selected' : 'btn-unselected'">{{ $t(spacing.labelKey) }}</button>
                  </div>
                </div>
                <!-- Auto-collapse Sidebar -->
                <div class="flex items-center justify-between">
                  <div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.autoCollapseSidebar') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.autoCollapseSidebarDesc') }}</p></div>
                  <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" :checked="sidebarStore.autoCollapse" @change="sidebarStore.setAutoCollapse(!sidebarStore.autoCollapse)" class="sr-only peer" /><div class="theme-switch"></div></label>
                </div>
              </div>
            </section>

            <!-- Danger Zone -->
            <section class="bg-theme-bg-card rounded-xl border border-red-200 p-6 shadow-sm transition-colors duration-300">
              <h2 class="text-lg font-bold text-red-600 mb-4 flex items-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ $t('settings.dangerZone') }}</h2>
              <div class="flex items-center justify-between p-4 bg-red-50/50 rounded-lg">
                <div><label class="text-sm text-theme-text-primary font-medium">{{ $t('settings.deleteAccount') }}</label><p class="text-xs text-theme-text-tertiary mt-0.5">{{ $t('settings.deleteAccountDesc') }}</p></div>
                <button @click="openDeleteAccountModal" class="px-5 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm">{{ $t('common.delete') }}</button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-theme-bg-card rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-theme-text-primary">{{ $t('settings.changePasswordTitle') }}</h3>
          <button @click="closePasswordModal" class="text-theme-text-tertiary hover:text-theme-text-secondary">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div v-if="passwordError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ passwordError }}</div>
        <div v-if="passwordSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">{{ passwordSuccess }}</div>
        <div class="space-y-4">
          <div>
            <label class="field-label">{{ $t('settings.email') }}</label>
            <input v-model="passwordForm.emailOrUsername" type="text" class="field-input" :placeholder="$t('settings.emailPlaceholder')" />
          </div>
          <div>
            <label class="field-label">{{ $t('settings.currentPassword') }}</label>
            <input v-model="passwordForm.current" type="password" class="field-input" :placeholder="$t('settings.currentPasswordPlaceholder')" />
          </div>
          <div>
            <label class="field-label">{{ $t('settings.verificationCode') }}</label>
            <div class="flex gap-2">
              <input v-model="passwordForm.code" type="text" class="flex-1 field-input" :placeholder="$t('settings.codePlaceholder')" />
              <button @click="handleSendCode" :disabled="isSendingCode" class="px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex-shrink-0" :class="isSendingCode ? 'bg-theme-bg-active text-theme-text-disabled cursor-not-allowed' : 'bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover'">
                {{ isSendingCode ? `${countdown}s` : $t('settings.sendCode') }}
              </button>
            </div>
          </div>
          <div><label class="field-label">{{ $t('settings.newPassword') }}</label><input v-model="passwordForm.new" type="password" class="field-input" :placeholder="$t('settings.newPasswordPlaceholder')" /></div>
          <div><label class="field-label">{{ $t('settings.confirmNewPassword') }}</label><input v-model="passwordForm.confirm" type="password" class="field-input" :placeholder="$t('settings.confirmNewPasswordPlaceholder')" /></div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-theme-border-secondary">
          <button @click="closePasswordModal" class="px-4 py-2 text-sm text-theme-text-secondary hover:text-theme-text-primary">{{ $t('settings.cancel') }}</button>
          <button @click="handlePasswordChange" :disabled="isResettingPassword" class="px-6 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2" :class="isResettingPassword ? 'bg-theme-bg-active text-theme-text-disabled cursor-not-allowed' : 'bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover'">
            <svg v-if="isResettingPassword" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,14" stroke-dashoffset="0"/></svg>
            {{ isResettingPassword ? $t('settings.updating') : $t('settings.updatePassword') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reset Confirmation Modal -->
    <div v-if="showResetModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-theme-bg-card rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-theme-text-primary flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ $t('settings.restoreDefaults') }}
          </h3>
          <button @click="showResetModal = false; isResetting = false" class="text-theme-text-tertiary hover:text-theme-text-secondary"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
        <p class="text-sm text-theme-text-secondary mb-6">确认要恢复所有设置为默认值吗？恢复后将清空您的自定义修改，回到初始设置状态。</p>
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-theme-border-secondary">
          <button @click="showResetModal = false; isResetting = false" :disabled="isResetting" class="px-4 py-2 text-sm text-theme-text-secondary hover:text-theme-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">取消</button>
          <button @click="confirmReset" :disabled="isResetting" class="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            <svg v-if="isResetting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,14" stroke-dashoffset="0"/></svg>
            {{ isResetting ? '恢复中...' : '确认恢复' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Account Verification Modal -->
    <div v-if="showDeleteAccountModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-theme-bg-card rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-red-600 flex items-center gap-2">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 001.242-1.986V10.25c0-1.09-.393-2.141-1.108-2.963l-3.154-3.58a2.25 2.25 0 00-1.68-.741H8.25a2.25 2.25 0 00-1.68.741l-3.154 3.58A4.5 4.5 0 002.25 10.25v8.637c0 .97.653 1.82 1.59 2.086L5.84 19.504" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ $t('settings.deleteAccount') }}
          </h3>
          <button @click="closeDeleteAccountModal" :disabled="isDeletingAccount" class="text-theme-text-tertiary hover:text-theme-text-secondary disabled:opacity-50"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>

        <!-- 警告提示 -->
        <div class="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600 flex items-start gap-2">
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ $t('settings.deleteAccountWarning') }}
          </p>
        </div>

        <!-- 错误/成功提示 -->
        <div v-if="deleteAccountError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{{ deleteAccountError }}</div>

        <div class="space-y-4">
          <div>
            <label class="field-label">{{ $t('settings.emailOrUsername') }}</label>
            <input v-model="deleteAccountForm.emailOrUsername" type="text" class="field-input" :placeholder="$t('settings.emailPlaceholder')" />
          </div>
          <div>
            <label class="field-label">{{ $t('settings.verificationCode') }}</label>
            <div class="flex gap-2">
              <input v-model="deleteAccountForm.code" type="text" class="flex-1 field-input" :placeholder="$t('settings.codePlaceholder')" />
              <button @click="handleSendDeleteCode" :disabled="isSendingDeleteCode || deleteCodeCountdown > 0" class="px-3 py-2.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0 whitespace-nowrap" :class="(isSendingDeleteCode || deleteCodeCountdown > 0) ? 'bg-theme-bg-active text-theme-text-disabled cursor-not-allowed' : 'bg-theme-btn-primary-bg text-theme-btn-primary-text hover:bg-theme-btn-primary-hover'">
                {{ isSendingDeleteCode ? `${deleteCodeCountdown}s` : (deleteCodeCountdown > 0 ? `${deleteCodeCountdown}s` : $t('settings.sendCode')) }}
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-theme-border-secondary">
          <button @click="closeDeleteAccountModal" :disabled="isDeletingAccount" class="px-4 py-2 text-sm text-theme-text-secondary hover:text-theme-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{{ $t('settings.cancel') }}</button>
          <button @click="confirmDeleteAccount" :disabled="isDeletingAccount" class="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2">
            <svg v-if="isDeletingAccount" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,14" stroke-dashoffset="0"/></svg>
            {{ isDeletingAccount ? $t('settings.deleting') : $t('settings.confirmDelete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="text-sm font-medium">设置已恢复为默认值</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Sidebar from '../components/Sidebar.vue'
import MatchScoreSlider from '../components/MatchScoreSlider.vue'
import { useThemeStore } from '../stores/theme'
import { useSidebarStore } from '../stores/sidebar'
import { useAppearanceStore } from '../stores/appearance'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../api'
import { userPreferencesApi } from '../api/userPreferences'
import { settingsApi } from '../api/settings'
import { buildUpdateRequest } from '../types/userConfig'
import type { UserSearchConfig } from '../types/userConfig'

const { t, locale } = useI18n()
const themeStore = useThemeStore()
const sidebarStore = useSidebarStore()
const appearanceStore = useAppearanceStore()

const SunIcon = { render: () => h('g', [h('circle', { cx: '12', cy: '12', r: '4' }), h('path', { d: 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41', 'stroke-linecap': 'round' })]) }
const MoonIcon = { render: () => h('path', { d: 'M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }) }
const SystemIcon = { render: () => h('g', [h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }), h('path', { d: 'M8 21h8m-4-4v4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) }

const themeModes = [
  { value: 'light' as const, labelKey: 'settings.light', icon: SunIcon },
  { value: 'dark' as const, labelKey: 'settings.dark', icon: MoonIcon },
  { value: 'system' as const, labelKey: 'settings.system', icon: SystemIcon },
]

const searchSources = [
  { id: 'google_scholar', label: 'Google Scholar' },
  { id: 'arxiv', label: 'arXiv' },
  { id: 'ieee_xplore', label: 'IEEE Xplore' },
]

const fontSizeOptions = [
  { value: 'small' as const, labelKey: 'settings.fontSizeSmall' },
  { value: 'standard' as const, labelKey: 'settings.fontSizeStandard' },
  { value: 'large' as const, labelKey: 'settings.fontSizeLarge' },
]

const spacingOptions = [
  { value: 'compact' as const, labelKey: 'settings.spacingCompact' },
  { value: 'standard' as const, labelKey: 'settings.spacingStandard' },
  { value: 'loose' as const, labelKey: 'settings.spacingLoose' },
]

/** 检索偏好：最大结果数合法区间与默认值 */
const MAX_RESULTS_MIN = 1
const MAX_RESULTS_MAX = 10
const MAX_RESULTS_DEFAULT = 5

function clampMaxResults(n: number): number {
  if (!Number.isFinite(n)) return MAX_RESULTS_DEFAULT
  return Math.min(MAX_RESULTS_MAX, Math.max(MAX_RESULTS_MIN, Math.round(n)))
}

/** 将表单中的 number / 空串解析为数字；空或非法表示需由 blur 处理 */
function parseMaxResultsInput(v: unknown): number | null {
  if (v === '' || v === null || v === undefined) return null
  const n = typeof v === 'number' ? v : Number(v)
  if (typeof n === 'number' && Number.isNaN(n)) return null
  return Number.isFinite(n) ? n : null
}

const defaultSettings = {
  username: '', email: '', bio: '', nickname: '', academicId: '', gender: '未知', school: '',
  yearRangeStart: 2020, yearRangeEnd: 2026, minMatchScore: 70, maxResults: 5,
  sources: ['google_scholar', 'semantic_scholar'], defaultSort: 'relevance', paperType: 'all',
  maxContextPapers: 5, responseLength: 2000, llmModel: 'deepseek', apiKey: '',
  citationFormat: 'apa', includeCitations: true, twoFactorEnabled: false,
  theme: 'light', fontSize: 'standard', spacingMode: 'standard', autoCollapseSidebar: true,
}

const settings = ref({ ...defaultSettings })
const showApiKey = ref(false)
const showPasswordModal = ref(false)
const avatarUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const passwordForm = ref({ emailOrUsername: '', current: '', code: '', new: '', confirm: '' })
const passwordError = ref('')
const passwordSuccess = ref('')
const isSendingCode = ref(false)
const isResettingPassword = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null
const showResetModal = ref(false)
const isResetting = ref(false)
const showSuccessToast = ref(false)
const maxResultsComplianceHint = ref('')
let maxResultsHintTimer: ReturnType<typeof setTimeout> | null = null
const isEditingProfile = ref(false)

// 删除账号相关状态
const showDeleteAccountModal = ref(false)
const isDeletingAccount = ref(false)
const deleteAccountError = ref('')
const isSendingDeleteCode = ref(false)
const deleteCodeCountdown = ref(0)
let deleteCodeTimer: ReturnType<typeof setInterval> | null = null
const deleteAccountForm = ref({
  emailOrUsername: '',
  code: '',
})
const isSavingProfile = ref(false)
const profileBackup = ref<any>(null)
const profileEmailCode = ref('')
const isSendingEmailCode = ref(false)
const emailCodeCountdown = ref(0)
let emailCodeTimer: ReturnType<typeof setInterval> | null = null
const isEmailChanged = ref(false)
const profileSaveError = ref('')
const profileSaveSuccess = ref('')

// 检索偏好相关状态
const isSavingPreferences = ref(false)
const isEditingPreferences = ref(false)  // 是否处于编辑模式
const preferencesSaveError = ref('')
const preferencesSaveSuccess = ref('')
const originalPreferences = ref<UserSearchConfig | null>(null)  // 保存原始配置用于对比

// AI RAG 配置相关状态
const isEditingAiRag = ref(false)
const isSavingAiRag = ref(false)
const isLoadingAiRag = ref(false)
const aiRagSaveError = ref('')
const aiRagSaveSuccess = ref('')
const originalAiRagConfig = ref<any>(null)  // 保存原始配置用于对比和取消
const aiRagDisplayApiKey = ref('')  // 显示用的 API Key（脱敏后的或编辑时的明文）

function flashMaxResultsComplianceHint() {
  maxResultsComplianceHint.value = t('settings.maxResultsComplianceHint')
  if (maxResultsHintTimer) clearTimeout(maxResultsHintTimer)
  maxResultsHintTimer = setTimeout(() => {
    maxResultsComplianceHint.value = ''
    maxResultsHintTimer = null
  }, 4000)
}

const authStore = useAuthStore()
const isLoadingUser = ref(false)
const isLoadingPreferences = ref(false) // 新增：加载检索偏好状态

async function loadUserProfile() {
  if (!authStore.isAuthenticated) return
  isLoadingUser.value = true
  try {
    const userInfo = await authApi.getMe()
    settings.value.username = userInfo.username || ''
    settings.value.nickname = userInfo.nickname || ''
    settings.value.email = userInfo.email || ''
    settings.value.bio = userInfo.bio || ''
    settings.value.academicId = userInfo.academicId || ''
    settings.value.gender = userInfo.gender || '未知'
    settings.value.school = userInfo.school || ''
    avatarUrl.value = userInfo.avatarUrl || null
    authStore.user = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      name: userInfo.nickname,
      avatarUrl: userInfo.avatarUrl,
      nickname: userInfo.nickname,
    }
  } catch (err: any) {
    console.error('Failed to load user profile:', err)
  } finally {
    isLoadingUser.value = false
  }
}

/**
 * 从后端加载检索偏好配置
 * 调用 GET /api/v1/user/profile/retrieve 接口
 */
async function loadSearchPreferences() {
  if (!authStore.isAuthenticated) {
    console.warn('[Settings] User not authenticated, skipping preferences load')
    return
  }

  isLoadingPreferences.value = true
  try {
    console.log('[Settings] Loading search preferences from server...')

    // 调用后端API获取检索偏好
    const config = await userPreferencesApi.getSearchPreferences()

    console.log('[Settings] ✅ Search preferences loaded from server:', config)

    // 将后端返回的数据映射到 settings 对象
    // 后端字段 → 前端字段映射：
    // yearStart → yearRangeStart
    // yearEnd → yearRangeEnd
    // matchScore → minMatchScore
    // sourceFlags(位图) → sources(数组) [由API层自动转换]
    // defaultSort(枚举) → defaultSort(字符串) [由API层自动转换]
    // docType(枚举) → paperType(字符串) [由API层自动转换]

    settings.value.yearRangeStart = config.yearRangeStart
    settings.value.yearRangeEnd = config.yearRangeEnd
    settings.value.maxResults = config.maxResults
    settings.value.minMatchScore = config.minMatchScore
    settings.value.sources = config.searchSources  // 已转换为数组格式
    settings.value.defaultSort = config.defaultSort     // 已转换为字符串
    settings.value.paperType = config.paperType         // 已转换为字符串

    // 保存原始配置用于后续对比修改
    originalPreferences.value = { ...config }

    console.log('[Settings] Preferences applied to form:')
    console.log(`  - Year range: ${config.yearRangeStart} - ${config.yearRangeEnd}`)
    console.log(`  - Max results: ${config.maxResults}`)
    console.log(`  - Match score: ${config.minMatchScore}%`)
    console.log(`  - Sources:`, config.searchSources)
    console.log(`  - Sort: ${config.defaultSort}`)
    console.log(`  - Paper type: ${config.paperType}`)

  } catch (error: any) {
    console.error('[Settings] ❌ Failed to load search preferences from server:', error)
    console.error('[Settings] Error details:', error.message || error)

    // 加载失败时使用默认值（不覆盖用户可能已修改的本地设置）
    console.warn('[Settings] Using existing/default values as fallback')
  } finally {
    isLoadingPreferences.value = false
  }
}

/**
 * 保存检索偏好到后端
 * 调用 PATCH /api/v1/user/profile/preferences/update 接口
 */
async function saveSearchPreferences() {
  if (!originalPreferences.value) {
    console.warn('[Settings] No original preferences to compare')
    return
  }

  isSavingPreferences.value = true
  preferencesSaveError.value = ''
  preferencesSaveSuccess.value = ''

  try {
    console.log('[Settings] Saving search preferences...')

    // 构建当前配置对象
    const currentConfig: UserSearchConfig = {
      yearRangeStart: settings.value.yearRangeStart,
      yearRangeEnd: settings.value.yearRangeEnd,
      maxResults: settings.value.maxResults,
      minMatchScore: settings.value.minMatchScore,
      searchSources: settings.value.sources,
      defaultSort: settings.value.defaultSort as any,
      paperType: settings.value.paperType as any,
    }

    // 使用工具函数构建更新请求（只包含修改的字段，未修改的字段为 null）
    const updateRequest = buildUpdateRequest(currentConfig, originalPreferences.value)

    console.log('[Settings] Update request:', updateRequest)

    // 调用后端 API 更新配置
    const updatedConfig = await userPreferencesApi.updateSearchPreferences(updateRequest)

    console.log('[Settings] ✅ Search preferences saved successfully:', updatedConfig)

    // 更新本地状态
    settings.value.yearRangeStart = updatedConfig.yearRangeStart
    settings.value.yearRangeEnd = updatedConfig.yearRangeEnd
    settings.value.maxResults = updatedConfig.maxResults
    settings.value.minMatchScore = updatedConfig.minMatchScore
    settings.value.sources = updatedConfig.searchSources
    settings.value.defaultSort = updatedConfig.defaultSort
    settings.value.paperType = updatedConfig.paperType

    // 更新原始配置为最新值
    originalPreferences.value = { ...updatedConfig }

    // 显示成功提示
    preferencesSaveSuccess.value = '检索偏好设置已保存'

    // 1.5秒后清除提示并退出编辑模式
    setTimeout(() => {
      preferencesSaveSuccess.value = ''
      isEditingPreferences.value = false  // 退出编辑模式
      console.log('[Settings] ✅ Exited editing mode after successful save')
    }, 1500)

  } catch (error: any) {
    console.error('[Settings] ❌ Failed to save search preferences:', error)
    console.error('[Settings] Error details:', error.message || error)

    // 显示错误提示
    const msg = error?.message || ''
    if (msg.includes('timeout')) {
      preferencesSaveError.value = '请求超时，请重试'
    } else if (msg.includes('network') || msg.includes('Network')) {
      preferencesSaveError.value = '网络连接错误，请检查网络'
    } else if (msg.includes('401') || msg.includes('403')) {
      preferencesSaveError.value = '登录已过期，请重新登录'
    } else if (msg.includes('400') || msg.includes('Bad Request')) {
      preferencesSaveError.value = '参数错误，请检查输入'
    } else {
      preferencesSaveError.value = msg || '保存失败，请重试'
    }
  } finally {
    isSavingPreferences.value = false
  }
}

/**
 * 开始编辑检索偏好（点击"编辑偏好"按钮）
 */
function startEditingPreferences() {
  console.log('[Settings] Starting preferences editing mode')

  // 清除之前的错误和成功提示
  preferencesSaveError.value = ''
  preferencesSaveSuccess.value = ''

  // 进入编辑模式
  isEditingPreferences.value = true

  console.log('[Settings] ✅ Entered editing mode')
}

/**
 * 取消检索偏好修改（恢复到原始值并退出编辑模式）
 */
function cancelEditingPreferences() {
  if (!originalPreferences.value) return

  console.log('[Settings] Canceling preferences changes, restoring original values')

  // 恢复到原始配置
  settings.value.yearRangeStart = originalPreferences.value.yearRangeStart
  settings.value.yearRangeEnd = originalPreferences.value.yearRangeEnd
  settings.value.maxResults = originalPreferences.value.maxResults
  settings.value.minMatchScore = originalPreferences.value.minMatchScore
  settings.value.sources = [...originalPreferences.value.searchSources]
  settings.value.defaultSort = originalPreferences.value.defaultSort
  settings.value.paperType = originalPreferences.value.paperType

  // 清除提示信息
  preferencesSaveError.value = ''
  preferencesSaveSuccess.value = ''

  // 退出编辑模式
  isEditingPreferences.value = false

  console.log('[Settings] ✅ Preferences restored to original values, exited editing mode')
}

// ==================== AI RAG 配置方法 ====================

/**
 * 从后端加载 AI RAG 配置
 * 调用 GET /api/v1/user/profile/AIRAG 接口
 */
async function loadAiRAGConfig() {
  if (!authStore.isAuthenticated) return

  isLoadingAiRag.value = true
  try {
    console.log('[Settings] Loading AI RAG config from server...')
    const config = await settingsApi.getAiRAGConfig()

    console.log('[Settings] ✅ AI RAG config loaded:', config)

    // 映射后端数据到前端表单
    settings.value.maxContextPapers = config.maxContextPapers || 3
    settings.value.responseLength = config.responseLengthLimit || 2000

    // modelProvider: 1=deepseek, 2=tongyi
    settings.value.llmModel = config.modelProvider === 2 ? 'tongyi' : 'deepseek'

    // citationFormat: 1=apa, 2=mla, 3=chicago, 4=ieee
    const formatMap: Record<number, string> = { 1: 'apa', 2: 'mla', 3: 'chicago', 4: 'ieee' }
    settings.value.citationFormat = formatMap[config.citationFormat] || 'apa'
    settings.value.includeCitations = config.includeCitation

    // API Key 显示脱敏值
    aiRagDisplayApiKey.value = config.maskedApiKey || ''
    settings.value.apiKey = ''  // 不存储明文到 settings

    // 保存原始配置用于对比
    originalAiRagConfig.value = { ...config }

    console.log('[Settings] AI RAG config applied to form')
  } catch (error: any) {
    console.error('[Settings] ❌ Failed to load AI RAG config:', error)
  } finally {
    isLoadingAiRag.value = false
  }
}

/**
 * 开始编辑 AI RAG 配置
 */
function startEditingAiRag() {
  console.log('[Settings] Starting AI RAG editing mode')

  // 备份当前值（用于取消时恢复）
  originalAiRagConfig.value = {
    maxContextPapers: settings.value.maxContextPapers,
    responseLength: settings.value.responseLength,
    llmModel: settings.value.llmModel,
    citationFormat: settings.value.citationFormat,
    includeCitations: settings.value.includeCitations,
    apiKey: settings.value.apiKey,
  }

  // 编辑模式下，API Key 输入框显示为空（用户需要重新输入或保留原值）
  // 如果已有密钥，显示提示
  if (aiRagDisplayApiKey.value && !settings.value.apiKey) {
    aiRagDisplayApiKey.value = ''  // 编辑模式清空，让用户决定是否重新输入
  }

  // 清除提示
  aiRagSaveError.value = ''
  aiRagSaveSuccess.value = ''

  isEditingAiRag.value = true
  showApiKey.value = false

  console.log('[Settings] ✅ Entered AI RAG editing mode')
}

/**
 * 取消 AI RAG 配置修改（恢复原始值）
 */
function cancelEditingAiRag() {
  if (!originalAiRagConfig.value) return

  console.log('[Settings] Canceling AI RAG changes, restoring original values')

  // 恢复原始值
  settings.value.maxContextPapers = originalAiRagConfig.value.maxContextPapers
  settings.value.responseLength = originalAiRagConfig.value.responseLength
  settings.value.llmModel = originalAiRagConfig.value.llmModel
  settings.value.citationFormat = originalAiRagConfig.value.citationFormat
  settings.value.includeCitations = originalAiRagConfig.value.includeCitations
  settings.value.apiKey = originalAiRagConfig.value.apiKey

  // 恢复脱敏显示
  if (originalAiRagConfig.value.maskedApiKey) {
    aiRagDisplayApiKey.value = originalAiRagConfig.value.maskedApiKey
  } else if (originalAiRagConfig.value.hasApiKey) {
    aiRagDisplayApiKey.value = 'sk-****'  // 无脱敏值但有密钥的降级显示
  } else {
    aiRagDisplayApiKey.value = ''
  }

  // 清除提示
  aiRagSaveError.value = ''
  aiRagSaveSuccess.value = ''

  isEditingAiRag.value = false
  showApiKey.value = false

  console.log('[Settings] ✅ AI RAG config restored, exited editing mode')
}

/**
 * 保存 AI RAG 配置到后端
 * 调用 PATCH /api/v1/user/profile/AIRAG/update 接口
 */
async function saveAiRagConfig() {
  isSavingAiRag.value = true
  aiRagSaveError.value = ''
  aiRagSaveSuccess.value = ''

  try {
    console.log('[Settings] Saving AI RAG config...')

    // 构建请求体（只包含有变化的字段）
    const request: Record<string, any> = {}
    const original = originalAiRagConfig.value

    // 大模型选择
    const modelProviderMap: Record<string, number> = { deepseek: 1, tongyi: 2 }
    const currentModelProvider = modelProviderMap[settings.value.llmModel] || 1
    if (!original || currentModelProvider !== (modelProviderMap[original.llmModel] || 1)) {
      request.modelProvider = currentModelProvider
    }

    // 其他字段对比
    if (!original || settings.value.maxContextPapers !== original.maxContextPapers) {
      request.maxContextPapers = settings.value.maxContextPapers
    }
    if (!original || settings.value.responseLength !== original.responseLength) {
      request.responseLengthLimit = settings.value.responseLength
    }

    // 引用格式
    const citationFormatMap: Record<string, number> = { apa: 1, mla: 2, chicago: 3, ieee: 4 }
    const currentCitationFormat = citationFormatMap[settings.value.citationFormat] || 1
    if (!original || currentCitationFormat !== (citationFormatMap[original.citationFormat] || 1)) {
      request.citationFormat = currentCitationFormat
    }

    // 包含引用
    if (!original || settings.value.includeCitations !== original.includeCitations) {
      request.includeCitation = settings.value.includeCitations
    }

    // API Key：只有用户输入了新值才发送
    if (settings.value.apiKey && settings.value.apiKey.trim()) {
      request.apiKey = settings.value.apiKey.trim()
    }

    console.log('[Settings] Update request:', request)

    // 调用后端 API
    const updatedConfig = await settingsApi.updateAiRAGConfig(request as any)

    console.log('[Settings] ✅ AI RAG config saved:', updatedConfig)

    // 更新本地状态
    settings.value.maxContextPapers = updatedConfig.maxContextPapers
    settings.value.responseLength = updatedConfig.responseLengthLimit
    settings.value.llmModel = updatedConfig.modelProvider === 2 ? 'tongyi' : 'deepseek'

    const fmtMap: Record<number, string> = { 1: 'apa', 2: 'mla', 3: 'chicago', 4: 'ieee' }
    settings.value.citationFormat = fmtMap[updatedConfig.citationFormat] || 'apa'
    settings.value.includeCitations = updatedConfig.includeCitation

    // 更新脱敏后的 API Key 显示
    aiRagDisplayApiKey.value = updatedConfig.maskedApiKey || ''
    settings.value.apiKey = ''  // 清空明文

    // 更新原始配置
    originalAiRagConfig.value = { ...updatedConfig }

    // 成功提示
    aiRagSaveSuccess.value = 'AI 配置保存成功'

    // 1.5秒后退出编辑模式
    setTimeout(() => {
      aiRagSaveSuccess.value = ''
      isEditingAiRag.value = false
      showApiKey.value = false
      console.log('[Settings] ✅ Exited AI RAG editing mode after successful save')
    }, 1500)

  } catch (error: any) {
    console.error('[Settings] ❌ Failed to save AI RAG config:', error)
    const msg = error?.message || ''
    if (msg.includes('timeout')) {
      aiRagSaveError.value = '请求超时，请重试'
    } else if (msg.includes('network') || msg.includes('Network')) {
      aiRagSaveError.value = '网络连接错误，请检查网络'
    } else if (msg.includes('401') || msg.includes('403')) {
      aiRagSaveError.value = '登录已过期，请重新登录'
    } else {
      aiRagSaveError.value = msg || '保存失败，请重试'
    }
  } finally {
    isSavingAiRag.value = false
  }
}

function onMaxResultsBlur() {
  const parsed = parseMaxResultsInput(settings.value.maxResults as unknown)
  if (parsed === null) {
    settings.value.maxResults = MAX_RESULTS_DEFAULT
    flashMaxResultsComplianceHint()
    return
  }
  const clamped = clampMaxResults(parsed)
  settings.value.maxResults = clamped
  if (clamped !== parsed) {
    flashMaxResultsComplianceHint()
  }
}

function onYearRangeStartBlur() {
  const val = settings.value.yearRangeStart
  if (val === null || val === undefined || val === '' || isNaN(Number(val))) return
  const n = Number(val)
  if (n < 2015) {
    settings.value.yearRangeStart = 2015
  }
  if (settings.value.yearRangeEnd <= settings.value.yearRangeStart) {
    settings.value.yearRangeEnd = settings.value.yearRangeStart + 1
  }
}

function onYearRangeEndBlur() {
  const val = settings.value.yearRangeEnd
  if (val === null || val === undefined || val === '' || isNaN(Number(val))) return
  const n = Number(val)
  const minEnd = settings.value.yearRangeStart + 1
  if (n <= settings.value.yearRangeStart) {
    settings.value.yearRangeEnd = minEnd
  }
}

function startEditingProfile() {
  profileBackup.value = {
    username: settings.value.username,
    nickname: settings.value.nickname,
    email: settings.value.email,
    academicId: settings.value.academicId,
    school: settings.value.school,
    bio: settings.value.bio,
    gender: settings.value.gender,
  }
  profileEmailCode.value = ''
  isEmailChanged.value = false
  profileSaveError.value = ''
  profileSaveSuccess.value = ''
  isEditingProfile.value = true
}

function cancelEditingProfile() {
  if (profileBackup.value) {
    settings.value.username = profileBackup.value.username
    settings.value.nickname = profileBackup.value.nickname
    settings.value.email = profileBackup.value.email
    settings.value.academicId = profileBackup.value.academicId
    settings.value.school = profileBackup.value.school
    settings.value.bio = profileBackup.value.bio
    settings.value.gender = profileBackup.value.gender
  }
  isEmailChanged.value = false
  profileEmailCode.value = ''
  profileSaveError.value = ''
  profileSaveSuccess.value = ''
  if (emailCodeTimer) { clearInterval(emailCodeTimer); emailCodeTimer = null }
  isEditingProfile.value = false
  profileBackup.value = null
}

async function saveEditingProfile() {
  isSavingProfile.value = true
  profileSaveError.value = ''
  profileSaveSuccess.value = ''
  try {
    const payload: any = {}
    const backup = profileBackup.value
    if (!backup) return

    if (settings.value.nickname !== backup.nickname) payload.nickname = settings.value.nickname
    if (settings.value.bio !== backup.bio) payload.bio = settings.value.bio
    if (settings.value.school !== backup.school) payload.school = settings.value.school
    if (settings.value.gender !== backup.gender) payload.gender = settings.value.gender
    if (settings.value.academicId !== backup.academicId) payload.academicId = settings.value.academicId

    const emailValueChanged = settings.value.email !== backup.email
    if (emailValueChanged) {
      if (isEmailChanged.value) {
        payload.email = settings.value.email
        payload.validateCode = profileEmailCode.value
      } else {
        settings.value.email = backup.email
      }
    }

    const hasChanges = Object.keys(payload).length > 0
    if (!hasChanges) {
      isEditingProfile.value = false
      profileBackup.value = null
      return
    }

    if (emailValueChanged && isEmailChanged.value && !payload.validateCode) {
      profileSaveError.value = '邮箱已修改，请输入验证码'
      isSavingProfile.value = false
      return
    }

    const updatedUser = await authApi.updateProfile(payload)
    settings.value.username = updatedUser.username || settings.value.username
    settings.value.nickname = updatedUser.nickname || settings.value.nickname
    settings.value.email = updatedUser.email || settings.value.email
    settings.value.bio = updatedUser.bio || settings.value.bio
    settings.value.academicId = updatedUser.academicId || settings.value.academicId
    settings.value.gender = updatedUser.gender || settings.value.gender
    settings.value.school = updatedUser.school || settings.value.school
    avatarUrl.value = updatedUser.avatarUrl || null
    if (authStore.user) {
      authStore.user.email = updatedUser.email || authStore.user.email
      authStore.user.name = updatedUser.nickname || authStore.user.name
      authStore.user.nickname = updatedUser.nickname || authStore.user.nickname
      authStore.user.avatarUrl = updatedUser.avatarUrl || authStore.user.avatarUrl
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }

    profileSaveSuccess.value = '个人资料更新成功'
    setTimeout(() => {
      isEditingProfile.value = false
      profileBackup.value = null
      profileSaveSuccess.value = ''
      profileSaveError.value = ''
      profileEmailCode.value = ''
      isEmailChanged.value = false
      if (emailCodeTimer) { clearInterval(emailCodeTimer); emailCodeTimer = null }
    }, 1500)
  } catch (err: any) {
    const msg = err?.message || ''
    if (msg.includes('timeout')) {
      profileSaveError.value = '请求超时，请重试'
    } else if (msg.includes('email')) {
      profileSaveError.value = msg || '邮箱验证失败'
    } else {
      profileSaveError.value = msg || '更新个人资料失败，请重试'
    }
  } finally {
    isSavingProfile.value = false
  }
}

function switchLanguage(lang: string) { locale.value = lang; localStorage.setItem('app-locale', lang) }
function triggerFileUpload() { fileInput.value?.click() }
function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => { avatarUrl.value = e.target?.result as string }
    reader.readAsDataURL(input.files[0])
  }
}
function toggleSource(id: string) {
  const idx = settings.value.sources.indexOf(id)
  if (idx === -1) settings.value.sources.push(id)
  else settings.value.sources.splice(idx, 1)
}
function handleResetAll() {
  showResetModal.value = true
}
async function confirmReset() {
  isResetting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    settings.value = { ...defaultSettings }
    avatarUrl.value = null
    themeStore.setTheme('light')
    appearanceStore.setFontSize('standard')
    appearanceStore.setSpacingMode('standard')
    sidebarStore.setAutoCollapse(true)
    localStorage.removeItem('app-settings')
    localStorage.removeItem('user-avatar')
    showResetModal.value = false
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } finally {
    isResetting.value = false
  }
}
function handleDeleteAccount() { if (confirm(t('settings.deleteAccountConfirm'))) alert(t('settings.settingsSaved')) }

// ==================== 删除账号方法 ====================

/**
 * 打开删除账号验证模态框
 */
function openDeleteAccountModal() {
  deleteAccountForm.value = {
    emailOrUsername: settings.value.email || authStore.user?.email || '',
    code: '',
  }
  deleteAccountError.value = ''
  isSendingDeleteCode.value = false
  deleteCodeCountdown.value = 0
  isDeletingAccount.value = false
  if (deleteCodeTimer) { clearInterval(deleteCodeTimer); deleteCodeTimer = null }
  showDeleteAccountModal.value = true
}

/**
 * 关闭删除账号模态框
 */
function closeDeleteAccountModal() {
  showDeleteAccountModal.value = false
  if (deleteCodeTimer) { clearInterval(deleteCodeTimer); deleteCodeTimer = null }
}

/**
 * 发送删除账号验证码
 */
async function handleSendDeleteCode() {
  const emailOrUsername = deleteAccountForm.value.emailOrUsername?.trim()
  if (!emailOrUsername) {
    deleteAccountError.value = '请输入邮箱或用户名'
    return
  }

  isSendingDeleteCode.value = true
  deleteAccountError.value = ''

  try {
    console.log('[Settings] Sending delete account verification code...')
    const res = await authApi.sendCode({
      emailOrUsername: emailOrUsername,
      scene: 'DELETEACCOUNT',
    })

    console.log('[Settings] ✅ Delete account code sent')
    deleteCodeCountdown.value = Math.max(res.expireTime, 60)
    deleteCodeTimer = setInterval(() => {
      deleteCodeCountdown.value--
      if (deleteCodeCountdown.value <= 0 && deleteCodeTimer) {
        clearInterval(deleteCodeTimer)
        deleteCodeTimer = null
      }
    }, 1000)

  } catch (err: any) {
    const msg = err?.message || ''
    if (msg.includes('timeout')) {
      deleteAccountError.value = '验证码时限已过'
    } else {
      deleteAccountError.value = msg || '发送验证码失败，请重试'
    }
  } finally {
    isSendingDeleteCode.value = false
  }
}

/**
 * 确认删除账号（需要输入正确的验证码）
 */
async function confirmDeleteAccount() {
  const { emailOrUsername, code } = deleteAccountForm.value

  // 前端校验
  if (!emailOrUsername?.trim()) {
    deleteAccountError.value = '请输入邮箱或用户名'
    return
  }
  if (!code?.trim()) {
    deleteAccountError.value = '请输入验证码'
    return
  }

  isDeletingAccount.value = true
  deleteAccountError.value = ''

  try {
    console.log('[Settings] Confirming account deletion...')

    // 调用后端删除接口（携带验证码 + 场景）
    // 对应后端: UserController.deleteUser() → UserDeletedRequest
    await authApi.deleteAccount({
      emailOrUserName: emailOrUsername.trim(),
      scene: 'DELETEACCOUNT',
      validateCode: code.trim(),
    })

    console.log('[Settings] ✅ Account deleted successfully')

    // 关闭模态框
    showDeleteAccountModal.value = false

    // 清除本地状态
    await authStore.logout()

    // 跳转到登录页
    window.location.href = '/login'

  } catch (err: any) {
    console.error('[Settings] ❌ Failed to delete account:', err)
    const msg = err?.message || ''
    if (msg.includes('timeout')) {
      deleteAccountError.value = '验证码已过期，请重新获取'
    } else if (msg.includes('code') || msg.includes('验证码')) {
      deleteAccountError.value = '验证码错误，请重新输入'
    } else if (msg.includes('401') || msg.includes('403')) {
      deleteAccountError.value = '登录已过期，请重新登录后操作'
    } else {
      deleteAccountError.value = msg || '删除失败，请重试'
    }
  } finally {
    isDeletingAccount.value = false
  }
}

function openPasswordModal() {
  passwordForm.value = { emailOrUsername: settings.value.email, current: '', code: '', new: '', confirm: '' }
  passwordError.value = ''
  passwordSuccess.value = ''
  isSendingCode.value = false
  isResettingPassword.value = false
  countdown.value = 0
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
}

async function handleSendCode() {
  if (!passwordForm.value.emailOrUsername.trim()) {
    passwordError.value = '请输入邮箱或用户名'
    return
  }
  isSendingCode.value = true
  passwordError.value = ''
  passwordSuccess.value = ''
  try {
    const res = await authApi.sendCode({
      emailOrUsername: passwordForm.value.emailOrUsername.trim(),
      scene: 'RESETPASSWORD',
    })
    passwordSuccess.value = '验证码已发送'
    countdown.value = Math.max(res.expireTime, 60)
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (err: any) {
    const msg = err?.message || ''
    if (msg.includes('timeout')) {
      passwordError.value = '验证码时限已过'
    } else {
      passwordError.value = msg || '发送验证码失败，请重试'
    }
  } finally {
    isSendingCode.value = false
  }
}

function handlePasswordChange() {
  passwordError.value = ''
  passwordSuccess.value = ''
  if (passwordForm.value.new !== passwordForm.value.confirm) { passwordError.value = '两次输入的密码不一致'; return }
  if (!passwordForm.value.emailOrUsername || !passwordForm.value.current || !passwordForm.value.code || !passwordForm.value.new) { passwordError.value = '请填写所有字段'; return }
  isResettingPassword.value = true
  authApi.resetPassword({
    emailOrUsername: passwordForm.value.emailOrUsername.trim(),
    password: passwordForm.value.current,
    newPassword: passwordForm.value.new,
    code: passwordForm.value.code,
  })
    .then(() => {
      passwordSuccess.value = '密码已更新，请重新登录'
      if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
      setTimeout(() => {
        showPasswordModal.value = false
        passwordForm.value = { emailOrUsername: settings.value.email, current: '', code: '', new: '', confirm: '' }
        passwordError.value = ''
        passwordSuccess.value = ''
      }, 2000)
    })
    .catch((err: any) => {
      const msg = err?.message || ''
      if (msg.includes('timeout')) {
        passwordError.value = '请求超时，请重试'
      } else {
        passwordError.value = msg || '密码更新失败'
      }
    })
    .finally(() => {
      isResettingPassword.value = false
    })
}

watch(showPasswordModal, (val) => {
  if (!val && countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

watch(
  () => settings.value.email,
  (newEmail) => {
    if (profileBackup.value && isEditingProfile.value) {
      isEmailChanged.value = newEmail !== profileBackup.value.email
    }
  },
)

async function handleSendEmailCode() {
  if (!settings.value.email.trim()) {
    profileSaveError.value = '请输入邮箱地址'
    return
  }
  
  isSendingEmailCode.value = true
  profileSaveError.value = ''
  try {
    const res = await authApi.sendCode({
      emailOrUsername: profileBackup.value?.email?.trim() || authStore.user?.email || settings.value.email.trim(),
      scene: 'UPDATEUSEREMAIL',
    })
    profileSaveSuccess.value = '验证码已发送'
    emailCodeCountdown.value = Math.max(res.expireTime, 60)
    emailCodeTimer = setInterval(() => {
      emailCodeCountdown.value--
      if (emailCodeCountdown.value <= 0 && emailCodeTimer) {
        clearInterval(emailCodeTimer)
        emailCodeTimer = null
      }
    }, 1000)
  } catch (err: any) {
    const msg = err?.message || ''
    if (msg.includes('timeout')) {
      profileSaveError.value = '验证码时限已过'
    } else {
      profileSaveError.value = msg || '发送验证码失败，请重试'
    }
  } finally {
    isSendingEmailCode.value = false
  }
}
onMounted(() => {
  const saved = localStorage.getItem('app-settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Record<string, unknown>
      settings.value = { ...defaultSettings, ...parsed }
    } catch (e) {
      console.error('Failed to parse settings', e)
    }
  }
  const parsed = parseMaxResultsInput(settings.value.maxResults as unknown)
  settings.value.maxResults = clampMaxResults(parsed === null ? MAX_RESULTS_DEFAULT : parsed)
  
  // 加载用户个人资料（用户名、邮箱等）
  loadUserProfile()
  
  // 加载检索偏好配置（从后端API）
  // 这会覆盖本地默认值，使用服务器返回的配置
  loadSearchPreferences()

  // 加载 AI RAG 配置（从后端API）
  loadAiRAGConfig()
})

onUnmounted(() => {
  if (maxResultsHintTimer) clearTimeout(maxResultsHintTimer)
})

watch(
  () => settings.value.maxResults,
  (val) => {
    const parsed = parseMaxResultsInput(val as unknown)
    if (parsed === null) return
    const c = clampMaxResults(parsed)
    if (settings.value.maxResults !== c) {
      settings.value.maxResults = c
      flashMaxResultsComplianceHint()
    }
  },
)

watch(settings, (newVal) => {
  const parsed = parseMaxResultsInput(newVal.maxResults as unknown)
  const maxResults = clampMaxResults(parsed === null ? MAX_RESULTS_DEFAULT : parsed)
  if (parsed === null && newVal.maxResults !== maxResults) {
    settings.value.maxResults = maxResults
    flashMaxResultsComplianceHint()
  }
  const { username, nickname, email, academicId, gender, school, bio, ...preferences } = newVal
  const safe = { ...preferences, maxResults }
  localStorage.setItem('app-settings', JSON.stringify(safe))
}, { deep: true })

watch(avatarUrl, (newVal) => {
  if (newVal) localStorage.setItem('user-avatar', newVal)
})
</script>

<style scoped>
.settings-section {
  @apply bg-theme-bg-card rounded-xl border border-theme-border-primary p-6 shadow-sm transition-colors duration-300;
}
.section-title {
  @apply text-lg font-bold text-theme-text-primary mb-5 flex items-center gap-2;
}
.field-label {
  @apply block text-xs font-medium text-theme-text-secondary mb-1.5;
}
.field-input {
  @apply w-full px-3.5 py-2.5 bg-theme-bg-input border border-theme-border-primary rounded-lg text-sm text-theme-text-primary outline-none focus:border-theme-border-focus transition-all;
}
.field-input-disabled {
  @apply w-full px-3.5 py-2.5 bg-theme-bg-active border border-theme-border-primary rounded-lg text-sm text-theme-text-primary cursor-not-allowed opacity-75;
}
.btn-selected {
  @apply border-theme-btn-primary-bg bg-theme-btn-primary-bg text-theme-btn-primary-text shadow-sm;
}
.btn-unselected {
  @apply border-theme-border-primary bg-theme-bg-card text-theme-text-secondary hover:text-theme-text-primary hover:border-theme-border-secondary;
}
.theme-switch {
  width: 2.75rem;
  height: 1.5rem;
  background-color: var(--switch-bg);
  border-radius: 9999px;
  position: relative;
  transition: all 0.3s;
}
.theme-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background-color: var(--switch-thumb);
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  transition: all 0.3s;
}
.peer:checked ~ .theme-switch {
  background-color: var(--switch-active);
}
.peer:checked ~ .theme-switch::after {
  transform: translateX(100%);
  border-color: white;
}
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in { animation: fade-in 0.2s ease-out; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.2); }
</style>
