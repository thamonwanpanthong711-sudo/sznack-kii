import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Debtor, AnalysisResponse } from "../types";

// Access environment variable using Vite's syntax
const apiKey = import.meta.env.VITE_API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const analyzeDebtorStrategy = async (debtor: Debtor): Promise<AnalysisResponse> => {
  if (!apiKey) {
    return {
      strategy: "ไม่สามารถเชื่อมต่อ AI ได้ (ไม่พบ API Key)",
      tone: "N/A",
      steps: ["กรุณาตรวจสอบการตั้งค่า Environment Variable: VITE_API_KEY"],
      legal_warning: "ไม่สามารถประเมินได้"
    };
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    คุณคือที่ปรึกษาอาวุโสจด้านการเงินและบัญชีภาครัฐ เชี่ยวชาญระเบียบการเบิกจ่ายเงินงบประมาณ
    
    ข้อมูลลูกหนี้หน่วยงานราชการ (ค่าไฟฟ้าค้างชำระ):
    - ชื่อหน่วยงาน: ${debtor.name}
    - ประเภท: ${debtor.type}
    - ปีงบประมาณที่ค้าง: ${debtor.fiscalYear}
    - ยอดหนี้: ${debtor.amount.toLocaleString()} บาท
    - จำนวนวันที่ค้างชำระ: ${debtor.daysOverdue} วัน
    - สถานะ: ${debtor.status}

    โจทย์: วิเคราะห์และแนะนำแนวทางการติดตามทวงถามหนี้ก้อนนี้ โดยคำนึงถึง:
    1. ระเบียบการเบิกจ่ายเงินข้ามปีงบประมาณ (กรณีค้างนาน) หรือเงินกันไว้เบิกเหลื่อมปี
    2. รูปแบบการเจรจาที่เหมาะสมกับหน่วยงานราชการ (Diplomatic but firm)
    3. ขั้นตอนปฏิบัติที่เป็นรูปธรรม

    ตอบกลับเป็น JSON ตาม Schema ที่กำหนด
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      strategy: { type: Type.STRING, description: "สรุปกลยุทธ์หลักใน 1 ประโยค" },
      tone: { type: Type.STRING, description: "น้ำเสียงที่ควรใช้ในการเจรจา" },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "รายการสิ่งที่ต้องทำ 3-5 ข้อ"
      },
      legal_warning: { type: Type.STRING, description: "ข้อควรระวังเรื่องระเบียบ/กม." }
    },
    required: ["strategy", "tone", "steps", "legal_warning"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      strategy: "เกิดข้อผิดพลาดในการวิเคราะห์",
      tone: "สุภาพ",
      steps: ["ตรวจสอบข้อมูลลูกหนี้อีกครั้ง", "ติดต่อผู้ดูแลระบบ"],
      legal_warning: "โปรดตรวจสอบความถูกต้องของข้อมูลด้วยตนเองอีกครั้ง"
    };
  }
};