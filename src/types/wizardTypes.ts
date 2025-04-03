import { SelectedMachines } from './MachineTypes';

export interface Option {
  option_id: number;
  option_name: string;
}

export interface LLMCability {
  llm_capability_id: number;
  capability_name: string;
  llm_capability_options: Option[];
}

export interface CapabilityOption extends Option {
  isEditing?: boolean;
}

export interface LLMCabilityPayload extends LLMCability {
  llm_capability_description?: string;
  isEditing?: boolean;
  llm_capability_options: CapabilityOption[];
}
export interface Group {
  group_id: number;
  group_name: string;
  llm_capabilities: LLMCabilityPayload[];
}

export interface GroupState extends Group {
  isEditing?: boolean;
  group_description: string;
}
export interface ApiErrorResponse {
  message: string;
}

export interface ToolkitOption {
  toolkitoption_id?: number;
  toolkitoption_name: string;
}

export interface Toolkit {
  toolkit_id?: number;
  toolkit_name: string;
  toolkit_options: ToolkitOption[];
}

export interface ToolkitOptionPayload extends ToolkitOption {
  toolkitoption_description: string;
  isEditing?: boolean;
}

export interface ToolkitState extends Toolkit {
  toolkit_description: string;
  isEditing?: boolean;
  toolkit_options: ToolkitOptionPayload[];
}

export interface Destination {
  destination_id: number;
  destination_name: string;
  levels: string[];
}

export interface Certification {
  compliance_id: number;
  certification_name: string;
  certification_features: string[];
}
interface SelectedToolkitOption {
  [key: string]: number[];
}

interface TeamOption {
  [key: string]: number | string;
}

interface TaskTypesOption {
  [key: string]: number[];
}

interface NodeOption {
  [key: string]: {
    llm_id: number;
    machine_type_id: number;
  }[];
}

interface ModelsOption {
  [key: string]: number[];
}

export interface SelectedOption {
  option_name: string;
  option_value:
    | SelectedToolkitOption
    | TeamOption
    | TaskTypesOption
    | NodeOption
    | ModelsOption;
}

export interface RouteMapping {
  [key: string]: string;
}

export enum RouteKeys {
  TASK_TYPES = 'task_types',
  TOOLKIT = 'toolkit',
  TEAM = 'team',
  MODELS = 'models',
  NODE = 'node',
  LEVEL = 'level',
  CERTIFICATION = 'certifications',
}

export interface TeamState {
  data_scientists: string;
  users: string;
  workspace_os: string;
}

export interface SelectedToolKits {
  ai: number[];
  teamState: TeamState;
}

export interface WizardState {
  models: number[];
  compareModels: boolean;
  loading: boolean;
  error: { show: boolean; message: string };
  selectedOptions: SelectedOption[];
  selectedLLMs: number[];
  selectedToolKits: SelectedToolKits;
  selectedMachines: SelectedMachines[];
  selectedLevel: number;
  selectedCert: number;
  selectedDataSet: number;
}

export interface ToplogyState {
  diagram_link: string;
  compliance_standard: {
    name: string;
  };
  level_standard: {
    name: string;
  };
}

export interface TestOutputJson {
  test_id: string;
  quantization: string;
  method: string;
  file_name: string;
  task_type: string;
  dataset_name: string;
  model_name: string;
  rouge1_score: string;
  rouge2_score: string;
  rougel_score: string;
  rougelsum_score: string;
  gleu_score: string;
  mauve_score: string;
  meteor_score: string;
  throughput_tokens_per_second: string;
  total_time_seconds: string;
  samples_per_second: string;
  latency_seconds: string;
  avg_cpu_utilization_percentage: string;
  avg_gpu_ram_utilization_percentage: string;
  avg_disk_utilization_percentage: string;
  cpu_before_load_percentage: string;
  gpu_ram_before_load_percentage: string;
  disk_before_load_percentage: string;
  cpu_ram_before_load_gb: string;
  total_gpu_ram_before_load_gb: string;
  used_gpu_ram_before_load_gb: string;
  total_disk_space_before_load_gb: string;
  used_disk_space_before_load_gb: string;
  cpu_after_load_percentage: string;
  gpu_ram_after_load_percentage: string;
  disk_after_load_percentage: string;
  cpu_ram_after_load_gb: string;
  total_gpu_ram_after_load_gb: string;
  used_gpu_ram_after_load_gb: string;
  total_disk_space_after_load_gb: string;
  used_disk_space_after_load_gb: string;
}
export type TestOutputKey = keyof TestOutputJson;

export interface CompareData {
  inference_name: string;
  test_name: string;
  data_name: string;
  test_output_json: TestOutputJson;
}
