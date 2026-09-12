import TaskForm from './TaskForm'

interface TaskModalProps {
  onClose: () => void
  onSuccess: () => void
}

function TaskModal({
  onClose,
  onSuccess,
}: TaskModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-task-title"
    >
      <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2
              id="create-task-title"
              className="text-base font-semibold text-slate-950"
            >
              Create task
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Add a new task to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close create task dialog"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <TaskForm
            onCancel={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  )
}

export default TaskModal