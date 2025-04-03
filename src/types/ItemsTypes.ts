export interface ItemFormData {
  partId: string;
  partName: string;
  version: string;
  partType: string;
  description: string;
  category: 'H/W' | 'S/W';
  machineName: string;
  machineDescription: string;
  cpu: string;
  ram: string;
  ramUOM: string;
  noOfGPUs: string;
  gpuRamValue: string;
  gpuRamUOM: string;
  hourlyRate: string;
  monthlyRate: string;
  yearlyRate: string;
  source: string;
  language: string;
  modelNumber: string;
  lastUpdated: string | null; // Date in 'mm-dd-yyyy' format
  cost: number | null;
  endOfLife: string | null; // Date in 'mm-dd-yyyy' format
  lastPatchDate: string | null; // Date in 'mm-dd-yyyy' format
  license: string;
  packageURL: string;
  manufacturer: string;
  serialNumber: string;
  status: string | null; // Selected status
  measurementUnit: string;
  measurementValue: number | null;
  currency: string | null; // Selected currency
  procurementDate: string | null; // Date in 'mm-dd-yyyy' format
  complianceStandards: string;
  securityPatches: string;
  notes: string;
}

export interface ItemDetails {
  item_id: number;
  region_id: number;
  cloud_id: number;
  item_name: string;
  dtl_node_cost_id: number;
  purpose_id: number | null;
  item_source: number;
  item_is_hw_or_sw: number;
  is_active: boolean;
  created_at: string; // ISO date format
  modified_at: string; // ISO date format
  description: string;
  node_id: number | null;
  part_type: string;
  category: string;
}

export interface BomDetails {
  bom_id: number;
  is_topology: boolean | null;
  topology_type: string | null;
  is_root: boolean;
  item_id: number;
  created_at: string; // ISO date format
  modified_at: string; // ISO date format
  created_by: string | null;
  updated_by: string | null;
  is_active: boolean;
  bom_name: string;
  description: string;
}
