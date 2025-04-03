interface UOM {
  id: number;
  name: string;
  symbol: string;
  type: string;
  unit: number;
}

export interface TestMachine {
  test_machine_id: number;
  name: string;
  description: string;
}

interface Cost {
  uom: UOM;
  value: number;
}

interface Pricing {
  monthly_cost: Cost;
  yearly_cost: Cost;
  daily_cost: Cost;
}

interface GPUParameters {
  value: number;
  uom: string;
}

interface GPU {
  gpu_type: string;
  gpu_parameters: GPUParameters;
}

interface MachineType {
  machine_type_id: number;
  machine_type_name: string;
  pricing: Pricing;
  gpu: GPU;
  vcpu: number;
  memory: {
    value: number;
    uom: string;
  };
  tps: number;
}

export interface MachineState {
  llm_id: number;
  llm_family_id: number;
  llm_family_name: string;
  llm_variant_name: string;
  available_machine_types: MachineType[];
}

export interface SelectedMachines {
  llm_id: number;
  machine_type_id: number;
}
