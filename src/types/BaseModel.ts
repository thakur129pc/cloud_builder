export interface AttributeValue {
  uom: number;
  value: string;
  is_measured: boolean;
}

export interface Attribute {
  attribute_name: string;
  attribute_description: string;
  attribute_value: AttributeValue;
}

export interface BaseModel {
  llm_name: string;
  llm_type: string;
  attributes: Attribute[];
}
