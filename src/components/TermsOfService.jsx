import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText } from 'lucide-react';
import { playClick } from '../utils/sounds';

export default function TermsOfService({ show, onClose }) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-[800px] max-h-[85vh] bg-[#FFFDF5] border-8 border-black shadow-[20px_20px_0px_#000] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-black p-6 flex items-center justify-between text-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <FileText size={28} />
              <h2 className="text-2xl font-black uppercase tracking-wider">Terms of Service</h2>
            </div>
            <button onClick={() => { playClick(); onClose(); }} className="w-10 h-10 bg-[#FF6B6B] border-2 border-white flex items-center justify-center hover:rotate-90 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="bg-[#FFD93D] border-4 border-black p-4 shadow-[4px_4px_0px_#000] -rotate-1">
              <p className="font-black text-lg">Last Updated: April 2025 • LeetNudge v1.0</p>
            </div>

            <Section title="1. ACCEPTANCE OF TERMS">
              <p>By accessing or using LeetNudge ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access the Service. LeetNudge reserves the right to modify these terms at any time.</p>
            </Section>

            <Section title="2. SERVICE DESCRIPTION">
              <p>LeetNudge is an AI-powered coding assistant and learning platform that provides:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Context-aware hints for LeetCode problems</li>
                <li>Structured DSA problem tracking sheets</li>
                <li>Competitive matchmaking duels</li>
                <li>Social features (friends, profiles, inbox)</li>
                <li>Chrome extension for real-time code analysis</li>
              </ul>
            </Section>

            <Section title="3. USER ACCOUNTS">
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate profile information. LeetNudge reserves the right to suspend accounts that violate these terms.</p>
            </Section>

            <Section title="4. SUBSCRIPTION & PAYMENTS">
              <p>LeetNudge Pro subscription costs <strong>₹59/month (~$3 USD)</strong>. Subscriptions auto-renew monthly. You may cancel at any time. Refunds are processed within 7 business days for cancellations within the first 48 hours. No refunds are issued after the 48-hour window.</p>
            </Section>

            <Section title="5. ACCEPTABLE USE">
              <p>You agree not to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Use LeetNudge to cheat in coding interviews or assessments</li>
                <li>Share your account credentials with others</li>
                <li>Attempt to reverse-engineer the AI hint system</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Use automated scripts to interact with the platform</li>
                <li>Paste copied solutions in matchmaking duels (anti-cheat enforced)</li>
              </ul>
            </Section>

            <Section title="6. ANTI-CHEAT POLICY">
              <p>Matchmaking duels enforce strict anti-cheat measures. Pasting code, using browser dev tools to manipulate game state, or any form of code injection will result in immediate disqualification and potential account suspension.</p>
            </Section>

            <Section title="7. INTELLECTUAL PROPERTY">
              <p>All content, design, and code of LeetNudge are the intellectual property of LeetNudge. User-generated content (custom sheets, profile data) remains the property of the user. LeetNudge may use anonymized usage data for service improvement.</p>
            </Section>

            <Section title="8. PRIVACY & DATA">
              <p>LeetNudge stores user preferences, progress, and profile data locally in the browser (localStorage). No personal data is transmitted to external servers without explicit consent. The Chrome extension only analyzes code on LeetCode pages and does not access other browsing data.</p>
            </Section>

            <Section title="9. LIMITATION OF LIABILITY">
              <p>LeetNudge is provided "as is" without warranties. We are not liable for any interview outcomes, learning results, or damages arising from the use of our service. AI hints are suggestions, not guaranteed solutions.</p>
            </Section>

            <Section title="10. CONTACT">
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000]">
                <p className="font-black">LeetNudge Support</p>
                <p>Email: support@leetnudge.com</p>
                <p>Discord: discord.gg/leetnudge</p>
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t-4 border-black bg-white flex-shrink-0">
            <button
              onClick={() => { playClick(); onClose(); }}
              className="w-full py-4 bg-[#4ade80] border-4 border-black font-black text-xl uppercase shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] active:translate-y-1 active:shadow-none transition-all"
            >
              I Understand & Accept
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-black text-xl uppercase tracking-tight mb-3 bg-black text-white px-3 py-1 inline-block border-2 border-black">
        {title}
      </h3>
      <div className="font-bold text-base leading-relaxed pl-1">
        {children}
      </div>
    </div>
  );
}
