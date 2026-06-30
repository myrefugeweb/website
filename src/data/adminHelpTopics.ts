export type AdminRole = 'viewer' | 'editor' | 'admin' | 'super_admin';

export type HelpCategory =
  | 'getting-started'
  | 'visual-editor'
  | 'assets'
  | 'publishing'
  | 'events'
  | 'analytics'
  | 'users'
  | 'troubleshooting';

export interface OnboardingAction {
  type: 'click' | 'type' | 'navigate' | 'open-image-library' | 'open-image-library-on-next';
  selector?: string;
  value?: string;
  tab?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: OnboardingAction;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  role?: AdminRole[];
}

export interface HelpTopic {
  id: string;
  category: HelpCategory;
  title: string;
  summary: string;
  /** Plain-language explanation of purpose, outcome, and effect on the live site. */
  whatItDoes: string;
  audience: AdminRole[];
  screenshotTarget?: string;
  screenshotLabel?: string;
  /** When true, the Help Center loads an animated /help/screenshots/<id>.gif instead of a PNG. */
  animated?: boolean;
  steps: string[];
  tips?: string[];
  relatedTopicIds?: string[];
  onboarding?: Pick<OnboardingStep, 'target' | 'action' | 'position'>;
}

export const helpCategories: Array<{ id: HelpCategory; label: string; description: string }> = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    description: 'The basic mental model for editing safely inside the dashboard.',
  },
  {
    id: 'visual-editor',
    label: 'Visual Editor',
    description: 'How to edit text, images, and page sections without touching code.',
  },
  {
    id: 'assets',
    label: 'Image Library',
    description: 'How uploaded images are organized, selected, and kept clean.',
  },
  {
    id: 'publishing',
    label: 'Staging & Publishing',
    description: 'How drafts become visible to public website visitors.',
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Create, update, and remove calendar events.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Understand page views, visitors, devices, and browsers.',
  },
  {
    id: 'users',
    label: 'Users & Roles',
    description: 'Manage dashboard access for staff and volunteers.',
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    description: 'Common issues and what to check first.',
  },
];

export const helpTopics: HelpTopic[] = [
  {
    id: 'welcome',
    category: 'getting-started',
    title: 'Welcome to the Admin Dashboard',
    summary: 'A quick orientation for the dashboard and the safest way to make changes.',
    whatItDoes:
      'The dashboard is your control center for the public My Refuge website. From here you can edit page content, manage photos, publish changes to the live site, schedule events, review traffic, and (for admins) manage who has access. Nothing you change here is visible to visitors until you publish.',
    audience: ['viewer', 'editor', 'admin', 'super_admin'],
    screenshotTarget: '.admin-dashboard__main-tabs',
    screenshotLabel: 'Dashboard navigation tabs',
    steps: [
      'Use the top tabs to move between editing, events, analytics, and admin tools.',
      'Start in the Visual Editor when you need to change website content.',
      'Use the Help Center any time you need a task-based guide instead of the guided tour.',
    ],
    tips: [
      'Editors can change content, while viewers may only have read access.',
      'Admin-only tools are hidden when your role does not include that permission.',
    ],
    onboarding: {
      position: 'center',
    },
  },
  {
    id: 'visual-editor-intro',
    category: 'visual-editor',
    title: 'Visual Editor: your content hub',
    summary: 'The Visual Editor shows a live preview of the site so you can edit in context.',
    whatItDoes:
      'Shows a real-time preview of the website while you work. You can switch between the My Refuge homepage and Sparrows Closet, turn editing on or off, and see exactly how headings, photos, and section layouts will look—without editing code or guessing from a form.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.visual-editor__toolbar',
    screenshotLabel: 'Visual Editor toolbar',
    steps: [
      'Open the Visual Editor tab.',
      'Use the page switcher to move between My Refuge and Sparrows Closet.',
      'Turn Edit Mode on when you want clickable text, image, and layout controls.',
    ],
    onboarding: {
      target: '[data-onboarding="tab-visual-editor"]',
      position: 'bottom',
    },
  },
  {
    id: 'edit-mode-toggle',
    category: 'visual-editor',
    title: 'Turn edit mode on or off',
    summary: 'Edit Mode controls whether clicks edit content or behave like the public site.',
    whatItDoes:
      'When Editing is on, you can click text and images in the preview to change them. When Preview is on, the page behaves like the public site—useful for checking links and layout without accidentally opening an editor. Your saved drafts still show in the admin preview either way.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.visual-editor__toolbar-right',
    screenshotLabel: 'Editing controls in the toolbar',
    animated: true,
    steps: [
      'Click Edit Mode to enable editable controls.',
      'Hover over editable text and images to see what can be changed.',
      'Switch to Preview Mode when you want to review without editing controls.',
    ],
    tips: ['Preview Mode hides editor controls, but drafts can still be visible inside the admin preview.'],
    onboarding: {
      target: '[data-onboarding="edit-mode-toggle"]',
      position: 'left',
    },
  },
  {
    id: 'edit-text',
    category: 'visual-editor',
    title: 'Edit text content',
    summary: 'Update headings, descriptions, and other copy directly from the page preview.',
    whatItDoes:
      'Lets you change headlines, paragraphs, stat labels, and other written content in place. Edits are saved as drafts in the database and appear in the preview immediately, but visitors on my-refuge.org still see the old text until you publish.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.visual-editor__preview',
    screenshotLabel: 'Editable page preview',
    animated: true,
    steps: [
      'Turn Editing on.',
      'Click an editable heading or paragraph in the preview.',
      'Type your changes in the floating toolbar that appears next to the text.',
      'Press Save (or Ctrl/Cmd + Enter), then publish when the page looks right.',
    ],
    tips: ['Some hero titles allow simple HTML spans for brand emphasis.'],
    onboarding: {
      target: '.visual-editor__preview',
      position: 'top',
    },
  },
  {
    id: 'edit-image',
    category: 'assets',
    title: 'Replace an image',
    summary: 'Swap section images from the library while keeping changes staged.',
    whatItDoes:
      'Changes which photo appears in a section (hero, mission, story cards, etc.). The new image shows in your admin preview right away, but the live website keeps the previous image until you publish. You can pick an existing upload or add a new one from the library.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.visual-editor__preview img[data-section]',
    screenshotLabel: 'Editable section image',
    steps: [
      'Turn Edit Mode on.',
      'Click an editable image in the preview.',
      'Choose an existing image from the library or upload a new one.',
      'Save the selection, then publish when the page looks right.',
    ],
    tips: ['Use descriptive alt text so images make sense to screen-reader users.'],
    onboarding: {
      target: '.visual-editor__preview',
      position: 'top',
    },
  },
  {
    id: 'image-library-button',
    category: 'assets',
    title: 'Open the Image Library',
    summary: 'Browse all uploaded images and see where each image is used.',
    whatItDoes:
      'Opens a gallery of every image stored for the site. Each card shows whether an image is in use and which sections reference it, so you can upload new assets, reuse photos across sections, and avoid deleting something the live site still needs.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '[data-onboarding="image-library"]',
    screenshotLabel: 'Image Library button',
    steps: [
      'Click Image Library from the Visual Editor toolbar.',
      'Review uploaded assets, usage labels, and inactive images.',
      'Use cleanup tools when duplicates appear.',
    ],
    onboarding: {
      target: '[data-onboarding="image-library"]',
      action: {
        type: 'open-image-library-on-next',
        selector: '[data-onboarding="image-library"]',
      },
      position: 'left',
    },
  },
  {
    id: 'image-library-upload',
    category: 'assets',
    title: 'Upload a new image',
    summary: 'Add image assets to Supabase storage and make them available to sections.',
    whatItDoes:
      'Stores a new photo or graphic in the site’s image library so editors can assign it to sections. Uploaded files are not automatically placed on the public site—you still choose which section uses them and publish when ready.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.image-library__upload-label',
    screenshotLabel: 'Upload button in Image Library',
    steps: [
      'Open the Image Library.',
      'Click Upload New.',
      'Choose a JPG, PNG, WebP, or SVG image.',
      'Wait for the image to appear in the library grid.',
    ],
    tips: [
      'Prefer optimized WebP/JPG images under 500 KB for photos.',
      'Use SVG only for simple logos or icons, not exported photo collages.',
    ],
    onboarding: {
      target: '.image-library__upload-label',
      position: 'bottom',
    },
  },
  {
    id: 'image-library-cleanup',
    category: 'assets',
    title: 'Clean duplicate images',
    summary: 'Remove duplicate database rows when the same image was assigned multiple times.',
    whatItDoes:
      'Finds and removes extra database entries when the same image was accidentally assigned more than once. It does not delete files from cloud storage—it only tidies the library list so usage labels and section picks stay accurate.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.image-library__cleanup-button',
    screenshotLabel: 'Clean Duplicates button',
    steps: [
      'Open the Image Library.',
      'Click Clean Duplicates.',
      'Confirm the cleanup only after checking the library contents.',
    ],
    tips: ['This cleanup removes duplicate database records, not necessarily duplicate files in storage.'],
    onboarding: {
      target: '.image-library__cleanup-button',
      position: 'bottom',
    },
  },
  {
    id: 'image-library-grid',
    category: 'assets',
    title: 'Understand image usage',
    summary: 'Each image card shows whether it is active and which sections use it.',
    whatItDoes:
      'Helps you see at a glance which images are safe to change or remove. The “In use” tags list sections like hero, mission, or story—so you know whether deleting or replacing an image will affect the live site after you publish.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.image-library__grid',
    screenshotLabel: 'Image library grid',
    steps: [
      'Open the Image Library.',
      'Look for the “In use” label on each image card.',
      'Avoid deleting images that are actively used unless you are replacing them first.',
    ],
    onboarding: {
      target: '.image-library__grid',
      position: 'top',
    },
  },
  {
    id: 'change-layout',
    category: 'visual-editor',
    title: 'Change a section layout',
    summary: 'Switch between preset layouts for page sections that support layouts.',
    whatItDoes:
      'Rearranges how a section looks on the public site— for example side-by-side vs. featured image vs. centered spotlight. Each section that supports layouts offers a few on-brand presets; picking one updates the preview immediately and goes live only after you publish.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.visual-editor__preview',
    screenshotLabel: 'Section layout buttons in the live preview',
    animated: true,
    steps: [
      'Turn Edit Mode on.',
      'Click the Layout button near a section.',
      'Choose one of the available layout preview cards.',
      'Review the section and publish when ready.',
    ],
    tips: ['Supported sections include Hero, Mission, Story, Help, Impact, Contact, and Sparrows Closet.'],
    onboarding: {
      target: '.visual-editor__preview',
      position: 'top',
    },
  },
  {
    id: 'staging-mode',
    category: 'publishing',
    title: 'Staging vs published content',
    summary: 'Changes are saved as drafts until you publish them for public visitors.',
    whatItDoes:
      'Keeps your edits private until you are ready. Every text, image, and layout change is saved as a draft first. The toolbar shows how many unpublished changes you have and offers Publish to push them to the live website, or Discard to undo all drafts and restore what visitors currently see.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '[data-onboarding="publish-status"]',
    screenshotLabel: 'Unpublished changes and publish controls',
    steps: [
      'Make one or more edits in the Visual Editor.',
      'When drafts exist, the toolbar shows Discard and Publish with a count of pending changes.',
      'Review the preview carefully, then click Publish to update the live site.',
      'Use Discard if you want to throw away all unpublished edits and start over.',
    ],
    onboarding: {
      target: '.visual-editor__toolbar',
      position: 'bottom',
    },
  },
  {
    id: 'events-tab',
    category: 'events',
    title: 'Manage events',
    summary: 'Create events that appear in the public Upcoming Events section.',
    whatItDoes:
      'Controls what shows in the “Upcoming Events” area on the homepage. Events you add here with a future date appear to visitors automatically; past or deleted events drop off the public list. No publishing step is required for events—they go live when saved.',
    audience: ['admin', 'super_admin'],
    screenshotTarget: '.admin-dashboard__tab-content',
    screenshotLabel: 'Events management panel',
    steps: [
      'Open the Events tab.',
      'Add a new event with a title and date.',
      'Optionally include description, time, and location.',
      'Save the event and confirm it appears on the public page preview.',
    ],
    onboarding: {
      target: '[data-onboarding="tab-events"]',
      action: { type: 'navigate', tab: 'events' },
      position: 'bottom',
    },
  },
  {
    id: 'create-event',
    category: 'events',
    title: 'Create an event',
    summary: 'Fill out the event form with the details visitors need.',
    whatItDoes:
      'Adds a new calendar entry to the site. Once saved, it can appear in the public Upcoming Events section with the title, date, and any description, time, or location you provide—helping families know when and where to show up.',
    audience: ['admin', 'super_admin'],
    screenshotTarget: '.admin-dashboard__section-header',
    screenshotLabel: 'Add event controls',
    steps: [
      'Click Add New Event.',
      'Enter a short title and event date.',
      'Add practical details in the description, time, and location fields.',
      'Save the event.',
    ],
    onboarding: {
      target: '.admin-dashboard__section-header',
      position: 'bottom',
    },
  },
  {
    id: 'event-form',
    category: 'events',
    title: 'Event form fields',
    summary: 'Know which event fields are required and where each field appears.',
    whatItDoes:
      'Maps each form field to what visitors see. Title and date are required and drive how events are sorted and displayed; description, time, and location add detail on the public calendar. Filling these in clearly reduces “when is it?” and “where do I go?” questions.',
    audience: ['admin', 'super_admin'],
    screenshotTarget: '.admin-dashboard__form',
    screenshotLabel: 'Event form',
    steps: [
      'Use Title for the public event name.',
      'Use Date for ordering and display.',
      'Use Time and Location when visitors need logistics.',
      'Use Description for context, instructions, or contact information.',
    ],
    onboarding: {
      target: '.admin-dashboard__form',
      position: 'top',
    },
  },
  {
    id: 'analytics-tab',
    category: 'analytics',
    title: 'Read analytics',
    summary: 'Review traffic patterns and visitor devices from the Analytics tab.',
    whatItDoes:
      'Summarizes anonymous visit data collected from the public website: how many people viewed pages, how many were unique visitors, which pages were popular, and whether they used phones or desktops. Use it to see if outreach efforts are driving traffic and which content gets attention.',
    audience: ['admin', 'super_admin'],
    screenshotTarget: '.admin-dashboard__analytics-grid',
    screenshotLabel: 'Analytics overview cards',
    steps: [
      'Open the Analytics tab.',
      'Compare page views and unique visitors.',
      'Review device and browser breakdowns.',
      'Use the information to decide which content deserves updates.',
    ],
    onboarding: {
      target: '[data-onboarding="tab-analytics"]',
      action: { type: 'navigate', tab: 'analytics' },
      position: 'bottom',
    },
  },
  {
    id: 'admin-tab',
    category: 'users',
    title: 'Manage users and roles',
    summary: 'Control who can access dashboard areas and what they can change.',
    whatItDoes:
      'Lets super admins invite staff and assign roles. Editors can change site content; viewers can look but not edit; admins can manage events and users. The right role limits mistakes and keeps sensitive tools (like user management) in trusted hands only.',
    audience: ['super_admin'],
    screenshotTarget: '.admin-dashboard__section-header',
    screenshotLabel: 'User management header',
    steps: [
      'Open the Admin tab.',
      'Review users and current roles.',
      'Assign editor/admin roles based on actual responsibility.',
      'Keep super admin access limited to trusted maintainers.',
    ],
    onboarding: {
      target: '[data-onboarding="tab-admin"]',
      action: { type: 'navigate', tab: 'admin' },
      position: 'bottom',
    },
  },
  {
    id: 'troubleshooting-images',
    category: 'troubleshooting',
    title: 'Images are not showing',
    summary: 'A quick checklist for storage, RLS, and image assignment issues.',
    whatItDoes:
      'Walks through the most common reasons a photo looks fine in the editor but missing or broken on the public site—wrong section assignment, unpublished changes, inactive images, or server permission issues. Work through the list before contacting a developer.',
    audience: ['editor', 'admin', 'super_admin'],
    screenshotTarget: '.image-library__grid',
    screenshotLabel: 'Image troubleshooting checklist',
    steps: [
      'Confirm the image appears in the Image Library.',
      'Confirm the image is assigned to the intended section.',
      'Check whether the image is inactive or unpublished.',
      'If public visitors cannot see it, verify Supabase storage and RLS policies.',
    ],
    tips: ['The developer docs include RLS and storage fix scripts for deeper troubleshooting.'],
  },
  {
    id: 'complete',
    category: 'getting-started',
    title: 'You are ready to edit safely',
    summary: 'You know the core workflow: edit, review, publish.',
    whatItDoes:
      'You are set up to maintain the site without breaking the live pages. Remember the rhythm: edit in the Visual Editor, preview your changes, publish when satisfied, and return here anytime you need a refresher or are training someone new.',
    audience: ['viewer', 'editor', 'admin', 'super_admin'],
    screenshotTarget: '.admin-dashboard__header-actions',
    screenshotLabel: 'Help Center in the dashboard header',
    steps: [
      'Use the Help Center for task-specific guidance.',
      'Use the guided tour when training a new editor.',
      'Publish only after reviewing pending changes.',
    ],
    onboarding: {
      position: 'center',
    },
  },
];

const onboardingTopicIds = [
  'welcome',
  'visual-editor-intro',
  'edit-mode-toggle',
  'edit-text',
  'edit-image',
  'image-library-button',
  'image-library-cleanup',
  'image-library-upload',
  'image-library-grid',
  'change-layout',
  'staging-mode',
  'events-tab',
  'create-event',
  'event-form',
  'analytics-tab',
  'admin-tab',
  'complete',
];

export const getHelpTopicsForRole = (role: string) =>
  helpTopics.filter((topic) => topic.audience.includes(role as AdminRole) || topic.audience.includes('viewer'));

export const getOnboardingSteps = (role: string): OnboardingStep[] =>
  onboardingTopicIds
    .map((id) => helpTopics.find((topic) => topic.id === id))
    .filter((topic): topic is HelpTopic => Boolean(topic))
    .filter((topic) => topic.audience.includes(role as AdminRole) || topic.audience.includes('viewer'))
    .map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.summary,
      target: topic.onboarding?.target,
      action: topic.onboarding?.action,
      position: topic.onboarding?.position,
      role: topic.audience,
    }));
