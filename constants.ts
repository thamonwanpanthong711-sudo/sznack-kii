import { Debtor, AgencyType, FiscalYear } from './types';

export const MOCK_DEBTORS: Debtor[] = [
  {
    id: 'D001',
    name: 'โรงเรียนบ้านหนองน้ำขุ่น',
    type: AgencyType.SCHOOL,
    fiscalYear: FiscalYear.Y2566,
    amount: 45000.50,
    invoiceDate: '2023-08-15',
    daysOverdue: 450,
    contactPerson: 'ผอ. สมชาย',
    phone: '081-234-5678',
    status: 'Critical'
  },
  {
    id: 'D002',
    name: 'องค์การบริหารส่วนตำบลทุ่งกระเจี๊ยบ',
    type: AgencyType.LOCAL,
    fiscalYear: FiscalYear.Y2567,
    amount: 12500.00,
    invoiceDate: '2024-02-10',
    daysOverdue: 280,
    contactPerson: 'คุณนิภา (การคลัง)',
    phone: '089-987-6543',
    status: 'Warning'
  },
  {
    id: 'D003',
    name: 'สำนักงานสาธารณสุขจังหวัดเชียงราย',
    type: AgencyType.MINISTRY,
    fiscalYear: FiscalYear.Y2565,
    amount: 120500.75,
    invoiceDate: '2022-09-01',
    daysOverdue: 800,
    contactPerson: 'คุณวิชัย (พัสดุ)',
    phone: '053-111-222',
    status: 'Critical'
  },
  {
    id: 'D004',
    name: 'ศูนย์วิจัยข้าวปทุมธานี',
    type: AgencyType.MINISTRY,
    fiscalYear: FiscalYear.Y2567,
    amount: 8900.00,
    invoiceDate: '2024-07-20',
    daysOverdue: 120,
    contactPerson: 'คุณอารยา',
    phone: '02-555-6666',
    status: 'Normal'
  },
  {
    id: 'D005',
    name: 'เทศบาลตำบลแม่ริม',
    type: AgencyType.LOCAL,
    fiscalYear: FiscalYear.Y2566,
    amount: 67800.00,
    invoiceDate: '2023-05-10',
    daysOverdue: 550,
    contactPerson: 'ปลัดเทศบาล',
    phone: '053-333-444',
    status: 'Critical'
  },
  {
    id: 'D006',
    name: 'การประปาส่วนภูมิภาค สาขาแม่สาย',
    type: AgencyType.STATE_ENTERPRISE,
    fiscalYear: FiscalYear.Y2568,
    amount: 3400.00,
    invoiceDate: '2024-10-05',
    daysOverdue: 40,
    contactPerson: 'คุณสมศักดิ์',
    phone: '053-777-888',
    status: 'Normal'
  },
  {
    id: 'D007',
    name: 'กองร้อยตำรวจตระเวนชายแดนที่ 327',
    type: AgencyType.OTHER,
    fiscalYear: FiscalYear.Y2566,
    amount: 25600.00,
    invoiceDate: '2023-09-25',
    daysOverdue: 410,
    contactPerson: 'ด.ต. มานะ',
    phone: '086-111-9999',
    status: 'Critical'
  }
];
