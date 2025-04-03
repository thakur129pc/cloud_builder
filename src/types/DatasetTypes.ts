export interface DatasetInfo {
  data_id: number;
  data_name: string;
  description: string;
  storage_location: string;
  version: string;
}

export interface DatasetPayload {
  data_name: string;
  description: string;
  storage_location: string;
  version: string;
  file: string;
}
