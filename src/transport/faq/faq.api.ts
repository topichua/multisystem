import axio2s from '../axios/axios-instance';
import { FaqDto, FaqItem } from './faq.dto';

const FAQ_ENTRIES: Pick<FaqItem, 'name' | 'description'>[] = [
  {
    name: 'How do I join a community?',
    description: `<p>From the <strong>Communities</strong> area, browse or search for a community. Click <strong>Join</strong> and complete any required agreement or questions. Your request may need approval for closed communities; you’ll be notified once you’re in.</p>`,
  },
  {
    name: 'How do I get access to a meeting?',
    description: `<p>Meetings are listed under each community and in <strong>Explore meetings</strong>. If the meeting is for members only, join the community first. Open the meeting to see the link, dial-in and calendar invite. Add it to your calendar from the meeting page.</p>`,
  },
  {
    name: 'Who can create or edit posts?',
    description: `<p>Members can create posts according to the community’s permissions. Some communities require post approval before posts go live. Editors and moderators can edit or remove posts; see the community’s About section for roles and rules.</p>`,
  },
  {
    name: 'How do I report inappropriate content?',
    description: `<p>Use the <strong>Report</strong> option on the post or comment. Choose a reason and add details. Reports are reviewed by community moderators and admins. For urgent security or policy issues, contact the security team through the usual channel.</p>`,
  },
  {
    name: 'Where are my saved posts and communities?',
    description: `<p>Saved posts and favourite communities are in <strong>Your library</strong> (or <strong>Favourites</strong>). You can filter by type: posts, events, meetings, communities, news and resources. Use the bookmark/save action on any item to add it there.</p>`,
  },
  {
    name: 'How do I change my notification preferences?',
    description: `<p>Go to <strong>Settings → Communication preferences</strong>. You can choose how you’re notified (email, in-app) for community updates, meetings, mentions and announcements. Changes apply across all communities you’re in.</p>`,
  },
  {
    name: 'What happens when I leave a community?',
    description: `<p>You lose access to that community’s posts, meetings and members. Your past posts and comments remain but are no longer editable by you. You can re-join later if the community allows; some may require a new approval.</p>`,
  },
  {
    name: 'How do I update my profile or contact details?',
    description: `<p>Open <strong>Settings → Account details</strong> to update your name, email, phone and address. Some fields may be managed by your organisation. Changes here are reflected across the platform where your profile is shown.</p>`,
  },
  {
    name: 'Why can’t I see a community or meeting?',
    description: `<p>Communities and meetings can be restricted by segment, role or membership. If you don’t see one you expect: check you’re in the right community, that your segment is included, and that the event is not in the past. Contact the community owner or support if access should be granted.</p>`,
  },
  {
    name: 'How do I add or remove people from a community?',
    description: `<p>Only admins and moderators can manage members. Use <strong>Members</strong> in the community to invite, approve requests, change roles or remove members. For bulk changes or permissions, use the admin community settings.</p>`,
  },
  {
    name: 'What are segments and why do they matter?',
    description: `<p>Segments group users (e.g. by team, region or role). Some communities and content are visible only to certain segments. Your segments are set by admins. If you think you’re missing access, ask your admin or the community owner.</p>`,
  },
  {
    name: 'How do I download or export content?',
    description: `<p>Where available, use the <strong>Download</strong> or <strong>Export</strong> action on the relevant page (e.g. event list, report). Not all content is exportable for privacy and policy reasons. For data requests, see the privacy policy or contact the data protection contact.</p>`,
  },
  {
    name: 'How do I reset my password?',
    description: `<p>On the sign-in page, use <strong>Forgot password</strong> and enter your registered email. You’ll receive a link to set a new password. Links expire after a short time. If you don’t receive it, check spam or contact IT support.</p>`,
  },
  {
    name: 'Can I use the platform on mobile?',
    description: `<p>The platform is responsive and works in mobile browsers. For the best experience, use a supported browser and a stable connection. Some actions (e.g. large uploads or video) may work better on desktop.</p>`,
  },
  {
    name: 'Who do I contact for technical support?',
    description: `<p>Use <strong>Settings → Contact us</strong> to submit a request or see contact details. For login or access issues, contact your IT or identity team. For community or content issues, contact the community owner or moderators.</p>`,
  },
  {
    name: 'How is my data protected?',
    description: `<p>We follow our privacy policy and security standards. Data is encrypted in transit and at rest. Access is role-based and audited. For details on what we collect and how we use it, see <strong>Settings → Privacy</strong> and the main privacy policy.</p>`,
  },
  {
    name: 'How do I request a new community?',
    description: `<p>Community creation is controlled by admins. Submit a request via <strong>Contact us</strong> or your usual channel, including the purpose, suggested name and who should be the owner. An admin will review and set it up or suggest an existing community.</p>`,
  },
  {
    name: 'What are CPD and how do I log them?',
    description: `<p>CPD (Continuing Professional Development) activities can be tracked in the <strong>CPD</strong> section. Enrol in courses, record completed activities and view your progress. Requirements depend on your role and organisation; check with your manager or compliance team.</p>`,
  },
  {
    name: 'How do I cancel or reschedule a meeting?',
    description: `<p>If you’re the meeting owner, open the meeting and use <strong>Edit</strong> to change the time, link or details. Cancelled meetings can be marked as cancelled so attendees are notified. Attendees can update their RSVP from the meeting page.</p>`,
  },
  {
    name: 'Where do I find policies and terms?',
    description: `<p>Global terms and conditions are under <strong>Admin → Communities management</strong> (for admins) or linked from the footer. Community-specific rules and agreements appear when you join a community or in its About section.</p>`,
  },
];

export const faqApi = {
  async getAllFaq(): Promise<FaqDto> {
    const total = FAQ_ENTRIES.length;
    const now = 1735689600000; // 2025-01-01 for stable dates
    const faQs: FaqItem[] = FAQ_ENTRIES.map((entry, idx) => {
      const i = idx + 1;
      const created = new Date(now - i * 86400_000).toISOString();
      const updated = new Date(now - (i - 1) * 43200_000).toISOString();
      const authorId = `user-${((i - 1) % 20) + 1}`;
      return {
        id: `faq-${i}`,
        name: entry.name,
        description: entry.description,
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
