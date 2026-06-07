import { FileCategory } from "@/lib/types";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface Props {
  name: string;
  status: string;
  category: FileCategory;
  client?: { name: string; reference: string; country: string; email: string; phone: string };
  fileId: string;
}

const A4 = "w-full max-w-[794px] mx-auto aspect-[1/1.414] bg-white text-[#0b1733] shadow-elevated rounded-2xl relative overflow-hidden";

function Watermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
      <div className="text-[80px] font-black tracking-[0.3em] rotate-[-28deg] text-[#0b1733]/[0.04] whitespace-nowrap">
        VISAHOBE · INTERNAL
      </div>
    </div>
  );
}

function Header({ subtitle, refId, status }: { subtitle: string; refId: string; status: string }) {
  return (
    <div className="flex items-start justify-between border-b-2 border-[#0b1733] pb-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#003B73] to-[#E63946] text-white font-black flex items-center justify-center text-lg shadow-sm">VH</div>
        <div>
          <div className="font-bold text-[15px] tracking-tight">VisaHOBe PTE. LTD.</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#0b1733]/60 mt-0.5">{subtitle}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" /> {status.toUpperCase()}
        </div>
        <div className="text-[9px] text-[#0b1733]/50 mt-1.5 font-mono">{refId}</div>
      </div>
    </div>
  );
}

function Footer({ page, total, refId }: { page: number; total: number; refId: string }) {
  return (
    <div className="absolute bottom-6 inset-x-10 flex items-center justify-between text-[9px] text-[#0b1733]/50 border-t border-[#0b1733]/10 pt-2.5">
      <span className="font-mono">{refId}</span>
      <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> visahobe.com · confidential</span>
      <span>Page {page} of {total}</span>
    </div>
  );
}

function Field({ label, value, w = "w-1/2" }: { label: string; value: string; w?: string }) {
  return (
    <div className={`${w} pr-4 mb-3`}>
      <div className="text-[8px] uppercase tracking-[0.15em] text-[#0b1733]/50 font-semibold">{label}</div>
      <div className="text-[12px] font-medium mt-0.5 border-b border-[#0b1733]/15 pb-1">{value}</div>
    </div>
  );
}

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-3">
      <div className="h-5 w-5 rounded bg-[#003B73] text-white text-[10px] font-bold flex items-center justify-center">{n}</div>
      <div className="text-[11px] uppercase tracking-[0.15em] font-bold text-[#003B73]">{title}</div>
      <div className="flex-1 h-px bg-[#0b1733]/10" />
    </div>
  );
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className={`h-3.5 w-3.5 border-[1.5px] border-[#0b1733] flex items-center justify-center ${checked ? "bg-[#003B73]" : "bg-white"}`}>
        {checked && <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-white"><path fill="none" stroke="currentColor" strokeWidth="2.2" d="M2 6l3 3 5-6" /></svg>}
      </div>
      <div className="text-[11px]">{label}</div>
    </div>
  );
}

function SignatureBlock({ name }: { name: string }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-8">
      <div>
        <div className="h-10 border-b border-[#0b1733]/40 italic text-[#003B73] font-serif text-lg flex items-end pb-0.5">~{name.split(" ")[0]}~</div>
        <div className="text-[9px] uppercase tracking-wider text-[#0b1733]/60 mt-1">Client signature</div>
      </div>
      <div>
        <div className="h-10 border-b border-[#0b1733]/40 italic text-[#003B73] font-serif text-lg flex items-end pb-0.5">~VH Officer~</div>
        <div className="text-[9px] uppercase tracking-wider text-[#0b1733]/60 mt-1">Authorised officer</div>
      </div>
    </div>
  );
}

function Stamp() {
  return (
    <div className="absolute right-10 bottom-24 h-24 w-24 rounded-full border-[2.5px] border-[#E63946] text-[#E63946] flex flex-col items-center justify-center rotate-[-12deg] opacity-80">
      <div className="text-[8px] font-bold tracking-widest">VISAHOBE</div>
      <div className="text-[10px] font-black">VERIFIED</div>
      <div className="text-[7px] mt-0.5">2026 · SG</div>
    </div>
  );
}

/* ---------- CATEGORY PAGES ---------- */

function CompanyLetterPages({ client, refId, status }: any) {
  const c = client;
  return (
    <>
      <div className={A4}>
        <Watermark />
        <div className="relative px-10 pt-8 pb-20 h-full">
          <Header subtitle="Internal Company Letter" refId={refId} status={status} />
          <div className="mt-8 text-[11px] text-[#0b1733]/70">
            <div>10 Anson Road, #14-06 International Plaza</div>
            <div>Singapore 079903 · UEN 202612345K</div>
          </div>
          <div className="mt-6 text-[11px]">Date: <span className="font-medium">07 June 2026</span></div>
          <div className="mt-6">
            <div className="text-[11px]">To,</div>
            <div className="text-[13px] font-semibold mt-1">{c?.name || "Valued Client"}</div>
            <div className="text-[11px] text-[#0b1733]/70">{c?.email} · {c?.phone}</div>
          </div>
          <div className="mt-6 text-[12px] font-bold underline">Subject: Confirmation of Engagement & Document Custody</div>
          <div className="mt-4 text-[11.5px] leading-[1.7] text-[#0b1733]/85 text-justify space-y-3">
            <p>Dear {c?.name?.split(" ")[0] || "Client"},</p>
            <p>This letter serves as formal confirmation that VisaHOBe PTE. LTD. has received and acknowledged the documents submitted under client reference <span className="font-mono font-semibold">{c?.reference}</span>. Our compliance team has reviewed the initial submission and the file has been moved to the secure company vault for ongoing case management.</p>
            <p>Your case has been assigned to a dedicated relationship officer who will coordinate all communication and provide weekly progress updates. All physical and digital documents remain the property of the client and may be retrieved at any time upon written request through our client portal.</p>
            <p>We thank you for choosing VisaHOBe and look forward to delivering a smooth, transparent and timely service.</p>
          </div>
          <SignatureBlock name={c?.name || "Client"} />
          <Stamp />
          <Footer page={1} total={2} refId={refId} />
        </div>
      </div>
      <div className={A4 + " mt-6"}>
        <Watermark />
        <div className="relative px-10 pt-8 pb-20 h-full">
          <Header subtitle="Engagement Schedule" refId={refId} status={status} />
          <SectionTitle n="1" title="Service Summary" />
          <div className="text-[11.5px] leading-[1.7] text-[#0b1733]/85 text-justify">VisaHOBe will provide end-to-end consultancy services including document preparation, review, secure storage and timeline tracking. Service level commitments are listed below.</div>
          <SectionTitle n="2" title="Milestones" />
          <table className="w-full text-[11px] border-collapse">
            <thead className="bg-[#0b1733]/[0.04]">
              <tr><th className="text-left p-2 border border-[#0b1733]/10">Stage</th><th className="text-left p-2 border border-[#0b1733]/10">Owner</th><th className="text-left p-2 border border-[#0b1733]/10">Target</th><th className="text-left p-2 border border-[#0b1733]/10">Status</th></tr>
            </thead>
            <tbody>
              {[
                ["Document intake", "VH Officer", "Day 1", "Complete"],
                ["Compliance review", "Compliance", "Day 3", "Complete"],
                ["Quality assurance", "QA Lead", "Day 5", "In progress"],
                ["Client confirmation", "Client", "Day 7", "Pending"],
                ["Archive & handover", "VH Officer", "Day 10", "Pending"],
              ].map((r) => (
                <tr key={r[0]}><td className="p-2 border border-[#0b1733]/10">{r[0]}</td><td className="p-2 border border-[#0b1733]/10">{r[1]}</td><td className="p-2 border border-[#0b1733]/10">{r[2]}</td><td className="p-2 border border-[#0b1733]/10 font-medium">{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
          <SectionTitle n="3" title="Fee Schedule" />
          <div className="grid grid-cols-2 gap-x-4 text-[11px]">
            <Field label="Engagement Fee" value="SGD 1,200.00" />
            <Field label="Processing Fee" value="SGD 380.00" />
            <Field label="Vault Storage (12 mo)" value="SGD 90.00" />
            <Field label="Total Payable" value="SGD 1,670.00" />
          </div>
          <Footer page={2} total={2} refId={refId} />
        </div>
      </div>
    </>
  );
}

function IdentityPages({ client, refId, status }: any) {
  const c = client;
  return (
    <div className={A4}>
      <Watermark />
      <div className="relative px-10 pt-8 pb-20 h-full">
        <Header subtitle="Identity Reference Sheet" refId={refId} status={status} />
        <SectionTitle n="A" title="Personal Particulars" />
        <div className="flex gap-5 mt-2">
          <div className="w-28 h-36 border-2 border-dashed border-[#0b1733]/30 rounded flex items-center justify-center text-[9px] text-[#0b1733]/50 text-center px-2">CLIENT PHOTO (on file)</div>
          <div className="flex-1 flex flex-wrap">
            <Field label="Full Name" value={c?.name || "—"} />
            <Field label="Reference" value={c?.reference || "—"} />
            <Field label="Country" value={c?.country || "—"} />
            <Field label="Date Joined" value="2026-04-12" />
            <Field label="Email" value={c?.email || "—"} />
            <Field label="Phone" value={c?.phone || "—"} />
          </div>
        </div>
        <SectionTitle n="B" title="Internal Verification Checklist" />
        <div className="grid grid-cols-2 gap-x-6">
          <div>
            <Checkbox checked label="Name confirmed against intake form" />
            <Checkbox checked label="Contact details validated" />
            <Checkbox checked label="Address proof received" />
            <Checkbox checked={false} label="Secondary reference pending" />
          </div>
          <div>
            <Checkbox checked label="Client agreement signed" />
            <Checkbox checked label="Privacy notice acknowledged" />
            <Checkbox checked label="Vault access provisioned" />
            <Checkbox checked={false} label="Final officer sign-off" />
          </div>
        </div>
        <SectionTitle n="C" title="Officer Notes" />
        <div className="border border-[#0b1733]/15 rounded p-3 text-[11px] leading-relaxed text-[#0b1733]/80 min-h-[80px]">
          Client onboarded through the Singapore office. All identity references match the intake form. Awaiting one secondary reference letter before moving the case to compliance review. No flags raised by the screening team.
        </div>
        <SignatureBlock name={c?.name || "Client"} />
        <Stamp />
        <Footer page={1} total={1} refId={refId} />
      </div>
    </div>
  );
}

function TravelPages({ client, refId, status }: any) {
  return (
    <div className={A4}>
      <Watermark />
      <div className="relative px-10 pt-8 pb-20 h-full">
        <Header subtitle="Travel Itinerary" refId={refId} status={status} />
        <SectionTitle n="1" title="Trip Summary" />
        <div className="grid grid-cols-2 gap-x-4 flex-wrap flex">
          <Field label="Traveller" value={client?.name || "—"} />
          <Field label="Reference" value={client?.reference || "—"} />
          <Field label="Departure" value="Singapore (SIN)" />
          <Field label="Arrival" value="London (LHR)" />
          <Field label="Date" value="14 July 2026" />
          <Field label="Return" value="28 July 2026" />
        </div>
        <SectionTitle n="2" title="Flight Segments" />
        <table className="w-full text-[10.5px] border-collapse">
          <thead className="bg-[#003B73] text-white">
            <tr><th className="text-left p-2">Date</th><th className="text-left p-2">From → To</th><th className="text-left p-2">Carrier</th><th className="text-left p-2">Flight</th><th className="text-left p-2">Class</th></tr>
          </thead>
          <tbody>
            {[
              ["14 Jul", "SIN → LHR", "VH Air", "VH 218", "Economy"],
              ["18 Jul", "LHR → CDG", "VH Air", "VH 042", "Economy"],
              ["22 Jul", "CDG → AMS", "VH Air", "VH 113", "Economy"],
              ["28 Jul", "AMS → SIN", "VH Air", "VH 219", "Economy"],
            ].map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-[#0b1733]/[0.03]" : ""}>{r.map((x, j) => <td key={j} className="p-2 border-b border-[#0b1733]/10">{x}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <SectionTitle n="3" title="Accommodation" />
        <div className="space-y-2">
          {[
            ["14–18 Jul", "The Strand House, London", "Confirmed"],
            ["18–22 Jul", "Rive Gauche Hotel, Paris", "Confirmed"],
            ["22–28 Jul", "Canal View Suites, Amsterdam", "Confirmed"],
          ].map((r) => (
            <div key={r[0]} className="flex items-center justify-between border border-[#0b1733]/10 rounded px-3 py-2 text-[11px]">
              <div><span className="font-mono text-[#0b1733]/60 mr-3">{r[0]}</span>{r[1]}</div>
              <span className="text-emerald-700 font-semibold text-[10px]">{r[2]}</span>
            </div>
          ))}
        </div>
        <Stamp />
        <Footer page={1} total={1} refId={refId} />
      </div>
    </div>
  );
}

function AgreementPages({ client, refId, status }: any) {
  const c = client;
  return (
    <>
      <div className={A4}>
        <Watermark />
        <div className="relative px-10 pt-8 pb-20 h-full">
          <Header subtitle="Service Agreement" refId={refId} status={status} />
          <h1 className="text-center font-black text-[18px] mt-6 tracking-tight">CONSULTANCY SERVICE AGREEMENT</h1>
          <div className="text-center text-[10px] uppercase tracking-widest text-[#0b1733]/60">Between VisaHOBe PTE. LTD. and the Client named below</div>
          <SectionTitle n="1" title="Parties" />
          <div className="text-[11.5px] leading-[1.7]">
            <p><span className="font-semibold">VisaHOBe PTE. LTD.</span> (UEN 202612345K), 10 Anson Road #14-06, Singapore 079903 ("the Company")</p>
            <p className="mt-2"><span className="font-semibold">{c?.name}</span>, {c?.country}, reference <span className="font-mono">{c?.reference}</span> ("the Client")</p>
          </div>
          <SectionTitle n="2" title="Scope of Services" />
          <ol className="text-[11px] leading-[1.7] list-decimal pl-5 space-y-1 text-[#0b1733]/85">
            <li>Secure custody of all documents uploaded by the Client to the VisaHOBe Vault.</li>
            <li>Internal review, categorisation and quality assurance of submitted documents.</li>
            <li>Weekly status updates through the Client portal and email notifications.</li>
            <li>Support handover at completion, including a digital archive of all approved records.</li>
          </ol>
          <SectionTitle n="3" title="Confidentiality" />
          <div className="text-[11px] leading-[1.7] text-justify text-[#0b1733]/85">The Company shall hold all Client information in strict confidence. Information may only be disclosed to authorised personnel and shall not be shared with any third party without the Client's prior written consent, save where required by Singapore law.</div>
          <Footer page={1} total={2} refId={refId} />
        </div>
      </div>
      <div className={A4 + " mt-6"}>
        <Watermark />
        <div className="relative px-10 pt-8 pb-20 h-full">
          <Header subtitle="Service Agreement (cont.)" refId={refId} status={status} />
          <SectionTitle n="4" title="Term & Termination" />
          <div className="text-[11px] leading-[1.7] text-justify text-[#0b1733]/85">This Agreement shall commence on the date of signature and continue for twelve (12) months unless terminated earlier by either party with thirty (30) days written notice. Any documents in custody shall be returned within seven (7) days of termination.</div>
          <SectionTitle n="5" title="Fees" />
          <div className="text-[11px] leading-[1.7] text-justify text-[#0b1733]/85">The Client shall pay the engagement fees as outlined in the attached schedule. All fees are exclusive of GST and shall be invoiced monthly.</div>
          <SectionTitle n="6" title="Governing Law" />
          <div className="text-[11px] leading-[1.7] text-justify text-[#0b1733]/85">This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.</div>
          <SectionTitle n="7" title="Acknowledgement" />
          <div className="text-[11px] leading-[1.7] text-justify text-[#0b1733]/85">By signing below the parties confirm that they have read, understood and agreed to be bound by the terms of this Agreement.</div>
          <SignatureBlock name={c?.name || "Client"} />
          <Stamp />
          <Footer page={2} total={2} refId={refId} />
        </div>
      </div>
    </>
  );
}

function MedicalPages({ client, refId, status }: any) {
  const c = client;
  return (
    <div className={A4}>
      <Watermark />
      <div className="relative px-10 pt-8 pb-20 h-full">
        <Header subtitle="Medical Summary (Internal)" refId={refId} status={status} />
        <div className="text-[10px] mt-3 italic text-[#0b1733]/60">Summary prepared by VisaHOBe for internal case-management only. Original clinical records remain with the issuing practitioner.</div>
        <SectionTitle n="A" title="Patient Reference" />
        <div className="grid grid-cols-2 gap-x-4 flex-wrap flex">
          <Field label="Client" value={c?.name || "—"} />
          <Field label="Reference" value={c?.reference || "—"} />
          <Field label="Country" value={c?.country || "—"} />
          <Field label="Summary Date" value="04 June 2026" />
        </div>
        <SectionTitle n="B" title="Wellness Indicators" />
        <div className="space-y-2">
          {[
            ["General health", 88], ["Vaccinations on file", 100], ["Allergies recorded", 30], ["Fitness clearance", 92],
          ].map(([k, v]: any) => (
            <div key={k}>
              <div className="flex justify-between text-[10px] mb-0.5"><span>{k}</span><span className="font-mono">{v}%</span></div>
              <div className="h-2 rounded-full bg-[#0b1733]/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#003B73] to-[#177BBB]" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </div>
        <SectionTitle n="C" title="Notes" />
        <div className="border border-[#0b1733]/15 rounded p-3 text-[11px] leading-relaxed text-[#0b1733]/80 min-h-[120px]">
          All routine vaccinations are on file. Client reports no chronic conditions or long-term medication. Awaiting one outstanding clearance letter from the family practitioner before the case can be moved to the next review stage.
        </div>
        <SignatureBlock name={c?.name || "Client"} />
        <Stamp />
        <Footer page={1} total={1} refId={refId} />
      </div>
    </div>
  );
}

function OtherPages({ client, refId, status, name }: any) {
  return (
    <div className={A4}>
      <Watermark />
      <div className="relative px-10 pt-8 pb-20 h-full">
        <Header subtitle="Internal Document" refId={refId} status={status} />
        <h2 className="font-bold text-[16px] mt-6">{name}</h2>
        <div className="text-[10px] text-[#0b1733]/60 mt-1">Filed under client {client?.reference || "—"} · {client?.name || "—"}</div>
        <SectionTitle n="1" title="Overview" />
        <div className="text-[11.5px] leading-[1.7] text-justify text-[#0b1733]/85">This document has been stored in the VisaHOBe vault as part of the client's ongoing engagement. The content has been categorised, indexed and is accessible to authorised members of the case team. A full audit trail is preserved for every access event.</div>
        <SectionTitle n="2" title="Indexed Fields" />
        <div className="grid grid-cols-2 gap-x-4 flex-wrap flex">
          <Field label="Client" value={client?.name || "—"} />
          <Field label="Reference" value={client?.reference || "—"} />
          <Field label="Category" value="Other" />
          <Field label="Visibility" value="Private" />
        </div>
        <SectionTitle n="3" title="Audit Trail" />
        <div className="space-y-1.5 text-[11px]">
          {[
            ["07 Jun 2026 09:42", "Uploaded by VH Officer"],
            ["07 Jun 2026 10:15", "Categorised as Other"],
            ["07 Jun 2026 11:03", "Moved to secure vault"],
            ["07 Jun 2026 14:21", "Reviewed by Compliance"],
          ].map(([t, e]) => (
            <div key={t} className="flex gap-3 border-b border-[#0b1733]/10 pb-1">
              <span className="font-mono text-[#0b1733]/55 w-32 shrink-0">{t}</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
        <Stamp />
        <Footer page={1} total={1} refId={refId} />
      </div>
    </div>
  );
}

export default function DemoDocument({ name, status, category, client, fileId }: Props) {
  const refId = `VH-${fileId.toUpperCase().slice(-6).padStart(6, "0")}`;
  const props = { client, refId, status, name };
  switch (category) {
    case "Company Letter": return <CompanyLetterPages {...props} />;
    case "Identity": return <IdentityPages {...props} />;
    case "Travel": return <TravelPages {...props} />;
    case "Agreement": return <AgreementPages {...props} />;
    case "Medical": return <MedicalPages {...props} />;
    default: return <OtherPages {...props} />;
  }
}
