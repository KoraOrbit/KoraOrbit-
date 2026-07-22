هذا المجلد فارغ حاليًا بشكل متعمّد.

الموقع يستخدم خطوط Google Fonts عبر CDN مباشرة (El Messiri, Tajawal,
IBM Plex Sans Arabic) — أنظر الوسوم <link> في head الخاصة بـ index.html.

إن رغبت لاحقًا باستضافة الخطوط ذاتيًا (self-hosting) لتحسين الخصوصية
أو الأداء دون الاعتماد على fonts.googleapis.com، ضع ملفات .woff2 هنا
وأضف قواعد @font-face في بداية css/style.css، ثم احذف وسوم
<link rel="preconnect"> و<link href="https://fonts.googleapis.com...">
من index.html.
