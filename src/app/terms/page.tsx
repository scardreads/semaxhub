import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import {
  LEGAL_EFFECTIVE_DATE,
  LegalContact,
  LegalLink,
  LegalSection,
} from "@/components/LegalSection";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Rules for reading Semax Hub and for posting in Discuss. Informational only. Not medical advice. We don't sell Semax.",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Semax Hub"
      title="Terms of Use"
      lede="The rules for reading Semax Hub and for posting in Discuss."
    >
      <p className="text-sm text-muted">Effective {LEGAL_EFFECTIVE_DATE}</p>

      <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/85">
        <p>
          Semax Hub is a free place to read sourced material about Semax and,
          if you want, to talk with other readers. By using the site, you agree
          to these terms. If you do not agree, do not use the site.
        </p>
        <p>
          How we handle account data and posts is described in the{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink>.
        </p>
      </div>

      <LegalSection title="Informational only">
        <p>
          The Learn pages, labels, and discussion are for education and
          conversation. They are not medical advice, not a diagnosis, and not a
          treatment plan. They are not a recommendation to use, obtain, or avoid
          any substance. Nothing on the site creates a clinician, pharmacist, or
          patient relationship.
        </p>
        <p>
          Research summaries can be incomplete. Discuss posts are written by
          other readers, not by Semax Hub as professional advice. Peer
          experiences are allowed. They are not guidance for your own care. Talk
          with a licensed clinician about your own health decisions.
        </p>
      </LegalSection>

      <LegalSection title="We don't sell Semax">
        <p>
          Semax Hub is not a store, a clinic, or a compounding service. There is
          no cart, no checkout, and no &quot;buy Semax&quot; offer. Do not use
          the site to sell, source, or link to vendors.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility">
        <p>
          Semax Hub is intended for people 18+. You must be 18 or older to use
          the site and to create an account.
        </p>
      </LegalSection>

      <LegalSection title="Accounts">
        <p>
          Reading is open. You need an account to start a thread, reply, or
          report a post. Accounts are provided by Clerk, using email sign-in
          and, when that option is turned on, Google sign-in.
        </p>
        <p>
          You are responsible for activity on your account. Give accurate
          account details if you choose to provide them. Do not share your
          sign-in in a way that lets someone else post as you.
        </p>
      </LegalSection>

      <LegalSection title="Your posts">
        <p>
          You keep ownership of the text you submit. You give Semax Hub
          permission to store that text, display it publicly on Discuss with
          your display name and profile image, and hide it if it breaks these
          terms or the discussion rules. That permission is non-exclusive, and
          it lasts while we store the content for the site.
        </p>
        <p>
          Threads and replies are public. Do not post anything you expect to
          stay private. The site has no button for you to delete your own post.
          A moderator can hide a post so the public no longer sees it. Hidden
          posts can remain in the database.
        </p>
        <p>
          You are responsible for what you write. Do not post material that you
          do not have the right to share.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>Discuss is a reading room. The short rules are:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Peer experiences are welcome.</li>
          <li>Posts are not medical advice from Semax Hub.</li>
          <li>No sales, vendor links, or requests to buy.</li>
          <li>Be kind. No harassment, threats, or pile-ons.</li>
          <li>Cite when you can, and label speculation as speculation.</li>
          <li>No spam, and no one else&apos;s private information.</li>
          <li>No unlawful content, and no attempt to break or overload the site.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Reports and moderation">
        <p>
          Signed-in readers can report a thread or reply for spam, harassment,
          or a buy link. The report is saved with the discussion data. The site
          does not send a notice that someone reviewed it, and it does not
          promise a review within a set time.
        </p>
        <p>
          Moderators may hide or restore a thread or reply. Hiding removes it
          from public Discuss views. We may also stop a feature, including
          Discuss, or refuse a post that breaks these terms. There is no full
          admin console and no direct-message system.
        </p>
      </LegalSection>

      <LegalSection title="Our material">
        <p>
          The Learn pages, site design, logo, and the way the site is arranged
          belong to Semax Hub, except for text you post and except for
          third-party material we quote with a source. You may read and share
          links to pages. Do not copy the site and present it as your own
          product or store.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimers">
        <p>
          The site is provided as it is and as available. We work to keep pages
          clear and sourced, and we say when a claim still needs a citation. We
          do not warrant that a page, a study summary, or a Discuss post is
          complete, current, or fit for a particular purpose.
        </p>
        <p>
          We are not responsible for decisions you make after reading the site,
          for products you obtain elsewhere, or for what other people post.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent the law allows, Semax Hub and the people who
          operate it are not liable for indirect, incidental, special,
          consequential, or punitive damages, or for lost profits or data,
          arising out of your use of the site or your reliance on anything you
          read here. Where the law does not allow a limit, that limit applies
          only as far as the law permits.
        </p>
        <p>
          These terms do not name a court or a state&apos;s law. The site does
          not publish a legal entity or a business address. Protections that
          the law where you live does not let a site waive still apply.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms. The current version is the one on this
          page, with the effective date at the top. Continued use of the site
          after a change means you accept the updated terms. We may also change,
          pause, or remove parts of the site.
        </p>
      </LegalSection>

      <LegalContact />
    </PageShell>
  );
}
