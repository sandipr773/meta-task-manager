<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Support\TenantContext;

class TaskService
{
    public function __construct(
        private TenantContext $tenantContext,
    ) {}

    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Task::query()
            ->where('tenant_id', $this->tenantContext->id())
            ->with(['creator:id,name', 'assignee:id,name']);

        if (!empty($filters['search'])) {
            $query->where(
                'title',
                'like',
                '%' . $filters['search'] . '%'
            );
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        return $query
            ->latest()
            ->paginate(10);
    }

    public function create(User $user, array $data): Task
    {
        return Task::create([
            'tenant_id' => $this->tenantContext->id(), //multi-tenant isolation
            'created_by' => $user->id,
            'assigned_to' => $data['assigned_to'] ?? null,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'status' => $data['status'] ?? 'todo',
            'priority' => $data['priority'] ?? 'medium',
        ]);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);

        return $task->fresh(['creator:id,name', 'assignee:id,name']);
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}