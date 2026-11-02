export const formCopy = {
  stepLabels: ['Service', 'Vehicle', 'Your details', 'Message'],
  stepStatus: (step, total) => `Step ${step} of ${total}`,
  next: 'Next',
  back: 'Back',
  title: 'Tell us about your vehicle.',
  description: 'Share your vehicle details and choose the service you need.',
  emailFallbackTitle: 'Online requests are not available yet',
  emailFallbackDescription: 'Please call or email us to request service.',
  labels: {
    fullName: 'Full name',
    phone: 'Phone',
    email: 'Email address',
    serviceId: 'Service needed',
    requestType: 'Type of request',
    vehicle: 'Vehicle year, make, and model',
    location: 'Service address or ZIP code',
    preferredDate: 'Preferred date (optional)',
    message: 'Anything else we should know? (optional)',
    website: 'Website',
  },
  selectService: 'Select a service',
  notAvailable: 'Not available as of now',
  vehicleHint: 'For example: 2022 Toyota Camry',
  locationHint: 'For mobile service within 40 miles of New Orleans',
  dateHint:
    'Requested date only. Times are confirmed by the team in Central Time.',
  required: 'Fields marked * are required.',
  submit: 'Send service request',
  submitting: 'Sending your request…',
  privacy:
    'Your details are used to respond to this inquiry. Please call if you would prefer to discuss your request by phone.',
  successTitle: 'Your request was accepted.',
  success:
    'Our team will contact you to confirm details. Your appointment is not yet confirmed.',
  copySent: (email) => `We also emailed a copy of your request to ${email}.`,
  retry: 'Start another request',
  error:
    'We could not send your request. Your details are still here. Please try again or call our team.',
  validationSummary: 'Please check the highlighted fields.',
  privacyLabel: 'Privacy Policy',
  dateError: 'Choose today or a future date.',
};
export const mapCopy = {
  title: 'Based in New Orleans.',
  loading: 'Loading location map…',
  unavailable: 'Our service area',
  fallback:
    'Call us if you need help confirming your service location.',
  error:
    'The interactive map is unavailable. Call us to confirm your service location.',
  attribution: '\u00a9 CARTO \u00b7 \u00a9 OpenStreetMap contributors',
};
export const transformationCopy = {
  title: 'A clearer view of the difference.',
  description:
    'The same vehicle, before and after our work. Real projects from the Total Mobile Install team.',
  before: 'Before',
  after: 'After',
  next: 'Next transformation',
  previous: 'Previous transformation',
  nextLabel: 'Next result',
  previousLabel: 'Previous result',
  navigationHint:
    'Use the buttons to explore our before-and-after transformations.',
  viewGallery: 'See more transformations',
  angleNote:
    'Photographs show the same vehicle at different stages. Camera positions may vary.',
};
export const ctaCopy = {
  title: 'Your next clear view starts here.',
  description:
    'Request mobile service at your home or workplace. We’ll help you choose the right option for your vehicle.',
  action: 'Book Mobile Service',
  call: 'Call 1-504-207-7742',
};
