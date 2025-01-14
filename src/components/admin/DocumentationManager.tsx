import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocTask {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  output?: string;
  error?: string;
}

export const DocumentationManager: React.FC = () => {
  const [tasks, setTasks] = useState<DocTask[]>([]);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/docs/versions');
      const data = await response.json();
      setVersions(data.versions);
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    }
  };

  const runDocTask = async (taskName: string, command: string) => {
    const taskId = `${taskName}-${Date.now()}`;
    const newTask: DocTask = {
      id: taskId,
      name: taskName,
      status: 'running',
      progress: 0,
    };

    setTasks(prev => [newTask, ...prev]);
    setActiveTask(taskId);

    try {
      const response = await fetch('/api/docs/run-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const data = JSON.parse(text);

        setTasks(prev =>
          prev.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status: data.status,
                  progress: data.progress,
                  output: data.output,
                  error: data.error,
                }
              : task
          )
        );

        if (data.status === 'completed' || data.status === 'failed') {
          toast({
            title: `Task ${data.status}`,
            description: data.status === 'completed'
              ? `${taskName} completed successfully`
              : `${taskName} failed: ${data.error}`,
            variant: data.status === 'completed' ? 'default' : 'destructive',
          });
        }
      }
    } catch (error) {
      console.error(`Failed to run ${taskName}:`, error);
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: 'failed',
                error: error instanceof Error ? error.message : 'Unknown error',
              }
            : task
        )
      );
    }
  };

  const getStatusColor = (status: DocTask['status']) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documentation Management</h2>
        <div className="space-x-2">
          <Button
            onClick={() => runDocTask('Build Documentation', 'docs:build')}
            variant="default"
          >
            Build Docs
          </Button>
          <Button
            onClick={() => runDocTask('Run Tests', 'docs:test')}
            variant="outline"
          >
            Run Tests
          </Button>
          <Button
            onClick={() => runDocTask('Create Version', 'docs:version')}
            variant="secondary"
          >
            Create Version
          </Button>
          <Button
            onClick={() => runDocTask('Full Deployment', 'docs:deploy')}
            variant="default"
          >
            Deploy
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          <Card className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg ${
                      task.id === activeTask ? 'border-primary' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{task.name}</div>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(task.status)}
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <Progress value={task.progress} className="mb-2" />
                    {task.output && (
                      <pre className="bg-muted p-2 rounded text-sm mt-2 max-h-32 overflow-auto">
                        {task.output}
                      </pre>
                    )}
                    {task.error && (
                      <div className="text-red-500 text-sm mt-2">
                        {task.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-4">
          <Card className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {versions.map(version => (
                  <div
                    key={version}
                    className="flex justify-between items-center p-2 hover:bg-muted rounded"
                  >
                    <span>Version {version}</span>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/docs/versions/${version}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => runDocTask(
                          `Delete Version ${version}`,
                          `docs:version:delete ${version}`
                        )}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
