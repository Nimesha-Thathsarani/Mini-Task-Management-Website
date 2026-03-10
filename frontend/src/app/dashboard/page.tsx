"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Circle, Clock, MoreVertical, Plus, 
  Trash2, Edit2, LogOut, LayoutDashboard, CheckSquare,
  AlertCircle, ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  user: { id: number, username: string };
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '9',
      });
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, page, statusFilter, priorityFilter]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (e) {
        alert("Failed to delete task.");
      }
    }
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTask?.id) {
        await api.put(`/tasks/${currentTask.id}`, currentTask);
      } else {
        await api.post('/tasks', currentTask);
      }
      setIsModalOpen(false);
      setCurrentTask(null);
      fetchTasks();
    } catch (error) {
        alert("Failed to save task. Ensure all required fields are filled.");
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setCurrentTask(task);
    } else {
      setCurrentTask({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date().toISOString().slice(0, 16)
      });
    }
    setIsModalOpen(true);
  };

  if (loading || !user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-colors duration-300 shadow-sm z-10 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center mr-3 shadow-md shadow-purple-500/20">
            <CheckSquare size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-orange-500">MiniTask</h1>
        </div>
        
        <div className="p-4 flex-1">
          <div className="space-y-1">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-blue-50  text-blue-700  transition-colors">
              <LayoutDashboard size={18} className="mr-3" />
              Dashboard
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 ">
          <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-slate-100 ">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-slate-900  truncate">{user.username}</p>
              <p className="text-xs text-slate-500  truncate">{isAdmin ? 'Administrator' : 'User'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-2 mt-2 text-sm font-medium text-red-600  hover:bg-red-50  rounded-xl transition-colors"
          >
            <LogOut size={16} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-slate-800">Tasks Overview</h2>
          <button 
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-[#FF6B35] hover:bg-[#ff7e4f] text-white text-sm font-medium rounded-lg shadow-md shadow-orange-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={16} className="mr-2" />
            New Task
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 relative">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/50 rounded-full blur-[100px] pointer-events-none"></div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 bg-white  p-4 rounded-2xl shadow-sm border border-slate-200  transition-colors duration-300">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500  uppercase tracking-wider mb-1">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="w-full bg-slate-50  border border-slate-200  text-slate-800  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500  uppercase tracking-wider mb-1">Priority</label>
              <select 
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
                className="w-full bg-slate-50  border border-slate-200  text-slate-800  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Task Grid */}
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 ">
              <CheckSquare size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-slate-700 ">No tasks found</p>
              <p className="text-sm">Try empty filters or create a new task.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white  rounded-2xl p-5 shadow-sm border border-slate-200  hover:shadow-md hover:border-blue-300  transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                         task.status === 'TODO' ? 'bg-slate-100 text-slate-700 border-slate-200   ' :
                         task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200   ' :
                         'bg-emerald-100 text-emerald-700 border-emerald-200   '
                       }`}>
                         {task.status.replace('_', ' ')}
                       </span>
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                         task.priority === 'HIGH' ? 'bg-red-100 text-red-700 border-red-200   ' :
                         task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200   ' :
                         'bg-slate-100 text-slate-700 border-slate-200   '
                       }`}>
                         {task.priority}
                       </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(task)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50  rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50  rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900  mb-2 line-clamp-1">{task.title}</h3>
                  <p className="text-sm text-slate-600  mb-4 line-clamp-3 min-h-[60px]">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100  mt-auto">
                    <div className="flex items-center text-xs text-slate-500 ">
                      <Clock size={14} className="mr-1.5" />
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {isAdmin && (
                       <div className="text-xs font-semibold bg-indigo-50 text-indigo-600   px-2 py-1 rounded-md">
                         By: {task.user.username}
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 pb-8">
              <div className="flex items-center gap-2 bg-white  p-1 rounded-xl border border-slate-200  shadow-sm">
                <button 
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="p-2 text-slate-600  hover:bg-slate-100  rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-4 text-sm font-medium text-slate-700 ">
                  Page {page + 1} of {totalPages}
                </div>
                <button 
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  className="p-2 text-slate-600  hover:bg-slate-100  rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Task Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white  rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-slate-200  transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 ">
              <h3 className="text-xl font-bold text-slate-900 ">
                {currentTask?.id ? 'Edit Task' : 'New Task'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600  transition-colors p-1 rounded-lg hover:bg-slate-100 "
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700  mb-1">Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={currentTask?.title || ''}
                    onChange={e => setCurrentTask({ ...currentTask, title: e.target.value })}
                    className="w-full bg-white  border border-slate-300  text-slate-900  rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="E.g. Complete project presentation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700  mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={currentTask?.description || ''}
                    onChange={e => setCurrentTask({ ...currentTask, description: e.target.value })}
                    className="w-full bg-white  border border-slate-300  text-slate-900  rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Add details about this task..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700  mb-1">Status</label>
                    <select 
                      value={currentTask?.status || 'TODO'}
                      onChange={e => setCurrentTask({ ...currentTask, status: e.target.value as any })}
                      className="w-full bg-white  border border-slate-300  text-slate-900  rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700  mb-1">Priority</label>
                    <select 
                      value={currentTask?.priority || 'MEDIUM'}
                      onChange={e => setCurrentTask({ ...currentTask, priority: e.target.value as any })}
                      className="w-full bg-white  border border-slate-300  text-slate-900  rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700  mb-1">Due Date <span className="text-red-500">*</span></label>
                  <input 
                    type="datetime-local" 
                    required 
                    value={currentTask?.dueDate ? new Date(currentTask.dueDate).toISOString().slice(0, 16) : ''}
                    onChange={e => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
                    className="w-full bg-white  border border-slate-300  text-slate-900  rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#ff7e4f] rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
