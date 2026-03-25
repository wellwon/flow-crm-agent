

# Полная унификация дизайна: две темы, единый стиль

## Проблема

Сейчас базовая страница (WorkspacePage) визуально корректна — `main-content-panel` с правильным фоном, карточки `matte-glass`. Но:
1. **Карточки на главной** — в светлой теме `matte-glass` прозрачные (rgba), фон gradient просвечивает и даёт синеватый оттенок
2. **Внутренняя страница (PipelinePage)** — использует свой набор классов (`pipeline-chrome`, произвольные стили), не наследует layout и токены с главной
3. **Подвиды Pipeline** (Dashboard, List, Kanban, Timeline) — висят поверх gradient без `main-content-panel`, карточки `glass-panel` — полупрозрачные на gradient

## Что будет сделано

### 1. Исправить `matte-glass` для светлой темы
Карточки должны быть непрозрачными с тенью, а не прозрачными на градиенте:
- Light: `background: hsl(var(--card))` (белый), `border: 1px solid hsl(var(--border))`, `box-shadow: var(--shadow-glass)`
- Dark: `background: #121e32`, `border: 1px solid rgba(255,255,255,0.05)` (как в дизайн-системе)

### 2. Перестроить PipelinePage на layout главной страницы
Сейчас Pipeline — полноэкранный ReactFlow без `main-content-panel`. Нужно:
- Обернуть в тот же layout: gradient (layer 0) → padding → `main-content-panel` (layer 1)
- Верхний хедер внутри `main-content-panel` с `border-b border-border` (как на главной)
- Кнопка "Назад", название сделки, view switcher, действия — всё в едином хедере
- Контент (ReactFlow / List / Kanban / Dashboard / Timeline) занимает `flex-1` внутри панели

### 3. Удалить `pipeline-chrome` и `glass-panel-dark`
Эти классы — источник разнобоя. Заменить на:
- Хедер Pipeline → стандартный `header` с `border-b border-border` внутри `main-content-panel`
- NodePalette → сайдбар внутри панели с `border-r border-border`, фон `bg-card`
- JarvisCommandBar → `matte-glass` или `bg-card` вместо `pipeline-chrome`
- Zoom controls → `matte-glass` с правильными border-radius

### 4. Унифицировать все карточки Pipeline подвидов
ListView, KanbanView, TimelineView, DashboardView — заменить `glass-panel` на `matte-glass` (теперь непрозрачный).

### 5. Minimap — правильные border-radius и стиль
- `rounded-[14px]` (по дизайн-системе для карточек)
- В light: `bg-card`, `border border-border`, `shadow-glass`
- В dark: `bg-[#121e32]`, `border rgba(255,255,255,0.05)`

---

## Технический план (файлы)

### `src/index.css`
- Исправить `:root .matte-glass` → `background: hsl(var(--card))`
- Удалить `.pipeline-chrome`, `.pipeline-chrome-dense` — больше не нужны
- Обновить `.react-flow__minimap` стили

### `src/components/pipeline/PipelinePage.tsx`
- Обернуть в layout: `div.h-screen` → gradient bg → padding → `main-content-panel flex flex-col`
- Перенести хедер (TopToolbar) внутрь панели как `<header>` с `border-b`
- NodePalette — внутри flex-row как `border-r` сайдбар
- ReactFlow, List, Kanban, Dashboard, Timeline — в `<main className="flex-1 overflow-hidden">`
- Minimap и zoom controls — стили через токены

### `src/components/pipeline/TopToolbar.tsx`
- Из absolute-positioned `pipeline-chrome` → обычный `<header>` внутри flow, стиль как в WorkspacePage (px-6 py-4, border-b)

### `src/components/pipeline/NodePalette.tsx`
- Из absolute `pipeline-chrome-dense` → flex-shrink-0 сайдбар внутри layout, `bg-card border-r border-border`

### `src/components/pipeline/JarvisCommandBar.tsx`
- `pipeline-chrome` → `matte-glass` или `bg-card border border-border`

### `src/components/pipeline/HoloNode.tsx`
- `bg-card/90` → `bg-card` (полностью непрозрачный в обеих темах)

### `src/components/pipeline/ListView.tsx`, `KanbanView.tsx`, `TimelineView.tsx`, `DashboardView.tsx`
- `glass-panel` → `matte-glass`
- Убрать `absolute inset-0 top-[72px]` → обычный flex-1 overflow-auto (layout теперь управляется PipelinePage)
- DashboardView: карточки stats — `matte-glass` вместо inline стилей

### `src/components/pipeline/NodeDrawer.tsx`
- Проверить что drawer использует `bg-card` и `border-border`

---

## Результат
- Главная страница и Pipeline выглядят идентично по структуре: gradient → padding → белая/тёмная панель с контентом
- Все карточки непрозрачные, с тенью, в цветах дизайн-системы
- Единый набор CSS-классов: `main-content-panel`, `matte-glass`, стандартные токены
- Никаких `pipeline-chrome`, `glass-panel-dark` и прочих одноразовых классов

