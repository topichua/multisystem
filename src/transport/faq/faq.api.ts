import axio2s from '../axios/axios-instance';
import { FaqDto, FaqItem } from './faq.dto';

export const faqApi = {
  async getAllFaq(): Promise<FaqDto> {
    const total = 20;
    const now = 1735689600000; // 2025-01-01 for stable dates
    const faQs: FaqItem[] = Array.from({ length: total }, (_, idx) => {
      const i = idx + 1;
      const created = new Date(now - i * 86400_000).toISOString();
      const updated = new Date(now - (i - 1) * 43200_000).toISOString();
      const authorId = `user-${((i - 1) % 20) + 1}`;
      return {
        id: `faq-${i}`,
        name: `FAQ Question ${i}`,
        description: `<p>This is the answer to <strong>FAQ Question ${i}</strong>. It covers common issues and useful guidance for communities.</p>
<ul>
  <li>Point A for question ${i}</li>
  <li>Point B for question ${i}</li>
  <li>Point C for question ${i}</li>
  <li>Related community: community-${((i - 1) % 20) + 1}</li>
  <li>Posted by: ${authorId}</li>
  <li>Updated: ${updated.split('T')[0]}</li>
  </ul>`,
        isDeleted: false,
        createdAt: created,
        updatedAt: updated,
        createdByUserId: authorId,
        updatedByUserId: authorId,
      };
    });

    return Promise.resolve({
      faQs,
      args: { page: 1, pageSize: total },
      totalItemCount: total,
    });
  },

  async getAllAdminFaq(): Promise<FaqDto> {
    return axio2s.get(`api/v1/admin/faq?page=1&pageSize=1000`);
  },

  async createFaq(faQs: FaqItem): Promise<FaqDto> {
    return axio2s.post(`api/v1/admin/faq`, { faQs: [faQs] });
  },

  async updateFaq(faqId: string, faq: FaqItem): Promise<FaqDto> {
    return axio2s.put(`api/v1/admin/faq/${faqId}`, {
      name: faq.name,
      description: faq.description,
    });
  },

  async deleteQuestion(faqId: string) {
    return axio2s.delete(`api/v1/admin/faq/${faqId}`);
  },

  async restoreQuestion(faqId: string) {
    return axio2s.put(`api/v1/admin/faq/${faqId}/restore`);
  },
};
