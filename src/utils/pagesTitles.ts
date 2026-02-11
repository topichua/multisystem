export const pagesTitles: Array<{ route: string; title: string }> = [
  { route: '/account', title: 'Account' },
  { route: 'enter-password', title: 'Password Entry' },
  { route: '/account/impersonate', title: 'Account Impersonate' },
  { route: '/account/sign-in', title: 'Sign In' },
  { route: '/account/forgot-password', title: 'Forgot Password' },
  { route: '/account/reset-password', title: 'Reset Password' },
  { route: '/', title: 'Home' },
  { route: '/marketplace', title: 'Marketplace' },
  { route: '/news', title: 'News' },
  { route: '/news/:categoryId', title: 'News Category' },
  { route: '/news/details/:id', title: 'News Details' },
  { route: '/resources', title: 'Resources' },
  { route: '/resources/:categoryId', title: 'Resources Category' },
  { route: '/resources/details/:id', title: 'Resource Details' },
  { route: '/pages', title: 'Member Content' },
  { route: '/pages/:id', title: 'Member Content Page' },
  { route: '/favourites', title: 'My Favourites' },
  { route: '/favourites/resources', title: 'My Favourites Resources' },
  { route: '/favourites/news', title: 'My Favourites News' },
  { route: '/favourites/meetings', title: 'My Favourites Meetings' },
  { route: '/favourites/events', title: 'My Favourites Events' },
  {
    route: '/favourites/community-posts',
    title: 'My Favourites Community Posts',
  },
  { route: '/favourites/communities', title: 'My Favourites Communities' },
  { route: '/communities', title: 'Communities' },
  { route: '/communities/:alias', title: 'Community Details' },
  { route: '/communities/:alias/posts', title: 'Community Details Posts' },
  { route: '/communities/:alias/posts/:id', title: 'Community Post Details' },
  {
    route: '/communities/:alias/members',
    title: 'Community Details Key Members',
  },
  {
    route: '/communities/:alias/resources',
    title: 'Community Details Resources',
  },
  {
    route: '/communities/:alias/meetings',
    title: 'Community Details Meetings',
  },
  {
    route: '/communities/:alias/meetings/:id',
    title: 'Community Meeting Details',
  },
  { route: '/meetings/explore', title: 'Explore Meetings' },
  { route: '/communities/saved-posts', title: 'Community Saved Posts' },
  { route: '/communities/faq', title: 'Communities FAQ' },
  { route: '*', title: 'Error' },
  { route: '/events', title: 'Events' },
  { route: '/events/:id', title: 'Single Event' },
  { route: '/events', title: 'Events Home' },
  { route: '/events/attending', title: 'Events Attending' },
  { route: '/events/past-events', title: 'Events Past Events' },
  { route: '/events/your-invites', title: 'Events Your Invites' },
  { route: '/events/your-preferences', title: 'Events Your Preferences' },
  { route: '/events/webinar', title: 'Events Webinar' },
  { route: '/events/conference', title: 'Events Conference' },
  { route: '/events/cpd', title: 'Events CPD' },
  { route: '/events/main', title: 'Events Main' },
  { route: '/events/meeting', title: 'Events Meeting' },
  { route: '/admin', title: 'Admin Page' },
  { route: '/admin/resources', title: 'Admin Resources' },
  { route: '/admin/users', title: 'Admin Page Users' },
  { route: '/admin/events', title: 'Admin Page Events' },
  {
    route: '/admin/communities-management',
    title: 'Admin Page Communities Management',
  },
  {
    route: '/admin/communities-management/categories',
    title: 'Admin Page Communities Management Categories',
  },
  {
    route: '/admin/communities-management/tags',
    title: 'Admin Page Communities Management Tags',
  },
  {
    route: '/admin/communities-management/administrators',
    title: 'Admin Page Communities Management Administrators',
  },
  {
    route: '/admin/communities-management/faq',
    title: 'Admin Page Communities Management FAQ',
  },
  {
    route: '/admin/communities-management/global/terms-conditions',
    title: 'Admin Global Terms Conditions Page',
  },
  { route: '/admin/settings', title: 'Admin Page Settings' },
  { route: '/admin/community/:id', title: 'Admin Community About Layout' },
  { route: '/admin/community/:id/about', title: 'Admin Community About Page' },
  {
    route: '/admin/community/:id/assets',
    title: 'Admin Community Assets Page',
  },
  { route: '/admin/community/:id/posts', title: 'Admin Community Posts Page' },
  {
    route: '/admin/community/:id/pending-posts',
    title: 'Admin Community Pending Posts Page',
  },
  {
    route: '/admin/community/:id/reported-posts',
    title: 'Admin Community Reported Posts Page',
  },
  {
    route: '/admin/community/:id/reported-comments',
    title: 'Admin Community Reported Comments Page',
  },
  {
    route: '/admin/community/:id/archive',
    title: 'Admin Community Archive Page',
  },
  {
    route: '/admin/community/:id/members',
    title: 'Admin Community Members Page',
  },
  {
    route: '/admin/community/:id/banned-members',
    title: 'Admin Community Banned Members List Page',
  },
  {
    route: '/admin/community/:id/deleted-members',
    title: 'Admin Community Deleted Members List Page',
  },
  {
    route: '/admin/community/:id/meetings',
    title: 'Admin Community Meetings Page',
  },
  {
    route: '/admin/community/:id/settings',
    title: 'Admin Community Settings Page',
  },
  {
    route: '/admin/community/:id/terms-conditions',
    title: 'Admin Community Terms Conditions Page',
  },
  { route: '/admin/announcement', title: 'Announcement' },
  { route: '/settings', title: 'Settings Page' },
  { route: '/settings/change-password', title: 'Change Password Page' },
  { route: '/settings/account-details', title: 'Account Details Page' },
  { route: '/settings/workplace-details', title: 'Organisation Details Page' },
  {
    route: '/settings/dietary-and-special-requirements',
    title: 'Dietary & special requirements',
  },
  { route: '/settings/membership-profile', title: 'Membership Profile Page' },
  { route: '/settings/contact-us', title: 'Contact Us' },
  { route: '/settings/invoices', title: 'Invoices Table' },
  { route: '/settings/invoice/:id', title: 'Single Invoice Page' },
  { route: '/settings/privacy', title: 'Privacy' },
  { route: '/settings/user-interests', title: 'My Areas of Interest' },
  { route: '/settings/area-of-interests', title: 'Practice Areas of Interest' },
  {
    route: '/settings/user-communication-preferences',
    title: 'My communication preferences',
  },
  {
    route: '/settings/communication-preferences',
    title: 'All communication preferences',
  },
  { route: '/cpd', title: 'CPD Page' },
  { route: '/cpd/tracker-page', title: 'CPD Tracker Page' },
  { route: '/cpd/enrolled-page', title: 'CPD Enrolled Page' },
  { route: '/cpd/all-courses', title: 'CPD All Courses' },
];

export const getPageTitleByPath = (path: string): string | null => {
  const matchRoute = (route: string, path: string): boolean => {
    const routeParts = route.split('/');
    const pathParts = path.split('/');
    if (routeParts.length !== pathParts.length) return false;

    return routeParts.every(
      (part, index) => part.startsWith(':') || part === pathParts[index]
    );
  };

  const foundPage = pagesTitles.find((page) => matchRoute(page.route, path));

  return foundPage ? foundPage.title : null;
};
