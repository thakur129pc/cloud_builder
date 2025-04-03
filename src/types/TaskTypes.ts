export interface TaskGroup {
  group_id: number;
  group_name: string;
  group_description: string;
}

export interface TaskOption {
  option_id?: number;
  name: string;
  description: string;
}

export interface Task {
  task_id?: number;
  task_name: string;
  task_description: string;
  task_group_id?: number;
  task_options?: TaskOption[];
  type_option_id?: number;
}
