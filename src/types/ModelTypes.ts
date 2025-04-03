export interface Uom {
  id: number;
  name: string;
  symbol: string;
  type: string;
  unit: number;
}

export interface Cost {
  uom: Uom;
  value: number;
}

export interface TargetCloud {
  cloud_id: number;
  cloud_name: string;
  description: string;
  monthly_cost: Cost;
  yearly_cost: Cost;
  daily_cost: Cost;
}

export interface Capability {
  capability_id: number;
  capability_name: string;
}

export interface LlmVariant {
  llm_id: number;
  llm_name: string;
  llm_family: string;
  llm_base: boolean;
  quantization_bit: number;
  inference_method: string;
  latency: number | null;
  throughput: number | null;
  llm_capability: Capability[];
  target_cloud: TargetCloud[];
}

export interface AttributeValue {
  uom?: string;
  value: number | string;
}

export interface Attribute {
  attribute_name: string;
  attribute_value: number | AttributeValue;
}

export interface LlmFamily {
  llm_family_id: number;
  llm_family: string;
  attributes: Attribute[];
  description?: string;
  llm_type?: string;
  llm_name?: string;
  id?: string;
  llm_variants: LlmVariant[];
}

export interface DatasetInfo {
  data_id: number;
  data_name: string;
  description: string;
  storage_location: string;
}
