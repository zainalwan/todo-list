export interface CreateToDoPayload {
  name: string,
  description: string,
  dueDate: Date,
  status: string,
  assigneeId: number,
  creatorId: number,
}
