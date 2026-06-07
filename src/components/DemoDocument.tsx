import { FileCategory } from "@/lib/types";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export interface DocClient { name: string; reference: string; country: string; email: string; phone: string }

export const PAGES_PER_CATEGORY: Record<FileCategory, number> = {
  "Company Letter": 3,
  "Identity": 3,
  "Travel": 3,
  "Agreement": 3,
  "Medical": 3,
  "Other": 3,
};

export const pageCountFor = (cat: FileCategory) => PAGES_PER_CATEGORY[cat] ?? 3;

export const recordIdFor = (fileId: string) =>
  `VH-${fileId.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-6).padStart(6, "0")}`;

/* ===== shared atoms ===== */

const SHEET = "w-full bg-white text-[#0b1733] shadow-elevated rounded-2xl relative overflow-hidden aspect-[1/1.414]";

const Watermark = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
    <div className="text-[80px] font-black tracking-[0.3em] rotate-[-28deg] text-[#0b1733]/[0.04] whitespace-nowrap">
      VISAHOBE · INTERNAL
    </div>
  </div>
);

const Header = ({ subtitle, refId, status }: { subtitle: string; refId: string; status: string }) => (
  <div className="flex items-start justify-between border-b-2 border-[#0b1733] pb-3">
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#003B73] to-[#E63946] text-white font-black flex items-center justify-center text-base shadow-sm">VH</div>
      <div>
        <div className="font-bold text-[14px] tracking-tight">VisaHOBe PTE. LTD.</div>
        <div className="text-[9px] uppercase tracking-[0.18em] text-[#0b1733]/60 mt-0.5">{subtitle}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="inline-flex items-center gap-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="h-2.5 w-2.5" /> {status.toUpperCase()}
      </div>
      <div className="text-[8px] text-[#0b1733]/50 mt-1 font-mono">{refId}</div>
    </div>
  </div>
);

const Footer = ({ page, total, refId }: { page: number; total: number; refId: string }) => (
  <div className="absolute bottom-5 inset-x-8 flex items-center justify-between text-[8px] text-[#0b1733]/50 border-t border-[#0b1733]/10 pt-2">
    <span className="font-mono">{refId}</span>
    <span className="flex items-center gap-1.5"><ShieldCheck className="h-2.5 w-2.5" /> visahobe.com · confidential</span>
    <span>Page {page} of {total}</span>
  </div>
);

const Field = ({ label, value, w = "w-1/2" }: { label: string; value: string; w?: string }) => (
  <div className={`${w} pr-3 mb-2.5`}>
    <div className="text-[7.5px] uppercase tracking-[0.15em] text-[#0b1733]/50 font-semibold">{label}</div>
    <div className="text-[11px] font-medium mt-0.5 border-b border-[#0b1733]/15 pb-0.5">{value}</div>
  </div>
);

const Section = ({ n, title }: { n: string; title: string }) => (
  <div className="flex items-center gap-2 mt-4 mb-2.5">
    <div className="h-4 w-4 rounded bg-[#003B73] text-white text-[9px] font-bold flex items-center justify-center">{n}</div>
    <div className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#003B73]">{title}</div>
    <div className="flex-1 h-px bg-[#0b1733]/10" />
  </div>
);

const Check = ({ on, label }: { on: boolean; label: string }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className={`h-3 w-3 border-[1.5px] border-[#0b1733] flex items-center justify-center ${on ? "bg-[#003B73]" : "bg-white"}`}>
      {on && <svg viewBox="0 0 12 12" className="h-2 w-2 text-white"><path fill="none" stroke="currentColor" strokeWidth="2.4" d="M2 6l3 3 5-6" /></svg>}
    </div>
    <div className="text-[10px]">{label}</div>
  </div>
);

const Signatures = ({ name }: { name: string }) => (
  <div className="mt-6 grid grid-cols-2 gap-8">
    <div>
      <div className="h-9 border-b border-[#0b1733]/40 italic text-[#003B73] font-serif text-base flex items-end pb-0.5">~{name.split(" ")[0]}~</div>
      <div className="text-[8px] uppercase tracking-wider text-[#0b1733]/60 mt-1">Client signature</div>
    </div>
    <div>
      <div className="h-9 border-b border-[#0b1733]/40 italic text-[#003B73] font-serif text-base flex items-end pb-0.5">~VH Officer~</div>
      <div className="text-[8px] uppercase tracking-wider text-[#0b1733]/60 mt-1">Authorised officer</div>
    </div>
  </div>
);

const Stamp = () => (
  <div className="absolute right-8 bottom-20 h-20 w-20 rounded-full border-[2.5px] border-[#E63946] text-[#E63946] flex flex-col items-center justify-center rotate-[-12deg] opacity-80">
    <div className="text-[7px] font-bold tracking-widest">VISAHOBE</div>
    <div className="text-[9px] font-black">VERIFIED</div>
    <div className="text-[6px] mt-0.5">2026 · SG</div>
  </div>
);

const Sheet = ({ children }: { children: React.ReactNode }) => (
  <div className={SHEET}>
    <Watermark />
    <div className="relative px-8 pt-6 pb-16 h-full overflow-hidden text-[11px]">{children}</div>
  </div>
);

/* ===== category renderers (3 pages each) ===== */

type RenderArgs = { client?: DocClient; refId: string; status: string; name: string; category: FileCategory };

function companyLetter({ client, refId, status, name }: RenderArgs, page: number) {
  const c = client;
  const total = 3;
  if (page === 0) return (
    <Sheet>
      <Header subtitle="Internal Company Letter" refId={refId} status={status} />
      <div className="mt-5 text-[10px] text-[#0b1733]/70">
        <div>10 Anson Road, #14-06 International Plaza</div>
        <div>Singapore 079903 · UEN 202612345K</div>
      </div>
      <div className="mt-4 text-[10px]">Date: <span className="font-medium">07 June 2026</span></div>
      <div className="mt-4">
        <div className="text-[10px]">To,</div>
        <div className="text-[12px] font-semibold mt-1">{c?.name || "Valued Client"}</div>
        <div className="text-[10px] text-[#0b1733]/70">{c?.email} · {c?.phone}</div>
      </div>
      <div className="mt-4 text-[11px] font-bold underline">Subject: Confirmation of Engagement & Document Custody</div>
      <div className="mt-3 leading-[1.7] text-[#0b1733]/85 text-justify space-y-2">
        <p>Dear {c?.name?.split(" ")[0] || "Client"},</p>
        <p>This letter serves as formal confirmation that VisaHOBe PTE. LTD. has received and acknowledged the documents submitted under client reference <span className="font-mono font-semibold">{c?.reference}</span>. Our compliance team has reviewed the initial submission and the file has been moved to the secure company vault for ongoing case management.</p>
        <p>Your case has been assigned to a dedicated relationship officer who will coordinate all communication and provide weekly progress updates. All physical and digital documents remain the property of the client and may be retrieved at any time upon written request through our client portal.</p>
        <p>We thank you for choosing VisaHOBe and look forward to delivering a smooth, transparent and timely service.</p>
      </div>
      <Signatures name={c?.name || "Client"} />
      <Stamp />
      <Footer page={1} total={total} refId={refId} />
    </Sheet>
  );
  if (page === 1) return (
    <Sheet>
      <Header subtitle="Engagement Schedule" refId={refId} status={status} />
      <Section n="1" title="Service Summary" />
      <div className="leading-[1.7] text-[#0b1733]/85 text-justify">VisaHOBe will provide end-to-end consultancy services including document preparation, review, secure storage and timeline tracking. Service level commitments are listed below.</div>
      <Section n="2" title="Milestones" />
      <table className="w-full border-collapse">
        <thead className="bg-[#0b1733]/[0.04]">
          <tr><th className="text-left p-1.5 border border-[#0b1733]/10">Stage</th><th className="text-left p-1.5 border border-[#0b1733]/10">Owner</th><th className="text-left p-1.5 border border-[#0b1733]/10">Target</th><th className="text-left p-1.5 border border-[#0b1733]/10">Status</th></tr>
        </thead>
        <tbody>
          {[["Document intake","VH Officer","Day 1","Complete"],["Compliance review","Compliance","Day 3","Complete"],["Quality assurance","QA Lead","Day 5","In progress"],["Client confirmation","Client","Day 7","Pending"],["Archive & handover","VH Officer","Day 10","Pending"]].map((r) => (
            <tr key={r[0]}>{r.map((x,i)=><td key={i} className="p-1.5 border border-[#0b1733]/10">{x}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <Section n="3" title="Fee Schedule" />
      <div className="flex flex-wrap">
        <Field label="Engagement Fee" value="SGD 1,200.00" />
        <Field label="Processing Fee" value="SGD 380.00" />
        <Field label="Vault Storage (12 mo)" value="SGD 90.00" />
        <Field label="Total Payable" value="SGD 1,670.00" />
      </div>
      <Footer page={2} total={total} refId={refId} />
    </Sheet>
  );
  return (
    <Sheet>
      <Header subtitle="Annex · Terms of Custody" refId={refId} status={status} />
      <Section n="A" title="Document Handling" />
      <div className="leading-[1.7] text-[#0b1733]/85 text-justify">All documents stored in the VisaHOBe Vault are encrypted at rest and in transit. Access is restricted to the assigned case team and is logged in a tamper-evident audit trail. Physical originals, where applicable, are stored in a fire-rated cabinet at our Singapore office.</div>
      <Section n="B" title="Retention" />
      <div className="leading-[1.7] text-[#0b1733]/85 text-justify">Digital records are retained for seven (7) years from the date of case closure in accordance with our internal records-management policy. Clients may request earlier deletion subject to legal and regulatory obligations.</div>
      <Section n="C" title="Contact Officer" />
      <div className="flex flex-wrap">
        <Field label="Officer" value="Priya Menon" />
        <Field label="Direct" value="+65 6812 0042" />
        <Field label="Email" value="priya@visahobe.com" />
        <Field label="Office" value="Singapore HQ" />
      </div>
      <Signatures name={c?.name || "Client"} />
      <Stamp />
      <Footer page={3} total={total} refId={refId} />
    </Sheet>
  );
}

function identity({ client, refId, status }: RenderArgs, page: number) {
  const c = client; const total = 3;
  if (page === 0) return (
    <Sheet>
      <Header subtitle="Identity Reference Sheet" refId={refId} status={status} />
      <Section n="A" title="Personal Particulars" />
      <div className="flex gap-4 mt-1">
        <div className="w-24 h-32 border-2 border-dashed border-[#0b1733]/30 rounded flex items-center justify-center text-[8px] text-[#0b1733]/50 text-center px-2">CLIENT PHOTO (on file)</div>
        <div className="flex-1 flex flex-wrap">
          <Field label="Full Name" value={c?.name || "—"} />
          <Field label="Reference" value={c?.reference || "—"} />
          <Field label="Country" value={c?.country || "—"} />
          <Field label="Date Joined" value="2026-04-12" />
          <Field label="Email" value={c?.email || "—"} />
          <Field label="Phone" value={c?.phone || "—"} />
        </div>
      </div>
      <Section n="B" title="Internal Verification Checklist" />
      <div className="grid grid-cols-2 gap-x-6">
        <div>
          <Check on label="Name confirmed against intake form" />
          <Check on label="Contact details validated" />
          <Check on label="Address proof received" />
          <Check on={false} label="Secondary reference pending" />
        </div>
        <div>
          <Check on label="Client agreement signed" />
          <Check on label="Privacy notice acknowledged" />
          <Check on label="Vault access provisioned" />
          <Check on={false} label="Final officer sign-off" />
        </div>
      </div>
      <Section n="C" title="Officer Notes" />
      <div className="border border-[#0b1733]/15 rounded p-2.5 leading-relaxed text-[#0b1733]/80 min-h-[70px]">
        Client onboarded through the Singapore office. All identity references match the intake form. Awaiting one secondary reference letter before moving the case to compliance review. No flags raised by the screening team.
      </div>
      <Stamp />
      <Footer page={1} total={total} refId={refId} />
    </Sheet>
  );
  if (page === 1) return (
    <Sheet>
      <Header subtitle="Reference Log" refId={refId} status={status} />
      <Section n="1" title="Submitted References" />
      <table className="w-full border-collapse">
        <thead className="bg-[#0b1733]/[0.04]"><tr>{["Type","Issued By","Date","Status"].map((h)=><th key={h} className="text-left p-1.5 border border-[#0b1733]/10">{h}</th>)}</tr></thead>
        <tbody>
          {[["Address proof","Utility provider","2026-03-12","Verified"],["Employment letter","Acme Corp","2026-03-18","Verified"],["Bank reference","Standard Bank","2026-03-22","Verified"],["Character reference","Dr. M. Iyer","—","Pending"]].map((r)=>(
            <tr key={r[0]}>{r.map((x,i)=><td key={i} className="p-1.5 border border-[#0b1733]/10">{x}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <Section n="2" title="Screening Result" />
      <div className="grid grid-cols-3 gap-2">
        {[["Sanctions","Clear"],["Watchlist","Clear"],["Adverse media","Clear"]].map(([k,v])=>(
          <div key={k} className="border border-emerald-200 bg-emerald-50 rounded p-2">
            <div className="text-[8px] uppercase tracking-wider text-emerald-700/70">{k}</div>
            <div className="text-[12px] font-bold text-emerald-700">{v}</div>
          </div>
        ))}
      </div>
      <Footer page={2} total={total} refId={refId} />
    </Sheet>
  );
  return (
    <Sheet>
      <Header subtitle="Sign-off" refId={refId} status={status} />
      <Section n="A" title="Officer Declaration" />
      <div className="leading-[1.7] text-[#0b1733]/85 text-justify">I confirm that the references collected for the client named in this file have been reviewed against our internal verification standards. All listed checklist items have been completed except where a pending status is shown.</div>
      <Section n="B" title="Approvals" />
      <div className="flex flex-wrap">
        <Field label="Reviewed by" value="Priya Menon" />
        <Field label="Reviewed on" value="2026-04-15" />
        <Field label="Approved by" value="K. Tan" />
        <Field label="Approved on" value="2026-04-16" />
      </div>
      <Signatures name={c?.name || "Client"} />
      <Stamp />
      <Footer page={3} total={total} refId={refId} />
    </Sheet>
  );
}

function travel({ client, refId, status }: RenderArgs, page: number) {
  const total = 3;
  if (page === 0) return (
    <Sheet>
      <Header subtitle="Travel Itinerary" refId={refId} status={status} />
      <Section n="1" title="Trip Summary" />
      <div className="flex flex-wrap">
        <Field label="Traveller" value={client?.name || "—"} />
        <Field label="Reference" value={client?.reference || "—"} />
        <Field label="Departure" value="Singapore (SIN)" />
        <Field label="Arrival" value="London (LHR)" />
        <Field label="Date" value="14 July 2026" />
        <Field label="Return" value="28 July 2026" />
      </div>
      <Section n="2" title="Flight Segments" />
      <table className="w-full border-collapse">
        <thead className="bg-[#003B73] text-white"><tr>{["Date","From → To","Carrier","Flight","Class"].map((h)=><th key={h} className="text-left p-1.5">{h}</th>)}</tr></thead>
        <tbody>
          {[["14 Jul","SIN → LHR","VH Air","VH 218","Economy"],["18 Jul","LHR → CDG","VH Air","VH 042","Economy"],["22 Jul","CDG → AMS","VH Air","VH 113","Economy"],["28 Jul","AMS → SIN","VH Air","VH 219","Economy"]].map((r,i)=>(
            <tr key={i} className={i%2?"bg-[#0b1733]/[0.03]":""}>{r.map((x,j)=><td key={j} className="p-1.5 border-b border-[#0b1733]/10">{x}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <Stamp />
      <Footer page={1} total={total} refId={refId} />
    </Sheet>
  );
  if (page === 1) return (
    <Sheet>
      <Header subtitle="Accommodation & Ground Transport" refId={refId} status={status} />
      <Section n="3" title="Accommodation" />
      <div className="space-y-1.5">
        {[["14–18 Jul","The Strand House, London","Confirmed"],["18–22 Jul","Rive Gauche Hotel, Paris","Confirmed"],["22–28 Jul","Canal View Suites, Amsterdam","Confirmed"]].map((r)=>(
          <div key={r[0]} className="flex items-center justify-between border border-[#0b1733]/10 rounded px-2.5 py-1.5">
            <div><span className="font-mono text-[#0b1733]/60 mr-3">{r[0]}</span>{r[1]}</div>
            <span className="text-emerald-700 font-semibold text-[9px]">{r[2]}</span>
          </div>
        ))}
      </div>
      <Section n="4" title="Ground Transport" />
      <table className="w-full border-collapse">
        <thead className="bg-[#0b1733]/[0.04]"><tr>{["Date","City","Service","Reference"].map((h)=><th key={h} className="text-left p-1.5 border border-[#0b1733]/10">{h}</th>)}</tr></thead>
        <tbody>
          {[["14 Jul","London","Airport transfer","LDN-2241"],["18 Jul","Paris","Rail Eurostar","EUR-7782"],["22 Jul","Amsterdam","High-speed rail","AMS-5510"],["28 Jul","Singapore","Airport transfer","SIN-9911"]].map((r,i)=>(
            <tr key={i}>{r.map((x,j)=><td key={j} className="p-1.5 border border-[#0b1733]/10">{x}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <Footer page={2} total={total} refId={refId} />
    </Sheet>
  );
  return (
    <Sheet>
      <Header subtitle="Officer Notes & Approvals" refId={refId} status={status} />
      <Section n="5" title="Notes" />
      <div className="leading-[1.7] text-[#0b1733]/85 text-justify">All bookings are non-refundable. Travel insurance has been arranged through our partner provider and the policy reference is on file. Daily allowances and meal vouchers are listed in the supporting schedule.</div>
      <Section n="6" title="Approvals" />
      <div className="flex flex-wrap">
        <Field label="Prepared by" value="VH Travel Desk" />
        <Field label="Prepared on" value="2026-05-21" />
        <Field label="Approved by" value="K. Tan" />
        <Field label="Approved on" value="2026-05-22" />
      </div>
      <Signatures name={client?.name || "Client"} />
      <Stamp />
      <Footer page={3} total={total} refId={refId} />
    </Sheet>
  );
}

function agreement({ client, refId, status }: RenderArgs, page: number) {
  const c = client; const total = 3;
  if (page === 0) return (
    <Sheet>
      <Header subtitle="Service Agreement" refId={refId} status={status} />
      <h1 className="text-center font-black text-[16px] mt-4 tracking-tight">CONSULTANCY SERVICE AGREEMENT</h1>
      <div className="text-center text-[9px] uppercase tracking-widest text-[#0b1733]/60">Between VisaHOBe PTE. LTD. and the Client named below</div>
      <Section n="1" title="Parties" />
      <div className="leading-[1.7]">
        <p><span className="font-semibold">VisaHOBe PTE. LTD.</span> (UEN 202612345K), 10 Anson Road #14-06, Singapore 079903 ("the Company")</p>
        <p className="mt-1.5"><span className="font-semibold">{c?.name}</span>, {c?.country}, reference <span className="font-mono">{c?.reference}</span> ("the Client")</p>
      </div>
      <Section n="2" title="Scope of Services" />
      <ol className="leading-[1.7] list-decimal pl-5 space-y-0.5 text-[#0b1733]/85">
        <li>Secure custody of all documents uploaded by the Client to the VisaHOBe Vault.</li>
        <li>Internal review, categorisation and quality assurance of submitted documents.</li>
        <li>Weekly status updates through the Client portal and email notifications.</li>
        <li>Support handover at completion, including a digital archive of all approved records.</li>
      </ol>
      <Section n="3" title="Confidentiality" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">The Company shall hold all Client information in strict confidence. Information may only be disclosed to authorised personnel and shall not be shared with any third party without the Client's prior written consent, save where required by Singapore law.</div>
      <Footer page={1} total={total} refId={refId} />
    </Sheet>
  );
  if (page === 1) return (
    <Sheet>
      <Header subtitle="Service Agreement (cont.)" refId={refId} status={status} />
      <Section n="4" title="Term & Termination" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">This Agreement shall commence on the date of signature and continue for twelve (12) months unless terminated earlier by either party with thirty (30) days written notice. Any documents in custody shall be returned within seven (7) days of termination.</div>
      <Section n="5" title="Fees" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">The Client shall pay the engagement fees as outlined in the attached schedule. All fees are exclusive of GST and shall be invoiced monthly.</div>
      <Section n="6" title="Liability" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">The Company's total liability under this Agreement shall be limited to the fees paid by the Client during the twelve (12) months preceding any claim. The Company shall not be liable for any indirect or consequential loss.</div>
      <Section n="7" title="Governing Law" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.</div>
      <Footer page={2} total={total} refId={refId} />
    </Sheet>
  );
  return (
    <Sheet>
      <Header subtitle="Acknowledgement & Signatures" refId={refId} status={status} />
      <Section n="8" title="Acknowledgement" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">By signing below the parties confirm that they have read, understood and agreed to be bound by the terms of this Agreement. Each party has had the opportunity to take independent advice prior to signature.</div>
      <Section n="9" title="Execution" />
      <div className="flex flex-wrap">
        <Field label="Place of execution" value="Singapore" />
        <Field label="Date" value="07 June 2026" />
        <Field label="Witness" value="Priya Menon" />
        <Field label="Counterpart" value="1 of 1" />
      </div>
      <Signatures name={c?.name || "Client"} />
      <Stamp />
      <Footer page={3} total={total} refId={refId} />
    </Sheet>
  );
}

function medical({ client, refId, status }: RenderArgs, page: number) {
  const c = client; const total = 3;
  if (page === 0) return (
    <Sheet>
      <Header subtitle="Medical Summary (Internal)" refId={refId} status={status} />
      <div className="text-[9px] mt-2 italic text-[#0b1733]/60">Summary prepared by VisaHOBe for internal case-management only. Original clinical records remain with the issuing practitioner.</div>
      <Section n="A" title="Patient Reference" />
      <div className="flex flex-wrap">
        <Field label="Client" value={c?.name || "—"} />
        <Field label="Reference" value={c?.reference || "—"} />
        <Field label="Country" value={c?.country || "—"} />
        <Field label="Summary Date" value="04 June 2026" />
      </div>
      <Section n="B" title="Wellness Indicators" />
      <div className="space-y-1.5">
        {[["General health",88],["Vaccinations on file",100],["Allergies recorded",30],["Fitness clearance",92]].map(([k,v]:any)=>(
          <div key={k}>
            <div className="flex justify-between text-[9px] mb-0.5"><span>{k}</span><span className="font-mono">{v}%</span></div>
            <div className="h-1.5 rounded-full bg-[#0b1733]/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#003B73] to-[#177BBB]" style={{width:`${v}%`}}/></div>
          </div>
        ))}
      </div>
      <Stamp />
      <Footer page={1} total={total} refId={refId} />
    </Sheet>
  );
  if (page === 1) return (
    <Sheet>
      <Header subtitle="Clinical History (Summary)" refId={refId} status={status} />
      <Section n="C" title="Vaccinations" />
      <table className="w-full border-collapse">
        <thead className="bg-[#0b1733]/[0.04]"><tr>{["Vaccine","Date","Practitioner"].map((h)=><th key={h} className="text-left p-1.5 border border-[#0b1733]/10">{h}</th>)}</tr></thead>
        <tbody>
          {[["MMR","2018-04-10","Dr. L. Goh"],["Tetanus booster","2023-11-02","Dr. M. Iyer"],["Influenza","2025-10-14","Dr. S. Lim"],["Hepatitis A & B","2024-06-22","Dr. L. Goh"]].map((r)=>(
            <tr key={r[0]}>{r.map((x,i)=><td key={i} className="p-1.5 border border-[#0b1733]/10">{x}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <Section n="D" title="Conditions on File" />
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <Check on={false} label="Chronic condition" />
          <Check on={false} label="Long-term medication" />
          <Check on label="Routine annual review" />
        </div>
        <div>
          <Check on label="Family GP on record" />
          <Check on={false} label="Specialist referral" />
          <Check on label="Insurance details up to date" />
        </div>
      </div>
      <Footer page={2} total={total} refId={refId} />
    </Sheet>
  );
  return (
    <Sheet>
      <Header subtitle="Officer Notes & Sign-off" refId={refId} status={status} />
      <Section n="E" title="Notes" />
      <div className="border border-[#0b1733]/15 rounded p-2.5 leading-relaxed text-[#0b1733]/80 min-h-[80px]">
        All routine vaccinations are on file. Client reports no chronic conditions or long-term medication. Awaiting one outstanding clearance letter from the family practitioner before the case can be moved to the next review stage.
      </div>
      <Section n="F" title="Approvals" />
      <div className="flex flex-wrap">
        <Field label="Prepared by" value="Wellness Desk" />
        <Field label="Reviewed by" value="Dr. M. Iyer (panel)" />
        <Field label="Reviewed on" value="2026-06-04" />
        <Field label="Next review" value="2027-06-04" />
      </div>
      <Signatures name={c?.name || "Client"} />
      <Stamp />
      <Footer page={3} total={total} refId={refId} />
    </Sheet>
  );
}

function other({ client, refId, status, name }: RenderArgs, page: number) {
  const total = 3;
  if (page === 0) return (
    <Sheet>
      <Header subtitle="Internal Document" refId={refId} status={status} />
      <h2 className="font-bold text-[14px] mt-4">{name}</h2>
      <div className="text-[9px] text-[#0b1733]/60 mt-1">Filed under client {client?.reference || "—"} · {client?.name || "—"}</div>
      <Section n="1" title="Overview" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">This document has been stored in the VisaHOBe vault as part of the client's ongoing engagement. The content has been categorised, indexed and is accessible to authorised members of the case team. A full audit trail is preserved for every access event.</div>
      <Section n="2" title="Indexed Fields" />
      <div className="flex flex-wrap">
        <Field label="Client" value={client?.name || "—"} />
        <Field label="Reference" value={client?.reference || "—"} />
        <Field label="Category" value="Other" />
        <Field label="Visibility" value="Private" />
      </div>
      <Stamp />
      <Footer page={1} total={total} refId={refId} />
    </Sheet>
  );
  if (page === 1) return (
    <Sheet>
      <Header subtitle="Audit Trail" refId={refId} status={status} />
      <Section n="3" title="Recent Events" />
      <div className="space-y-1">
        {[["07 Jun 2026 09:42","Uploaded by VH Officer"],["07 Jun 2026 10:15","Categorised as Other"],["07 Jun 2026 11:03","Moved to secure vault"],["07 Jun 2026 14:21","Reviewed by Compliance"],["08 Jun 2026 08:07","Accessed by case team"],["08 Jun 2026 16:55","Tagged for archive"]].map(([t,e])=>(
          <div key={t} className="flex gap-3 border-b border-[#0b1733]/10 pb-1">
            <span className="font-mono text-[#0b1733]/55 w-28 shrink-0">{t}</span>
            <span>{e}</span>
          </div>
        ))}
      </div>
      <Footer page={2} total={total} refId={refId} />
    </Sheet>
  );
  return (
    <Sheet>
      <Header subtitle="Retention & Sign-off" refId={refId} status={status} />
      <Section n="4" title="Retention" />
      <div className="leading-[1.7] text-justify text-[#0b1733]/85">This record will be retained for seven (7) years in line with our records-management policy. Early deletion may be requested in writing by the client, subject to legal and regulatory obligations.</div>
      <Section n="5" title="Sign-off" />
      <div className="flex flex-wrap">
        <Field label="Reviewed by" value="Priya Menon" />
        <Field label="Reviewed on" value="2026-06-07" />
        <Field label="Approved by" value="K. Tan" />
        <Field label="Approved on" value="2026-06-07" />
      </div>
      <Signatures name={client?.name || "Client"} />
      <Stamp />
      <Footer page={3} total={total} refId={refId} />
    </Sheet>
  );
}

const renderers: Record<FileCategory, (a: RenderArgs, p: number) => React.ReactNode> = {
  "Company Letter": companyLetter,
  "Identity": identity,
  "Travel": travel,
  "Agreement": agreement,
  "Medical": medical,
  "Other": other,
};

export function DemoPage({
  name, status, category, client, fileId, page,
}: { name: string; status: string; category: FileCategory; client?: DocClient; fileId: string; page: number }) {
  const refId = recordIdFor(fileId);
  return <>{renderers[category]({ name, status, client, refId, category }, page)}</>;
}
