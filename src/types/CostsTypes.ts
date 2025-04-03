export interface ModelCost {
  inference_id: number;
  model: string;
  machine_type: string;
  monthly_cost: number;
  yearly_cost: number;
}

export type CostState = {
  models: ModelCost[];
  cost: BomApiRes | null;
};

export interface BomApiRes {
  bom: BOM[];
  sbom?: BOM[];
  pricing: Pricing;
  item_id: number;
  item_name: string;
}

interface UOM {
  id: number;
  name: string;
  symbol: string;
  type: string;
  unit: number;
}

interface Cost {
  uom: UOM;
  value: number;
}

interface Pricing {
  cloud_id: number;
  cloud_name: string;
  description: string;
  monthly_cost: Cost;
  yearly_cost: Cost;
  daily_cost: Cost;
}

export interface BOM {
  item_id: number;
  system_type: 'software' | 'hardware';
  item_name: string;
  pricing: Pricing;
  bom?: BOM[];
}
