<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_task(): void
    {
        $tenant = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $user = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenant->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Complete assessment',
            'description' => 'Finish the Laravel and React assessment.',
            'status' => 'todo',
            'priority' => 'high',
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('task.title', 'Complete assessment')
            ->assertJsonPath('task.tenant_id', $tenant->id)
            ->assertJsonPath('task.created_by', $user->id);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Complete assessment',
            'tenant_id' => $tenant->id,
            'created_by' => $user->id,
        ]);
    }

    //Cross-Tenant Isolation Test
    public function test_user_cannot_access_a_task_from_another_tenant(): void
    {
        $tenantA = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $tenantB = Tenant::create([
            'name' => 'Bright Healthcare',
        ]);

        $userA = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenantA->id,
        ]);

        $userB = User::create([
            'name' => 'Bright Admin',
            'email' => 'admin@bright.test',
            'password' => 'password',
            'tenant_id' => $tenantB->id,
        ]);

        $task = Task::create([
            'tenant_id' => $tenantB->id,
            'created_by' => $userB->id,
            'title' => 'Bright private task',
            'description' => 'This task belongs to tenant B.',
            'status' => 'todo',
            'priority' => 'high',
        ]);

        Sanctum::actingAs($userA);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertNotFound();
    }

    //validation-test
    public function test_task_creation_requires_a_title(): void
    {
        $tenant = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $user = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenant->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'description' => 'Task without a title.',
            'status' => 'todo',
            'priority' => 'medium',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);

        $this->assertDatabaseCount('tasks', 0);
    }

    //Update Test
    public function test_user_can_update_their_own_task(): void
    {
        $tenant = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $user = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenant->id,
        ]);

        $task = Task::create([
            'tenant_id' => $tenant->id,
            'created_by' => $user->id,
            'title' => 'Original task',
            'description' => 'Original description',
            'status' => 'todo',
            'priority' => 'medium',
        ]);

        Sanctum::actingAs($user);

        $response = $this->patchJson("/api/tasks/{$task->id}", [
            'status' => 'done',
            'priority' => 'high',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('task.status', 'done')
            ->assertJsonPath('task.priority', 'high');

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'done',
            'priority' => 'high',
        ]);
    }

    //cross-tenant update test
    public function test_user_cannot_update_a_task_from_another_tenant(): void
    {
        $tenantA = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $tenantB = Tenant::create([
            'name' => 'Bright Healthcare',
        ]);

        $userA = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenantA->id,
        ]);

        $userB = User::create([
            'name' => 'Bright Admin',
            'email' => 'admin@bright.test',
            'password' => 'password',
            'tenant_id' => $tenantB->id,
        ]);

        $task = Task::create([
            'tenant_id' => $tenantB->id,
            'created_by' => $userB->id,
            'title' => 'Bright private task',
            'description' => 'Private tenant task.',
            'status' => 'todo',
            'priority' => 'high',
        ]);

        Sanctum::actingAs($userA);

        $response = $this->patchJson("/api/tasks/{$task->id}", [
            'status' => 'done',
        ]);

        $response->assertNotFound();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'todo',
        ]);
    }

    //task asign test
    public function test_user_cannot_assign_a_task_to_a_user_from_another_tenant(): void
    {
        $tenantA = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $tenantB = Tenant::create([
            'name' => 'Bright Healthcare',
        ]);

        $userA = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenantA->id,
        ]);

        $userB = User::create([
            'name' => 'Bright Admin',
            'email' => 'admin@bright.test',
            'password' => 'password',
            'tenant_id' => $tenantB->id,
        ]);

        Sanctum::actingAs($userA);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Cross tenant assignment test',
            'status' => 'todo',
            'priority' => 'medium',
            'assigned_to' => $userB->id,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['assigned_to']);

        $this->assertDatabaseCount('tasks', 0);
    }

    //Unauthenticated user cannot access tasks test
    public function test_unauthenticated_user_cannot_access_tasks(): void
    {
        $response = $this->getJson('/api/tasks');

        $response->assertUnauthorized();
    }

    //user can delete own tasks test
    public function test_user_can_delete_their_own_task(): void
    {
        $tenant = Tenant::create([
            'name' => 'Acme Education',
        ]);

        $user = User::create([
            'name' => 'Acme Admin',
            'email' => 'admin@acme.test',
            'password' => 'password',
            'tenant_id' => $tenant->id,
        ]);

        $task = Task::create([
            'tenant_id' => $tenant->id,
            'created_by' => $user->id,
            'title' => 'Task to delete',
            'description' => 'Temporary task.',
            'status' => 'todo',
            'priority' => 'medium',
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Task deleted successfully.',
            ]);

        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}