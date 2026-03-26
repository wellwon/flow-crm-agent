

# Исправление автономного HTML-файла

## Проблема
Файл `project-page-reference.html` содержит только JS-бандл, но **не содержит CSS** (стили Tailwind, CSS-переменные, кастомные классы). Поэтому страница загружается без оформления — белый/чёрный текст без layout'а.

## Решение
Пересобрать HTML-файл с полным инлайном CSS:

### Шаги
1. **Запустить production build** (`npm run build`) — Vite создаст CSS-файл в `dist/assets/`
2. **Прочитать собранный CSS** из `dist/assets/*.css`
3. **Прочитать собранный JS** из `dist/assets/*.js`
4. **Сгенерировать HTML** с:
   - `<style>` блоком с полным CSS внутри `<head>`
   - `<script type="module">` с полным JS внутри `<body>`
   - Скрипт для подмены `history.replaceState` на `/project/1` (чтобы React Router показал страницу проекта)
   - Все SVG/изображения как data-URI
5. **Записать в `/mnt/documents/project-page-reference_v2.html`**

### Технические детали
- Скрипт на bash/python: `vite build` → читаем `dist/assets/index-*.css` и `dist/assets/index-*.js` → склеиваем в один HTML
- Размер ~1.5-2MB (JS + CSS + Tailwind)
- Файл будет работать через `file://` протокол без сервера

