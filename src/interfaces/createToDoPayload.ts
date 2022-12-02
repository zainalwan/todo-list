export interface CreateToDoPayload {
  name: string,
  description: string,
  dueDate: Date,
  assigneeId: number,
}
