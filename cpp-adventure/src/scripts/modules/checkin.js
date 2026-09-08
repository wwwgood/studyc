/**
 * 梓煜作业安排本 - 每日打卡系统（云端版）
 * 已融合进统一学习网站：由门户 portal 切换视图时通过 checkinOnViewChange() 控制家长锁显隐。
 * 支持多终端数据同步（Supabase）；离线时自动使用本地 localStorage，不影响核心打卡功能。
 */

// 应用状态
const state = {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    selectedDate: null,
    editingSubject: null,
    quickAddSubject: null, // 用于快速添加任务的学科
    data: {},
    defaults: {
        chinese: ['朗读课文和解析'],
        english: ['单词表或课文跟读学习']
    },
    // 其他任务模板（用于快速添加）
    taskTemplates: [
        { subject: 'english', name: '抄书抄单词' },
        { subject: 'chinese', name: '语文练习' },
        { subject: 'chinese', name: '写字' },
        { subject: 'math', name: '口算' }
    ],
    userId: null,
    isSyncing: false,
    syncStatus: 'local' // 'local' | 'syncing' | 'synced'
};

// Supabase 配置（集中管理于 core/config.js，此处仅为兼容引用）
const SUPABASE_URL = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.supabase) ? APP_CONFIG.supabase.url : 'https://coqsxhwdnbjptnqelwld.supabase.co';
const SUPABASE_ANON_KEY = (typeof APP_CONFIG !== "undefined" && APP_CONFIG.supabase) ? APP_CONFIG.supabase.anonKey : 'sb_publishable_Vf2RzEmduPF6H2wCdPUTpg_EnF17J5I';

// 带超时的 fetch：离线/网络不通时 6 秒自动放弃，不阻塞渲染
function ckFetch(url, opts, ms) {
    ms = ms || 6000;
    try {
        var c = new AbortController();
        var tid = setTimeout(function () { c.abort(); }, ms);
        return (0, fetch)(url, Object.assign({}, opts, { signal: c.signal })).then(
            function (r) { clearTimeout(tid); return r; },
            function (e) { clearTimeout(tid); throw e; }
        );
    } catch (e) { return Promise.reject(e); }
}

// 默认密码（新用户首次使用）
const DEFAULT_PASSWORD = '123456';

// 获取保存的密码（没有则使用默认密码）
function getSavedPassword() {
    return localStorage.getItem('ziyu_app_password') || DEFAULT_PASSWORD;
}

// 保存新密码
function savePassword(newPassword) {
    localStorage.setItem('ziyu_app_password', newPassword);
}

// 检查是否首次使用（未设置过密码）
function isFirstTimeUse() {
    return !localStorage.getItem('ziyu_app_password');
}

// 认证状态
let isAuthenticated = false;

// 认证 DOM 元素
const authElements = {
    authScreen: document.getElementById('authScreen'),
    appContainer: document.getElementById('appContainer'),
    authForm: document.getElementById('authForm'),
    authPassword: document.getElementById('authPassword'),
    authError: document.getElementById('authError'),
    authTitle: document.getElementById('authTitle'),
    authSubtitle: document.getElementById('authSubtitle')
};

// 认证函数
function verifyPassword(password) {
    return password === getSavedPassword();
}

// 处理认证表单提交
function handleAuthSubmit(e) {
    e.preventDefault();
    const password = authElements.authPassword.value;

    // 首次使用：设置新密码
    if (isFirstTimeUse()) {
        if (password.length < 4) {
            authElements.authError.textContent = '密码至少需要4个字符';
            authElements.authError.style.display = 'block';
            authElements.authPassword.classList.add('shake');
            setTimeout(() => {
                authElements.authPassword.classList.remove('shake');
            }, 500);
            return;
        }
        // 保存新密码
        savePassword(password);
        ckToast('密码设置成功！');
    }

    if (verifyPassword(password)) {
        isAuthenticated = true;
        // 保存认证状态到 sessionStorage
        sessionStorage.setItem('ziyu_authenticated', 'true');
        // 隐藏认证界面，显示主界面
        authElements.authScreen.style.display = 'none';
        authElements.appContainer.style.display = 'block';
        // 初始化应用
        init();
    } else {
        // 显示错误
        authElements.authError.textContent = '密码错误，请重试';
        authElements.authError.style.display = 'block';
        authElements.authPassword.value = '';
        authElements.authPassword.focus();
        // 添加震动效果
        authElements.authPassword.classList.add('shake');
        setTimeout(() => {
            authElements.authPassword.classList.remove('shake');
        }, 500);
    }
}

// 检查是否已认证
function checkAuth() {
    return sessionStorage.getItem('ziyu_authenticated') === 'true';
}

// 更新认证界面（首次使用 vs 正常登录）
function updateAuthScreen() {
    if (isFirstTimeUse()) {
        // 首次使用：显示设置密码界面
        if (authElements.authTitle) authElements.authTitle.textContent = '设置访问密码';
        if (authElements.authSubtitle) authElements.authSubtitle.textContent = '请设置一个方便记忆的密码';
        if (document.querySelector('.auth-hint')) document.querySelector('.auth-hint').textContent = '建议使用简单的数字或字母组合';
    } else {
        // 正常登录
        if (authElements.authTitle) authElements.authTitle.textContent = '梓煜作业安排本';
        if (authElements.authSubtitle) authElements.authSubtitle.textContent = '请输入访问密码';
        if (document.querySelector('.auth-hint')) document.querySelector('.auth-hint').textContent = '默认密码: 123456';
    }
}

// DOM 元素
const elements = {
    calendarGrid: document.getElementById('calendarGrid'),
    currentMonth: document.getElementById('currentMonth'),
    prevMonth: document.getElementById('prevMonth'),
    nextMonth: document.getElementById('nextMonth'),
    taskPanel: document.getElementById('taskPanel'),
    taskPanelOverlay: document.getElementById('taskPanelOverlay'),
    closePanel: document.getElementById('closePanel'),
    panelDay: document.getElementById('panelDay'),
    panelWeekday: document.getElementById('panelWeekday'),
    panelMonth: document.getElementById('panelMonth'),
    chineseTasks: document.getElementById('chineseTasks'),
    englishTasks: document.getElementById('englishTasks'),
    customTasks: document.getElementById('customTasks'),
    emptyCustomTasks: document.getElementById('emptyCustomTasks'),
    customTaskInput: document.getElementById('customTaskInput'),
    subjectSelect: document.getElementById('subjectSelect'),
    addCustomTaskBtn: document.getElementById('addCustomTaskBtn'),
    editChineseBtn: document.getElementById('editChineseBtn'),
    editEnglishBtn: document.getElementById('editEnglishBtn'),
    addChineseTask: document.getElementById('addChineseTask'),
    addEnglishTask: document.getElementById('addEnglishTask'),
    summaryCount: document.getElementById('summaryCount'),
    progressBar: document.getElementById('progressBar'),
    motivationText: document.getElementById('motivationText'),
    editModal: document.getElementById('editModal'),
    editModalTitle: document.getElementById('editModalTitle'),
    closeModal: document.getElementById('closeModal'),
    contentList: document.getElementById('contentList'),
    newContentInput: document.getElementById('newContentInput'),
    addContentBtn: document.getElementById('addContentBtn'),
    saveContentBtn: document.getElementById('saveContentBtn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    syncStatus: document.getElementById('syncStatus'),
    refreshSyncBtn: document.getElementById('refreshSyncBtn'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    importFile: document.getElementById('ckImportFile'),
    // Quick Add Modal
    quickAddModal: document.getElementById('quickAddModal'),
    quickAddTitle: document.getElementById('quickAddTitle'),
    closeQuickAddModal: document.getElementById('closeQuickAddModal'),
    quickAddInput: document.getElementById('quickAddInput'),
    confirmQuickAddBtn: document.getElementById('confirmQuickAddBtn')
};

// 星期名称
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 鼓励语
const MOTIVATIONS = [
    '养成好习惯，天天进步一点点',
    '完成打卡，你真棒！',
    '坚持就是胜利，加油！',
    '每天进步一点点，未来大不同',
    '认真学习的你最可爱',
    '继续保持，好习惯伴你成长',
    '今天的你比昨天更优秀',
    '学习使我快乐，打卡让我成长'
];

// 初始化
async function init() {
    loadData();
    generateUserId();
    bindEvents();
    // 先从云端同步数据，再渲染日历
    await syncFromCloud();
    renderCalendar();
}

// 生成用户ID - 使用固定ID确保多设备同步
function generateUserId() {
    // 使用固定的应用ID，确保所有设备使用同一个userId进行同步
    // 这样可以保证多设备数据同步到同一个云端记录
    state.userId = 'ziyu_homework_checkin_v1';
}

// 数据管理
function loadData() {
    const savedData = localStorage.getItem('studentCheckIn');
    if (savedData) {
        try {
            state.data = JSON.parse(savedData);
        } catch (e) {
            state.data = {};
        }
    }

    const savedDefaults = localStorage.getItem('studentCheckInDefaults');
    if (savedDefaults) {
        try {
            state.defaults = JSON.parse(savedDefaults);
        } catch (e) {
            // 使用内置默认值
        }
    }
}

function saveData() {
    localStorage.setItem('studentCheckIn', JSON.stringify(state.data));
    // 延迟同步，避免频繁请求
    debounceSync();
}

// 防抖同步
let syncTimeout = null;
function debounceSync() {
    if (syncTimeout) {
        clearTimeout(syncTimeout);
    }
    syncTimeout = setTimeout(() => {
        syncToCloud();
    }, 1000); // 1秒防抖
}

function saveDefaults() {
    localStorage.setItem('studentCheckInDefaults', JSON.stringify(state.defaults));
}

// 获取中国时区的当前时间字符串
function getChinaTimeString() {
    const now = new Date();
    const chinaOffset = 8 * 60; // UTC+8
    const localOffset = now.getTimezoneOffset();
    const chinaTime = new Date(now.getTime() + (chinaOffset + localOffset) * 60000);
    return chinaTime.toISOString();
}

// 云端同步
async function syncFromCloud() {
    if (!state.userId) return;

    try {
        updateSyncStatus('syncing');
        const response = await ckFetch(`${SUPABASE_URL}/rest/v1/checkin_data?user_id=eq.${state.userId}&select=*`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (response.ok) {
            const cloudData = await response.json();
            console.log('云端返回数据:', cloudData);

            if (cloudData && cloudData.length > 0) {
                // 云端有数据，以云端数据为准
                const cloudRecord = cloudData[0];
                console.log('云端记录:', cloudRecord);

                // 安全解析 JSON
                let cloudParsedData = null;
                let cloudParsedDefaults = null;

                try {
                    if (cloudRecord.data && cloudRecord.data !== 'null' && cloudRecord.data !== '{}') {
                        cloudParsedData = JSON.parse(cloudRecord.data);
                        console.log('解析后的数据:', cloudParsedData);
                    }
                } catch (e) {
                    console.error('解析云端数据失败:', e);
                }

                try {
                    if (cloudRecord.defaults && cloudRecord.defaults !== 'null') {
                        cloudParsedDefaults = JSON.parse(cloudRecord.defaults);
                    }
                } catch (e) {
                    console.error('解析云端默认值失败:', e);
                }

                // 如果有有效数据，替换本地数据
                if (cloudParsedData && Object.keys(cloudParsedData).length > 0) {
                    state.data = cloudParsedData;
                    localStorage.setItem('studentCheckIn', JSON.stringify(state.data));
                    console.log('已用云端数据更新本地数据，当前数据键:', Object.keys(state.data));
                }

                if (cloudParsedDefaults) {
                    state.defaults = cloudParsedDefaults;
                    localStorage.setItem('studentCheckInDefaults', JSON.stringify(state.defaults));
                }

                // 重新渲染日历和任务面板
                renderCalendar();
                if (state.selectedDate) {
                    const dateData = state.data[state.selectedDate];
                    if (dateData) {
                        renderTaskList(dateData);
                        updateSummary(dateData);
                    }
                }

                updateSyncStatus('synced');
                console.log('云端同步成功');
            } else {
                // 云端无数据，上传本地数据（如果有的话）
                console.log('云端无数据');
                const localDataKeys = Object.keys(state.data);
                if (localDataKeys.length > 0) {
                    console.log('将上传本地数据到云端');
                    await syncToCloud();
                }
                updateSyncStatus('synced');
            }
        }
    } catch (e) {
        console.log('云端同步失败，使用本地数据', e);
        updateSyncStatus('local');
    }
}

async function syncToCloud() {
    if (state.isSyncing) return;
    if (!state.userId) return;

    state.isSyncing = true;

    try {
        // 检查是否有有效数据需要同步
        const dataKeys = Object.keys(state.data);
        const hasValidData = dataKeys.length > 0;
        const hasValidDefaults = state.defaults.chinese.length > 0 || state.defaults.english.length > 0;

        // 如果没有任何数据，不上传空数据
        if (!hasValidData && !hasValidDefaults) {
            console.log('没有有效数据需要同步');
            state.isSyncing = false;
            return;
        }

        const payload = {
            user_id: state.userId,
            data: JSON.stringify(state.data),
            defaults: JSON.stringify(state.defaults),
            updated_at: getChinaTimeString()
        };

        // 检查是否已存在记录
        const checkResponse = await ckFetch(`${SUPABASE_URL}/rest/v1/checkin_data?user_id=eq.${state.userId}&select=id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        const existing = await checkResponse.json();

        if (existing && existing.length > 0) {
            // 更新现有记录
            await ckFetch(`${SUPABASE_URL}/rest/v1/checkin_data?id=eq.${existing[0].id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });
            console.log('云端数据已更新');
        } else {
            // 创建新记录
            await ckFetch(`${SUPABASE_URL}/rest/v1/checkin_data`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });
            console.log('云端数据已创建');
        }
        updateSyncStatus('synced');
    } catch (e) {
        console.log('云端同步失败', e);
        updateSyncStatus('local');
    }

    state.isSyncing = false;
}

function updateSyncStatus(status) {
    state.syncStatus = status;
    if (elements.syncStatus) {
        const statusText = {
            local: '本地存储',
            syncing: '同步中...',
            synced: '已同步'
        };
        const statusColor = {
            local: '#EF4444',
            syncing: '#F59E0B',
            synced: '#10B981'
        };
        elements.syncStatus.innerHTML = `<span style="color:${statusColor[status]}">●</span> ${statusText[status]}`;
    }
}

// 数据导出
function exportData() {
    const exportData = {
        version: 1,
        exportDate: new Date().toISOString(),
        userId: state.userId,
        data: state.data,
        defaults: state.defaults
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `梓煜作业打卡_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    ckToast('数据已导出');
}

// 数据导入
function importData(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.data) {
                state.data = { ...state.data, ...imported.data };
            }
            if (imported.defaults) {
                state.defaults = imported.defaults;
                saveDefaults();
            }
            if (imported.userId) {
                state.userId = imported.userId;
                localStorage.setItem('checkInUserId', imported.userId);
            }
            saveData();
            await syncFromCloud();
            renderCalendar();
            ckToast('数据导入成功');
        } catch (err) {
            ckToast('导入失败：文件格式错误');
        }
    };
    reader.readAsText(file);
}

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function ensureDateData(dateKey) {
    if (!state.data[dateKey]) {
        state.data[dateKey] = {
            chinese: {
                content: [...state.defaults.chinese],
                completed: false
            },
            english: {
                content: [...state.defaults.english],
                completed: false
            },
            customTasks: []
        };
    } else {
        if (!state.data[dateKey].chinese) {
            state.data[dateKey].chinese = { content: [...state.defaults.chinese], completed: false };
        }
        if (!state.data[dateKey].english) {
            state.data[dateKey].english = { content: [...state.defaults.english], completed: false };
        }
        if (!state.data[dateKey].customTasks) {
            state.data[dateKey].customTasks = [];
        }
    }
    return state.data[dateKey];
}

// 渲染日历
function renderCalendar() {
    const year = state.currentYear;
    const month = state.currentMonth;

    elements.currentMonth.textContent = `${year}年${month + 1}月`;
    elements.calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    const todayKey = getDateKey(today);

    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'day-cell empty';
        elements.calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateKey = getDateKey(date);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = dateKey === todayKey;
        const isSelected = state.selectedDate === dateKey;

        const dayCell = document.createElement('div');
        dayCell.className = 'day-cell';
        if (isWeekend) dayCell.classList.add('weekend');
        if (isToday) dayCell.classList.add('today');
        if (isSelected) dayCell.classList.add('selected');

        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);

        const dateData = state.data[dateKey];
        if (dateData) {
            const markers = document.createElement('div');
            markers.className = 'day-markers';

            if (dateData.chinese && dateData.chinese.content.length > 0) {
                const marker = document.createElement('span');
                marker.className = 'day-marker chinese';
                markers.appendChild(marker);
            }
            if (dateData.english && dateData.english.content.length > 0) {
                const marker = document.createElement('span');
                marker.className = 'day-marker english';
                markers.appendChild(marker);
            }
            if (dateData.customTasks && dateData.customTasks.length > 0) {
                const marker = document.createElement('span');
                marker.className = 'day-marker custom';
                markers.appendChild(marker);
            }

            if (markers.children.length > 0) {
                dayCell.appendChild(markers);
            }
        }

        dayCell.addEventListener('click', () => openTaskPanel(date));
        elements.calendarGrid.appendChild(dayCell);
    }
}

// 打开任务面板
function openTaskPanel(date) {
    const dateKey = getDateKey(date);
    state.selectedDate = dateKey;

    elements.panelDay.textContent = date.getDate();
    elements.panelWeekday.textContent = WEEKDAYS[date.getDay()];
    elements.panelMonth.textContent = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    const dateData = ensureDateData(dateKey);
    renderTaskList(dateData);
    updateSummary(dateData);

    elements.taskPanel.classList.add('active');
    elements.taskPanelOverlay.classList.add('active');
    renderCalendar();
}

// 关闭任务面板
function closeTaskPanel() {
    elements.taskPanel.classList.remove('active');
    elements.taskPanelOverlay.classList.remove('active');
    state.selectedDate = null;
    renderCalendar();
}

// 渲染任务列表
function renderTaskList(dateData) {
    elements.chineseTasks.innerHTML = '';
    if (dateData.chinese && dateData.chinese.content.length > 0) {
        dateData.chinese.content.forEach((content, index) => {
            const taskItem = createTaskItem({
                id: `chinese-${index}`,
                text: content,
                completed: dateData.chinese.completed,
                onToggle: () => toggleChineseComplete(),
                onDelete: null
            });
            elements.chineseTasks.appendChild(taskItem);
        });
    }

    elements.englishTasks.innerHTML = '';
    if (dateData.english && dateData.english.content.length > 0) {
        dateData.english.content.forEach((content, index) => {
            const taskItem = createTaskItem({
                id: `english-${index}`,
                text: content,
                completed: dateData.english.completed,
                onToggle: () => toggleEnglishComplete(),
                onDelete: null
            });
            elements.englishTasks.appendChild(taskItem);
        });
    }

    elements.customTasks.innerHTML = '';
    if (dateData.customTasks && dateData.customTasks.length > 0) {
        elements.emptyCustomTasks.style.display = 'none';
        dateData.customTasks.forEach(task => {
            const taskItem = createTaskItem({
                id: task.id,
                text: task.name,
                completed: task.completed,
                onToggle: () => toggleCustomTask(task.id),
                onDelete: () => deleteCustomTask(task.id),
                onEdit: (newName) => editCustomTask(task.id, newName),
                subject: task.subject
            });
            elements.customTasks.appendChild(taskItem);
        });
    } else {
        elements.emptyCustomTasks.style.display = 'flex';
    }
}

// 学科标签颜色映射
const SUBJECT_COLORS = {
    chinese: { bg: '#FEF2F2', color: '#EF4444', text: '语文' },
    english: { bg: '#EFF6FF', color: '#3B82F6', text: '英语' },
    math: { bg: '#F0FDF4', color: '#10B981', text: '数学' },
    other: { bg: '#FAFAFA', color: '#6B7280', text: '其他' }
};

// 创建任务项
function createTaskItem({ id, text, completed, onToggle, onDelete, onEdit, subject }) {
    const item = document.createElement('div');
    item.className = `task-item${completed ? ' completed' : ''}`;
    item.dataset.id = id;

    let subjectTag = '';
    if (subject && SUBJECT_COLORS[subject]) {
        const s = SUBJECT_COLORS[subject];
        subjectTag = `<span class="subject-tag" style="background:${s.bg};color:${s.color}">${s.text}</span>`;
    }

    item.innerHTML = `
        <div class="custom-checkbox${completed ? ' checked' : ''}" data-action="toggle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        </div>
        <span class="task-text" data-action="edit">${subjectTag}${escapeHtml(text)}</span>
        ${onDelete ? `
        <button class="task-edit-btn" data-action="edit-btn" title="修改">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        </button>
        <button class="task-delete-btn" data-action="delete" title="删除">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
            </svg>
        </button>
        ` : ''}
    `;

    const checkbox = item.querySelector('[data-action="toggle"]');
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        onToggle();
    });

    if (onEdit) {
        const startEdit = () => {
            const textEl = item.querySelector('.task-text');
            const oldText = text;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'task-edit-input';
            input.value = oldText;
            input.style.flex = '1';
            input.style.fontSize = '0.9rem';
            input.style.padding = '2px 6px';
            input.style.border = '1px solid var(--primary)';
            input.style.borderRadius = '4px';
            input.style.outline = 'none';
            textEl.replaceWith(input);
            input.focus();
            input.select();
            const finish = (save) => {
                const newName = input.value.trim();
                if (save && newName && newName !== oldText) {
                    onEdit(newName);
                } else {
                    const span = document.createElement('span');
                    span.className = 'task-text';
                    span.setAttribute('data-action', 'edit');
                    span.innerHTML = subjectTag + escapeHtml(oldText);
                    input.replaceWith(span);
                    span.addEventListener('dblclick', (e) => { e.stopPropagation(); startEdit(); });
                }
            };
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); finish(true); }
                else if (e.key === 'Escape') { e.preventDefault(); finish(false); }
            });
            input.addEventListener('blur', () => finish(true));
        };
        const textEl = item.querySelector('.task-text');
        textEl.addEventListener('dblclick', (e) => { e.stopPropagation(); startEdit(); });
        const editBtn = item.querySelector('[data-action="edit-btn"]');
        if (editBtn) editBtn.addEventListener('click', (e) => { e.stopPropagation(); startEdit(); });
    }

    if (onDelete) {
        const deleteBtn = item.querySelector('[data-action="delete"]');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete();
        });
    }

    return item;
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 切换语文完成状态
function toggleChineseComplete() {
    const dateData = state.data[state.selectedDate];
    if (dateData && dateData.chinese) {
        dateData.chinese.completed = !dateData.chinese.completed;
        saveData();
        renderTaskList(dateData);
        updateSummary(dateData);
        ckToast(dateData.chinese.completed ? '语文打卡完成！' : '语文打卡已取消');
    }
}

// 切换英语完成状态
function toggleEnglishComplete() {
    const dateData = state.data[state.selectedDate];
    if (dateData && dateData.english) {
        dateData.english.completed = !dateData.english.completed;
        saveData();
        renderTaskList(dateData);
        updateSummary(dateData);
        ckToast(dateData.english.completed ? '英语打卡完成！' : '英语打卡已取消');
    }
}

// 切换自定义任务完成状态
function toggleCustomTask(taskId) {
    const dateData = state.data[state.selectedDate];
    if (dateData && dateData.customTasks) {
        const task = dateData.customTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveData();
            renderTaskList(dateData);
            updateSummary(dateData);
            ckToast(task.completed ? '作业完成！' : '作业已取消');
        }
    }
}

// 删除自定义任务
function deleteCustomTask(taskId) {
    const dateData = state.data[state.selectedDate];
    if (dateData && dateData.customTasks) {
        const taskIndex = dateData.customTasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            dateData.customTasks.splice(taskIndex, 1);
            saveData();
            renderTaskList(dateData);
            updateSummary(dateData);
            ckToast('作业已删除');
        }
    }
}

// 修改自定义任务
function editCustomTask(taskId, newName) {
    const dateData = state.data[state.selectedDate];
    if (dateData && dateData.customTasks) {
        const task = dateData.customTasks.find(t => t.id === taskId);
        if (task) {
            task.name = newName;
            saveData();
            renderTaskList(dateData);
            updateSummary(dateData);
            ckToast('作业已修改');
        }
    }
}

// 添加自定义任务
function addCustomTask() {
    const input = elements.customTaskInput;
    const subject = elements.subjectSelect.value;
    const text = input.value.trim();

    if (!text) {
        ckToast('请输入作业内容');
        input.focus();
        return;
    }

    const dateData = state.data[state.selectedDate];
    if (dateData && dateData.customTasks) {
        const newTask = {
            id: Date.now(),
            name: text,
            subject: subject,
            completed: false
        };
        dateData.customTasks.push(newTask);
        saveData();
        renderTaskList(dateData);
        updateSummary(dateData);
        input.value = '';
        ckToast('作业已添加');
    }
}

// 更新摘要
function updateSummary(dateData) {
    let total = 0;
    let completed = 0;

    if (dateData.chinese && dateData.chinese.content.length > 0) {
        total += dateData.chinese.content.length;
        if (dateData.chinese.completed) {
            completed += dateData.chinese.content.length;
        }
    }

    if (dateData.english && dateData.english.content.length > 0) {
        total += dateData.english.content.length;
        if (dateData.english.completed) {
            completed += dateData.english.content.length;
        }
    }

    if (dateData.customTasks) {
        dateData.customTasks.forEach(task => {
            total++;
            if (task.completed) completed++;
        });
    }

    elements.summaryCount.textContent = `${completed}/${total}`;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    elements.progressBar.style.width = `${percentage}%`;

    if (percentage === 100) {
        elements.motivationText.textContent = '太棒了！今日任务全部完成！';
    } else if (percentage >= 50) {
        elements.motivationText.textContent = '加油！已经完成一半了！';
    } else {
        const randomMotivation = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
        elements.motivationText.textContent = randomMotivation;
    }
}

// 打开编辑模态框
function openEditModal(subject) {
    state.editingSubject = subject;
    const dateData = state.data[state.selectedDate];

    elements.editModalTitle.textContent = subject === 'chinese' ? '编辑语文打卡内容' : '编辑英语打卡内容';

    elements.contentList.innerHTML = '';
    const contents = dateData[subject].content;

    contents.forEach((content, index) => {
        const item = document.createElement('div');
        item.className = 'content-item';
        item.innerHTML = `
            <input type="text" value="${escapeHtml(content)}" data-index="${index}">
            <button class="content-delete-btn" data-index="${index}" title="删除">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        elements.contentList.appendChild(item);
    });

    elements.contentList.querySelectorAll('.content-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const input = elements.contentList.querySelector(`input[data-index="${index}"]`);
            if (input) {
                input.value = '';
                btn.closest('.content-item').style.opacity = '0.5';
                btn.closest('.content-item').style.textDecoration = 'line-through';
            }
        });
    });

    elements.newContentInput.value = '';
    elements.editModal.classList.add('active');
}

// 关闭编辑模态框
function closeEditModal() {
    elements.editModal.classList.remove('active');
    state.editingSubject = null;
}

// 添加新内容
function addNewContent() {
    const input = elements.newContentInput;
    const text = input.value.trim();

    if (!text) {
        ckToast('请输入打卡内容');
        input.focus();
        return;
    }

    const item = document.createElement('div');
    item.className = 'content-item';
    item.innerHTML = `
        <input type="text" value="${escapeHtml(text)}" data-index="new-${Date.now()}">
        <button class="content-delete-btn" title="删除" style="opacity: 1;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;

    item.querySelector('.content-delete-btn').addEventListener('click', () => {
        item.remove();
    });

    elements.contentList.appendChild(item);
    input.value = '';
    input.focus();
}

// 保存编辑内容
function saveContent() {
    if (!state.editingSubject) return;

    const dateData = state.data[state.selectedDate];
    const newContents = [];

    elements.contentList.querySelectorAll('.content-item').forEach(item => {
        const input = item.querySelector('input');
        const text = input.value.trim();
        if (text) {
            newContents.push(text);
        }
    });

    if (newContents.length === 0) {
        newContents.push(state.editingSubject === 'chinese' ? '语文打卡' : '英语打卡');
    }

    dateData[state.editingSubject].content = newContents;
    state.defaults[state.editingSubject] = [...newContents];
    saveDefaults();
    saveData();
    renderTaskList(dateData);
    updateSummary(dateData);
    closeEditModal();
    ckToast('打卡内容已保存，将作为每日默认任务');
}

// 添加语文/英语任务 - 使用自定义模态框
function addMiniTask(subject) {
    if (!state.selectedDate) return;

    state.quickAddSubject = subject;
    elements.quickAddTitle.textContent = subject === 'chinese' ? '添加语文任务' : '添加英语任务';
    elements.quickAddInput.value = '';
    elements.quickAddModal.classList.add('active');

    // 聚焦输入框
    setTimeout(() => elements.quickAddInput.focus(), 100);
}

// 确认添加快速任务
function confirmQuickAdd() {
    const taskName = elements.quickAddInput.value.trim();
    if (taskName && state.quickAddSubject) {
        const dateData = state.data[state.selectedDate];
        dateData[state.quickAddSubject].content.push(taskName);
        saveData();
        renderTaskList(dateData);
        updateSummary(dateData);
        ckToast('任务已添加');
    }
    closeQuickAddModal();
}

// 关闭快速添加模态框
function closeQuickAddModal() {
    elements.quickAddModal.classList.remove('active');
    state.quickAddSubject = null;
}

// Toast提示
function ckToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('active');

    setTimeout(() => {
        elements.toast.classList.remove('active');
    }, 2000);
}

// 绑定事件
function bindEvents() {
    elements.prevMonth.addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        renderCalendar();
    });

    elements.nextMonth.addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        renderCalendar();
    });

    elements.closePanel.addEventListener('click', closeTaskPanel);
    elements.taskPanelOverlay.addEventListener('click', closeTaskPanel);

    elements.addCustomTaskBtn.addEventListener('click', addCustomTask);
    elements.customTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomTask();
        }
    });

    elements.editChineseBtn.addEventListener('click', () => openEditModal('chinese'));
    elements.editEnglishBtn.addEventListener('click', () => openEditModal('english'));

    elements.closeModal.addEventListener('click', closeEditModal);
    elements.editModal.addEventListener('click', (e) => {
        if (e.target === elements.editModal) {
            closeEditModal();
        }
    });

    elements.addContentBtn.addEventListener('click', addNewContent);
    elements.newContentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewContent();
        }
    });

    elements.saveContentBtn.addEventListener('click', saveContent);

    elements.addChineseTask.addEventListener('click', () => addMiniTask('chinese'));
    elements.addEnglishTask.addEventListener('click', () => addMiniTask('english'));

    // Quick Add Modal events
    elements.closeQuickAddModal.addEventListener('click', closeQuickAddModal);
    elements.quickAddModal.addEventListener('click', (e) => {
        if (e.target === elements.quickAddModal) {
            closeQuickAddModal();
        }
    });
    elements.confirmQuickAddBtn.addEventListener('click', confirmQuickAdd);
    elements.quickAddInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmQuickAdd();
        }
    });

    // 导出导入
    if (elements.refreshSyncBtn) {
        elements.refreshSyncBtn.addEventListener('click', async () => {
            ckToast('正在刷新同步...');
            await syncFromCloud();
        });
    }
    if (elements.exportBtn) {
        elements.exportBtn.addEventListener('click', exportData);
    }
    if (elements.importBtn && elements.importFile) {
        elements.importBtn.addEventListener('click', () => elements.importFile.click());
        elements.importFile.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                importData(e.target.files[0]);
                e.target.value = '';
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (elements.quickAddModal.classList.contains('active')) {
                closeQuickAddModal();
            } else if (elements.editModal.classList.contains('active')) {
                closeEditModal();
            } else if (elements.taskPanel.classList.contains('active')) {
                closeTaskPanel();
            }
        }
    });

    // 页面加载和离开时同步
    window.addEventListener('beforeunload', () => {
        syncToCloud();
    });
}

// ==================== 书籍库功能 ====================

// 书籍库状态
const bookState = {
    books: [],
    editingBookId: null,
    filters: {
        category: '',
        status: '',
        location: '',
        search: ''
    }
};

// 书籍库 DOM 元素
const bookElements = {
    openBtn: document.getElementById('openBookLibrary'),
    panel: document.getElementById('bookLibraryPanel'),
    overlay: document.getElementById('bookLibraryOverlay'),
    closeBtn: document.getElementById('closeBookLibrary'),
    searchInput: document.getElementById('bookSearchInput'),
    addBtn: document.getElementById('addBookBtn'),
    list: document.getElementById('bookList'),
    filterCategory: document.getElementById('filterCategory'),
    filterStatus: document.getElementById('filterStatus'),
    filterLocation: document.getElementById('filterLocation'),
    // Modal
    modal: document.getElementById('bookModal'),
    modalTitle: document.getElementById('bookModalTitle'),
    closeModalBtn: document.getElementById('closeBookModal'),
    cancelBtn: document.getElementById('cancelBookBtn'),
    saveBtn: document.getElementById('saveBookBtn'),
    // Form fields
    category: document.getElementById('bookCategory'),
    name: document.getElementById('bookName'),
    volumes: document.getElementById('bookVolumes'),
    status: document.getElementById('bookStatus'),
    source: document.getElementById('bookSource'),
    location: document.getElementById('bookLocation'),
    owned: document.getElementById('bookOwned'),
    // Cover elements
    coverPreview: document.getElementById('bookCoverPreview'),
    coverInput: document.getElementById('bookCoverInput'),
    removeCoverBtn: document.getElementById('removeCoverBtn')
};

// 当前编辑的书籍封面图片（base64）
let currentBookCover = null;

// 企业微信推送状态
const wechatPushState = {
    webhookUrl: '',
    pushTime: '08:00',
    pushChinese: true,
    pushEnglish: true,
    pushCustom: true,
    pushWeekends: true,
    pushTodayOnly: true,
    enabled: false
};

// 企业微信推送 DOM 元素
const wechatPushElements = {
    openBtn: document.getElementById('openWechatPush'),
    panel: document.getElementById('wechatPushPanel'),
    overlay: document.getElementById('wechatPushOverlay'),
    closeBtn: document.getElementById('closeWechatPush'),
    webhookUrl: document.getElementById('wechatWebhookUrl'),
    pushTime: document.getElementById('wechatPushTime'),
    pushChinese: document.getElementById('wechatPushChinese'),
    pushEnglish: document.getElementById('wechatPushEnglish'),
    pushCustom: document.getElementById('wechatPushCustom'),
    pushWeekends: document.getElementById('wechatPushWeekends'),
    pushTodayOnly: document.getElementById('wechatPushToday'),
    testBtn: document.getElementById('testPushBtn'),
    statusDot: document.querySelector('.wechat-push-status .status-dot'),
    statusText: document.querySelector('.wechat-push-status .status-text')
};

// 初始化企业微信推送
function initWechatPush() {
    loadWechatPushSettings();
    updateWechatPushStatus();
}

// 加载推送设置
function loadWechatPushSettings() {
    const saved = localStorage.getItem('wechatPushSettings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            Object.assign(wechatPushState, settings);
            // 更新UI
            if (wechatPushElements.webhookUrl) wechatPushElements.webhookUrl.value = wechatPushState.webhookUrl || '';
            if (wechatPushElements.pushTime) wechatPushElements.pushTime.value = wechatPushState.pushTime || '08:00';
            if (wechatPushElements.pushChinese) wechatPushElements.pushChinese.checked = wechatPushState.pushChinese;
            if (wechatPushElements.pushEnglish) wechatPushElements.pushEnglish.checked = wechatPushState.pushEnglish;
            if (wechatPushElements.pushCustom) wechatPushElements.pushCustom.checked = wechatPushState.pushCustom;
            if (wechatPushElements.pushWeekends) wechatPushElements.pushWeekends.checked = wechatPushState.pushWeekends;
            if (wechatPushElements.pushTodayOnly) wechatPushElements.pushTodayOnly.checked = wechatPushState.pushTodayOnly;
        } catch (e) {
            console.error('加载推送设置失败:', e);
        }
    }
}

// 保存推送设置
function saveWechatPushSettings() {
    wechatPushState.webhookUrl = wechatPushElements.webhookUrl?.value || '';
    wechatPushState.pushTime = wechatPushElements.pushTime?.value || '08:00';
    wechatPushState.pushChinese = wechatPushElements.pushChinese?.checked ?? true;
    wechatPushState.pushEnglish = wechatPushElements.pushEnglish?.checked ?? true;
    wechatPushState.pushCustom = wechatPushElements.pushCustom?.checked ?? true;
    wechatPushState.pushWeekends = wechatPushElements.pushWeekends?.checked ?? true;
    wechatPushState.pushTodayOnly = wechatPushElements.pushTodayOnly?.checked ?? true;
    wechatPushState.enabled = !!wechatPushState.webhookUrl;

    localStorage.setItem('wechatPushSettings', JSON.stringify(wechatPushState));
    updateWechatPushStatus();
    ckToast('推送设置已保存', 'success');
}

// 更新推送状态显示
function updateWechatPushStatus() {
    if (!wechatPushElements.statusDot || !wechatPushElements.statusText) return;

    if (wechatPushState.enabled) {
        wechatPushElements.statusDot.style.background = '#07C160';
        wechatPushElements.statusText.textContent = `已启用 · ${wechatPushState.pushTime}`;
    } else {
        wechatPushElements.statusDot.style.background = '#999';
        wechatPushElements.statusText.textContent = '未配置';
    }
}

// 打开推送设置面板
function openWechatPush() {
    if (wechatPushElements.panel) {
        wechatPushElements.panel.classList.add('active');
    }
    if (wechatPushElements.overlay) {
        wechatPushElements.overlay.classList.add('active');
    }
}

// 关闭推送设置面板
function closeWechatPush() {
    if (wechatPushElements.panel) {
        wechatPushElements.panel.classList.remove('active');
    }
    if (wechatPushElements.overlay) {
        wechatPushElements.overlay.classList.remove('active');
    }
    saveWechatPushSettings();
}

// 获取今日任务摘要
function getTodayTasksSummary() {
    const today = getChinaTimeString().split('T')[0];
    const dateData = localData.data[today];
    if (!dateData) return null;

    const summary = { chinese: [], english: [], custom: [] };

    // 语文打卡任务
    if (dateData.chineseTasks) {
        dateData.chineseTasks.forEach(task => {
            if (task.content) summary.chinese.push(task.content);
        });
    }

    // 英语打卡任务
    if (dateData.englishTasks) {
        dateData.englishTasks.forEach(task => {
            if (task.content) summary.english.push(task.content);
        });
    }

    // 自定义任务
    if (dateData.customTasks) {
        dateData.customTasks.forEach(task => {
            if (task.content && !task.fromPlanId) {
                summary.custom.push(task.content);
            }
        });
    }

    return summary;
}

// 格式化推送消息
function formatWechatMessage(summary, date) {
    const dateObj = new Date(date);
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateObj.getDay()];
    const dateStr = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日 ${weekday}`;

    let message = `📋 梓煜每日任务提醒\n`;
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `📅 ${dateStr}\n\n`;

    let hasContent = false;

    if (wechatPushState.pushChinese && summary.chinese.length > 0) {
        message += `📝 语文打卡：\n`;
        summary.chinese.forEach(item => {
            message += `   • ${item}\n`;
        });
        message += `\n`;
        hasContent = true;
    }

    if (wechatPushState.pushEnglish && summary.english.length > 0) {
        message += `📚 英语打卡：\n`;
        summary.english.forEach(item => {
            message += `   • ${item}\n`;
        });
        message += `\n`;
        hasContent = true;
    }

    if (wechatPushState.pushCustom && summary.custom.length > 0) {
        message += `✨ 其他任务：\n`;
        summary.custom.forEach(item => {
            message += `   • ${item}\n`;
        });
        message += `\n`;
        hasContent = true;
    }

    if (!hasContent) {
        message += `今日暂无任务安排\n\n`;
    }

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💪 加油完成任务！`;

    return message;
}

// 发送测试推送
async function sendTestPush() {
    if (!wechatPushState.webhookUrl) {
        ckToast('请先配置Webhook地址', 'error');
        return;
    }

    const today = getChinaTimeString().split('T')[0];
    const summary = getTodayTasksSummary() || { chinese: ['语文打卡测试'], english: ['英语打卡测试'], custom: [] };
    const message = formatWechatMessage(summary, today);

    try {
        const response = await ckFetch(wechatPushState.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                msgtype: 'text',
                text: {
                    content: message
                }
            })
        });

        if (response.ok) {
            ckToast('测试推送成功！', 'success');
        } else {
            const error = await response.json();
            ckToast(`推送失败: ${error.errmsg || '未知错误'}`, 'error');
        }
    } catch (error) {
        console.error('推送失败:', error);
        ckToast('推送失败，请检查网络和Webhook地址', 'error');
    }
}

// 绑定企微推送事件
function bindWechatEvents() {
    if (wechatPushElements.openBtn) {
        wechatPushElements.openBtn.addEventListener('click', openWechatPush);
    }
    if (wechatPushElements.closeBtn) {
        wechatPushElements.closeBtn.addEventListener('click', closeWechatPush);
    }
    if (wechatPushElements.overlay) {
        wechatPushElements.overlay.addEventListener('click', closeWechatPush);
    }
    if (wechatPushElements.testBtn) {
        wechatPushElements.testBtn.addEventListener('click', sendTestPush);
    }

    // 输入时自动保存
    [wechatPushElements.webhookUrl, wechatPushElements.pushTime].forEach(el => {
        if (el) {
            el.addEventListener('change', saveWechatPushSettings);
        }
    });
    [wechatPushElements.pushChinese, wechatPushElements.pushEnglish,
     wechatPushElements.pushCustom, wechatPushElements.pushWeekends,
     wechatPushElements.pushTodayOnly].forEach(el => {
        if (el) {
            el.addEventListener('change', saveWechatPushSettings);
        }
    });
}

// 初始化书籍库
async function initBookLibrary() {
    await loadBooksFromCloud();
    renderBookList();
}

// 从云端加载书籍
async function loadBooksFromCloud() {
    try {
        const response = await ckFetch(`${SUPABASE_URL}/rest/v1/books?user_id=eq.${state.userId}&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            bookState.books = data || [];
            console.log('已加载书籍:', bookState.books.length);
        }
    } catch (e) {
        console.error('加载书籍失败:', e);
    }
}

// 保存书籍到云端
async function saveBookToCloud(book) {
    try {
        const payload = {
            user_id: state.userId,
            category: book.category,
            name: book.name,
            volumes: book.volumes,
            status: book.status,
            source: book.source,
            location: book.location,
            owned: book.owned || 'owned',
            cover: book.cover || null,
            updated_at: getChinaTimeString()
        };

        if (book.id && book.id > 0) {
            // 更新现有书籍
            await ckFetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${book.id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });
        } else {
            // 创建新书籍
            payload.created_at = getChinaTimeString();
            const response = await ckFetch(`${SUPABASE_URL}/rest/v1/books`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const result = await response.json();
                if (result && result[0]) {
                    book.id = result[0].id;
                }
            }
        }
        return true;
    } catch (e) {
        console.error('保存书籍失败:', e);
        return false;
    }
}

// 删除书籍
async function deleteBookFromCloud(bookId) {
    try {
        await ckFetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${bookId}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        return true;
    } catch (e) {
        console.error('删除书籍失败:', e);
        return false;
    }
}

// 渲染书籍列表
function renderBookList() {
    const filtered = filterBooks();

    if (filtered.length === 0) {
        bookElements.list.innerHTML = `
            <div class="book-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                </svg>
                <p>暂无书籍</p>
                <span>点击上方"添加书籍"开始录入</span>
            </div>
        `;
        return;
    }

    bookElements.list.innerHTML = filtered.map(book => createBookItem(book)).join('');

    // 绑定事件
    bookElements.list.querySelectorAll('.book-item').forEach(item => {
        const bookId = parseInt(item.dataset.id);

        item.querySelector('.edit-book-btn')?.addEventListener('click', () => openEditBookModal(bookId));
        item.querySelector('.delete-book-btn')?.addEventListener('click', () => confirmDeleteBook(bookId));
    });
}

// 筛选书籍
function filterBooks() {
    return bookState.books.filter(book => {
        if (bookState.filters.category && book.category !== bookState.filters.category) return false;
        if (bookState.filters.status && book.status !== bookState.filters.status) return false;
        if (bookState.filters.location && book.location !== bookState.filters.location) return false;
        if (bookState.filters.search) {
            const search = bookState.filters.search.toLowerCase();
            if (!book.name.toLowerCase().includes(search)) return false;
        }
        return true;
    });
}

// 创建书籍项 HTML
function createBookItem(book) {
    const categoryNames = { chinese: '语文', math: '数学', english: '英语', science: '科学', history: '历史', other: '其他' };
    const statusNames = { not_started: '未开始', reading: '正在进行', completed: '已完成' };
    const sourceNames = { published: '出版', homemade: '自制' };
    const locationNames = { east: '东区', south: '南区' };
    const ownedNames = { owned: '已购买', not_owned: '未购买' };

    const coverHtml = book.cover
        ? `<img src="${book.cover}" alt="封面">`
        : `<div class="book-icon ${book.category}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
           </div>`;

    return `
        <div class="book-item" data-id="${book.id}">
            <div class="book-item-cover">
                ${coverHtml}
            </div>
            <div class="book-content">
                <div class="book-name">${escapeHtml(book.name)} ${book.volumes > 1 ? `×${book.volumes}` : ''}</div>
                <div class="book-meta">
                    <span class="book-tag">${categoryNames[book.category] || book.category}</span>
                    <span class="book-tag status-${book.status}">${statusNames[book.status]}</span>
                    <span class="book-tag source-${book.source}">${sourceNames[book.source]}</span>
                    <span class="book-tag location-${book.location}">${locationNames[book.location]}</span>
                    <span class="book-tag owned-${book.owned}">${ownedNames[book.owned] || '已购买'}</span>
                </div>
            </div>
            <div class="book-actions">
                <button class="book-action-btn edit-book-btn" title="编辑">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="book-action-btn delete delete-book-btn" title="删除">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// 更新封面预览
function updateCoverPreview(coverData) {
    if (coverData) {
        bookElements.coverPreview.innerHTML = `<img src="${coverData}" alt="封面">`;
        bookElements.coverPreview.classList.add('has-image');
        bookElements.removeCoverBtn.style.display = 'flex';
    } else {
        bookElements.coverPreview.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>上传封面</span>`;
        bookElements.coverPreview.classList.remove('has-image');
        bookElements.removeCoverBtn.style.display = 'none';
    }
}

// 处理封面图片上传
function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        ckToast('请选择图片文件');
        return;
    }

    // 限制图片大小为 500KB
    if (file.size > 500 * 1024) {
        ckToast('图片大小不能超过 500KB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentBookCover = e.target.result;
        updateCoverPreview(currentBookCover);
    };
    reader.readAsDataURL(file);
}

// 移除封面
function removeCover() {
    currentBookCover = null;
    if (bookElements.coverInput) {
        bookElements.coverInput.value = '';
    }
    updateCoverPreview(null);
}

// 打开添加书籍弹窗
function openAddBookModal() {
    bookState.editingBookId = null;
    currentBookCover = null;
    bookElements.modalTitle.textContent = '添加书籍';
    bookElements.category.value = 'chinese';
    bookElements.name.value = '';
    bookElements.volumes.value = '1';
    bookElements.status.value = 'not_started';
    bookElements.source.value = 'published';
    bookElements.location.value = 'east';
    updateCoverPreview(null);
    bookElements.modal.classList.add('active');
    setTimeout(() => bookElements.name.focus(), 100);
}

// 打开编辑书籍弹窗
function openEditBookModal(bookId) {
    const book = bookState.books.find(b => b.id === bookId);
    if (!book) return;

    bookState.editingBookId = bookId;
    currentBookCover = book.cover || null;
    bookElements.modalTitle.textContent = '编辑书籍';
    bookElements.category.value = book.category;
    bookElements.name.value = book.name;
    bookElements.volumes.value = book.volumes || 1;
    bookElements.status.value = book.status;
    bookElements.source.value = book.source;
    bookElements.location.value = book.location;
    bookElements.owned.value = book.owned || 'owned';
    updateCoverPreview(currentBookCover);
    bookElements.modal.classList.add('active');
}

// 关闭书籍弹窗
function closeBookModal() {
    bookElements.modal.classList.remove('active');
    bookState.editingBookId = null;
    currentBookCover = null;
}

// 保存书籍
async function saveBook() {
    const book = {
        category: bookElements.category.value,
        name: bookElements.name.value.trim(),
        volumes: parseInt(bookElements.volumes.value) || 1,
        status: bookElements.status.value,
        source: bookElements.source.value,
        location: bookElements.location.value,
        owned: bookElements.owned ? bookElements.owned.value : 'owned',
        cover: currentBookCover
    };

    if (!book.name) {
        ckToast('请输入书名');
        return;
    }

    if (bookState.editingBookId) {
        book.id = bookState.editingBookId;
        const index = bookState.books.findIndex(b => b.id === bookState.editingBookId);
        if (index > -1) {
            Object.assign(bookState.books[index], book);
        }
    } else {
        book.id = 0; // 临时ID，云端会返回真实ID
        bookState.books.unshift(book);
    }

    const success = await saveBookToCloud(book);
    if (success) {
        ckToast(bookState.editingBookId ? '书籍已更新' : '书籍已添加');
        closeBookModal();
        renderBookList();
    } else {
        ckToast('保存失败，请重试');
    }
}

// 确认删除书籍
function confirmDeleteBook(bookId) {
    if (!confirm('确定要删除这本书吗？')) return;

    const index = bookState.books.findIndex(b => b.id === bookId);
    if (index > -1) {
        bookState.books.splice(index, 1);
    }

    deleteBookFromCloud(bookId).then(() => {
        ckToast('书籍已删除');
        renderBookList();
    });
}

// 打开书籍库面板
function openBookLibrary() {
    bookElements.overlay.classList.add('active');
    bookElements.panel.classList.add('active');
}

// 关闭书籍库面板
function closeBookLibrary() {
    bookElements.overlay.classList.remove('active');
    bookElements.panel.classList.remove('active');
}

// ==================== 计划任务功能 ====================

// 计划任务状态
const planState = {
    plans: [],
    editingPlanId: null
};

// 格式化日期为 YYYY-MM-DD
function formatDateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 计划任务 DOM 元素
const planElements = {
    openBtn: document.getElementById('openPlanTasks'),
    panel: document.getElementById('planTasksPanel'),
    overlay: document.getElementById('planTasksOverlay'),
    closeBtn: document.getElementById('closePlanTasks'),
    addBtn: document.getElementById('addPlanBtn'),
    list: document.getElementById('planList'),
    // Modal
    modal: document.getElementById('planModal'),
    modalTitle: document.getElementById('planModalTitle'),
    closeModalBtn: document.getElementById('closePlanModal'),
    cancelBtn: document.getElementById('cancelPlanBtn'),
    saveBtn: document.getElementById('savePlanBtn'),
    // Form fields
    subject: document.getElementById('planSubject'),
    name: document.getElementById('planName'),
    startDate: document.getElementById('planStartDate'),
    endDate: document.getElementById('planEndDate')
};

// 初始化计划任务
async function initPlanTasks() {
    await loadPlansFromCloud();
    renderPlanList();
}

// 从云端加载计划任务
async function loadPlansFromCloud() {
    try {
        const response = await ckFetch(`${SUPABASE_URL}/rest/v1/plans?user_id=eq.${state.userId}&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            planState.plans = data || [];
            console.log('已加载计划任务:', planState.plans.length);
        }
    } catch (e) {
        console.error('加载计划任务失败:', e);
    }
}

// 保存计划到云端
async function savePlanToCloud(plan) {
    try {
        const payload = {
            user_id: state.userId,
            subject: plan.subject,
            name: plan.name,
            start_date: plan.startDate,
            end_date: plan.endDate,
            distributed: plan.distributed || false,
            updated_at: getChinaTimeString()
        };

        if (plan.id && plan.id > 0) {
            // 更新现有计划
            await ckFetch(`${SUPABASE_URL}/rest/v1/plans?id=eq.${plan.id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(payload)
            });
        } else {
            // 创建新计划
            payload.created_at = getChinaTimeString();
            const response = await ckFetch(`${SUPABASE_URL}/rest/v1/plans`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('云端返回的计划数据:', result);
                // 处理不同的返回格式
                if (result && result.length > 0) {
                    plan.id = result[0].id;
                    console.log('已设置计划ID:', plan.id);
                } else if (result && result.id) {
                    // 单个对象格式
                    plan.id = result.id;
                    console.log('已设置计划ID (对象格式):', plan.id);
                }
            }
        }
        return true;
    } catch (e) {
        console.error('保存计划失败:', e);
        return false;
    }
}

// 删除计划
async function deletePlanFromCloud(planId) {
    try {
        await ckFetch(`${SUPABASE_URL}/rest/v1/plans?id=eq.${planId}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        return true;
    } catch (e) {
        console.error('删除计划失败:', e);
        return false;
    }
}

// 渲染计划列表
function renderPlanList() {
    if (planState.plans.length === 0) {
        planElements.list.innerHTML = `
            <div class="plan-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                <p>暂无计划任务</p>
                <span>点击上方"添加计划"创建任务计划</span>
            </div>
        `;
        return;
    }

    planElements.list.innerHTML = planState.plans.map(plan => createPlanItem(plan)).join('');

    // 绑定事件
    planElements.list.querySelectorAll('.plan-item').forEach(item => {
        const planId = parseInt(item.dataset.id);
        item.querySelector('.distribute-plan-btn')?.addEventListener('click', () => distributePlanToCalendar(planId));
        item.querySelector('.edit-plan-btn')?.addEventListener('click', () => openEditPlanModal(planId));
        item.querySelector('.delete-plan-btn')?.addEventListener('click', () => confirmDeletePlan(planId));
    });
}

// 创建计划项 HTML
function createPlanItem(plan) {
    const subjectNames = { chinese: '语文', math: '数学', english: '英语', science: '科学', history: '历史', other: '其他' };

    const distributedHtml = plan.distributed ? `
        <span class="plan-distributed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            已分配
        </span>
    ` : '';

    return `
        <div class="plan-item" data-id="${plan.id}">
            <div class="plan-icon ${plan.subject}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
            </div>
            <div class="plan-content">
                <div class="plan-name">${escapeHtml(plan.name)}</div>
                <div class="plan-meta">
                    <span class="plan-tag subject-${plan.subject}">${subjectNames[plan.subject] || plan.subject}</span>
                    <span class="plan-tag">${plan.startDate} 至 ${plan.endDate}</span>
                    ${distributedHtml}
                </div>
            </div>
            <div class="plan-actions">
                ${!plan.distributed ? `
                <button class="plan-action-btn distribute-plan-btn" title="分配到日历">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                </button>
                ` : ''}
                <button class="plan-action-btn edit-plan-btn" title="编辑">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="plan-action-btn delete delete-plan-btn" title="删除">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// 将计划分配到日历
async function distributePlanToCalendar(planId) {
    const plan = planState.plans.find(p => p.id === planId);
    if (!plan) return;

    // 解析日期范围
    const startDate = new Date(plan.startDate);
    const endDate = new Date(plan.endDate);

    let distributedCount = 0;

    // 遍历日期范围内的每一天
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = getDateKey(d);
        const dateData = ensureDateData(dateKey);

        // 检查是否已经存在同名任务
        const taskExists = dateData.customTasks.some(task =>
            task.name === plan.name && task.subject === plan.subject && task.fromPlanId === planId
        );

        if (!taskExists) {
            dateData.customTasks.push({
                id: Date.now() + distributedCount,
                name: plan.name,
                subject: plan.subject,
                completed: false,
                fromPlanId: planId // 标记任务来源
            });
            distributedCount++;
        }
    }

    // 保存数据并同步
    saveData();

    // 标记计划已分配
    plan.distributed = true;
    await savePlanToCloud(plan);

    // 更新UI
    renderPlanList();
    renderCalendar();

    ckToast(`已将任务分配到${distributedCount}天日历`);
}

// 打开添加计划弹窗
function openAddPlanModal() {
    planState.editingPlanId = null;

    // 设置默认日期为今天和一个月后
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    planElements.modalTitle.textContent = '添加计划';
    planElements.subject.value = 'math';
    planElements.name.value = '';
    planElements.startDate.value = formatDate(today);
    planElements.endDate.value = formatDate(nextMonth);

    planElements.modal.classList.add('active');
    setTimeout(() => planElements.name.focus(), 100);
}

// 打开编辑计划弹窗
function openEditPlanModal(planId) {
    const plan = planState.plans.find(p => p.id === planId);
    if (!plan) return;

    planState.editingPlanId = planId;
    planElements.modalTitle.textContent = '编辑计划';
    planElements.subject.value = plan.subject;
    planElements.name.value = plan.name;
    planElements.startDate.value = plan.startDate;
    planElements.endDate.value = plan.endDate;

    planElements.modal.classList.add('active');
}

// 关闭计划弹窗
function closePlanModal() {
    planElements.modal.classList.remove('active');
    planState.editingPlanId = null;
}

// 保存计划
async function savePlan() {
    const plan = {
        subject: planElements.subject.value,
        name: planElements.name.value.trim(),
        startDate: planElements.startDate.value,
        endDate: planElements.endDate.value
    };

    if (!plan.name) {
        ckToast('请输入任务名称');
        return;
    }

    if (!plan.startDate || !plan.endDate) {
        ckToast('请选择日期范围');
        return;
    }

    if (new Date(plan.startDate) > new Date(plan.endDate)) {
        ckToast('开始日期不能晚于结束日期');
        return;
    }

    if (planState.editingPlanId) {
        // 编辑现有计划
        plan.id = planState.editingPlanId;
        plan.distributed = true;

        const index = planState.plans.findIndex(p => p.id === planState.editingPlanId);
        if (index > -1) {
            Object.assign(planState.plans[index], plan);
        }

        const success = await savePlanToCloud(plan);
        if (success) {
            updatePlanTasksInCalendar(plan.id, plan);
            ckToast('计划已更新');
            closePlanModal();
            renderPlanList();
        } else {
            ckToast('保存失败，请重试');
        }
    } else {
        // 新建计划
        plan.id = 0;
        plan.distributed = true;
        planState.plans.unshift(plan);

        const success = await savePlanToCloud(plan);
        if (success) {
            setTimeout(async () => {
                if (plan.id && plan.id > 0) {
                    await distributePlanToCalendar(plan.id);
                }
            }, 100);

            ckToast('计划已添加并分配到日历');
            closePlanModal();
            renderPlanList();
            renderCalendar();
        } else {
            ckToast('保存失败，请重试');
        }
    }
}

// 从日历中删除某个计划的所有任务
function removePlanTasksFromCalendar(planId) {
    // 遍历所有日期数据
    Object.keys(localData.data).forEach(dateKey => {
        const dateData = localData.data[dateKey];
        // 过滤掉该计划的任务
        dateData.customTasks = dateData.customTasks.filter(task =>
            task.fromPlanId !== planId
        );
    });
    saveData();
    renderCalendar();
}

// 更新日历中某个计划的所有任务
function updatePlanTasksInCalendar(planId, newPlanData) {
    // 先删除旧的计划任务
    removePlanTasksFromCalendar(planId);

    // 重新添加更新后的任务（只对新的日期范围）
    const startDate = new Date(newPlanData.startDate);
    const endDate = new Date(newPlanData.endDate);

    let distributedCount = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = getDateKey(d);
        const dateData = ensureDateData(dateKey);

        const taskExists = dateData.customTasks.some(task =>
            task.name === newPlanData.name && task.subject === newPlanData.subject && task.fromPlanId === planId
        );

        if (!taskExists) {
            dateData.customTasks.push({
                id: Date.now() + distributedCount,
                name: newPlanData.name,
                subject: newPlanData.subject,
                completed: false,
                fromPlanId: planId
            });
            distributedCount++;
        }
    }

    saveData();
    renderCalendar();
    return distributedCount;
}

// 确认删除计划
async function confirmDeletePlan(planId) {
    if (!confirm('确定要删除这个计划吗？删除后将同时删除日历中已分配的任务。')) return;

    const index = planState.plans.findIndex(p => p.id === planId);
    if (index > -1) {
        planState.plans.splice(index, 1);
    }

    // 从日历中删除该计划的任务
    removePlanTasksFromCalendar(planId);

    await deletePlanFromCloud(planId);
    ckToast('计划已删除');
    renderPlanList();
}

// 打开计划任务面板
function openPlanTasks() {
    planElements.overlay.classList.add('active');
    planElements.panel.classList.add('active');
}

// 关闭计划任务面板
function closePlanTasks() {
    planElements.overlay.classList.remove('active');
    planElements.panel.classList.remove('active');
}

// 绑定计划任务事件
function bindPlanEvents() {
    if (planElements.openBtn) {
        planElements.openBtn.addEventListener('click', openPlanTasks);
    }
    if (planElements.closeBtn) {
        planElements.closeBtn.addEventListener('click', closePlanTasks);
    }
    if (planElements.overlay) {
        planElements.overlay.addEventListener('click', closePlanTasks);
    }
    if (planElements.addBtn) {
        planElements.addBtn.addEventListener('click', openAddPlanModal);
    }
    if (planElements.closeModalBtn) {
        planElements.closeModalBtn.addEventListener('click', closePlanModal);
    }
    if (planElements.cancelBtn) {
        planElements.cancelBtn.addEventListener('click', closePlanModal);
    }
    if (planElements.saveBtn) {
        planElements.saveBtn.addEventListener('click', savePlan);
    }
    if (planElements.name) {
        planElements.name.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') savePlan();
        });
    }
    if (planElements.modal) {
        planElements.modal.addEventListener('click', (e) => {
            if (e.target === planElements.modal) closePlanModal();
        });
    }
}

// 绑定书籍库事件
function bindBookEvents() {
    if (bookElements.openBtn) {
        bookElements.openBtn.addEventListener('click', openBookLibrary);
    }
    if (bookElements.closeBtn) {
        bookElements.closeBtn.addEventListener('click', closeBookLibrary);
    }
    if (bookElements.overlay) {
        bookElements.overlay.addEventListener('click', closeBookLibrary);
    }
    if (bookElements.addBtn) {
        bookElements.addBtn.addEventListener('click', openAddBookModal);
    }
    if (bookElements.closeModalBtn) {
        bookElements.closeModalBtn.addEventListener('click', closeBookModal);
    }
    if (bookElements.cancelBtn) {
        bookElements.cancelBtn.addEventListener('click', closeBookModal);
    }
    if (bookElements.saveBtn) {
        bookElements.saveBtn.addEventListener('click', saveBook);
    }
    if (bookElements.name) {
        bookElements.name.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveBook();
        });
    }
    if (bookElements.searchInput) {
        bookElements.searchInput.addEventListener('input', (e) => {
            bookState.filters.search = e.target.value;
            renderBookList();
        });
    }
    if (bookElements.filterCategory) {
        bookElements.filterCategory.addEventListener('change', (e) => {
            bookState.filters.category = e.target.value;
            renderBookList();
        });
    }
    if (bookElements.filterStatus) {
        bookElements.filterStatus.addEventListener('change', (e) => {
            bookState.filters.status = e.target.value;
            renderBookList();
        });
    }
    if (bookElements.filterLocation) {
        bookElements.filterLocation.addEventListener('change', (e) => {
            bookState.filters.location = e.target.value;
            renderBookList();
        });
    }
    if (bookElements.modal) {
        bookElements.modal.addEventListener('click', (e) => {
            if (e.target === bookElements.modal) closeBookModal();
        });
    }
    // 封面上传事件
    if (bookElements.coverInput) {
        bookElements.coverInput.addEventListener('change', handleCoverUpload);
    }
    if (bookElements.removeCoverBtn) {
        bookElements.removeCoverBtn.addEventListener('click', removeCover);
    }
}

// 修改 init 函数以初始化书籍库、计划任务和企微推送
const originalInit = init;
init = async function() {
    loadData();
    generateUserId();
    bindEvents();
    bindBookEvents();
    bindPlanEvents();
    bindWechatEvents();
    // 先用本地数据立即渲染，云端同步在后台进行，不阻塞界面
    renderCalendar();
    syncFromCloud().then(function () { renderCalendar(); }).catch(function () {});
    initBookLibrary().catch(function () {});
    initPlanTasks().catch(function () {});
    initWechatPush();
};

// 绑定认证表单事件
if (authElements.authForm) {
    authElements.authForm.addEventListener('submit', handleAuthSubmit);
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    // 更新认证界面（首次使用 vs 正常登录）
    updateAuthScreen();

    if (checkAuth()) {
        // 已认证，直接初始化
        authElements.authScreen.style.display = 'none';
        authElements.appContainer.style.display = 'block';
        init();
    } else {
        // 未认证：应用容器保持渲染（锁屏只覆盖打卡视图视口），
        // 家长锁显隐交给门户视图切换逻辑统一控制
        authElements.appContainer.style.display = 'block';
        checkinOnViewChange(window.__ckViewActive === true);
    }
});

// 门户视图联动：进入/离开打卡视图时由 portal.js 调用
function checkinOnViewChange(active) {
    window.__ckViewActive = active;
    if (checkAuth() || !authElements.authScreen) return;
    authElements.authScreen.style.display = active ? 'flex' : 'none';
    if (active) {
        const appContainer = document.getElementById('appContainer');
        if (appContainer) appContainer.style.display = 'block';
        setTimeout(() => { if (authElements.authPassword) authElements.authPassword.focus(); }, 60);
    }
}
window.checkinOnViewChange = checkinOnViewChange;

// 添加到设置界面修改密码的功能
// 在 header-actions 添加设置按钮
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const headerActions = document.querySelector('.header-actions');
        if (headerActions && !document.getElementById('settingsBtn')) {
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'action-btn';
            settingsBtn.id = 'settingsBtn';
            settingsBtn.title = '修改密码';
            settingsBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
                设置
            `;
            settingsBtn.addEventListener('click', openSettingsModal);
            headerActions.insertBefore(settingsBtn, headerActions.firstChild);
        }
    }, 1000);
});

// 设置弹窗 HTML
function createSettingsModal() {
    const modalHTML = `
        <div class="modal-overlay" id="settingsOverlay"></div>
        <div class="settings-modal" id="settingsModal">
            <div class="modal-header">
                <h3>系统设置</h3>
                <button class="close-modal-btn" id="closeSettingsBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="settings-section">
                    <h4>修改访问密码</h4>
                    <div class="settings-form">
                        <div class="form-group">
                            <label>当前密码</label>
                            <input type="password" id="currentPassword" placeholder="请输入当前密码">
                        </div>
                        <div class="form-group">
                            <label>新密码</label>
                            <input type="password" id="newPassword" placeholder="请输入新密码（至少4位）">
                        </div>
                        <div class="form-group">
                            <label>确认新密码</label>
                            <input type="password" id="confirmPassword" placeholder="请再次输入新密码">
                        </div>
                        <button class="save-settings-btn" id="savePasswordBtn">保存密码</button>
                    </div>
                </div>
                <div class="settings-section">
                    <h4>数据管理</h4>
                    <button class="danger-btn" id="resetPasswordBtn">重置密码（恢复默认）</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 打开设置弹窗
function openSettingsModal() {
    if (!document.getElementById('settingsModal')) {
        createSettingsModal();
    }
    document.getElementById('settingsOverlay').style.display = 'block';
    document.getElementById('settingsModal').classList.add('active');

    // 绑定关闭事件
    document.getElementById('closeSettingsBtn').onclick = closeSettingsModal;
    document.getElementById('settingsOverlay').onclick = closeSettingsModal;
    document.getElementById('savePasswordBtn').onclick = handleSavePassword;
    document.getElementById('resetPasswordBtn').onclick = handleResetPassword;
}

// 关闭设置弹窗
function closeSettingsModal() {
    document.getElementById('settingsOverlay').style.display = 'none';
    document.getElementById('settingsModal').classList.remove('active');
}

// 保存新密码
function handleSavePassword() {
    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;

    if (currentPwd !== getSavedPassword()) {
        ckToast('当前密码错误');
        return;
    }

    if (newPwd.length < 4) {
        ckToast('新密码至少需要4个字符');
        return;
    }

    if (newPwd !== confirmPwd) {
        ckToast('两次输入的新密码不一致');
        return;
    }

    savePassword(newPwd);
    ckToast('密码修改成功！');
    closeSettingsModal();

    // 清除认证状态，需要重新登录
    sessionStorage.removeItem('ziyu_authenticated');
    location.reload();
}

// 重置密码（恢复默认）
function handleResetPassword() {
    if (confirm('确定要重置密码吗？重置后将恢复为默认密码 123456')) {
        localStorage.removeItem('ziyu_app_password');
        sessionStorage.removeItem('ziyu_authenticated');
        ckToast('密码已重置，请重新登录');
        location.reload();
    }
}

// 预设作业管理
var CK_DEFAULT_PRESETS = [
    { subject: 'chinese', name: '语文一课一练' },
    { subject: 'chinese', name: '写字' },
    { subject: 'english', name: '抄单词' },
    { subject: 'english', name: '英语一课一练' },
    { subject: 'math', name: '口算' },
    { subject: 'math', name: '应用题' },
    { subject: 'math', name: '数学一课一练' },
    { subject: 'math', name: '数学课本练习' }
];

function ckLoadPresets(){
    try {
        var saved = JSON.parse(localStorage.getItem('ziyu_custom_presets'));
        if (Array.isArray(saved)) return saved;
    } catch(e){}
    return CK_DEFAULT_PRESETS.slice();
}

function ckSavePresets(presets){
    try { localStorage.setItem('ziyu_custom_presets', JSON.stringify(presets)); } catch(e){}
}

function ckRenderPresets(){
    var container = document.querySelector('.preset-tasks');
    if (!container) return;
    var presets = ckLoadPresets();
    container.innerHTML = '';
    presets.forEach(function(p, i){
        var span = document.createElement('span');
        span.className = 'preset-item ' + p.subject;
        span.setAttribute('data-subject', p.subject);
        span.setAttribute('data-name', p.name);
        span.innerHTML = escapeHtml(p.name) + '<button class="preset-del" data-idx="' + i + '" title="删除预设">×</button>';
        container.appendChild(span);
    });
    var addBtn = document.createElement('span');
    addBtn.className = 'preset-item preset-add';
    addBtn.innerHTML = '➕ 管理预设';
    addBtn.id = 'presetManageBtn';
    container.appendChild(addBtn);
}

function ckPresetManageOpen(){
    var presets = ckLoadPresets();
    var subjects = ['chinese', 'english', 'math', 'other'];
    var subjectNames = { chinese: '语文', english: '英语', math: '数学', other: '其他' };
    var html = '<div class="ck-preset-mask" id="ckPresetMask">' +
      '<div class="ck-preset-dialog">' +
        '<div class="ck-preset-head"><span>⚙️ 管理快捷预设</span><button onclick="ckPresetManageClose()">×</button></div>' +
        '<div class="ck-preset-body">' +
          '<p class="ck-preset-tip">💡 这里添加的预设会显示在「其他作业」下方，点击即可快速添加。删掉不常用的，加上你需要的！</p>' +
          '<div class="ck-preset-list" id="ckPresetList">';
    presets.forEach(function(p, i){
        html += '<div class="ck-preset-row">' +
          '<select class="ck-preset-sel" data-idx="' + i + '">' +
            subjects.map(function(s){ return '<option value="' + s + '"' + (p.subject === s ? ' selected' : '') + '>' + subjectNames[s] + '</option>'; }).join('') +
          '</select>' +
          '<input type="text" class="ck-preset-input" data-idx="' + i + '" value="' + escapeHtml(p.name) + '">' +
          '<button class="ck-preset-del" data-idx="' + i + '" title="删除">🗑️</button>' +
        '</div>';
    });
    html += '</div>' +
          '<button class="ck-preset-add" onclick="ckPresetAddRow()">➕ 新增预设</button>' +
          '<div class="ck-preset-actions">' +
            '<button class="ck-preset-save" onclick="ckPresetManageSave()">💾 保存</button>' +
            '<button class="ck-preset-reset" onclick="ckPresetReset()">↩️ 恢复默认</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    var old = document.getElementById('ckPresetMask');
    if (old) old.remove();
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div.firstChild);
    document.querySelectorAll('.ck-preset-del').forEach(function(btn){
        btn.addEventListener('click', function(){ var idx = parseInt(this.dataset.idx); ckPresetDelRow(idx); });
    });
}

function ckPresetAddRow(){
    var presets = ckPresetCollect();
    presets.push({ subject: 'other', name: '新预设' });
    ckSavePresets(presets);
    ckPresetManageOpen();
}

function ckPresetDelRow(idx){
    var presets = ckPresetCollect();
    presets.splice(idx, 1);
    ckSavePresets(presets);
    ckPresetManageOpen();
}

function ckPresetCollect(){
    var presets = [];
    var sels = document.querySelectorAll('.ck-preset-sel');
    var inputs = document.querySelectorAll('.ck-preset-input');
    sels.forEach(function(sel, i){
        presets.push({ subject: sel.value, name: (inputs[i] ? inputs[i].value.trim() : '') || '未命名' });
    });
    return presets;
}

function ckPresetManageSave(){
    var presets = ckPresetCollect().filter(function(p){ return p.name; });
    if (presets.length === 0) presets = [{ subject: 'other', name: '写作业' }];
    ckSavePresets(presets);
    ckPresetManageClose();
    ckRenderPresets();
    ckToast('✅ 预设已保存');
}

function ckPresetReset(){
    ckSavePresets(CK_DEFAULT_PRESETS.slice());
    ckPresetManageClose();
    ckRenderPresets();
    ckToast('已恢复默认预设');
}

function ckPresetManageClose(){
    var m = document.getElementById('ckPresetMask');
    if (m) m.remove();
}

// 绑定预设作业点击事件 - 直接添加
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        ckRenderPresets();
        document.addEventListener('click', (e) => {
            if (e.target.closest('.preset-del')) {
                e.stopPropagation();
                var idx = parseInt(e.target.closest('.preset-del').dataset.idx);
                var presets = ckLoadPresets();
                presets.splice(idx, 1);
                ckSavePresets(presets);
                ckRenderPresets();
                return;
            }
            if (e.target.closest('#presetManageBtn')) {
                ckPresetManageOpen();
                return;
            }
            const presetItem = e.target.closest('.preset-item');
            if (presetItem && !presetItem.classList.contains('preset-add')) {
                const subject = presetItem.dataset.subject;
                const name = presetItem.dataset.name;

                if (name && state.selectedDate) {
                    const dateData = ensureDateData(state.selectedDate);
                    dateData.customTasks.push({
                        id: Date.now(),
                        name: name,
                        subject: subject,
                        completed: false
                    });
                    saveData();
                    renderTaskList(dateData);
                    updateSummary(dateData);
                }
            }
        });
    }, 500);
});
