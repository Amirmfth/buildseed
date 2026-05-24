export function calculateProgress(tasks: { completed: boolean }[]) {
  if (tasks.length === 0) return 0;
  return Math.round(
    (tasks.filter((task) => task.completed).length / tasks.length) * 100
  );
}
