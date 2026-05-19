import { daysDiff } from "./dateUtils.js";
import { libraryConfig } from "../config/libraryConfig.js";

/**
 * คำนวณค่าปรับจากจำนวนวันที่คืนช้ากว่ากำหนด
 * @param {Date} dueDate - วันครบกำหนดคืนหนังสือ
 * @param {Date} returnDate - วันที่คืนหนังสือจริง
 * @param {number} ratePerDay - อัตราค่าปรับต่อวัน (บาท), default จาก libraryConfig
 * @returns {number} ค่าปรับรวม (บาท), ไม่ติดลบ
 */
export function calculateFine(dueDate, returnDate, ratePerDay = libraryConfig.fineRatePerDay) {
  const days = daysDiff(dueDate, returnDate);
  if (days <= 0) return 0;
  return days * ratePerDay;
}

/**
 * คำนวณค่าปรับรวมจากทุก record
 * @param {Array} records - รายการยืม-คืนหนังสือ (มี dueDate และ returnDate)
 * @returns {number} ยอดค่าปรับรวม (บาท)
 */
export function getTotalFine(records) {
  return records.reduce((total, record) => {
    const returnDate = record.returnDate ?? new Date();
    return total + calculateFine(record.dueDate, returnDate);
  }, 0);
}
