import { ChartData } from 'chart.js';
import { CompareData, TestOutputKey } from '../types/wizardTypes';
import { ModelsName } from './ModelsData';

export const generateLineData = (
  compareData: CompareData[],
  itemKey: TestOutputKey,
  label: string,
  selectedModels: ModelsName[]
): ChartData<'line'> => {
  return {
    labels: selectedModels?.map((model) => model.llm_family) || [
      'Mistral-7b-Instruct-v0.2',
      'Falcon',
      'GPT',
    ],
    datasets: [
      {
        label: label || 'GLEU',
        data: compareData.map((item) => Number(item.test_output_json[itemKey])),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };
};

export const generateMultiChartData = (
  r1: number[],
  r2: number[],
  r3: number[],
  r4: number[],
  selectedModels: ModelsName[]
): ChartData<'line'> => {
  const rougeDatasets = [
    {
      label: 'ROUGE-1',
      data: r1,
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
    },
    {
      label: 'ROUGE-2',
      data: r2,
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
    },
    {
      label: 'ROUGE-L',
      data: r3,
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
    },
    {
      label: 'ROUGE-Lsum',
      data: r4,
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
    },
  ];
  return {
    labels: selectedModels?.map((model) => model.llm_family) || [
      'Mistral-7b-Instruct-v0.2',
      'Falcon',
      'GPT',
    ],
    datasets: rougeDatasets,
  };
};

export const mappedChartData: ChartInfo[] = [
  {
    yLabel: 'GLEU Scores',
    xLabel: 'Models',
    key: 'gleu_score',
    label: 'GLEU',
  },
  {
    yLabel: 'Scores',
    xLabel: 'Models',
    keys: ['rouge1_score', 'rouge2_score', 'rougel_score', 'rougelsum_score'],
    key: 'rouge1_score',
    labels: ['ROUGE-1', 'ROUGE-2', 'ROUGE-L', 'ROUGE-Lsum'],
    label: '',
  },
  {
    yLabel: 'MAUVE Scores',
    xLabel: 'Models',
    key: 'mauve_score',
    label: 'MAUVE',
  },
  {
    yLabel: 'METEOR Scores',
    xLabel: 'Models',
    key: 'meteor_score',
    label: 'METEOR',
  },
  {
    yLabel: 'Samples Per Second',
    xLabel: 'Models',
    key: 'samples_per_second',
    label: 'Samples Per Second',
  },
  {
    yLabel: 'Latency (seconds)',
    xLabel: 'Models',
    key: 'latency_seconds',
    label: 'Latency',
  },
  {
    yLabel: 'Avergae GPU Utilization (%)',
    xLabel: 'Models',
    key: 'avg_gpu_ram_utilization_percentage',
    label: 'Average GPU Utilization',
  },
  {
    yLabel: 'Used GPU RAM After Load (GB)',
    xLabel: 'Models',
    key: 'used_gpu_ram_after_load_gb',
    label: 'Used GPU RAM After Load',
  },
  {
    yLabel: 'Avergae CPU Utilization (%)',
    xLabel: 'Models',
    key: 'avg_cpu_utilization_percentage',
    label: 'Average CPU Utilization',
  },
];

interface ChartInfo {
  yLabel: string;
  xLabel: string;
  key: TestOutputKey;
  label: string;
  keys?: string[];
  labels?: string[];
}
