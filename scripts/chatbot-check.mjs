import assert from 'node:assert/strict';
import {
  chatbotSuggestions,
  getChatbotReply,
} from '../src/integrations/chatbotKnowledge.js';

const cases = [
  [
    'Will my insurance cover windshield replacement?',
    'Coverage depends on your policy',
  ],
  ['How long does windshield replacement take?', '45 to 90 minutes'],
  [
    'How fast can a mobile technician arrive?',
    'confirm the next available time',
  ],
  ['What tint percentage is legal in Louisiana?', 'visible-light transmission'],
  ['Do you perform ADAS calibration?', 'OEM targets'],
  ['Can you come to my office?', '40-mile radius'],
  ['Where is the shop?', '2642 Tulane Ave'],
  ['Do you do side window glass?', 'door, quarter, and rear window glass'],
  ['Can you do paint correction at my house?', 'shop-only'],
  ['Do you work on Bentleys?', 'range of makes and models'],
  ['Can you help me check booking status?', 'can’t look up, change, or cancel'],
  ['What service do you offer?', 'We offer 6 services'],
  ['Do you offer mobile services?', '40 miles'],
  ['Do you serve New Orleans?', 'Greater New Orleans'],
  ['Where is a shop near me?', '2642 Tulane Ave'],
  ['Are you open now?', 'Monday to Friday'],
  [
    'How soon is your next available appointment?',
    'confirm the next available time',
  ],
  [
    'I need a cracked windshield repaired',
    'repair is suitable for your vehicle',
  ],
  ['What is your phone number?', '1-504-207-7742'],
  ['Do you service ZIP code 70119?', '40-mile radius'],
  ['Which services can be mobile?', 'Window tinting is shop-only'],
  ['Can you tint my windows at home?', 'not as a mobile service'],
  ['What kind of windshield glass do you use?', 'OEM-equivalent glass'],
  ['What brand of tint film do you use?', 'product-brand'],
  ['How long does ceramic coating take?', 'confirmed service duration'],
  ['What information do you need to book?', 'vehicle year/make/model'],
  ['Do you accept walk-ins?', 'confirmed walk-in availability'],
  [
    'Can I send photos of the damage?',
    'cannot review or assess customer photos',
  ],
  ['What does the project map pin show?', 'not customer addresses'],
  ['Are you a bot?', 'automated website assistant'],
  [
    'What is your privacy policy?',
    'final Privacy Policy has not been provided yet',
  ],
  ['Are you open on holidays?', 'Sunday and holiday hours'],
  ['Do you work on a Ford?', 'range of makes and models'],
  ['How soon after replacement can I drive?', 'safe drive-away window'],
  ['Can you do mobile car detailing?', 'interior steam and shampoo'],
  [
    'Can you tell from a picture if it needs repair?',
    'cannot review or assess customer photos',
  ],
  ['How many services do you offer?', 'We offer 6 services'],
  ['What is your address?', '2642 Tulane Ave'],
  ['How do I get directions to your shop?', 'Our shop is at'],
  ['Are you open on Saturdays?', 'Saturday: 7 AM to 12 PM'],
  ['Do you charge to help with an insurance claim?', 'no additional charge'],
  [
    'Does windshield replacement include calibration?',
    'static or dynamic calibration',
  ],
  ['Can I tint my windshield?', 'windshield-specific tint availability'],
  [
    'What ceramic and carbon tint options do you offer?',
    'UV protection',
  ],
  ['When can I roll down my windows after tint?', 'aftercare instructions'],
  ['Can you replace my back glass?', 'rear window glass'],
  [
    'Can you shampoo my interior at my apartment?',
    'Interior steam and shampoo',
  ],
  ['Where can I get paint correction done?', 'shop-only'],
  ['What happens after I submit my service request?', 'team will contact you'],
  ['Can I just walk in to the shop?', 'confirmed walk-in availability'],
  [
    'I can’t submit the service request form',
    'cannot see or verify service requests',
  ],
  ['I do not know what service I need', 'assess whether windshield damage'],
  ['Is my preferred date guaranteed?', 'does not confirm a booking'],
  ['How long have you served New Orleans?', 'more than nine years'],
  ['Do you do mobile service at my apartment?', '40 miles'],
  ['Do you use actual OEM glass?', 'does not list glass manufacturer brands'],
  ['Do you offer 24/7 service?', 'does not list 24/7 service'],
  ['glass', 'Auto glass service includes'],
  ['tint', 'Ceramic and carbon film options'],
  ['mobile', 'homes, offices, fleet yards, and dealerships'],
  ['services', 'We offer 6 services'],
  [
    'Can you fix a crack in my windshield?',
    'repair is suitable for your vehicle',
  ],
  ['How do you repair windshield cracks?', 'repair is suitable for your vehicle'],
  [
    'Is windshield tint legal in Louisiana?',
    'windshield-specific tint availability',
  ],
  ['Is tint 20 percent legal in Louisiana?', 'visible-light transmission'],
  [
    'What can you do at the shop?',
    'paint correction, polishing, and ceramic coating are shop-only',
  ],
  [
    'Can you help me choose which service I need?',
    'assess whether windshield damage',
  ],
  ['Can I see a map?', 'Choose the map you need'],
  ['Can you service me at ZIP 70001?', 'Exact ZIP-code availability'],
  ['Can you tell me if you cover my town?', '40-mile radius'],
  [
    'How long do I wait before washing my car after tint?',
    'aftercare instructions',
  ],
  [
    'Do you accept payment by credit card?',
    'confirmed price list or payment details',
  ],
  ['Will you call me after I submit the form?', 'team will contact you'],
  [
    'Can I bring my car without an appointment?',
    'confirmed walk-in availability',
  ],
  [
    'How should I prepare before the technician arrives?',
    'vehicle-preparation',
  ],
  [
    'Can you assess my windshield from a photo?',
    'cannot review or assess customer photos',
  ],
  ['Are you a live agent?', 'automated website assistant'],
  ['What are your Google reviews?', 'Google Maps'],
  ['How many years have you been in business?', 'more than nine years'],
  [
    'Can you help me cancel my appointment?',
    'can’t look up, change, or cancel',
  ],
  ['What services do you offer?', 'We offer 6 services'],
  ['How much does a windshield cost?', 'don’t have a confirmed price list'],
  ['Can I see your before and after photos?', 'Browse the project gallery'],
  ['Where can I read reviews?', 'Google Maps'],
  ['Hello', 'common questions'],
];

for (const [question, expected] of cases) {
  const reply = getChatbotReply(question);
  assert.ok(
    reply.text.toLowerCase().includes(expected.toLowerCase()),
    `Expected “${question}” to match a response containing “${expected}”; got “${reply.text}”.`,
  );
}

const unknown = getChatbotReply('Do you sell roof racks?');
assert.match(unknown.text, /don’t have a confirmed answer/i);
assert.deepEqual(
  unknown.actions.map((action) => action.href),
  ['tel:+15042077742', 'mailto:quotes@totalmobileglass.com'],
);
for (const question of [
  'Do you offer a shuttle service?',
  'Do you provide a loaner car?',
  'Can you repair my boat?',
]) {
  const reply = getChatbotReply(question);
  assert.match(reply.text, /confirmed answer/i, question);
  assert.deepEqual(
    reply.actions.map((action) => action.href),
    ['tel:+15042077742', 'mailto:quotes@totalmobileglass.com'],
    question,
  );
}
const sunroof = getChatbotReply('Can you replace sunroof glass?');
assert.match(sunroof.text, /does not specify sunroof/i);
assert.deepEqual(
  sunroof.actions.map((action) => action.href),
  ['tel:+15042077742', 'mailto:quotes@totalmobileglass.com'],
);
assert.equal(getChatbotReply('').actions.length, 0);
assert.equal(chatbotSuggestions.length, 4);
const serviceList = getChatbotReply('services').text;
for (const service of [
  'Windshield Repair',
  'Windshield Replacement',
  'ADAS Calibration',
  'Window Tinting',
  'Mobile Detailing',
  'Side & Rear Glass Replacement',
])
  assert.ok(
    serviceList.includes(service),
    `Missing service from list: ${service}`,
  );
console.log(
  `Chatbot checks passed: ${cases.length} customer-question examples, all six services, unknown-topic fallback, and direct contact actions.`,
);
