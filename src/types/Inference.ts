export interface InferenceLLM {
  llm_id: number;
  llm_name: string;
  llm_base: boolean;
  quantization_bit: number;
  inference_method: string;
  inference_method_id?: number;
  latency: number | null;
  throughput: number | null;
  llm_capability: LLMCapability[];
  target_cloud: TargetCloud[];
  parameters?: string;
  tests?: string;
  id?: string;
}

interface LLMCapability {
  capability_id: number;
  capability_name: string;
}

interface TargetCloud {
  cloud_id: number;
  cloud_name: string;
  daily_cost: Cost;
  description: string;
  yearly_cost: Cost;
  monthly_cost: Cost;
}

interface Cost {
  uom: UOM;
  value: number;
}

interface UOM {
  id: number;
  name: string;
  type: string;
  unit: number;
  symbol: string;
}

interface LLMCapability {
  capability_id: number;
  capability_name: string;
}
