

# Зеркальная левая панель — план

## Проблема

Левая панель (JARVIS/Чат/Таймлайн) находится **внутри** `DealDossierView` и имеет другую структуру, высоту и отступы по сравнению с правой панелью (`MediaFilesPanel`). Нужно сделать их зеркально одинаковыми: одна ширина, одна высота, одинаковые отступы от краёв, одинаковый стиль.

## Решение

**Вынести левую панель из `DealDossierView` на уровень `PipelinePage`** — точно так же, как правая `MediaFilesPanel` уже живёт в `PipelinePage`. Обе панели станут сёстрами внутри общего flex-контейнера.

```text
┌─ PipelinePage ──────────────────────────────────┐
│  TopToolbar                                     │
│  ┌──────┬────────────────────────┬──────┐       │
│  │ Left │     Center content     │Right │       │
│  │Panel │   (DealDossierView     │Panel │       │
│  │340px │    без своего сайдбара) │340px │       │
│  │      │                        │      │       │
│  └──────┴────────────────────────┴──────┘       │
└─────────────────────────────────────────────────┘
```

## Изменения по файлам

### 1. `src/components/pipeline/JarvisChatSidebar.tsx` (создать)
- Вынести `JarvisChat`, `MiniTimelinePanel`, `CollapsedPanel` (для left) из `DealDossierView` в отдельный файл
- Применить те же классы, что у `MediaFilesPanel`: `w-[340px] 2xl:w-[380px] shrink-0 matte-glass h-full rounded-tl-none`
- Collapsed-состояние: узкая полоска `w-[44px]` (как сейчас)

### 2. `src/components/pipeline/PipelinePage.tsx`
- Импортировать `JarvisChatSidebar`
- Добавить state `leftPanelOpen` 
- Поместить `JarvisChatSidebar` **слева** в тот же flex-контейнер, где `MediaFilesPanel` справа
- Обе панели на одном уровне вложенности → одинаковая высота, отступы

### 3. `src/components/pipeline/DealDossierView.tsx`
- Удалить `JarvisChat`, `MiniTimelinePanel`, `CollapsedPanel`, `useResponsivePanels`
- Удалить обёртку `flex gap-0` с левой панелью
- Компонент становится чистым центральным контентом (ProjectScreen / DealScreen)

### 4. `src/components/pipeline/MediaFilesPanel.tsx`
- Выровнять ширину: `w-[340px] 2xl:w-[380px]` (уже есть, проверить совпадение с левой)
- Убедиться, что collapsed-вариант правой панели тоже `w-[44px]`

## Результат
- Обе панели — зеркальные по размерам, высоте, отступам
- Левая: `rounded-tl-none`, правая: `rounded-tr-none`
- Одинаковая ширина `340px / 380px (2xl)`
- Одинаковая высота (определяется общим flex-контейнером)

