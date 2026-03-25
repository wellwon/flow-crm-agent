import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Activity, Clock, Users, CheckCircle2, AlertTriangle,
  Zap, Target, Shield, BarChart3, ArrowUpRight, ArrowDownRight,
  Calendar, FileText, Bot, Cpu, Timer, Package,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import type { Node } from '@xyflow/react';
import type { PipelineNodeData, NodeStatus, NodeCategory, NODE_CATEGORIES } from '@/types/pipeline';
import { NODE_CATEGORIES as CATS } from '@/types/pipeline';

interface DashboardViewProps {
  nodes: Node[];
}

const STATUS_COLORS: Record<NodeStatus, string> = {
  completed: 'hsl(160, 84%, 39%)',
  active: 'hsl(38, 92%, 50%)',
  pending: 'hsl(240, 4%, 46%)',
  error: 'hsl(350, 89%, 60%)',
  waiting: 'hsl(174, 55%, 40%)',
  skipped: 'hsl(220, 15%, 30%)',
};

const PHASE_ORDER = ['PRE-SALE', 'BIDDING', 'RESULT', 'EXECUTION', 'POST-SALE', 'CUSTOM'];
const PHASE_LABELS: Record<string, string> = {
  'PRE-SALE': 'Пресейл',
  'BIDDING': 'Тендер',
  'RESULT': 'Результат',
  'EXECUTION': 'Исполнение',
  'POST-SALE': 'Пост-продажа',
  'CUSTOM': 'Другое',
};

export function DashboardView({ nodes }: DashboardViewProps) {
  const pipelineNodes = useMemo(() =>
    nodes.filter(n => n.type === 'holoNode').map(n => n.data as unknown as PipelineNodeData),
  [nodes]);

  const stats = useMemo(() => {
    const total = pipelineNodes.length;
    const completed = pipelineNodes.filter(n => n.status === 'completed').length;
    const active = pipelineNodes.filter(n => n.status === 'active').length;
    const pending = pipelineNodes.filter(n => n.status === 'pending').length;
    const waiting = pipelineNodes.filter(n => n.status === 'waiting').length;
    const error = pipelineNodes.filter(n => n.status === 'error').length;
    const avgProgress = total ? Math.round(pipelineNodes.reduce((s, n) => s + n.progress, 0) / total) : 0;

    // By phase
    const byPhase = PHASE_ORDER.map(p => {
      const phaseNodes = pipelineNodes.filter(n => n.phase === p);
      const done = phaseNodes.filter(n => n.status === 'completed').length;
      return { phase: p, label: PHASE_LABELS[p] || p, total: phaseNodes.length, done, pct: phaseNodes.length ? Math.round(done / phaseNodes.length * 100) : 0 };
    }).filter(p => p.total > 0);

    // By category
    const byCategory: Record<string, number> = { human_action: 0, gate: 0, ai_action: 0, system: 0 };
    pipelineNodes.forEach(n => { const cat = CATS[n.type]; if (cat) byCategory[cat]++; });

    // By assignee
    const assigneeMap: Record<string, { total: number; done: number }> = {};
    pipelineNodes.forEach(n => {
      const a = n.assignee || 'Не назначен';
      if (!assigneeMap[a]) assigneeMap[a] = { total: 0, done: 0 };
      assigneeMap[a].total++;
      if (n.status === 'completed') assigneeMap[a].done++;
    });
    const byAssignee = Object.entries(assigneeMap).map(([name, v]) => ({ name, ...v, pct: Math.round(v.done / v.total * 100) })).sort((a, b) => b.total - a.total);

    // Status distribution for pie
    const statusDist = [
      { name: 'Завершено', value: completed, color: STATUS_COLORS.completed },
      { name: 'Активно', value: active, color: STATUS_COLORS.active },
      { name: 'Ожидание', value: waiting, color: STATUS_COLORS.waiting },
      { name: 'В очереди', value: pending, color: STATUS_COLORS.pending },
      { name: 'Ошибка', value: error, color: STATUS_COLORS.error },
    ].filter(s => s.value > 0);

    // Compliance
    const complianceNodes = pipelineNodes.filter(n => n.complianceChecks?.length);
    const allChecks = complianceNodes.flatMap(n => n.complianceChecks || []);
    const passedChecks = allChecks.filter(c => c.passed === true).length;
    const failedChecks = allChecks.filter(c => c.passed === false).length;
    const pendingChecks = allChecks.filter(c => c.passed === null).length;

    // AI nodes
    const aiNodes = pipelineNodes.filter(n => CATS[n.type] === 'ai_action');
    const aiDone = aiNodes.filter(n => n.status === 'completed').length;

    // Timeline mock (progress over phases)
    const timeline = byPhase.map((p, i) => ({
      name: p.label,
      progress: p.pct,
      target: Math.min(100, (i + 1) * (100 / byPhase.length)),
    }));

    // Radar data
    const radar = [
      { metric: 'Прогресс', value: avgProgress },
      { metric: 'Compliance', value: allChecks.length ? Math.round(passedChecks / allChecks.length * 100) : 0 },
      { metric: 'AI покрытие', value: total ? Math.round(aiNodes.length / total * 100) : 0 },
      { metric: 'Команда', value: Object.keys(assigneeMap).length * 15 },
      { metric: 'Качество', value: error === 0 ? 95 : Math.max(40, 95 - error * 20) },
      { metric: 'Скорость', value: Math.min(100, avgProgress + 15) },
    ];

    return { total, completed, active, pending, waiting, error, avgProgress, byPhase, byCategory, byAssignee, statusDist, passedChecks, failedChecks, pendingChecks, allChecks: allChecks.length, aiNodes: aiNodes.length, aiDone, timeline, radar };
  }, [pipelineNodes]);

  const kpis = [
    { label: 'Сумма сделки', value: '6.2М ₽', icon: TrendingUp, trend: '+12%', up: true, color: 'text-node-completed' },
    { label: 'Win Rate', value: '67%', icon: Target, trend: '+5%', up: true, color: 'text-node-active' },
    { label: 'Прогресс', value: `${stats.avgProgress}%`, icon: Activity, trend: null, up: true, color: 'text-primary' },
    { label: 'Шагов выполнено', value: `${stats.completed}/${stats.total}`, icon: CheckCircle2, trend: null, up: true, color: 'text-node-completed' },
    { label: 'Активных задач', value: `${stats.active}`, icon: Zap, trend: null, up: true, color: 'text-node-active' },
    { label: 'AI задач', value: `${stats.aiDone}/${stats.aiNodes}`, icon: Bot, trend: null, up: true, color: 'text-primary' },
  ];

  const catLabels: Record<string, { label: string; icon: React.ElementType }> = {
    human_action: { label: 'Действия', icon: Users },
    gate: { label: 'Шлюзы', icon: Shield },
    ai_action: { label: 'AI', icon: Cpu },
    system: { label: 'Система', icon: Package },
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="absolute inset-0 pt-20 pb-4 px-4 overflow-y-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1600px] mx-auto space-y-4">

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div key={i} variants={item} className="glass-panel p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                {kpi.trend && (
                  <span className={`flex items-center gap-0.5 text-[10px] font-mono ${kpi.up ? 'text-node-completed' : 'text-node-error'}`}>
                    {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div className="text-xl font-bold text-foreground font-mono">{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{kpi.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Progress by Phase */}
          <motion.div variants={item} className="glass-panel p-5 lg:col-span-2">
            <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              Прогресс по фазам
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byPhase} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11, color: 'hsl(var(--foreground))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="pct" name="Выполнено %" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Status Pie */}
          <motion.div variants={item} className="glass-panel p-5">
            <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-node-active" />
              Статусы нод
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.statusDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3} strokeWidth={0}>
                    {stats.statusDist.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11, color: 'hsl(var(--foreground))' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Timeline Progress */}
          <motion.div variants={item} className="glass-panel p-5">
            <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
              <Timer className="w-3.5 h-3.5 text-primary" />
              Прогресс vs План
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 11, color: 'hsl(var(--foreground))' }} />
                  <Area type="monotone" dataKey="target" name="План" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted))" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="progress" name="Факт" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Radar */}
          <motion.div variants={item} className="glass-panel p-5">
            <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-node-active" />
              Здоровье сделки
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={stats.radar} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="hsl(220, 15%, 16%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Compliance */}
          <motion.div variants={item} className="glass-panel p-5">
            <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-node-completed" />
              Compliance Check
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Пройдено</span>
                <span className="text-lg font-bold font-mono text-node-completed">{stats.passedChecks}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-node-completed rounded-full transition-all" style={{ width: `${stats.allChecks ? stats.passedChecks / stats.allChecks * 100 : 0}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <MiniStat label="Пройдено" value={stats.passedChecks} color="text-node-completed" />
                <MiniStat label="Ожидает" value={stats.pendingChecks} color="text-node-active" />
                <MiniStat label="Провалено" value={stats.failedChecks} color="text-node-error" />
              </div>

              <div className="border-t border-border/30 pt-3 mt-3">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Категории нод</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(stats.byCategory).map(([cat, count]) => {
                    const info = catLabels[cat];
                    if (!info || count === 0) return null;
                    return (
                      <div key={cat} className="flex items-center gap-2 text-[11px]">
                        <info.icon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{info.label}</span>
                        <span className="text-foreground font-mono ml-auto">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div variants={item} className="glass-panel p-5">
          <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-primary" />
            Загрузка команды
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.byAssignee.map((a, i) => (
              <div key={i} className="bg-secondary/40 rounded-xl p-3 border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-foreground truncate">{a.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{a.done}/{a.total}</span>
                </div>
                <div className="w-full h-1.5 bg-background/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${a.pct}%`,
                      background: a.pct === 100 ? 'hsl(160, 84%, 39%)' : a.pct > 50 ? 'hsl(174, 55%, 40%)' : 'hsl(38, 92%, 50%)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phase detail cards */}
        <motion.div variants={item} className="glass-panel p-5">
          <h3 className="text-xs font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Детализация по фазам
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {stats.byPhase.map((p, i) => (
              <div key={i} className="bg-secondary/30 rounded-xl p-4 border border-border/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1 rounded-t-xl transition-all" style={{ width: `${p.pct}%`, background: p.pct === 100 ? 'hsl(160, 84%, 39%)' : 'hsl(174, 55%, 40%)' }} />
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{p.label}</div>
                <div className="text-2xl font-bold font-mono text-foreground">{p.pct}%</div>
                <div className="text-[10px] text-muted-foreground">{p.done} из {p.total} шагов</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[9px] text-muted-foreground uppercase">{label}</div>
    </div>
  );
}
