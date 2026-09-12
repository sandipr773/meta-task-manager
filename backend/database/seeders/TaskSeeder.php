<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $acme = Tenant::where('name', 'Acme Education')->firstOrFail();
        $acmeAdmin = User::where('email', 'admin@acme.test')->firstOrFail();

        $tasks = [
            [
                'title' => 'Laravel API Development',
                'description' => 'Build task management API endpoints.',
                'status' => 'todo',
                'priority' => 'high',
            ],
            [
                'title' => 'React Dashboard',
                'description' => 'Implement responsive dashboard UI.',
                'status' => 'in_progress',
                'priority' => 'high',
            ],
            [
                'title' => 'Database Optimization',
                'description' => 'Review queries and improve database performance.',
                'status' => 'done',
                'priority' => 'medium',
            ],
            [
                'title' => 'Authentication Flow',
                'description' => 'Implement secure login and logout flow.',
                'status' => 'done',
                'priority' => 'high',
            ],
            [
                'title' => 'Tenant Management',
                'description' => 'Review multi-tenant data isolation.',
                'status' => 'in_progress',
                'priority' => 'high',
            ],
            [
                'title' => 'API Documentation',
                'description' => 'Document available API endpoints.',
                'status' => 'todo',
                'priority' => 'low',
            ],
            [
                'title' => 'Frontend Validation',
                'description' => 'Add client-side validation to forms.',
                'status' => 'todo',
                'priority' => 'medium',
            ],
            [
                'title' => 'Laravel Testing',
                'description' => 'Add feature tests for task management.',
                'status' => 'in_progress',
                'priority' => 'high',
            ],
            [
                'title' => 'React Components',
                'description' => 'Refactor reusable UI components.',
                'status' => 'done',
                'priority' => 'medium',
            ],
            [
                'title' => 'Search Functionality',
                'description' => 'Implement server-side task search.',
                'status' => 'done',
                'priority' => 'medium',
            ],
            [
                'title' => 'Pagination Support',
                'description' => 'Add pagination to task listing.',
                'status' => 'done',
                'priority' => 'low',
            ],
            [
                'title' => 'Task Assignment',
                'description' => 'Allow tasks to be assigned to team members.',
                'status' => 'in_progress',
                'priority' => 'high',
            ],
            [
                'title' => 'Error Handling',
                'description' => 'Improve API error responses.',
                'status' => 'todo',
                'priority' => 'medium',
            ],
            [
                'title' => 'Responsive Design',
                'description' => 'Improve mobile task management experience.',
                'status' => 'in_progress',
                'priority' => 'medium',
            ],
            [
                'title' => 'Code Review',
                'description' => 'Review backend and frontend implementation.',
                'status' => 'todo',
                'priority' => 'high',
            ],
            [
                'title' => 'Laravel Middleware',
                'description' => 'Review authentication and tenant middleware.',
                'status' => 'done',
                'priority' => 'medium',
            ],
            [
                'title' => 'User Management',
                'description' => 'Implement tenant-specific user listing.',
                'status' => 'done',
                'priority' => 'low',
            ],
            [
                'title' => 'Task Filtering',
                'description' => 'Add status and priority filters.',
                'status' => 'done',
                'priority' => 'medium',
            ],
            [
                'title' => 'Dashboard Statistics',
                'description' => 'Show task statistics by status.',
                'status' => 'in_progress',
                'priority' => 'high',
            ],
            [
                'title' => 'Security Review',
                'description' => 'Review cross-tenant access protection.',
                'status' => 'todo',
                'priority' => 'high',
            ],
            [
                'title' => 'UI Accessibility',
                'description' => 'Improve accessibility of task controls.',
                'status' => 'todo',
                'priority' => 'low',
            ],
            [
                'title' => 'API Performance',
                'description' => 'Review API response performance.',
                'status' => 'in_progress',
                'priority' => 'medium',
            ],
            [
                'title' => 'Task Detail View',
                'description' => 'Improve individual task details.',
                'status' => 'todo',
                'priority' => 'medium',
            ],
            [
                'title' => 'Production Configuration',
                'description' => 'Review production environment configuration.',
                'status' => 'todo',
                'priority' => 'high',
            ],
            [
                'title' => 'Final QA Testing',
                'description' => 'Perform final functional testing.',
                'status' => 'in_progress',
                'priority' => 'high',
            ],
        ];

        foreach ($tasks as $task) {
            Task::create([
                ...$task,
                'tenant_id' => $acme->id,
                'created_by' => $acmeAdmin->id,
                'assigned_to' => $acmeAdmin->id,
            ]);
        }
    }
}