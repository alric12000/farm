import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, TreePine, Scissors, Bell, LogOut, Plus, Trash2, Edit3,
  ChevronDown, X, Calendar, MapPin, Hash, Leaf, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Weight, BarChart3, Save, ArrowLeft, RefreshCw, Upload, FileSpreadsheet
} from 'lucide-react';
import api, { authApi, treesApi, harvestsApi } from '../services/api';
import type { User, Tree, Harvest, DashboardStats, AlertsResponse } from '../services/api';

// ─── Tab type ────────────────────────────────────────────────────
type Tab = 'dashboard' | 'trees' | 'harvests';

// ─── Status badge colors ─────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    overdue: 'bg-red-500/10 text-red-600 border-red-500/20',
    today: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    soon: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    scheduled: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${styles[status] || styles.scheduled}`}>
      {status}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN ADMIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);

  // Modal states
  const [showTreeModal, setShowTreeModal] = useState(false);
  const [editingTree, setEditingTree] = useState<Tree | null>(null);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [selectedTreeForHarvest, setSelectedTreeForHarvest] = useState<number | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // ── Auth check ──────────────────────────────────────────────────
  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login');
      return;
    }
    authApi.me().then(setUser).catch(() => {
      authApi.logout();
      navigate('/login');
    });
  }, [navigate]);

  // ── Refresh data ────────────────────────────────────────────────
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, a, t, h] = await Promise.all([
        harvestsApi.getStats(),
        harvestsApi.getAlerts(),
        treesApi.getAll(),
        harvestsApi.getAll(),
      ]);
      setStats(s);
      setAlerts(a);
      setTrees(t);
      setHarvests(h);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) refreshData();
  }, [user, refreshData]);

  // ── Logout ──────────────────────────────────────────────────────
  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-farm-green-dark flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // ── Tab definitions ─────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'trees', label: 'Trees', icon: <TreePine className="w-4 h-4" /> },
    { id: 'harvests', label: 'Harvests', icon: <Scissors className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Header Bar ──────────────────────────────────── */}
      <header className="bg-farm-green-dark sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-white hover:text-farm-accent transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Back to Site</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Ghordaura Krishi Farm" className="h-9 w-auto object-contain bg-white/90 rounded-lg p-0.5" />
                <span className="font-serif font-bold text-white text-lg hidden sm:inline">Farm Admin</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Alerts indicator */}
              {alerts && alerts.count > 0 && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="relative p-2 text-white/70 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {alerts.count}
                  </span>
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-white font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/70 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab Navigation ──────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-farm-green/10 text-farm-green-dark'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === 'trees' && <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{trees.length}</span>}
              </button>
            ))}

            <div className="ml-auto">
              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-farm-green transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView stats={stats} alerts={alerts} trees={trees} harvests={harvests} loading={loading}
            onRecordHarvest={(treeId) => { setSelectedTreeForHarvest(treeId); setShowHarvestModal(true); }}
          />
        )}
        {activeTab === 'trees' && (
          <TreesView trees={trees} loading={loading}
            onAdd={() => { setEditingTree(null); setShowTreeModal(true); }}
            onEdit={(tree) => { setEditingTree(tree); setShowTreeModal(true); }}
            onDelete={async (id) => {
              if (confirm('Are you sure you want to delete this tree and all its harvest records?')) {
                await treesApi.delete(id);
                refreshData();
              }
            }}
            onRecordHarvest={(treeId) => { setSelectedTreeForHarvest(treeId); setShowHarvestModal(true); }}
            onImport={() => setShowImportModal(true)}
          />
        )}
        {activeTab === 'harvests' && (
          <HarvestsView harvests={harvests} trees={trees} loading={loading}
            onRecord={() => { setSelectedTreeForHarvest(null); setShowHarvestModal(true); }}
            onDelete={async (id) => {
              if (confirm('Delete this harvest record?')) {
                await harvestsApi.delete(id);
                refreshData();
              }
            }}
          />
        )}
      </main>

      {/* ── Modals ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showTreeModal && (
          <TreeModal
            tree={editingTree}
            onClose={() => setShowTreeModal(false)}
            onSaved={() => { setShowTreeModal(false); refreshData(); }}
          />
        )}
        {showHarvestModal && (
          <HarvestModal
            trees={trees}
            preselectedTreeId={selectedTreeForHarvest}
            onClose={() => setShowHarvestModal(false)}
            onSaved={() => { setShowHarvestModal(false); refreshData(); }}
          />
        )}
        {showImportModal && (
          <CSVImportModal
            onClose={() => setShowImportModal(false)}
            onImported={() => { setShowImportModal(false); refreshData(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ═══════════════════════════════════════════════════════════════════
function DashboardView({
  stats, alerts, trees, harvests, loading, onRecordHarvest
}: {
  stats: DashboardStats | null; alerts: AlertsResponse | null; trees: Tree[]; harvests: Harvest[];
  loading: boolean; onRecordHarvest: (treeId: number) => void;
}) {
  if (loading || !stats) {
    return <LoadingSkeleton />;
  }

  const statCards = [
    { label: 'Total Trees', value: stats.total_trees, icon: <TreePine className="w-6 h-6" />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Harvests', value: stats.total_harvests, icon: <Scissors className="w-6 h-6" />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Total Yield (kg)', value: stats.total_kg_harvested.toFixed(1), icon: <Weight className="w-6 h-6" />, color: 'text-purple-600 bg-purple-50' },
    { label: 'Overdue', value: stats.overdue_trees, icon: <AlertTriangle className="w-6 h-6" />, color: stats.overdue_trees > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50' },
    { label: 'Due Soon', value: stats.due_soon_trees, icon: <Clock className="w-6 h-6" />, color: stats.due_soon_trees > 0 ? 'text-amber-600 bg-amber-50' : 'text-gray-500 bg-gray-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-farm-accent" />
              <h3 className="font-serif font-bold text-lg text-gray-900">Harvest Alerts</h3>
            </div>
            {alerts && <span className="text-sm text-gray-500">{alerts.count} alert{alerts.count !== 1 ? 's' : ''}</span>}
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {!alerts || alerts.alerts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-gray-500">All trees are on schedule!</p>
              </div>
            ) : (
              alerts.alerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${alert.alert_type === 'overdue' ? 'bg-red-500' : alert.alert_type === 'today' ? 'bg-orange-500' : 'bg-amber-400'
                      }`} />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{alert.tree_no} — {alert.avocado_type}</p>
                      <p className="text-xs text-gray-500 truncate">{alert.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <StatusBadge status={alert.alert_type} />
                    <button
                      onClick={() => onRecordHarvest(alert.id)}
                      className="text-xs bg-farm-green text-white px-3 py-1.5 rounded-lg hover:bg-farm-green-light transition-colors whitespace-nowrap"
                    >
                      Harvest
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Harvests */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-farm-green" />
            <h3 className="font-serif font-bold text-lg text-gray-900">Recent Harvests</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {harvests.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Scissors className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No harvests recorded yet</p>
              </div>
            ) : (
              harvests.slice(0, 8).map((h) => (
                <div key={h.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{h.tree_no} — {h.avocado_type}</p>
                    <p className="text-xs text-gray-500">{new Date(h.harvest_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {h.quantity_kg && <span className="text-sm font-semibold text-gray-700">{h.quantity_kg} kg</span>}
                    {h.quality_grade && (
                      <span className="text-xs bg-farm-accent/10 text-farm-accent font-semibold border border-farm-accent/20 px-2 py-0.5 rounded-full">
                        {h.quality_grade}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TREES VIEW — compact table for 1000+ trees
// ═══════════════════════════════════════════════════════════════════
function TreesView({
  trees, loading, onAdd, onEdit, onDelete, onRecordHarvest, onImport
}: {
  trees: Tree[]; loading: boolean; onAdd: () => void; onEdit: (tree: Tree) => void;
  onDelete: (id: number) => void; onRecordHarvest: (treeId: number) => void; onImport: () => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = [...new Set(trees.map(t => t.avocado_type))];

  const filteredTrees = trees.filter((t) => {
    const matchesSearch = !search ||
      t.tree_no.toLowerCase().includes(search.toLowerCase()) ||
      t.avocado_type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true
        : statusFilter === 'overdue' ? t.harvest_status === 'overdue'
          : statusFilter === 'soon' ? (t.harvest_status === 'soon' || t.harvest_status === 'today')
            : true;
    const matchesType = typeFilter === 'all' || t.avocado_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) return <LoadingSkeleton />;

  const statusDot = (tree: Tree) => {
    const cls = tree.harvest_status === 'overdue' ? 'bg-red-500'
      : tree.harvest_status === 'today' ? 'bg-orange-500'
        : tree.harvest_status === 'soon' ? 'bg-amber-400'
          : 'bg-emerald-500';
    return <div className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />;
  };

  const daysLabel = (tree: Tree) => {
    if (tree.days_remaining === null) return <span className="text-gray-400">—</span>;
    if (tree.days_remaining < 0) return <span className="text-red-600 font-semibold">{Math.abs(tree.days_remaining)}d overdue</span>;
    if (tree.days_remaining === 0) return <span className="text-orange-600 font-semibold">Today</span>;
    if (tree.days_remaining <= 7) return <span className="text-amber-600 font-semibold">{tree.days_remaining}d</span>;
    return <span className="text-emerald-600">{tree.days_remaining}d</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Avocado Trees</h2>
          <p className="text-gray-500 text-sm">{filteredTrees.length} of {trees.length} trees</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onImport}
            className="inline-flex items-center gap-2 bg-white text-farm-green border border-farm-green px-4 py-2.5 rounded-xl font-medium hover:bg-farm-green/5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button onClick={onAdd}
            className="inline-flex items-center gap-2 bg-farm-green text-white px-5 py-2.5 rounded-xl font-medium hover:bg-farm-green-light transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Tree
          </button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-green/30"
            placeholder="Search tree no or type..."
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-green/30"
        >
          <option value="all">All Status</option>
          <option value="overdue">🔴 Overdue</option>
          <option value="soon">🟡 Due Soon</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-green/30"
        >
          <option value="all">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="pl-6 pr-2 py-3 font-medium w-8"></th>
                <th className="px-3 py-3 font-medium">Tree No.</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Last Harvest</th>
                <th className="px-3 py-3 font-medium text-center">Harvests</th>
                <th className="px-3 py-3 font-medium">Next Harvest</th>
                <th className="px-3 py-3 font-medium text-right">Remaining</th>
                <th className="px-3 pr-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTrees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-400">
                    <TreePine className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    No trees match your filters
                  </td>
                </tr>
              ) : (
                filteredTrees.map((tree) => (
                  <tr key={tree.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="pl-6 pr-2 py-3">{statusDot(tree)}</td>
                    <td className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap">{tree.tree_no}</td>
                    <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{tree.avocado_type}</td>
                    <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{tree.last_harvested ? new Date(tree.last_harvested).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                    <td className="px-3 py-3 text-center text-gray-600">{tree.total_harvests}</td>
                    <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                      {tree.next_harvest_date ? new Date(tree.next_harvest_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-3 py-3 text-right whitespace-nowrap">{daysLabel(tree)}</td>
                    <td className="px-3 pr-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onRecordHarvest(tree.id)} title="Record harvest"
                          className="p-1.5 text-gray-400 hover:text-farm-green hover:bg-farm-green/10 rounded-lg transition-colors">
                          <Scissors className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onEdit(tree)} title="Edit tree"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDelete(tree.id)} title="Delete tree"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HARVESTS VIEW
// ═══════════════════════════════════════════════════════════════════
function HarvestsView({
  harvests, trees, loading, onRecord, onDelete
}: {
  harvests: Harvest[]; trees: Tree[]; loading: boolean; onRecord: () => void; onDelete: (id: number) => void;
}) {
  const [filterTree, setFilterTree] = useState<string>('all');

  const filtered = filterTree === 'all' ? harvests : harvests.filter(h => String(h.tree_id) === filterTree);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Harvest Records</h2>
          <p className="text-gray-500 text-sm mt-1">Track and manage all harvest activity</p>
        </div>
        <button
          onClick={onRecord}
          className="inline-flex items-center gap-2 bg-farm-green text-white px-5 py-2.5 rounded-xl font-medium hover:bg-farm-green-light transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Record Harvest
        </button>
      </div>

      {/* Filter by tree */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500">Filter by tree:</label>
        <select
          value={filterTree}
          onChange={(e) => setFilterTree(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-farm-green/30"
        >
          <option value="all">All Trees</option>
          {trees.map(t => (
            <option key={t.id} value={String(t.id)}>{t.tree_no} — {t.avocado_type}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-left">
                <th className="px-6 py-3.5 font-medium">Date</th>
                <th className="px-6 py-3.5 font-medium">Tree</th>
                <th className="px-6 py-3.5 font-medium">Type</th>
                <th className="px-6 py-3.5 font-medium text-right">Quantity (kg)</th>
                <th className="px-6 py-3.5 font-medium text-center">Grade</th>
                <th className="px-6 py-3.5 font-medium">Notes</th>
                <th className="px-6 py-3.5 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                    <Scissors className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    No harvest records found
                  </td>
                </tr>
              ) : (
                filtered.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {new Date(h.harvest_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{h.tree_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{h.avocado_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-700">{h.quantity_kg ?? '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {h.quality_grade ? (
                        <span className="inline-block bg-farm-accent/10 text-farm-accent border border-farm-accent/20 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {h.quality_grade}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-gray-500">{h.notes || '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onDelete(h.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TREE MODAL (Add / Edit)
// ═══════════════════════════════════════════════════════════════════
function TreeModal({
  tree, onClose, onSaved
}: {
  tree: Tree | null; onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!tree;
  const [form, setForm] = useState({
    tree_no: tree?.tree_no || '',
    avocado_type: tree?.avocado_type || '',
    planted_date: tree?.planted_date || '',
    location: tree?.location || '',
    harvest_interval_days: tree?.harvest_interval_days ?? 120,
    last_harvested: tree?.last_harvested || '',
    notes: tree?.notes || '',
    status: tree?.status || 'active',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await treesApi.update(tree!.id, {
          avocado_type: form.avocado_type,
          planted_date: form.planted_date || null,
          location: form.location || null,
          harvest_interval_days: form.harvest_interval_days,
          notes: form.notes || null,
          status: form.status,
        } as any);
      } else {
        await treesApi.create(form as any);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-xl font-serif font-bold text-gray-900">{isEdit ? 'Edit Tree' : 'Add New Tree'}</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tree No. *</label>
              <input type="text" required disabled={isEdit} value={form.tree_no}
                onChange={(e) => setForm({ ...form, tree_no: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="AVO-006"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Avocado Type *</label>
              <input type="text" required value={form.avocado_type}
                onChange={(e) => setForm({ ...form, avocado_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
                placeholder="Hass"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Planted Date</label>
              <input type="date" value={form.planted_date}
                onChange={(e) => setForm({ ...form, planted_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Harvest Interval (days)</label>
              <input type="number" value={form.harvest_interval_days}
                onChange={(e) => setForm({ ...form, harvest_interval_days: parseInt(e.target.value) || 120 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input type="text" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
              placeholder="Block A - North Slope"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Harvested</label>
              <input type="date" value={form.last_harvested}
                onChange={(e) => setForm({ ...form, last_harvested: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
              />
            </div>
          )}

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all resize-none"
              placeholder="Additional notes about this tree..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-farm-green text-white px-4 py-2.5 rounded-xl font-medium hover:bg-farm-green-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HARVEST MODAL
// ═══════════════════════════════════════════════════════════════════
function HarvestModal({
  trees, preselectedTreeId, onClose, onSaved
}: {
  trees: Tree[]; preselectedTreeId: number | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    tree_id: preselectedTreeId ? String(preselectedTreeId) : '',
    harvest_date: new Date().toISOString().split('T')[0],
    quantity_kg: '',
    quality_grade: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSaving(true);
    try {
      const result = await harvestsApi.record({
        tree_id: parseInt(form.tree_id),
        harvest_date: form.harvest_date,
        quantity_kg: form.quantity_kg ? parseFloat(form.quantity_kg) : undefined,
        quality_grade: form.quality_grade || undefined,
        notes: form.notes || undefined,
      });
      setSuccessMsg(result.message);
      setTimeout(onSaved, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <h3 className="text-xl font-serif font-bold text-gray-900">Record Harvest</h3>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}
          {successMsg && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tree *</label>
            <select required value={form.tree_id}
              onChange={(e) => setForm({ ...form, tree_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all bg-white"
            >
              <option value="">Select a tree...</option>
              {trees.filter(t => t.status === 'active').map(t => (
                <option key={t.id} value={String(t.id)}>{t.tree_no} — {t.avocado_type} ({t.location || 'No location'})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Harvest Date *</label>
              <input type="date" required value={form.harvest_date}
                onChange={(e) => setForm({ ...form, harvest_date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity (kg)</label>
              <input type="number" step="0.1" min="0" value={form.quantity_kg}
                onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all"
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Quality Grade</label>
            <div className="flex gap-2">
              {['A+', 'A', 'B', 'C'].map((grade) => (
                <button key={grade} type="button"
                  onClick={() => setForm({ ...form, quality_grade: form.quality_grade === grade ? '' : grade })}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${form.quality_grade === grade
                    ? 'bg-farm-accent text-farm-green-dark border-farm-accent shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea rows={3} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-farm-green/30 focus:border-farm-green outline-none transition-all resize-none"
              placeholder="Any observations about this harvest..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving || !!successMsg}
              className="flex-1 bg-farm-green text-white px-4 py-2.5 rounded-xl font-medium hover:bg-farm-green-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Scissors className="w-4 h-4" />}
              Record Harvest
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-full max-w-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CSV IMPORT MODAL
// ═══════════════════════════════════════════════════════════════════
function CSVImportModal({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ message: string; imported_count: number; skipped_count: number; skipped: { tree_no: string; reason: string }[] } | null>(null);
  const [error, setError] = useState('');

  const expectedCols = ['tree_no', 'avocado_type', 'planted_date', 'location', 'harvest_interval_days', 'last_harvested', 'notes'];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { setError('CSV must have a header row and at least one data row.'); return; }

      const hdr = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      setHeaders(hdr);

      const parsed: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        hdr.forEach((h, j) => { row[h] = vals[j] || ''; });
        parsed.push(row);
      }
      setRows(parsed);
    };
    reader.readAsText(f);
  };

  const handleImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);
    setError('');
    try {
      const res = await treesApi.importCSV(rows);
      setResult(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const missingCols = expectedCols.filter(c => !headers.includes(c));
  const hasRequired = headers.includes('tree_no') && headers.includes('avocado_type');

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-farm-green" />
            <h3 className="text-xl font-serif font-bold text-gray-900">Import Trees from CSV</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          {result ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-4 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{result.message}</span>
                </div>
              </div>
              {result.skipped.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 text-sm font-medium text-amber-800 border-b border-amber-200">
                    Skipped rows ({result.skipped_count})
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {result.skipped.map((s, i) => (
                      <div key={i} className="px-4 py-2 text-sm text-amber-700 border-b border-amber-100 last:border-0">
                        <span className="font-medium">{s.tree_no}</span> — {s.reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={onImported}
                className="w-full bg-farm-green text-white py-2.5 rounded-xl font-medium hover:bg-farm-green-light transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              {/* File picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV file</label>
                <label className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-farm-green/40 hover:bg-farm-green/5 transition-all">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">{file ? file.name : 'Click to choose a .csv file'}</span>
                  <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
                </label>
              </div>

              {/* Expected format */}
              <div className="text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3">
                <p className="font-medium text-gray-700 mb-1">Expected CSV columns:</p>
                <code className="text-farm-green">tree_no, avocado_type, planted_date, location, harvest_interval_days, last_harvested, notes</code>
                <p className="mt-1">Required: <strong>tree_no</strong> and <strong>avocado_type</strong></p>
              </div>

              {/* Preview */}
              {rows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">{rows.length} rows found</p>
                    {missingCols.length > 0 && hasRequired && (
                      <p className="text-xs text-amber-600">Optional columns missing: {missingCols.join(', ')}</p>
                    )}
                  </div>
                  {!hasRequired && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      CSV must include <strong>tree_no</strong> and <strong>avocado_type</strong> columns.
                    </div>
                  )}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-48">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-50">
                            {headers.map(h => <th key={h} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {rows.slice(0, 10).map((row, i) => (
                            <tr key={i}>
                              {headers.map(h => <td key={h} className="px-3 py-1.5 text-gray-700 whitespace-nowrap">{row[h] || '—'}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {rows.length > 10 && (
                      <div className="px-3 py-1.5 text-xs text-gray-400 bg-gray-50 border-t border-gray-200">...and {rows.length - 10} more rows</div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleImport} disabled={!hasRequired || rows.length === 0 || importing}
                  className="flex-1 bg-farm-green text-white px-4 py-2.5 rounded-xl font-medium hover:bg-farm-green-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                  {importing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                  Import {rows.length} Trees
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28">
            <div className="w-10 h-10 rounded-xl bg-gray-100 mb-3" />
            <div className="h-5 w-12 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl h-72 border border-gray-100" />
        <div className="bg-white rounded-2xl h-72 border border-gray-100" />
      </div>
    </div>
  );
}
