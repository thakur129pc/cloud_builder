interface Metric {
  metric_name?: string;
  metric_description?: string;
  uom_type?: string;
  uom_name?: string;
  is_range?: boolean;
  fixed_range_value?: string;
  min_range_value?: string;
  max_range_value?: string;
}

export interface TestInfo {
  test_id: number;
  test_name: string;
  description: string;
  metrics?: Metric[];
}

export interface MetricState {
  metric_id?: string;
  metric_name: string;
  metric_description: string;
  is_measured: boolean | null;
  uom_id?: string;
  uom_type?: string;
  is_range?: boolean | null;
  isEditing?: boolean;
  min_range_value?: string;
  max_range_value?: string;
  fixed_range_value?: string;
}

export interface TestType {
  test_type_id: number;
  test_type: string;
  description: string;
}
