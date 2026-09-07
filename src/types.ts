export interface ProjectFile {
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript' | 'json' | 'markdown' | 'other';
  size: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  extractedFiles?: Record<string, string>;
  isStreaming?: boolean;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export type AIModel =
  | 'gemini-flash-latest'
  | 'gemini-3.8-flash'
  | 'gemini-3.1-flash-lite'
  | 'gemini-3.1-pro-preview';

export type ViewMode = 'preview' | 'code' | 'split';
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ProjectMetadata {
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}
