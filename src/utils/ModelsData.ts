export const modelNames: string[] = [
  'Mistral-7b-instruct-v0.2',
  'Codellama-7b-instruct',
  'Codellama-13b-instruct',
  'Microsoft-phi-2',
  'Mpt-7b-8k-instruct',
  'Falcon-7b-instruct',
  'Mistral-7b-v0.1',
  'Yi-6b-chat-4bits',
  'Qwen-7b-chat',
  'Gemma-2b',
  'Gemma-7b',
  'Stable-code-instruct-3b',
  'Starcoder2-3b',
  'Starcoder2-7b',
  'Llava',
  'Mosaicml-mpt-7b-8k-instruct',
  'Eleutherai-gpt-neo-1.3b',
  'Tiiuae-falcon-7b-instruct',
  'Sshleifer-tiny-distilbert-base-cased-distilled-squad',
];

export const models: ModelsName[] = [
  {
    llm_family_id: 1,
    llm_family: 'Mistral-7b-Instruct-v0.2',
  },
  {
    llm_family_id: 2,
    llm_family: 'CodeLlama-7b-Instruct',
  },
  {
    llm_family_id: 3,
    llm_family: 'CodeLlama-13b-Instruct',
  },
  {
    llm_family_id: 4,
    llm_family: 'Microsoft-phi-2',
  },
  {
    llm_family_id: 5,
    llm_family: 'MPT-7b-8k-Instruct',
  },
  {
    llm_family_id: 6,
    llm_family: 'Falcon-7b-Instruct',
  },
  {
    llm_family_id: 7,
    llm_family: 'Mistral-7b-v0.1',
  },
  {
    llm_family_id: 8,
    llm_family: 'Yi-6B-Chat-4bits',
  },
  {
    llm_family_id: 9,
    llm_family: 'Qwen-7B-Chat',
  },
  {
    llm_family_id: 10,
    llm_family: 'gemma-2b',
  },
  {
    llm_family_id: 11,
    llm_family: 'gemma-7b',
  },
  {
    llm_family_id: 12,
    llm_family: 'stable-code-instruct-3b',
  },
  {
    llm_family_id: 13,
    llm_family: 'starcoder2-3b',
  },
  {
    llm_family_id: 14,
    llm_family: 'starcoder2-7b',
  },
  {
    llm_family_id: 15,
    llm_family: 'LLaVA',
  },
];

export interface ModelsName {
  llm_family_id?: number;
  llm_family?: string;
}
