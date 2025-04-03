import { InferenceLLM } from './Inference';
import { TestMachine } from './MachineTypes';
import { Group, Toolkit } from './wizardTypes';

export interface DashboardState {
  dashboardLoading: boolean;
  llmList: LLMList | null;
  selectedInference: InferenceLLM | null;
  selectedInferenceMethod: InferenceMethod | null;
  selectedTestMachine: TestMachine | null;
  selectedTaskType: Group | null;
  selectedCertificate: ComplianceCertificate | null;
  selectedToolkit: Toolkit | null;
}

export interface AttributeValue {
  uom: string | null;
  attribute_name?: string;
  attribute_description?: string;
  description?: string;
  attribute_value?: string;
  value: string;
  uom_type: string;
  is_measured: boolean | null;
  is_range?: boolean | null;
  min_range_value?: string;
  max_range_value?: string;
  fixed_range_value?: string;
}

export interface AttributeState {
  attribute_id?: string;
  attribute_name: string;
  attribute_description: string;
  attribute_value: AttributeValue;
  isEditing?: boolean;
}

export interface LLMList {
  llm_family: string;
  llm_name?: string;
  llm_type: string;
  attributes: AttributeState[];
}

export interface CertificationFeature {
  name: string;
  isEditing?: boolean;
  description: string;
}

export interface CertificateState {
  name: string;
  isEditing?: boolean;
  description: string;
  certifications: CertificationFeature[];
}

export interface InferenceMethod {
  inference_method_id: number;
  name: string;
  description: string | null;
}

export interface ComplianceCertificate {
  compliance_id: number;
  certification_name: string;
  description?: string;
  certification_features: string[];
}

export interface Parameter {
  is_new_parameter: boolean;
  parameter_name: string;
  parameter_descryption?: string;
  measurement_type_id?: number;
  uom_id?: number;
  is_range?: boolean;
  fixed_range_value?: string;
  min_range_value?: string;
  max_range_value?: string;
}
