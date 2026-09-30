import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  LEGAL_EFFECTIVE_DATE,
  LegalContact,
  LegalLink,
  LegalSection,
} from "@/components/LegalSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Semax Hub collects for accounts and Discuss, and what it does not. Informational site. Not medical advice.",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Semax Hub"
      title="Privacy Policy"
      lede="What this informational site collects, why, and who else handles it."
    >
      <p className="text-sm text-muted">Effective {LEGAL_EFFECTIVE_DATE}</p>

      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/85">
        <p>
          Semax Hub is a free educational site about the peptide Semax.
          Informational only. Not medical advice. We don&apos;t sell Semax. This
          policy describes the data the site actually handles: optional accounts,
          posts in Discuss, and the ordinary records a host keeps to serve pages.
        </p>
        <p>
          The rules for using the site are in the{" "}
          <LegalLink href="/terms">Terms of Use</LegalLink>.
        </p>
      </div>

      <LegalSection title="What this site is">
        <p>
          You can read the Learn pages without an account. Discuss is a public
          reading room: anyone can read threads, and you sign in to start a
          thread, reply, or report a post. We are not a clinic, a pharmacy, or a
          store. We do not take orders, payments, or shipping details.
        </p>
      </LegalSection>

      <LegalSection title="Information you give us">
        <p>You can use most of the site without giving us an account.</p>
        <p>
          If you create an account, sign-in is provided by Clerk. Clerk holds
          the account record. Depending on how you sign up, that can include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Your email address, when you use email sign-in.</li>
          <li>
            Your name and username, if you provide them. On Discuss and in the
            header we show a short display name: first name and last initial
            when both are present, otherwise your first name, last name,
            username, or &quot;Member.&quot;
          </li>
          <li>
            A profile image. If you sign in with Google and your Clerk profile
            has no photo, the site may copy the Google profile image into your
            Clerk profile so it can appear next to your posts and in the header.
          </li>
          <li>A Clerk user ID, which we store with posts and reports.</li>
        </ul>
        <p>
          Your email address stays with Clerk. Discuss pages show your display
          name and profile image, not your email and not your Clerk user ID.
        </p>
        <p>If you post in Discuss, we store:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Thread titles and bodies, and reply text.</li>
          <li>The display name and profile image URL shown with the post.</li>
          <li>Your Clerk user ID and the time of the post.</li>
        </ul>
        <p>
          Those records live in a Postgres database used for Discuss. If you
          report a thread or reply, we store your Clerk user ID, which post you
          reported, a short reason (up to 500 characters), and the time of the
          report. The report button is for spam, harassment, or buy links.
        </p>
      </LegalSection>

      <LegalSection title="Information collected while you browse">
        <p>
          The site is hosted on Vercel. Serving a page means the host receives
          ordinary connection data, such as your IP address, browser type, and
          the page you requested, in server logs. We use that to deliver the
          site and keep it available. We do not run a separate analytics product
          on top of those logs.
        </p>
        <p>
          This app does not include Vercel Analytics, Vercel Speed Insights,
          Google Analytics, or another analytics or advertising script. There is
          no cookie banner, because the site does not add its own tracking
          cookies.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and sessions">
        <p>
          When Clerk is configured, its script loads with the site so sign-in
          can work. Clerk sets cookies to keep you signed in and to run the
          sign-in and sign-up screens. Those cookies are for the account
          session, not for ads.
        </p>
        <p>
          You can block cookies in your browser. Sign-in and posting will not
          work if the session cookie is blocked. Reading the Learn pages does
          not require an account.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <ul className="list-disc space-y-2 pl-5">
          <li>To let you sign in and show your display name and avatar.</li>
          <li>To publish the threads and replies you submit.</li>
          <li>To store reports and let moderators hide posts that break the rules.</li>
          <li>To operate, secure, and host the site.</li>
        </ul>
        <p>
          We do not sell personal information. We do not use it for advertising.
          We do not use it to sell Semax or to give medical advice.
        </p>
      </LegalSection>

      <LegalSection title="Who else processes it">
        <p>These providers handle data because the site uses them:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <LegalLink href="https://clerk.com/legal/privacy">Clerk</LegalLink>{" "}
            provides accounts, sessions, and the sign-in screens. Clerk&apos;s
            own privacy policy covers account data it processes.
          </li>
          <li>
            Google, only if you choose Google to sign in. We do not receive your
            Google password. Google&apos;s policy is at{" "}
            <LegalLink href="https://policies.google.com/privacy">
              policies.google.com/privacy
            </LegalLink>
            . If your avatar image is hosted by Google, your browser loads that
            image from Google when a page shows it.
          </li>
          <li>
            <LegalLink href="https://vercel.com/legal/privacy-policy">
              Vercel
            </LegalLink>{" "}
            hosts the website and processes the connection logs described above.
          </li>
          <li>
            The Postgres host that stores Discuss topics, threads, replies, and
            reports. The app connects with a database URL. The repository does
            not hard-code a vendor name.
          </li>
        </ul>
        <p>
          Reports are stored in that database. The site has no public reports
          inbox. Moderators can hide a post from its page, and they can still
          open posts that are hidden from everyone else. We may also disclose
          information if the law requires it.
        </p>
      </LegalSection>

      <LegalSection title="Discuss posts are public">
        <p>
          Threads and replies are readable by anyone who visits Discuss. Your
          display name and profile image appear with what you write. Do not post
          information you want kept private.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          Account details stay with Clerk for as long as the account exists. The
          site has no separate control to delete an account or a post. You can
          update profile details from the account menu after you sign in.
        </p>
        <p>
          Threads, replies, and reports stay in the database. A moderator can
          hide a thread or reply so it no longer appears in public Discuss
          views. Hidden posts remain stored, and moderators can still open them.
          There is no automatic deletion schedule in the app.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can read without an account. You can choose not to sign in, not to
          post, and not to use Google. Blocking Clerk cookies will sign you out
          and stop posting. Because we have not published a contact address,
          there is no in-site form for access or deletion requests. See Contact
          below.
        </p>
      </LegalSection>

      <LegalSection title="Age">
        <p>
          Semax Hub is intended for people 18+. We do not knowingly collect
          account information from anyone under 18.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          If this policy changes, we will update the text on this page and the
          effective date at the top.
        </p>
      </LegalSection>

      <LegalContact />
    </PageShell>
  );
}
