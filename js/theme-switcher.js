/* =====================================================
   theme-switcher.js — زرار تغيير الثيم (بيشتغل في كل الصفحات)
   حطيه في <head> عشان الثيم يتطبّق قبل ما الصفحة تظهر
   ===================================================== */
(function () {
    var KEY = 'careerstart-theme';
    var DEFAULT_THEME = 'ocean';

    // أضيفي ثيم جديد هنا (الاسم لازم يطابق data-theme في theme.css)
    var THEMES = [
        { id: 'ocean',   label: 'أزرق',    color: '#3875f8' },
        { id: 'purple',  label: 'بنفسجي',  color: '#c084fc' },
        { id: 'emerald', label: 'أخضر',    color: '#34d371' },
        { id: 'sunset',  label: 'برتقالي', color: '#fb923c' },
        { id: 'rose',    label: 'وردي',    color: '#fb7185' },
        { id: 'black',   label: 'أسود',    color: '#000000' }
    ];

    function valid(id) { return THEMES.some(function (t) { return t.id === id; }); }
    function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function save(id) { try { localStorage.setItem(KEY, id); } catch (e) {} }

    var current = load();
    if (!valid(current)) current = DEFAULT_THEME;
    document.documentElement.setAttribute('data-theme', current);   // فوراً: من غير وميض

    function build() {
        var css = document.createElement('style');
        css.textContent =
            '.ts-wrap{position:fixed;left:20px;bottom:110px;z-index:9998;direction:rtl;font-family:inherit}' +
            '.ts-btn{width:48px;height:48px;border-radius:50%;border:1px solid color-mix(in srgb,var(--accent) 50%,transparent);' +
            'background:var(--card);color:var(--accent);font-size:1.3rem;cursor:pointer;display:grid;place-items:center;' +
            'box-shadow:0 0 18px color-mix(in srgb,var(--accent) 30%,transparent);transition:transform .2s}' +
            '.ts-btn:hover{transform:scale(1.08)}' +
            '.ts-btn:focus-visible,.ts-dot:focus-visible{outline:3px solid var(--accent-light);outline-offset:3px}' +
            '.ts-menu{position:absolute;left:0;bottom:60px;display:none;gap:10px;padding:12px 14px;border-radius:14px;' +
            'background:var(--card);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);' +
            'box-shadow:0 12px 30px rgba(0,0,0,.4);white-space:nowrap}' +
            '.ts-menu.open{display:flex}' +
            '.ts-dot{width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.25);cursor:pointer;padding:0;transition:transform .15s}' +
            '.ts-dot:hover{transform:scale(1.15)}' +
            '.ts-dot[aria-pressed="true"]{border-color:#fff;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 60%,transparent)}' +
            '@media print{.ts-wrap{display:none}}';
        document.head.appendChild(css);

        var wrap = document.createElement('div');
        wrap.className = 'ts-wrap';
        wrap.innerHTML = '<button type="button" class="ts-btn" aria-label="تغيير لون الموقع" aria-expanded="false" title="تغيير الألوان">🎨</button>' +
                         '<div class="ts-menu" role="group" aria-label="اختيار الثيم"></div>';
        var btn = wrap.querySelector('.ts-btn');
        var menu = wrap.querySelector('.ts-menu');

        THEMES.forEach(function (t) {
            var d = document.createElement('button');
            d.type = 'button';
            d.className = 'ts-dot';
            d.style.background = t.color;
            d.title = t.label;
            d.setAttribute('aria-label', 'ثيم ' + t.label);
            d.setAttribute('aria-pressed', String(t.id === current));
            d.addEventListener('click', function () {
                current = t.id;
                document.documentElement.setAttribute('data-theme', t.id);
                save(t.id);
                Array.prototype.forEach.call(menu.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
                d.setAttribute('aria-pressed', 'true');
            });
            menu.appendChild(d);
        });

        function toggle(open) {
            menu.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', String(open));
        }
        btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(!menu.classList.contains('open')); });
        document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) toggle(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });

        document.body.appendChild(wrap);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
    else build();
})();
