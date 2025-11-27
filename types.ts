export enum FiscalYear {
  Y2565 = '2565',
  Y2566 = '2566',
  Y2567 = '2567',
  Y2568 = '2568'
}

export enum AgencyType {
  MINISTRY = 'กระทรวง/กรม',
  LOCAL = 'อปท. (อบต./เทศบาล)',
  SCHOOL = 'สถานศึกษา',
  STATE_ENTERPRISE = 'รัฐวิสาหกิจ',
  OTHER = 'หน่วยงานอื่นของรัฐ'
}

export interface Debtor {
  id: string;
  name: string;
  type: AgencyType;
  fiscalYear: FiscalYear; // ปีงบประมาณที่เริ่มค้าง
  amount: number;
  invoiceDate: string;
  daysOverdue: number;
  contactPerson: string;
  phone: string;
  status: 'Critical' | 'Warning' | 'Normal'; // Critical = ข้ามปีงบประมาณนาน
}

export interface AnalysisResponse {
  strategy: string;
  tone: string;
  steps: string[];
  legal_warning: string;
}
