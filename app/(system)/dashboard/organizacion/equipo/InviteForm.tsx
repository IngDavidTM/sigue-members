"use client";

import { MemberForm } from "../../MemberForm";
import styles from "../../members.module.css";
import { inviteMember } from "../actions";

type Text = {
  inviteEmail: string; inviteRole: string; roleHelp: string; invite: string;
  linkTitle: string; linkHelp: string; emailSent: string; editor: string; viewer: string;
};

export function InviteForm({ text }: { text: Text }) {
  return <MemberForm
    action={inviteMember}
    submitLabel={text.invite}
    pendingLabel="…"
    renderResult={(state) => state.link ? <div className={styles.inviteLink} role="status">
      <strong>{text.linkTitle}</strong>
      <input readOnly value={state.link} aria-label={text.linkTitle} onFocus={(event) => event.currentTarget.select()} />
      <small>{text.linkHelp}{state.emailSent ? ` ${text.emailSent}` : ""}</small>
    </div> : null}
  >
    <div className={styles.formGrid}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{text.inviteEmail}</span>
        <input name="email" type="email" inputMode="email" autoComplete="off" required maxLength={254} />
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{text.inviteRole}<small>{text.roleHelp}</small></span>
        <select name="role" defaultValue="editor">
          <option value="editor">{text.editor}</option>
          <option value="viewer">{text.viewer}</option>
        </select>
      </label>
    </div>
  </MemberForm>;
}
