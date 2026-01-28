import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, ListTodo, CheckCircle2, AlertCircle, Clock, Trash2, Filter, Calendar, Sparkles, Wand2 } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

interface SuggestedTask {
  title: string;
  description: string;
  category: string;
  priority: string;
  due_days: number;
}

export default function Tasks() {
  const { user, profile, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    tasks, 
    loading, 
    filters, 
    setFilters, 
    toggleComplete, 
    createTask, 
    deleteTask,
    stats, 
    categories,
    refreshTasks
  } = useTasks();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingSuggestion, setIsAddingSuggestion] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    due_date: '',
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (!authLoading && profile && !profile.onboarding_completed) navigate('/onboarding');
  }, [user, profile, authLoading, navigate]);

  const handleGenerateSuggestions = async () => {
    if (!session) return;
    
    setIsGenerating(true);
    setShowSuggestionsDialog(true);
    setSuggestedTasks([]);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suggest-tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestedTasks(data.tasks || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate task suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSuggestedTask = async (task: SuggestedTask, index: number) => {
    setIsAddingSuggestion(index);
    
    const dueDate = addDays(new Date(), task.due_days);
    
    await createTask({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      due_date: format(dueDate, 'yyyy-MM-dd'),
    });

    // Remove from suggestions
    setSuggestedTasks(prev => prev.filter((_, i) => i !== index));
    setIsAddingSuggestion(null);
  };

  const handleAddAllSuggestions = async () => {
    setIsGenerating(true);
    
    for (const task of suggestedTasks) {
      const dueDate = addDays(new Date(), task.due_days);
      await createTask({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        due_date: format(dueDate, 'yyyy-MM-dd'),
      });
    }

    setSuggestedTasks([]);
    setShowSuggestionsDialog(false);
    setIsGenerating(false);
    toast.success('All tasks added successfully!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    
    await createTask({
      title: newTask.title,
      description: newTask.description || null,
      priority: newTask.priority,
      category: newTask.category || null,
      due_date: newTask.due_date || null,
    });

    setNewTask({ title: '', description: '', priority: 'medium', category: '', due_date: '' });
    setShowCreateDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <ListTodo className="h-7 w-7 text-primary" />
              Task Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your study abroad preparation tasks
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleGenerateSuggestions}
            >
              <Wand2 className="h-4 w-4" />
              AI Suggestions
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Complete IELTS registration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Add more details..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newTask.category}
                        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                        placeholder="e.g., exams, documents"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date (optional)</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateTask} className="w-full">
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* AI Suggestions Dialog */}
          <Dialog open={showSuggestionsDialog} onOpenChange={setShowSuggestionsDialog}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI-Generated Task Suggestions
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Analyzing your profile and generating personalized tasks...</p>
                  </div>
                ) : suggestedTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No new suggestions at this time. Your profile is well-covered!</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Based on your profile, here are {suggestedTasks.length} recommended tasks:
                    </p>
                    <div className="space-y-3">
                      {suggestedTasks.map((task, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground">{task.title}</p>
                                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="bg-secondary px-2 py-0.5 rounded">{task.category}</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Due in {task.due_days} days
                                </span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddSuggestedTask(task, index)}
                              disabled={isAddingSuggestion === index}
                            >
                              {isAddingSuggestion === index ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {suggestedTasks.length > 0 && (
                      <Button 
                        onClick={handleAddAllSuggestions} 
                        className="w-full gap-2"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Add All {suggestedTasks.length} Tasks
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) => setFilters({ ...filters, priority: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? null : value })}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={filters.showCompleted}
                onCheckedChange={(checked) => setFilters({ ...filters, showCompleted: !!checked })}
              />
              <span className="text-foreground">Show completed</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Tasks ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ListTodo className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-lg text-foreground">No tasks found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                {filters.showCompleted || filters.category || filters.priority
                  ? 'Try adjusting your filters or create a new task.'
                  : 'Start by talking to your AI Counsellor or create tasks manually.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    task.is_completed 
                      ? 'bg-muted/50 border-border opacity-60' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    checked={task.is_completed}
                    onCheckedChange={() => toggleComplete(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-foreground ${task.is_completed ? 'line-through' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {task.category && (
                        <span className="bg-secondary px-2 py-0.5 rounded">{task.category}</span>
                      )}
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.due_date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
