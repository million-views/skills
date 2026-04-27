# Sign-In Screen Redesign

**Status:** draft

> **Recipe note:** This recipe demonstrates the brownfield UX refinement pattern.
> In a real project, the product owner provides actual screenshots before this
> document is written. The `CompareView` widget shows a placeholder when
> `screenshots/current/` is empty — replace the path once screenshots exist.

---

## Who Uses This Today

Returning users on iOS and Android, signing into the app after install or session
expiry. Typical context: subway commute, one hand on phone, distracted. They know
their credentials; they just want to get in.

## The Problem with the Current Experience

The sign-in screen presents email, password, "Forgot password?", and "Create
account" simultaneously with no visual hierarchy. Usability testing shows:

- Users entering a password before email (field order is not enforced)
- 23% click "Create account" when they intended to sign in ("Login" label
  is ambiguous to non-technical users)
- Generic "Login failed" error gives no recovery guidance — users retry the
  same wrong password twice before abandoning
- Mobile users can't verify typed passwords; "forgot password" flows spike
  on days after app updates when autofill breaks

## The Cost of Not Fixing This

Sign-in abandonment accounts for 18% of session-start failures. Support volume
for "can't log in" tickets is 340/month. 60% of those are resolved by password
reset — suggesting the form confusion, not forgotten credentials, is the driver.

---

## Audit: Sign-In Screen

![Sign-in — current state](./screenshots/current/01-signin.png)

> _Place a screenshot from the running app at `screenshots/current/01-signin.png`._
> _The image above will render once the file exists._

**Friction points:**

- **All fields visible at once, no hierarchy**: Email, password, "Forgot?", and
  "Create account" compete for attention. The eye has no obvious starting point.
- **"Login" CTA is ambiguous**: Usability sessions show non-technical users read
  "Login" as "I need to log in / create an account." "Sign in" is unambiguous.
- **Generic error message "Login failed"**: Users don't know if the email or the
  password is wrong. The only recovery path shown is "Forgot password?" — which
  is wrong advice if they simply mistyped their email.
- **No password visibility toggle**: One mistyped character means a failed attempt
  with no feedback. Visibility toggle is the standard mitigation; it's absent.
- **"Forgot password?" is always visible**: It primes users to doubt their
  memory before they've even tried. Should appear only after a failed attempt
  or at the password step.

---

## Redesign: Sign-In Screen

Progressive disclosure: collect email first, validate format immediately, then
reveal the password field with the confirmed email shown as context. The user
always knows which field caused an error.

```jsx live id="proposed-signin" device=mobile zoom=fill
import { ProposedSignIn } from './proposed-sign-in.jsx';
export function Demo() { return <ProposedSignIn />; }
```

**Design decisions:**

- **Email → password in two steps**: One field per step reduces visual complexity
  and enables identity-first auth (SSO, magic link) without a redesign later.
  The confirmed email displayed in step 2 eliminates "which account am I on?"
  confusion in multi-account households.
- **"Continue" → "Sign in" CTA sequence**: "Continue" cannot be misread as
  "create account." "Sign in" completes the framing once identity is confirmed.
- **Client-side email format error, server-side password error**: Different errors
  at different steps. Users know exactly what to fix. "Incorrect password" is
  honest and actionable; "Login failed" is neither.
- **Password visibility toggle**: Standard iOS/Android pattern. Reduces mistyped-
  password support tickets. No cognitive overhead for users who know it.
- **"Forgot?" co-located with the password field, step 2 only**: Surfaced only
  when relevant. Removes the priming effect of showing it before the user has
  tried anything.
- **"Create account" demoted to footer link**: Still discoverable but not
  competing with the primary task. Users who need it will find it; users who
  don't won't click it by accident.

---

## Side-by-Side

Direct before/after comparison. The left panel shows the current screenshot;
the right panel renders the proposed design live.

```jsx live id="compare-signin" device=none
import { CompareView } from './compare-view.jsx';
import { ProposedSignIn } from './proposed-sign-in.jsx';

export function Compare() {
  return (
    <CompareView screenshotSrc="./screenshots/current/01-signin.png">
      <ProposedSignIn />
    </CompareView>
  );
}
```

> **Note:** The left panel shows a placeholder until `screenshots/current/01-signin.png`
> exists. In Markdown Preview, local images always render. In Interactive Preview,
> images resolve when `spec.md` and `screenshots/` share the same parent folder.

---

## Migration Notes

**Behavioral delta:** The two-step flow adds one tap for users who have autofill
disabled. Users with autofill enabled see no change — the browser/OS populates
both fields after the email step. Measure task-completion time in A/B; expect
≤5% increase for non-autofill users, offset by abandonment reduction.

**Rollout strategy:** Ship behind a feature flag. Run as A/B for two weeks.
Primary metric: sign-in completion rate. Secondary: "Forgot password" click rate
(should decrease if specific error messages reduce unnecessary resets).

**Compatibility:** No API changes required. The two-step split is client-side
only. The same auth endpoint receives the same payload.

**Copy change:** "Login" → "Sign in" requires copy-team approval. File as a
separate ticket to avoid blocking the UX change.

## Decision

Ship the two-step flow. The one-page form is a local aberration — progressive
disclosure is the dominant pattern (Google, Apple, Stripe). The "Login" copy
change is a quick follow-on. Run A/B for two weeks; if completion rate is flat
or positive, retire the flag and remove the old form.
