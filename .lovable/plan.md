

# Implementation Plan: 4 New Features

## Overview
Adding Timeline Ribbon, Notification Center, Health Map, and Quick Actions Bar to the workspace and pipeline views.

## 1. Timeline Ribbon — `src/components/workspace/TimelineRibbon.tsx` (NEW)

Horizontal collapsible bar between header and main content in WorkspacePage. Shows deal deadlines on a 90-day axis:
- SVG-based horizontal timeline with "today" marker line
- Each deal = colored dot (by status) positioned proportionally on the axis
- Tooltip on hover with deal name, amount, deadline
- Click navigates to `/project/{id}`
- Collapse/expand toggle
- Uses `matte-glass` styling, month labels along axis

## 2. Notification Center — `src/components/workspace/NotificationCenter.tsx` (NEW)

Bell icon button added to WorkspacePage header (next to theme toggle):
- Badge with unread count
- Popover with 3 groups: **Срочно** (overdue/errors), **Сегодня** (due within 3 days), **Информация** (status updates)
- Notifications auto-generated from mockDeals data (overdue deadlines, approaching deadlines, won/lost deals)
- Each notification: icon, text, timestamp, dismiss button
- Mark all as read button
- Design: `bg-card border-border rounded-[14px]` popover

## 3. Health Map — `src/components/workspace/DealsHealthMap.tsx` (NEW)

New view mode `'health'` in WorkspacePage view switcher (Activity icon):
- Grid of cells, each = one deal
- Color determined by health score formula:
  - Days to deadline weight + progress % weight + priority weight
  - Green (healthy) / Yellow (at risk) / Red (critical) / Gray (won/lost)
- Cell shows: company name, amount, small progress bar
- Tooltip with full details on hover
- Click → navigate to deal
- Uses `matte-glass` for each cell

## 4. Quick Actions Bar — `src/components/pipeline/QuickActionsBar.tsx` (NEW)

Horizontal bar shown in PipelinePage when `activeView === 'dossier'`, placed between toolbar and dossier content:
- 5-6 icon buttons: «Сгенерировать ТЗ», «Отправить КП», «Запланировать звонок», «Создать задачу», «Запросить документ», «AI-анализ»
- Each button triggers a toast notification (mock action)
- Style: `matte-glass` bar with icon + short label per button
- Compact horizontal layout

## Files to modify

| File | Change |
|------|--------|
| `src/components/workspace/TimelineRibbon.tsx` | **Create** |
| `src/components/workspace/NotificationCenter.tsx` | **Create** |
| `src/components/workspace/DealsHealthMap.tsx` | **Create** |
| `src/components/pipeline/QuickActionsBar.tsx` | **Create** |
| `src/components/workspace/WorkspacePage.tsx` | Add `health` to ViewMode, import TimelineRibbon + NotificationCenter + DealsHealthMap, add to header + view switcher + content |
| `src/components/pipeline/PipelinePage.tsx` | Import QuickActionsBar, render when dossier view active |

## Color scheme adherence
All new components will use the design system tokens:
- Backgrounds: `bg-card`, `matte-glass` class
- Borders: `border-border`
- Text: `text-foreground`, `text-muted-foreground`
- Accent: `text-primary` (#4ecdc4 in dark)
- Shadows: `var(--shadow-glass)`, `var(--shadow-soft)`
- Border-radius: 14px cards, 10px buttons, 6px badges

