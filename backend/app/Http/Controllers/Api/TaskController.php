<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {
    }

    public function stats(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;

        $stats = Task::query()
            ->where('tenant_id', $tenantId)
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo")
            ->selectRaw("SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress")
            ->selectRaw("SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done")
            ->first();

        return response()->json([
            'total' => (int) $stats->total,
            'todo' => (int) $stats->todo,
            'in_progress' => (int) $stats->in_progress,
            'done' => (int) $stats->done,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $tasks = $this->taskService->list(
            $request->only([
                'search',
                'status',
                'priority',
            ])
        );

        return response()->json($tasks);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $this->taskService->create(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task->load([
                'creator:id,name',
                'assignee:id,name',
            ]),
        ], 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->ensureTenantAccess($request, $task);

        return response()->json(
            $task->load([
                'creator:id,name',
                'assignee:id,name',
            ])
        );
    }

    public function update(
        UpdateTaskRequest $request,
        Task $task
    ): JsonResponse {
        $this->ensureTenantAccess($request, $task);

        $task = $this->taskService->update(
            $task,
            $request->validated()
        );

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task,
        ]);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->ensureTenantAccess($request, $task);

        $this->taskService->delete($task);

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }

    private function ensureTenantAccess(Request $request, Task $task): void
    {
        abort_unless(
            $task->tenant_id === $request->user()->tenant_id,
            404
        );
    }
}