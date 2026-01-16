
export interface Feedback {
  id: string;
  mood: number;
  comment: string;
  timestamp: number;
}

export interface ActionPlan {
  point1: string;
  point2: string;
  point3: string;
  summary: string;
}

export enum ViewMode {
  EMPLOYEE = 'EMPLOYEE',
  MANAGEMENT = 'MANAGEMENT'
}
