export interface User {
  phone: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  physical_issue: string;
  main_goal: string;
  role: 'admin' | 'client';
  is_demo: boolean;
  payment_day: number;
  avatar?: string;
  is_frozen?: boolean;
  is_online?: boolean;
}

export interface Evaluation {
  id: number;
  client_phone: string;
  eval_date: string;
  weight: number;
  height: number;
  neck: number;
  chest: number;
  waist: number;
  abdomen: number;
  hips: number;
  arm_right: number;
  arm_left: number;
  thigh_right: number;
  thigh_left: number;
  calf_right: number;
  calf_left: number;
  photo_front?: string;
  photo_side?: string;
  imc: number;
  body_fat: number;
  created_at?: string;
}

export interface Workout {
  id: number;
  client_phone: string;
  name: string;
  sets: number;
  reps: string;
  weight_load?: string;
  video_url?: string;
  notes?: string;
}

export interface WorkoutHistory {
  completed_at: string;
  count: number;
}

export interface Message {
  id: number;
  client_phone: string;
  client_name?: string;
  workout_id?: number | null;
  workout_name: string;
  reason: string;
  status: 'Pendente' | 'Resolvido';
  created_at: string;
}

export interface PaymentInvoice {
  id: number;
  client_phone: string;
  client_name: string;
  payment_day: number;
  month: string;
  amount: number;
  status: 'Pago' | 'Pendente';
  paid_at?: string;
}
