import { Result } from 'antd';
import { Route, Routes } from 'react-router-dom';
import { Page } from 'src/components/common/page/page';
import { AuthProvider } from 'src/context/auth-context';
import { AdminCommunityMeetings } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings.tsx';
import { AdminCommunityMembershipRequirements } from '../admin-pages/admin-community/admin-community-membership-requirements/admin-community-membership-requirements';
import { AdminCommunityTermsConditions } from 'src/pages/admin-pages/admin-community/admin-community-terms-conditions/admin-community-terms-conditions.tsx';
import { AdminCommunityJoinQuestions } from '../admin-pages/admin-community/admin-community-join-questions/admin-community-join-questions';
import { BookmarkProvider } from 'src/pages/bookmark/bookmark.provider.tsx';
import { SavedCommunities } from 'src/pages/bookmark/tabs/communities/SavedCommunities.tsx';
import { SavedEvents } from 'src/pages/bookmark/tabs/events/SavedEvents.tsx';
import { SavedMeetings } from 'src/pages/bookmark/tabs/meetings/SavedMeetings.tsx';
import { SavedNews } from 'src/pages/bookmark/tabs/news/SavedNews.tsx';
import { SavedResources } from 'src/pages/bookmark/tabs/resources/SavedResources.tsx';
import { ExploreCommunityProvider } from 'src/pages/explore-community/explore-communities.provider.tsx';
import { ExploreMeetingsProvider } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';
import { ExploreMeetings } from 'src/pages/explore-meetings/explore-meetings.tsx';
import { AccountLayout } from '../account/account.layout';
import { MemberContentProvider } from '../member-content/members-content.provider';
import { MemberContent } from '../member-content/member-content';
import { MemberContentPage } from '../member-content/member-content-page';

// account
import { ForgotPasswordPage } from '../account/forgot-password/forgot-password.page';
import { ImpersonatePage } from '../account/impersonate/impersonate.page';
import { ResetPasswordPage } from '../account/reset-password/reset-password.page';
import { PasswordEntryPage } from '../account/sign-in/password-entry';
import { SignInPage } from '../account/sign-in/sign-in.page';

// admin pages
import { AdminAnnouncement } from '../admin-pages/admin-announcement/admin-announcement';
import { AdminCommunitiesList } from '../admin-pages/admin-communities-list/admin-communities-list';
import { AdminCommunitiesManagementAdministrators } from '../admin-pages/admin-communities-management-administrators/admin-communities-management-administrators';
import { AdminCommunitiesManagementCategories } from '../admin-pages/admin-communities-management-categories/admin-communities-management-categories';
import { AdminCommunitiesManagementTags } from '../admin-pages/admin-communities-management-tags/admin-communities-management-tags';
import { AdminCommunitiesManagement } from '../admin-pages/admin-communities-management/admin-communities-management';
import { AdminCommunityLayout } from '../admin-pages/admin-community/admin-community-about/admin-community-layout';
import { AdminCommunityAboutPage } from '../admin-pages/admin-community/admin-community-about/pages/admin-community-about-page';
import { AdminCommunityAssetsPage } from '../admin-pages/admin-community/admin-community-about/pages/admin-community-assets';
import { AdminCommunityApprovalPosts } from '../admin-pages/admin-community/admin-community-approval-posts/admin-community-approval-posts';
import { AdminCommunityArchivedPosts } from '../admin-pages/admin-community/admin-community-archived-posts/admin-community-archived-posts';
import { AdminCommunityCommentsReport } from '../admin-pages/admin-community/admin-community-comments-reports/admin-community-comments-reports';
import { AdminCommunityMembersBlackList } from '../admin-pages/admin-community/admin-community-members-black-list/admin-community-members-black-list';
import { AdminCommunityMembers } from '../admin-pages/admin-community/admin-community-members/admin-community-members';
import { AdminCommunityPosts } from '../admin-pages/admin-community/admin-community-posts/admin-community-posts';
import { AdminCommunityReportedPosts } from '../admin-pages/admin-community/admin-community-reported-posts/admin-community-reported-posts';
import { AdminCommunitySettings } from '../admin-pages/admin-community/admin-community-settings/admin-community-settings';
import { AdminCommunityProvider } from '../admin-pages/admin-community/admin-community.provider';
import { AdminEventsProvider } from '../admin-pages/admin-events-provider/admin-events-provider';
import { FaqPage } from '../admin-pages/admin-faq/admin.faq.page';
import { AdminPagesLayout } from '../admin-pages/admin-pages-layout';

// communities
import { CommunitiesHomeFeed } from '../community-pages/communities-home-feed/communities-home-feed';
import { CommunityProvider } from '../community-pages/communities.page.provider';
import { CommunityDetailsAbout } from '../community-pages/community-details/community-details-about/community-details-about';
import { CommunityDetailsMeetings } from '../community-pages/community-details/community-details-meetings/community-details-meetings';
import { CommunityDetailsMembers } from '../community-pages/community-details/community-details-members/community-details-members';
import { CommunityDetailsPosts } from '../community-pages/community-details/community-details-posts/community-details-posts';
import { CommunityDetailsResources } from '../community-pages/community-details/community-details-resources/community-details-resources';
import { CommunityDetailsProvider } from '../community-pages/community-details/community-details.provider';
import { CommunityMeetingDetails } from '../community-pages/community-meeting-details/community-meeting-details';
import { CommunityPostDetailsProvider } from '../community-pages/community-post-details/community-post-details.provider';
import { Faq } from '../community-pages/faq/faq';
import { SavedPosts } from '../community-pages/saved-posts/saved-posts';
import { CpdAllCoursesPage } from '../cpd/cpd.all-courses.page';
import { CpdEnrolledPage } from '../cpd/cpd.enrolled.page';
import { CpdPage } from '../cpd/cpd.page';
import { CpdPeriodsPage } from '../cpd/cpd.periods.page';
import { ErrorPage } from '../error-page/error-page';

// events pages
import { EventsConferencePage } from '../events-page/categories/events-conference/events-conference.page';
import { EventsCpdPage } from '../events-page/categories/events-cpd/events-cpd.page';
import { EventsMeetingPage } from '../events-page/categories/events-meeting/events-meeting.page';
import { EventsWebinarPage } from '../events-page/categories/events-webinar/events-webinar.page';
import { EventsHomePage } from '../events-page/events-home/events-home.page';
import { EventsProvider } from '../events-page/events.page.provider';
import { SingleEventPage } from '../events-page/single-event/single-event.page';
import { EventsAttendingPage } from '../events-page/your-events/attending/events-attending.page';
import { EventsPastEventsPage } from '../events-page/your-events/past-events/past-events.page';
import { EventsYourInvitesPage } from '../events-page/your-events/your-invites/your-invites.page';
import { EventsYourPreferencesPage } from '../events-page/your-events/your-preferences/your-preferences.page';
import { ExploreCommunities } from '../explore-community/explore-communities';
import { EventsPage } from '../events-page/events-page';
import { EventsDiscoverWrapperPage } from '../events-page/events-discover/events-discover-wrapper.page';
import { EventsDiscoverPageContent } from '../events-page/events-discover/events-discover.page';
import { EventsMainPage } from '../events-page/categories/events-main/events-main.page';

// home
import { HomePageNew } from 'src/pages/home-page/home-page-new.tsx';
import { NewsCardList } from '../news-and-resources/news-card-list';
import { NewsDetailsProvider } from '../news-and-resources/providers/news-details.provider';
import { NewsProvider } from '../news-and-resources/providers/news.provider';
import { ResourceDetailsProvider } from '../news-and-resources/providers/resources-details.provider';
import { ResourcesProvider } from '../news-and-resources/providers/resources.provider';
import { ResourcesCardList } from '../news-and-resources/resources-card-list';
import { SettingsAccountDetailsProvider } from '../settings/account-details/account-section.provider';

// settings pages
import { ChangePasswordPage } from '../settings/change-password/change-password.page';
import { CommunicationPreferencesList } from '../settings/communication-preferences/communication-preferences-list.page';
import { CommunicationPreferencesProvider } from '../settings/communication-preferences/communication-preferences.provider';
import { UserCommunicationPreferences } from '../settings/communication-preferences/user-communication-preferences.page';
import { ContactUsPage } from '../settings/contact-us/contact-us.page';
import { SettingsDietaryPage } from '../settings/dietary-page/dietary-page';
import { AreaOfInterests } from '../settings/interests/area-of-interests/area-of-interests';
import { InterestsProvider } from '../settings/interests/interests.provider';
import { UserInterests } from '../settings/interests/user-interests/user-interests';
import { InvoicePage } from '../settings/invoices/invoice.page';
import { InvoicesProvider } from '../settings/invoices/invoices.provider';
import { MembershipProfilePage } from '../settings/membership-profile/membership-profile';
import { PrivacyPage } from '../settings/privacy/privacy.page';
import { SettingsPage } from '../settings/settings.page';
import { SettingsWorkplaceDetailsPage } from '../settings/workplace-detals/workplace-detail.section';
import { AuthorizationLayout } from './authorization.layout';

import { AdminGlobalTermsConditions } from 'src/pages/admin-pages/admin-global-terms-conditions/admin-global-terms-conditions.tsx';
import { AdminCommunityRemovedMembers } from '../admin-pages/admin-community/admin-community-removed-members/admin-community-removed-members';
import { LayoutWithHeader } from './layout-with-header';
import { BuyNowPage } from '../buy-now/buy-now-page';

export const PageRoutes = () => {
  return (
    <Routes>
      <Route path={pagesMap.account} element={<AccountLayout />}>
        <Route
          path={pagesMap.signIn}
          element={
            <AuthProvider>
              <SignInPage />
            </AuthProvider>
          }
        />
        <Route
          path={pagesMap.passwordEntry}
          element={
            <AuthProvider>
              <PasswordEntryPage />
            </AuthProvider>
          }
        />
        <Route
          path={pagesMap.accountImpersonate}
          element={<ImpersonatePage />}
        />
        {/* <Route path={pagesMap.signIn} element={<SignInPage />} /> */}
        <Route
          path={pagesMap.forgotPassword}
          element={<ForgotPasswordPage />}
        />
        <Route path={pagesMap.resetPassword} element={<ResetPasswordPage />} />
      </Route>

      <Route path={pagesMap.home} element={<AuthorizationLayout />}>
        <Route path={pagesMap.home} element={<LayoutWithHeader />}>
          <Route path={pagesMap.home} index element={<HomePageNew />} />
          {/* COMMUNITIES */}
          <Route path={pagesMap.communities} element={<CommunityProvider />}>
            <Route
              index
              // path={pagesMap.communitiesHomeFeed}
              element={<CommunitiesHomeFeed />}
            />
            <Route
              path={pagesMap.communityDetails}
              element={<CommunityDetailsProvider />}
            >
              <Route index element={<CommunityDetailsAbout />} />
              <Route
                path={pagesMap.communityDetailsPosts}
                element={<CommunityDetailsPosts />}
              />
              <Route
                path={pagesMap.communityDetailsKeyMembers}
                element={<CommunityDetailsMembers />}
              />
              <Route
                path={pagesMap.communityDetailsResources}
                element={<CommunityDetailsResources />}
              />
              <Route
                path={pagesMap.communityDetailsMeetings}
                element={<CommunityDetailsMeetings />}
              />
              <Route
                path={pagesMap.communityMeetingDetails}
                element={<CommunityMeetingDetails />}
              />
            </Route>
            <Route
              path={pagesMap.communitySavedPosts}
              element={<SavedPosts />}
            />
            <Route
              path={pagesMap.communityPostDetails}
              element={<CommunityPostDetailsProvider />}
            />
            <Route path={pagesMap.communitiesFaq} element={<Faq />} />
          </Route>
          <Route
            path={pagesMap.exploreCommunities}
            element={<ExploreCommunityProvider />}
          >
            <Route index element={<ExploreCommunities />} />
          </Route>
          <Route
            path={pagesMap.exploreMeetings}
            element={<ExploreMeetingsProvider />}
          >
            <Route index element={<ExploreMeetings />} />
          </Route>

          {/* EVENTS */}
          <Route element={<EventsProvider />}>
            <Route path={pagesMap.events} element={<EventsPage />}>
              <Route index element={<EventsHomePage />} />
              <Route
                path={pagesMap.singleEvent}
                element={<SingleEventPage />}
              />
              <Route
                path={pagesMap.eventsAttending}
                element={<EventsAttendingPage />}
              />
              <Route
                path={pagesMap.eventsPastEvents}
                element={<EventsPastEventsPage />}
              />
              <Route
                path={pagesMap.eventsMyInvites}
                element={<EventsYourInvitesPage />}
              />
              <Route
                path={pagesMap.eventsYourPreferences}
                element={<EventsYourPreferencesPage />}
              />

              <Route
                path={pagesMap.eventsWebinar}
                element={<EventsWebinarPage />}
              />
              <Route
                path={pagesMap.eventsConference}
                element={<EventsConferencePage />}
              />
              <Route
                path={pagesMap.eventsGeneral}
                element={<EventsMainPage />}
              />
              <Route path={pagesMap.eventsCpd} element={<EventsCpdPage />} />
              <Route
                path={pagesMap.eventsMeeting}
                element={<EventsMeetingPage />}
              />
            </Route>

            {/* Discover events */}
            <Route
              path={pagesMap.eventsDiscover}
              element={<EventsDiscoverWrapperPage />}
            >
              <Route index element={<EventsDiscoverPageContent />} />
            </Route>
          </Route>

          {/* NEWS AND RESOURCES */}
          <Route path={pagesMap.news} element={<NewsProvider />}>
            <Route path={pagesMap.newsCategory} element={<NewsCardList />} />
          </Route>
          <Route path={pagesMap.resources} element={<ResourcesProvider />}>
            <Route
              path={pagesMap.resourcesCategory}
              element={<ResourcesCardList />}
            />
          </Route>
          <Route
            path={pagesMap.newsDetails}
            element={<NewsDetailsProvider />}
          />
          <Route
            path={pagesMap.resourceDetails}
            element={<ResourceDetailsProvider />}
          />

          {/*MEMBER CONTENT*/}
          <Route
            path={pagesMap.memberContent}
            element={<MemberContentProvider />}
          >
            <Route index element={<MemberContent />} />
            <Route
              path={pagesMap.memberContentPage}
              element={<MemberContentPage />}
            />
          </Route>
          <Route path={pagesMap.error} element={<ErrorPage />} />

          {/* SETTINGS */}
          <Route path={pagesMap.settingsPage} element={<SettingsPage />}>
            <Route
              path={pagesMap.accountDetailsPage}
              element={<SettingsAccountDetailsProvider />}
            />
            <Route
              path={pagesMap.organisationDetailsPage}
              element={<SettingsWorkplaceDetailsPage />}
            />
            <Route
              path={pagesMap.dietaryPage}
              element={<SettingsDietaryPage />}
            />
            <Route
              path={pagesMap.changePasswordPage}
              element={<ChangePasswordPage />}
            />
            <Route
              path={pagesMap.membershipProfilePage}
              element={<MembershipProfilePage />}
            />
            <Route path={pagesMap.contactUs} element={<ContactUsPage />} />
            <Route
              path={pagesMap.invoicesTable}
              element={<InvoicesProvider />}
            />
            <Route
              path={pagesMap.singleInvoicePage}
              element={<InvoicePage />}
            />
            <Route path={pagesMap.privacy} element={<PrivacyPage />} />
            <Route
              path={pagesMap.communicationPreferences}
              element={
                <CommunicationPreferencesProvider>
                  <CommunicationPreferencesList />
                </CommunicationPreferencesProvider>
              }
            />
            <Route
              path={pagesMap.userCommunicationPreferences}
              element={
                <CommunicationPreferencesProvider>
                  <UserCommunicationPreferences />
                </CommunicationPreferencesProvider>
              }
            />
            <Route
              path={pagesMap.userInterests}
              element={
                <InterestsProvider>
                  <UserInterests />
                </InterestsProvider>
              }
            />
            <Route
              path={pagesMap.areaOfInterests}
              element={
                <InterestsProvider>
                  <AreaOfInterests />
                </InterestsProvider>
              }
            />
          </Route>

          {/* CPD */}
          <Route path={pagesMap.cpdPage} element={<CpdPage />}>
            <Route
              path={pagesMap.cpdEnrolledPage}
              element={<CpdEnrolledPage />}
            />
            <Route
              path={pagesMap.cpdAllCourses}
              element={<CpdAllCoursesPage />}
            />
            <Route
              path={pagesMap.cpdTrackerPage}
              element={<CpdPeriodsPage />}
            />
          </Route>

          {/* YOUR LIBRARY */}
          <Route path={pagesMap.myFavourites} element={<BookmarkProvider />}>
            <Route
              path={pagesMap.myFavouritesResources}
              element={<SavedResources />}
            />
            <Route path={pagesMap.myFavouritesNews} element={<SavedNews />} />
            <Route
              path={pagesMap.myFavouritesMeetings}
              element={<SavedMeetings />}
            />
            <Route
              path={pagesMap.myFavouritesEvents}
              element={<SavedEvents />}
            />
            <Route
              path={pagesMap.myFavouritesCommunityPosts}
              element={<SavedPosts titleWithCount />}
            />
            <Route
              path={pagesMap.myFavouritesCommunities}
              element={<SavedCommunities />}
            />
          </Route>
        </Route>
        {/* ADMIN */}
        <Route path={pagesMap.adminPage} element={<AdminPagesLayout />}>
          <Route path={pagesMap.adminResources} element={<PlugToRemove />} />
          <Route path={pagesMap.adminPageUsers} element={<PlugToRemove />} />
          <Route path={pagesMap.announcement} element={<AdminAnnouncement />} />
          <Route
            path={pagesMap.adminPageEvents}
            element={<AdminEventsProvider />}
          />
          <Route
            path={pagesMap.adminPageCommunitiesManagement}
            element={<AdminCommunitiesManagement />}
          >
            <Route index element={<AdminCommunitiesList />} />
            <Route
              path={pagesMap.adminPageCommunitiesManagementCategories}
              element={<AdminCommunitiesManagementCategories />}
            />
            <Route
              path={pagesMap.adminPageCommunitiesManagementTags}
              element={<AdminCommunitiesManagementTags />}
            />
            <Route
              path={pagesMap.adminPageCommunitiesManagementAdministrators}
              element={<AdminCommunitiesManagementAdministrators />}
            />
            <Route
              path={pagesMap.adminPageCommunitiesManagementFAQ}
              element={<FaqPage />}
            />
            <Route
              path={pagesMap.adminGlobalTermsConditionsPage}
              element={<AdminGlobalTermsConditions />}
            />
          </Route>
          <Route path={pagesMap.adminPageSettings} element={<PlugToRemove />} />
        </Route>

        <Route path={pagesMap.buyNow} element={<BuyNowPage />}></Route>

        <Route element={<AdminCommunityProvider />}>
          <Route
            path={pagesMap.adminCommunityAboutLayout}
            element={<AdminCommunityLayout />}
          >
            <Route
              path={pagesMap.adminCommunityAboutPage}
              element={<AdminCommunityAboutPage />}
            />
          </Route>
          <Route
            path={pagesMap.adminCommunityPostsPage}
            element={<AdminCommunityPosts />}
          />
          <Route
            path={pagesMap.adminCommunityPendingPostsPage}
            element={<AdminCommunityApprovalPosts />}
          />
          <Route
            path={pagesMap.adminCommunityReportedPostsPage}
            element={<AdminCommunityReportedPosts />}
          />
          <Route
            path={pagesMap.adminCommunityReportedCommentsPage}
            element={<AdminCommunityCommentsReport />}
          />
          <Route
            path={pagesMap.adminCommunityArchivePage}
            element={<AdminCommunityArchivedPosts />}
          />
          <Route
            path={pagesMap.adminCommunityAssetsPage}
            element={<AdminCommunityAssetsPage />}
          />
          <Route
            path={pagesMap.adminCommunityMembersPage}
            element={<AdminCommunityMembers />}
          />
          <Route
            path={pagesMap.adminCommunityBannedMembersListPage}
            element={<AdminCommunityMembersBlackList />}
          />
          <Route
            path={pagesMap.adminCommunityDeletedMembersListPage}
            element={<AdminCommunityRemovedMembers />}
          />
          <Route
            path={pagesMap.adminCommunityMeetingsPage}
            element={<AdminCommunityMeetings />}
          />
          <Route
            path={pagesMap.adminCommunitySettingsPage}
            element={<AdminCommunitySettings />}
          />
          <Route
            path={pagesMap.adminCommunityMembershipRequirements}
            element={<AdminCommunityMembershipRequirements />}
          >
            <Route index element={<AdminCommunityTermsConditions />} />
            <Route
              path={pagesMap.adminCommunityJoinQuestions}
              element={<AdminCommunityJoinQuestions />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export const pagesMap = {
  account: '/account',
  passwordEntry: 'enter-password',
  accountImpersonate: '/account/impersonate',
  signIn: '/account/sign-in',
  forgotPassword: '/account/forgot-password',
  resetPassword: '/account/reset-password',
  home: '/',
  marketPlace: '/marketplace',
  news: '/news',
  newsCategory: '/news/:categoryId',
  newsDetails: '/news/details/:id',
  resources: '/resources',
  resourcesCategory: '/resources/:categoryId',
  resourceDetails: '/resources/details/:id',
  memberContent: '/pages',
  memberContentPage: '/pages/:id',

  // My Favourites
  myFavourites: '/favourites',
  myFavouritesResources: '/favourites/resources',
  myFavouritesNews: '/favourites/news',
  myFavouritesMeetings: '/favourites/meetings',
  myFavouritesEvents: '/favourites/events',
  myFavouritesCommunityPosts: '/favourites/community-posts',
  myFavouritesCommunities: '/favourites/communities',

  // COMMUNITIES
  communities: '/communities',
  communityDetails: '/communities/:alias',
  communityDetailsPosts: '/communities/:alias/posts',
  communityPostDetails: '/communities/:alias/posts/:id',
  communityDetailsKeyMembers: '/communities/:alias/members',
  communityDetailsResources: '/communities/:alias/resources',
  communityDetailsMeetings: '/communities/:alias/meetings',
  communityMeetingDetails: '/communities/:alias/meetings/:id',
  // communitiesHomeFeed: '/communities/home',
  exploreCommunities: '/communities/explore',
  exploreMeetings: '/meetings/explore',
  communitySavedPosts: '/communities/saved-posts',
  communitiesFaq: '/communities/faq',
  error: '*',

  // EVENTS
  events: '/events',
  singleEvent: '/events/:id',
  eventsDiscover: '/events/discover/:filterType',

  // EVENTS - your events
  eventsAttending: '/events/attending',
  eventsPastEvents: '/events/past-events',
  eventsMyInvites: '/events/my-invites',
  eventsYourPreferences: '/events/your-preferences',
  // EVENTS - categories
  eventsWebinar: '/events/webinar',
  eventsConference: '/events/conference',
  eventsCpd: '/events/cpd',
  eventsGeneral: '/events/general',
  eventsMeeting: '/events/meeting',

  // ADMIN
  adminPage: '/admin',
  adminResources: '/admin/resources',
  adminPageUsers: '/admin/users',
  adminPageEvents: '/admin/events',
  adminPageCommunitiesManagement: '/admin/communities-management',
  adminPageCommunitiesManagementCategories:
    '/admin/communities-management/categories',
  adminPageCommunitiesManagementTags: '/admin/communities-management/tags',
  adminPageCommunitiesManagementAdministrators:
    '/admin/communities-management/administrators',
  adminPageCommunitiesManagementFAQ: '/admin/communities-management/faq',
  // adminCommunityMembershipRequirements:
  //   '/admin/communities-management/global/membership-requirements',
  adminGlobalTermsConditionsPage:
    '/admin/communities-management/global/terms-conditions',
  adminPageSettings: '/admin/settings',
  adminCommunityAboutLayout: '/admin/community/:id',
  adminCommunityAboutPage: '/admin/community/:id/about',
  adminCommunityAssetsPage: '/admin/community/:id/assets',
  adminCommunityPostsPage: '/admin/community/:id/posts',
  adminCommunityPendingPostsPage: '/admin/community/:id/pending-posts',
  adminCommunityReportedPostsPage: '/admin/community/:id/reported-posts',
  adminCommunityReportedCommentsPage: '/admin/community/:id/reported-comments',
  adminCommunityArchivePage: '/admin/community/:id/archive',
  adminCommunityMembersPage: '/admin/community/:id/members',
  adminCommunityBannedMembersListPage: '/admin/community/:id/banned-members',
  adminCommunityDeletedMembersListPage: '/admin/community/:id/deleted-members',
  adminCommunityMeetingsPage: '/admin/community/:id/meetings',
  adminCommunitySettingsPage: '/admin/community/:id/settings',
  // adminCommunityTermsConditionsPage: '/admin/community/:id/terms-conditions',
  adminCommunityMembershipRequirements:
    '/admin/community/:id/membership-requirements',
  adminCommunityJoinQuestions:
    '/admin/community/:id/membership-requirements/join-questions',
  announcement: '/admin/announcement',

  // SETTINGS
  settingsPage: '/settings',
  changePasswordPage: '/settings/change-password',
  accountDetailsPage: '/settings/account-details',
  organisationDetailsPage: '/settings/organisation-details',
  dietaryPage: '/settings/dietary-and-special-requirements',
  membershipProfilePage: '/settings/membership-profile',
  // communicationPreferences: '/settings/communication-preferences',
  contactUs: '/settings/contact-us',
  invoicesTable: '/settings/invoices',
  singleInvoicePage: '/settings/invoice/:id',
  privacy: '/settings/privacy',
  userInterests: '/settings/user-interests',
  areaOfInterests: '/settings/area-of-interests',
  userCommunicationPreferences: '/settings/user-communication-preferences',
  communicationPreferences: '/settings/communication-preferences',

  // CPD
  cpdPage: '/cpd',
  cpdTrackerPage: '/cpd/tracker-page',
  cpdEnrolledPage: '/cpd/enrolled-page',
  cpdAllCourses: '/cpd/all-courses',

  // Cart
  buyNow: '/buy-now',
};

const PlugToRemove = () => {
  return (
    <Page.Content style={{ width: 1064, minHeight: 500, margin: '0 auto' }}>
      <Result
        status="500"
        title="Oops!"
        subTitle="Sorry, page is under construction!"
      />
    </Page.Content>
  );
};
