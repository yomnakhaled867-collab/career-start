(function () {
    var THEMES = [
        ['ocean', 'أزرق', '#38bdf8'], ['purple', 'بنفسجي', '#c084fc'], ['emerald', 'أخضر', '#34d399'],
        ['sunset', 'برتقالي', '#fb923c'], ['rose', 'وردي', '#fb7185'], ['black', 'أسود', '#000000']
    ];
    /* الأول هو الخط الافتراضي للموقع (Tajawal من base.css) */
    var FONTS = [
        ['tajawal', 'Tajawal'],
        ['cairo', 'Cairo'],
        ['system', 'خط النظام']
    ];
    var K_THEME = 'careerstart-theme', K_USER = 'cs-user', K_FONT_SIZE = 'cs-font', K_FONT_FAMILY = 'cs-ff', K_PLAIN = 'cs-plain';
    var root = document.documentElement;
    function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    function del(k) { try { localStorage.removeItem(k); } catch (e) {} }
 
    /* ---------- تطبيق الإعدادات المحفوظة فوراً (قبل ما الصفحة تظهر = من غير وميض) ---------- */
    var curTheme = get(K_THEME) || 'ocean';
    var curFontFamily = get(K_FONT_FAMILY);
    if (!FONTS.some(function (f) { return f[0] === curFontFamily; })) curFontFamily = 'tajawal';
    var font = parseInt(get(K_FONT_SIZE), 10) || 100;
    root.setAttribute('data-theme', curTheme);
    if (curFontFamily !== 'tajawal') root.setAttribute('data-font', curFontFamily);
    root.style.fontSize = font + '%';
    if (get(K_PLAIN) === '1') root.classList.add('fm-plain');
 
    var ICON = {
        user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
        gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
        palette: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.5-1.9-.3-1 .3-2 1.4-2H17a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="7.5" cy="12" r="1" fill="currentColor"/><circle cx="10" cy="7.5" r="1" fill="currentColor"/><circle cx="15" cy="7.5" r="1" fill="currentColor"/></svg>',
        share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
        up: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
    };
 
    function init() {
        /* ---------- التنسيق ---------- */
        var css = document.createElement('style');
        css.textContent =
            '@import url("https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap");' +
            '.ts-wrap{display:none!important}' +
            '.fm-bar{position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9997;display:flex;flex-direction:column;gap:8px;padding:10px 8px;border-radius:20px;direction:rtl;' +
            'background:var(--card,#1a264a);border:1px solid color-mix(in srgb,var(--accent,#38bdf8) 35%,transparent);' +
            'box-shadow:0 10px 30px rgba(0,0,0,.4),0 0 18px color-mix(in srgb,var(--accent,#38bdf8) 15%,transparent)}' +
            '.fm-btn{position:relative;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;cursor:pointer;padding:0;border:0;background:transparent;' +
            'color:var(--accent,#38bdf8);text-decoration:none;transition:transform .2s,background .2s;font-weight:700;font-size:.95rem;font-family:inherit}' +
            '.fm-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
            '.fm-btn:hover{transform:scale(1.08);background:color-mix(in srgb,var(--accent,#38bdf8) 20%,transparent)}' +
            '.fm-btn:focus-visible,.fm-dot:focus-visible,.fm-small:focus-visible{outline:3px solid var(--accent-light,#7dd3fc);outline-offset:3px}' +
            '.fm-btn::after{content:attr(data-tip);position:absolute;right:54px;top:50%;transform:translateY(-50%);padding:5px 10px;border-radius:8px;' +
            'background:var(--panel,#0f172a);color:#e2e8f0;font-size:.78rem;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .15s}' +
            '.fm-btn:hover::after{opacity:1}' +
            '.fm-panel{position:fixed;right:80px;top:50%;transform:translateY(-50%);z-index:9997;width:260px;padding:16px;border-radius:16px;display:none;direction:rtl;' +
            'background:var(--card,#1a264a);color:#e2e8f0;border:1px solid color-mix(in srgb,var(--accent,#38bdf8) 35%,transparent);box-shadow:0 18px 40px rgba(0,0,0,.45)}' +
            '.fm-panel.open{display:block}' +
            '.fm-panel h4{margin:0 0 8px;font-size:.9rem;color:var(--accent,#38bdf8)}' +
            '.fm-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}' +
            '.fm-dot{width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.25);cursor:pointer;padding:0;transition:transform .15s}' +
            '.fm-dot:hover{transform:scale(1.15)}' +
            '.fm-dot[aria-pressed="true"]{border-color:#fff;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent,#38bdf8) 55%,transparent)}' +
            '.fm-small{min-width:38px;height:32px;padding:0 8px;border-radius:8px;border:1px solid #475569;background:var(--panel,#0f172a);color:#e2e8f0;cursor:pointer;font-weight:700;font-size:.8rem;font-family:inherit}' +
            '.fm-small:hover{border-color:var(--accent,#38bdf8)}' +
            '.fm-small[aria-pressed="true"]{border-color:var(--accent,#38bdf8);background:color-mix(in srgb,var(--accent,#38bdf8) 20%,transparent);color:var(--accent-light,#7dd3fc)}' +
            '.fm-overlay{position:fixed;inset:0;z-index:10001;display:none;place-items:center;padding:16px;background:rgba(0,0,0,.6)}' +
            '.fm-overlay.open{display:grid}' +
            '.fm-modal{position:relative;width:min(100%,380px);padding:24px;border-radius:16px;direction:rtl;background:var(--card,#1a264a);color:#fff;' +
            'border:1px solid color-mix(in srgb,var(--accent,#38bdf8) 35%,transparent);box-shadow:0 24px 60px rgba(0,0,0,.5)}' +
            '.fm-modal h3{margin:0 0 6px;color:var(--accent,#38bdf8)}' +
            '.fm-modal p{margin:0 0 14px;color:#94a3b8;font-size:.85rem;line-height:1.7}' +
            '.fm-modal label{display:block;margin:10px 0 4px;font-size:.85rem;font-weight:700}' +
            '.fm-modal input{width:100%;padding:.7rem .9rem;border-radius:8px;border:1px solid #334155;background:var(--panel,#0f172a);color:#fff;outline:none;font:inherit}' +
            '.fm-modal input:focus{border-color:var(--accent,#38bdf8)}' +
            '.fm-submit{width:100%;margin-top:16px;padding:.8rem;border:0;border-radius:8px;cursor:pointer;color:#fff;font-weight:700;font-size:1rem;font-family:inherit;' +
            'background:linear-gradient(135deg,var(--btn,#2563eb),var(--btn-hover,#1d4ed8))}' +
            '.fm-close{position:absolute;top:10px;left:12px;background:none;border:0;color:#94a3b8;font-size:1.5rem;cursor:pointer;line-height:1}' +
            '.fm-error{min-height:1.2rem;margin-top:8px;color:#fca5a5;font-size:.82rem}' +
            '.fm-sw{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:7px 0;background:none;border:0;color:#e2e8f0;cursor:pointer;font-family:inherit;font-size:.85rem;text-align:right}' +
            '.fm-sw i{position:relative;flex:0 0 auto;width:36px;height:20px;border-radius:99px;background:#475569;transition:background .2s}' +
            '.fm-sw i::after{content:"";position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:right .2s}' +
            '.fm-sw[aria-checked="true"] i{background:var(--accent,#38bdf8)}' +
            '.fm-sw[aria-checked="true"] i::after{right:18px}' +
            '.fm-sw:focus-visible{outline:3px solid var(--accent-light,#7dd3fc);outline-offset:3px}' +
            '.fm-reset{width:100%;margin-top:10px}' +
            '.fm-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:10002;padding:10px 18px;border-radius:12px;direction:rtl;background:var(--card,#1a264a);color:#fff;' +
            'border:1px solid color-mix(in srgb,var(--accent,#38bdf8) 40%,transparent);box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .25s;font-size:.9rem}' +
            '.fm-toast.show{opacity:1}' +
            /* الخطوط: بنستثني الأيقونات (i و fa-) عشان ما تتحوّلش لمربعات */
            'html[data-font="cairo"] *:not(i):not([class*="fa-"]){font-family:"Cairo",sans-serif!important}' +
            'html[data-font="system"] *:not(i):not([class*="fa-"]){font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif!important}' +
            '.fm-plain .hero-triangle,.fm-plain .bg-decorations,.fm-plain .orb-top-left,.fm-plain .orb-bottom-right,.fm-plain .floating-code-snippet,.fm-plain .tech-bg-grid{display:none!important}' +
            '@media(max-width:600px){.fm-bar{right:6px;padding:8px 6px;gap:6px}.fm-btn{width:34px;height:34px}.fm-btn::after{display:none}.fm-panel{right:58px;width:220px}}' +
            '@media print{.fm-bar,.fm-panel,.fm-overlay,.fm-toast{display:none!important}}';
        document.head.appendChild(css);
 
        /* ---------- القائمة ---------- */
        var bar = document.createElement('div');
        bar.className = 'fm-bar';
        bar.innerHTML =
            '<button type="button" class="fm-btn" id="fmLogin" data-tip="تسجيل الدخول" aria-label="تسجيل الدخول">' + ICON.user + '</button>' +
            '<button type="button" class="fm-btn" id="fmColors" data-tip="ألوان الموقع" aria-label="ألوان الموقع" aria-expanded="false">' + ICON.palette + '</button>' +
            '<button type="button" class="fm-btn" id="fmSettings" data-tip="الإعدادات" aria-label="الإعدادات" aria-expanded="false">' + ICON.gear + '</button>' +
            '<button type="button" class="fm-btn" id="fmShare" data-tip="مشاركة الموقع" aria-label="مشاركة الموقع">' + ICON.share + '</button>' +
            '<button type="button" class="fm-btn" id="fmTop" data-tip="لأعلى الصفحة" aria-label="لأعلى الصفحة">' + ICON.up + '</button>';
 
        var colorPanel = document.createElement('div');
        colorPanel.className = 'fm-panel';
        colorPanel.setAttribute('role', 'dialog');
        colorPanel.setAttribute('aria-label', 'ألوان الموقع');
        colorPanel.innerHTML = '<h4 style="margin-bottom:10px">لون الموقع</h4><div class="fm-row" id="fmThemes" style="margin-bottom:0"></div>';
 
        var panel = document.createElement('div');
        panel.className = 'fm-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'الإعدادات');
        panel.innerHTML =
            '<h4>نوع الخط</h4><div class="fm-row" id="fmFonts"></div>' +
            '<h4>حجم الخط</h4><div class="fm-row" style="margin-bottom:8px">' +
            '<button type="button" class="fm-small" id="fmFontDown" aria-label="تصغير الخط">A−</button>' +
            '<button type="button" class="fm-small" id="fmFontReset" aria-label="الحجم الافتراضي">الافتراضي</button>' +
            '<button type="button" class="fm-small" id="fmFontUp" aria-label="تكبير الخط">A+</button></div>' +
            '<h4 style="margin-top:4px">العرض</h4>' +
            '<button type="button" class="fm-sw" id="fmPlain" role="switch" aria-checked="false">إخفاء التوهج والمثلثات<i></i></button>' +
            '<button type="button" class="fm-small fm-reset" id="fmResetAll">إعادة ضبط الإعدادات</button>';
 
        var toastEl = document.createElement('div');
        toastEl.className = 'fm-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
 
        var overlay = document.createElement('div');
        overlay.className = 'fm-overlay';
        overlay.innerHTML = '<div class="fm-modal" role="dialog" aria-modal="true" aria-labelledby="fmTitle"><button type="button" class="fm-close" aria-label="إغلاق">&times;</button><div id="fmBody"></div></div>';
 
        document.body.appendChild(bar);
        document.body.appendChild(colorPanel);
        document.body.appendChild(panel);
        document.body.appendChild(toastEl);
        document.body.appendChild(overlay);
 
        var loginBtn = bar.querySelector('#fmLogin'), setBtn = bar.querySelector('#fmSettings'), colorBtn = bar.querySelector('#fmColors'), shareBtn = bar.querySelector('#fmShare');
 
        /* ---------- الثيم ---------- */
        function applyTheme(id) { curTheme = id; root.setAttribute('data-theme', id); set(K_THEME, id); markThemes(); }
        var themeRow = colorPanel.querySelector('#fmThemes');
        THEMES.forEach(function (t) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'fm-dot'; b.title = t[1]; b.style.background = t[2];
            b.setAttribute('aria-label', 'ثيم ' + t[1]); b.dataset.id = t[0];
            b.onclick = function () { applyTheme(t[0]); };
            themeRow.appendChild(b);
        });
        function markThemes() {
            Array.prototype.forEach.call(themeRow.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.id === curTheme)); });
        }
        markThemes();
 
        /* ---------- نوع الخط ---------- */
        function applyFontFamily(id) {
            curFontFamily = id;
            if (id === 'tajawal') { root.removeAttribute('data-font'); } else { root.setAttribute('data-font', id); }
            set(K_FONT_FAMILY, id);
            markFonts();
        }
        var fontRow = panel.querySelector('#fmFonts');
        FONTS.forEach(function (f) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'fm-small'; b.textContent = f[1];
            b.dataset.id = f[0]; b.setAttribute('aria-label', 'خط ' + f[1]);
            b.onclick = function () { applyFontFamily(f[0]); };
            fontRow.appendChild(b);
        });
        function markFonts() {
            Array.prototype.forEach.call(fontRow.children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.id === curFontFamily)); });
        }
        markFonts();
 
        /* ---------- حجم الخط ---------- */
        function applyFontSize(v) { font = Math.min(130, Math.max(85, v)); root.style.fontSize = font + '%'; set(K_FONT_SIZE, font); }
        panel.querySelector('#fmFontUp').onclick = function () { applyFontSize(font + 5); };
        panel.querySelector('#fmFontDown').onclick = function () { applyFontSize(font - 5); };
        panel.querySelector('#fmFontReset').onclick = function () { applyFontSize(100); };
 
        /* ---------- إخفاء التوهج والمثلثات ---------- */
        var plainBtn = panel.querySelector('#fmPlain');
        function applyPlain(on) {
            root.classList.toggle('fm-plain', on);
            plainBtn.setAttribute('aria-checked', String(on));
            set(K_PLAIN, on ? '1' : '0');
        }
        applyPlain(root.classList.contains('fm-plain'));
        plainBtn.onclick = function () { applyPlain(!root.classList.contains('fm-plain')); };
        panel.querySelector('#fmResetAll').onclick = function () {
            applyFontSize(100); applyFontFamily('tajawal'); applyPlain(false);
            toast('تمت إعادة ضبط الإعدادات');
        };
 
        /* ---------- المشاركة ---------- */
        var toastT;
        function toast(msg) {
            toastEl.textContent = msg; toastEl.classList.add('show');
            clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
        }
        function copyLink(url) {
            if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(url);
            return new Promise(function (res, rej) {
                var ta = document.createElement('textarea');
                ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
                document.body.appendChild(ta); ta.select();
                var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
                document.body.removeChild(ta); ok ? res() : rej();
            });
        }
        shareBtn.onclick = function () {
            var shareUrl = 'https://career-start-kappa.vercel.app/';
            var data = { title: 'Career Start AI', text: 'منصة Career Start AI لدعم الخريجين الجدد', url: shareUrl };
            function fallback() {
                copyLink(shareUrl).then(function () { toast('تم نسخ الرابط ✓'); }, function () { toast('تعذر النسخ، انسخي الرابط يدوياً'); });
            }
            if (navigator.share) {
                navigator.share(data).catch(function (e) { if (!e || e.name !== 'AbortError') fallback(); });
            } else {
                fallback();
            }
        };
 
        /* ---------- تسجيل الدخول (تجريبي: بيتحفظ على الجهاز فقط) ---------- */
        function user() { try { return JSON.parse(get(K_USER)); } catch (e) { return null; } }
        function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
        function refreshLoginBtn() {
            var u = user();
            loginBtn.innerHTML = u ? '<span>' + esc(Array.from(u.name)[0].toUpperCase()) + '</span>' : ICON.user;
            loginBtn.dataset.tip = u ? 'أهلاً ' + u.name : 'تسجيل الدخول';
            loginBtn.setAttribute('aria-label', u ? 'حساب ' + u.name : 'تسجيل الدخول');
        }
        function renderModal() {
            var u = user(), body = overlay.querySelector('#fmBody');
            if (u) {
                body.innerHTML = '<h3 id="fmTitle">أهلاً ' + esc(u.name) + ' 👋</h3><p>' + esc(u.email) + '</p><button type="button" class="fm-submit" id="fmLogout">تسجيل الخروج</button>';
                body.querySelector('#fmLogout').onclick = function () { del(K_USER); refreshLoginBtn(); closeModal(); };
            } else {
                body.innerHTML = '<h3 id="fmTitle">تسجيل الدخول</h3><p>نسخة تجريبية: بياناتك بتتحفظ على هذا الجهاز فقط ولا تُرسل لأي مكان.</p>' +
                    '<form id="fmForm" novalidate>' +
                    '<label for="fmName">اسم المستخدم</label><input id="fmName" type="text" autocomplete="username" maxlength="20" required>' +
                    '<label for="fmEmail">البريد الإلكتروني</label><input id="fmEmail" type="email" autocomplete="email" required>' +
                    '<label for="fmPass">كلمة المرور</label><input id="fmPass" type="password" autocomplete="current-password" minlength="6" required>' +
                    '<div class="fm-error" id="fmErr" role="alert"></div><button type="submit" class="fm-submit">دخول</button></form>';
                body.querySelector('#fmForm').onsubmit = function (e) {
                    e.preventDefault();
                    var nm = body.querySelector('#fmName').value.trim(),
                        em = body.querySelector('#fmEmail').value.trim(),
                        pw = body.querySelector('#fmPass').value,
                        err = body.querySelector('#fmErr');
                    if (!/^[\p{L}\p{N}_ ]{3,20}$/u.test(nm)) { err.textContent = 'اسم المستخدم من 3 إلى 20 حرف (حروف وأرقام وشرطة سفلية فقط)'; return; }
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { err.textContent = 'اكتبي بريد إلكتروني صحيح'; return; }
                    if (pw.length < 6) { err.textContent = 'كلمة المرور لازم تكون 6 حروف على الأقل'; return; }
                    set(K_USER, JSON.stringify({ name: nm, email: em })); /* كلمة المرور مبتتحفظش */
                    refreshLoginBtn(); closeModal();
                };
            }
        }
        function openModal() { closePanel(); renderModal(); overlay.classList.add('open'); var f = overlay.querySelector('input, button.fm-submit'); if (f) f.focus(); }
        function closeModal() { overlay.classList.remove('open'); loginBtn.focus(); }
        loginBtn.onclick = openModal;
        overlay.querySelector('.fm-close').onclick = closeModal;
        overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
        refreshLoginBtn();
 
        /* ---------- فتح وقفل اللوحات ولأعلى ---------- */
        function closePanel() {
            colorPanel.classList.remove('open'); panel.classList.remove('open');
            colorBtn.setAttribute('aria-expanded', 'false'); setBtn.setAttribute('aria-expanded', 'false');
        }
        function togglePanel(p, btn) {
            var wasOpen = p.classList.contains('open');
            closePanel();
            if (!wasOpen) { p.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
        }
        colorBtn.onclick = function (e) { e.stopPropagation(); togglePanel(colorPanel, colorBtn); };
        setBtn.onclick = function (e) { e.stopPropagation(); togglePanel(panel, setBtn); };
        document.addEventListener('click', function (e) {
            if (!panel.contains(e.target) && !colorPanel.contains(e.target) && !bar.contains(e.target)) closePanel();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closePanel(); if (overlay.classList.contains('open')) closeModal(); } });
        bar.querySelector('#fmTop').onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    }
 
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
 