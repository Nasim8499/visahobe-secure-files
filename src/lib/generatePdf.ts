import jsPDF from "jspdf";
import { FileCategory } from "./types";

export interface PdfClient { name: string; reference: string; country: string; email: string; phone: string }

const NAVY: [number, number, number] = [0, 59, 115];
const INK: [number, number, number] = [11, 23, 51];
const MUTED: [number, number, number] = [110, 120, 140];
const GREEN: [number, number, number] = [4, 120, 87];
const RED: [number, number, number] = [230, 57, 70];

const TOTAL = 3;

function header(doc: jsPDF, subtitle: string, refId: string, status: string) {
  // Logo
  doc.setFillColor(...NAVY); doc.roundedRect(15, 12, 12, 12, 2, 2, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
  doc.text("VH", 21, 19.6, { align: "center" });
  // Title
  doc.setTextColor(...INK); doc.setFontSize(13);
  doc.text("VisaHOBe PTE. LTD.", 30, 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(...MUTED);
  doc.text(subtitle.toUpperCase(), 30, 22.5, { charSpace: 0.5 });
  // Status badge
  doc.setFillColor(236, 253, 245); doc.setDrawColor(167, 243, 208);
  doc.roundedRect(160, 13, 35, 5.5, 2.5, 2.5, "FD");
  doc.setTextColor(...GREEN); doc.setFontSize(7); doc.setFont("helvetica", "bold");
  doc.text(status.toUpperCase(), 177.5, 16.8, { align: "center" });
  doc.setTextColor(...MUTED); doc.setFont("courier", "normal"); doc.setFontSize(7);
  doc.text(refId, 195, 22.5, { align: "right" });
  // Bottom rule
  doc.setDrawColor(...INK); doc.setLineWidth(0.7); doc.line(15, 27, 195, 27);
}

function footer(doc: jsPDF, page: number, refId: string) {
  doc.setDrawColor(220); doc.setLineWidth(0.2); doc.line(15, 283, 195, 283);
  doc.setFontSize(7); doc.setTextColor(...MUTED);
  doc.setFont("courier", "normal"); doc.text(refId, 15, 288);
  doc.setFont("helvetica", "normal"); doc.text("visahobe.com  ·  confidential — internal use only", 105, 288, { align: "center" });
  doc.text(`Page ${page} of ${TOTAL}`, 195, 288, { align: "right" });
}

function watermark(doc: jsPDF) {
  const g = (doc as any).GState ? new (doc as any).GState({ opacity: 0.05 }) : null;
  if (g) (doc as any).setGState(g);
  doc.setTextColor(...INK); doc.setFont("helvetica", "bold"); doc.setFontSize(54);
  doc.text("VISAHOBE  ·  INTERNAL", 105, 165, { align: "center", angle: 28 });
  if (g) (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
}

function section(doc: jsPDF, n: string, title: string, y: number) {
  doc.setFillColor(...NAVY); doc.roundedRect(15, y - 3.6, 5, 5, 0.8, 0.8, "F");
  doc.setTextColor(255); doc.setFontSize(7); doc.setFont("helvetica", "bold");
  doc.text(n, 17.5, y - 0.1, { align: "center" });
  doc.setTextColor(...NAVY); doc.setFontSize(9);
  doc.text(title.toUpperCase(), 22, y, { charSpace: 0.4 });
  const tw = doc.getTextWidth(title.toUpperCase()) + 26;
  doc.setDrawColor(220); doc.setLineWidth(0.3); doc.line(tw, y - 1, 195, y - 1);
  return y + 6;
}

function paragraph(doc: jsPDF, text: string, y: number, maxWidth = 180) {
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(40);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, 15, y, { lineHeightFactor: 1.5 });
  return y + lines.length * 4.8;
}

function fields(doc: jsPDF, rows: [string, string][], y: number) {
  doc.setFontSize(7); const col = [15, 110]; let row = 0;
  rows.forEach((r, i) => {
    const x = col[i % 2]; const cy = y + Math.floor(i / 2) * 11;
    doc.setTextColor(...MUTED); doc.setFont("helvetica", "bold");
    doc.text(r[0].toUpperCase(), x, cy, { charSpace: 0.3 });
    doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(r[1] || "—", x, cy + 4.2);
    doc.setDrawColor(220); doc.line(x, cy + 5.5, x + 80, cy + 5.5);
    doc.setFontSize(7);
    row = Math.floor(i / 2);
  });
  return y + (row + 1) * 11 + 2;
}

function table(doc: jsPDF, head: string[], rows: string[][], y: number) {
  const widths = head.map(() => 180 / head.length);
  // header
  doc.setFillColor(...NAVY); doc.rect(15, y, 180, 6, "F");
  doc.setTextColor(255); doc.setFontSize(8); doc.setFont("helvetica", "bold");
  let x = 15;
  head.forEach((h, i) => { doc.text(h, x + 2, y + 4); x += widths[i]; });
  y += 6;
  doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
  rows.forEach((r, ri) => {
    if (ri % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(15, y, 180, 6, "F"); }
    x = 15;
    r.forEach((cell, ci) => {
      const lines = doc.splitTextToSize(cell, widths[ci] - 4) as string[];
      doc.text(lines[0] || "", x + 2, y + 4);
      x += widths[ci];
    });
    doc.setDrawColor(230); doc.line(15, y + 6, 195, y + 6);
    y += 6;
  });
  return y + 3;
}

function check(doc: jsPDF, on: boolean, label: string, x: number, y: number) {
  doc.setDrawColor(...INK); doc.setLineWidth(0.4);
  if (on) { doc.setFillColor(...NAVY); doc.rect(x, y - 3, 3.2, 3.2, "FD"); }
  else { doc.rect(x, y - 3, 3.2, 3.2); }
  if (on) { doc.setDrawColor(255); doc.setLineWidth(0.6);
    doc.line(x + 0.8, y - 1.4, x + 1.5, y - 0.7); doc.line(x + 1.5, y - 0.7, x + 2.6, y - 2.2);
  }
  doc.setTextColor(...INK); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(label, x + 5, y);
}

function signatures(doc: jsPDF, clientName: string, y: number) {
  doc.setDrawColor(...MUTED); doc.setLineWidth(0.3);
  doc.line(15, y + 10, 90, y + 10);
  doc.line(120, y + 10, 195, y + 10);
  doc.setFont("times", "italic"); doc.setFontSize(14); doc.setTextColor(...NAVY);
  doc.text(`~${clientName.split(" ")[0] || "Client"}~`, 18, y + 8);
  doc.text("~VH Officer~", 123, y + 8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(...MUTED);
  doc.text("CLIENT SIGNATURE", 15, y + 14, { charSpace: 0.4 });
  doc.text("AUTHORISED OFFICER", 120, y + 14, { charSpace: 0.4 });
}

function stamp(doc: jsPDF) {
  doc.setDrawColor(...RED); doc.setLineWidth(0.8);
  doc.circle(175, 245, 14);
  doc.circle(175, 245, 11.5);
  doc.setTextColor(...RED); doc.setFont("helvetica", "bold");
  doc.setFontSize(7); doc.text("VISAHOBE", 175, 242, { align: "center", angle: -10 });
  doc.setFontSize(9); doc.text("VERIFIED", 175, 247, { align: "center", angle: -10 });
  doc.setFontSize(6); doc.text("2026 · SG", 175, 251, { align: "center", angle: -10 });
}

// ============== category builders ==============

type Ctx = { doc: jsPDF; client?: PdfClient; refId: string; status: string; name: string };

function startPage(ctx: Ctx, subtitle: string, page: number) {
  if (page > 1) ctx.doc.addPage();
  watermark(ctx.doc);
  header(ctx.doc, subtitle, ctx.refId, ctx.status);
  footer(ctx.doc, page, ctx.refId);
}

function buildCompanyLetter(ctx: Ctx) {
  const { doc, client, refId } = ctx;
  const c = client;
  startPage(ctx, "Internal Company Letter", 1);
  let y = 36;
  doc.setFontSize(8.5); doc.setTextColor(80);
  doc.text("10 Anson Road, #14-06 International Plaza, Singapore 079903 · UEN 202612345K", 15, y); y += 8;
  doc.setTextColor(...INK); doc.text(`Date: 07 June 2026`, 15, y); y += 8;
  doc.text("To,", 15, y); y += 5;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(c?.name || "Valued Client", 15, y); y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...MUTED);
  doc.text(`${c?.email || ""} · ${c?.phone || ""}`, 15, y); y += 8;
  doc.setTextColor(...INK); doc.setFont("helvetica", "bold"); doc.setFontSize(10.5);
  doc.text("Subject: Confirmation of Engagement & Document Custody", 15, y); y += 7;
  y = paragraph(doc, `Dear ${c?.name?.split(" ")[0] || "Client"},`, y); y += 2;
  y = paragraph(doc, `This letter serves as formal confirmation that VisaHOBe PTE. LTD. has received and acknowledged the documents submitted under client reference ${c?.reference || "—"}. Our compliance team has reviewed the initial submission and the file has been moved to the secure company vault for ongoing case management.`, y); y += 2;
  y = paragraph(doc, `Your case has been assigned to a dedicated relationship officer who will coordinate all communication and provide weekly progress updates. All physical and digital documents remain the property of the client and may be retrieved at any time upon written request through our client portal.`, y); y += 2;
  y = paragraph(doc, `We thank you for choosing VisaHOBe and look forward to delivering a smooth, transparent and timely service.`, y);
  signatures(doc, c?.name || "Client", y + 8);
  stamp(doc);

  startPage(ctx, "Engagement Schedule", 2);
  y = 36; y = section(doc, "1", "Service Summary", y);
  y = paragraph(doc, "VisaHOBe will provide end-to-end consultancy services including document preparation, review, secure storage and timeline tracking. Service-level commitments are listed below.", y);
  y = section(doc, "2", "Milestones", y + 4);
  y = table(doc, ["Stage", "Owner", "Target", "Status"], [
    ["Document intake", "VH Officer", "Day 1", "Complete"],
    ["Compliance review", "Compliance", "Day 3", "Complete"],
    ["Quality assurance", "QA Lead", "Day 5", "In progress"],
    ["Client confirmation", "Client", "Day 7", "Pending"],
    ["Archive & handover", "VH Officer", "Day 10", "Pending"],
  ], y);
  y = section(doc, "3", "Fee Schedule", y + 4);
  y = fields(doc, [["Engagement Fee", "SGD 1,200.00"], ["Processing Fee", "SGD 380.00"], ["Vault Storage (12 mo)", "SGD 90.00"], ["Total Payable", "SGD 1,670.00"]], y);

  startPage(ctx, "Annex · Terms of Custody", 3);
  y = 36; y = section(doc, "A", "Document Handling", y);
  y = paragraph(doc, "All documents stored in the VisaHOBe Vault are encrypted at rest and in transit. Access is restricted to the assigned case team and is logged in a tamper-evident audit trail. Physical originals, where applicable, are stored in a fire-rated cabinet at our Singapore office.", y);
  y = section(doc, "B", "Retention", y + 4);
  y = paragraph(doc, "Digital records are retained for seven (7) years from the date of case closure in accordance with our internal records-management policy. Clients may request earlier deletion subject to legal and regulatory obligations.", y);
  y = section(doc, "C", "Contact Officer", y + 4);
  y = fields(doc, [["Officer", "Priya Menon"], ["Direct", "+65 6812 0042"], ["Email", "priya@visahobe.com"], ["Office", "Singapore HQ"]], y);
  signatures(doc, c?.name || "Client", y + 10);
  stamp(doc);
}

function buildIdentity(ctx: Ctx) {
  const { doc, client } = ctx; const c = client;
  startPage(ctx, "Identity Reference Sheet", 1);
  let y = 34; y = section(doc, "A", "Personal Particulars", y);
  // photo box
  doc.setDrawColor(180); doc.setLineDashPattern([1.5, 1.5], 0); doc.rect(15, y, 28, 36);
  doc.setLineDashPattern([], 0); doc.setFontSize(7); doc.setTextColor(...MUTED);
  doc.text("CLIENT PHOTO", 29, y + 18, { align: "center" });
  doc.text("(on file)", 29, y + 22, { align: "center" });
  // fields next to photo
  const fy = y;
  doc.setFontSize(7); doc.setTextColor(...MUTED); doc.setFont("helvetica", "bold");
  const labelPairs: [string, string][] = [
    ["FULL NAME", c?.name || "—"], ["REFERENCE", c?.reference || "—"],
    ["COUNTRY", c?.country || "—"], ["DATE JOINED", "2026-04-12"],
    ["EMAIL", c?.email || "—"], ["PHONE", c?.phone || "—"],
  ];
  labelPairs.forEach((p, i) => {
    const cx = 50 + (i % 2) * 75; const cy = fy + Math.floor(i / 2) * 12;
    doc.setFontSize(7); doc.setTextColor(...MUTED); doc.setFont("helvetica", "bold");
    doc.text(p[0], cx, cy + 2, { charSpace: 0.3 });
    doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(p[1], cx, cy + 7);
    doc.setDrawColor(220); doc.line(cx, cy + 9, cx + 70, cy + 9);
  });
  y += 42;
  y = section(doc, "B", "Internal Verification Checklist", y);
  const checks: [boolean, string][] = [
    [true, "Name confirmed against intake form"], [true, "Client agreement signed"],
    [true, "Contact details validated"], [true, "Privacy notice acknowledged"],
    [true, "Address proof received"], [true, "Vault access provisioned"],
    [false, "Secondary reference pending"], [false, "Final officer sign-off"],
  ];
  checks.forEach((cv, i) => check(doc, cv[0], cv[1], 15 + (i % 2) * 95, y + Math.floor(i / 2) * 7));
  y += Math.ceil(checks.length / 2) * 7 + 4;
  y = section(doc, "C", "Officer Notes", y);
  doc.setDrawColor(220); doc.roundedRect(15, y, 180, 22, 1.5, 1.5);
  paragraph(doc, "Client onboarded through the Singapore office. All identity references match the intake form. Awaiting one secondary reference letter before moving the case to compliance review. No flags raised by the screening team.", y + 6, 174);
  stamp(doc);

  startPage(ctx, "Reference Log", 2);
  y = 34; y = section(doc, "1", "Submitted References", y);
  y = table(doc, ["Type", "Issued By", "Date", "Status"], [
    ["Address proof", "Utility provider", "2026-03-12", "Verified"],
    ["Employment letter", "Acme Corp", "2026-03-18", "Verified"],
    ["Bank reference", "Standard Bank", "2026-03-22", "Verified"],
    ["Character reference", "Dr. M. Iyer", "—", "Pending"],
  ], y);
  y = section(doc, "2", "Screening Result", y + 4);
  const sc: [string, string][] = [["Sanctions", "Clear"], ["Watchlist", "Clear"], ["Adverse media", "Clear"]];
  sc.forEach((s, i) => {
    const x = 15 + i * 60;
    doc.setFillColor(236, 253, 245); doc.setDrawColor(167, 243, 208);
    doc.roundedRect(x, y, 55, 16, 2, 2, "FD");
    doc.setTextColor(...MUTED); doc.setFontSize(7); doc.setFont("helvetica", "bold");
    doc.text(s[0].toUpperCase(), x + 3, y + 5, { charSpace: 0.3 });
    doc.setTextColor(...GREEN); doc.setFontSize(13);
    doc.text(s[1], x + 3, y + 12);
  });

  startPage(ctx, "Sign-off", 3);
  y = 34; y = section(doc, "A", "Officer Declaration", y);
  y = paragraph(doc, "I confirm that the references collected for the client named in this file have been reviewed against our internal verification standards. All listed checklist items have been completed except where a pending status is shown.", y);
  y = section(doc, "B", "Approvals", y + 4);
  y = fields(doc, [["Reviewed by", "Priya Menon"], ["Reviewed on", "2026-04-15"], ["Approved by", "K. Tan"], ["Approved on", "2026-04-16"]], y);
  signatures(doc, c?.name || "Client", y + 10);
  stamp(doc);
}

function buildTravel(ctx: Ctx) {
  const { doc, client } = ctx;
  startPage(ctx, "Travel Itinerary", 1);
  let y = 34; y = section(doc, "1", "Trip Summary", y);
  y = fields(doc, [
    ["Traveller", client?.name || "—"], ["Reference", client?.reference || "—"],
    ["Departure", "Singapore (SIN)"], ["Arrival", "London (LHR)"],
    ["Date", "14 July 2026"], ["Return", "28 July 2026"],
  ], y);
  y = section(doc, "2", "Flight Segments", y + 2);
  y = table(doc, ["Date", "From → To", "Carrier", "Flight", "Class"], [
    ["14 Jul", "SIN → LHR", "VH Air", "VH 218", "Economy"],
    ["18 Jul", "LHR → CDG", "VH Air", "VH 042", "Economy"],
    ["22 Jul", "CDG → AMS", "VH Air", "VH 113", "Economy"],
    ["28 Jul", "AMS → SIN", "VH Air", "VH 219", "Economy"],
  ], y);
  stamp(doc);

  startPage(ctx, "Accommodation & Ground Transport", 2);
  y = 34; y = section(doc, "3", "Accommodation", y);
  const acc = [["14–18 Jul", "The Strand House, London", "Confirmed"], ["18–22 Jul", "Rive Gauche Hotel, Paris", "Confirmed"], ["22–28 Jul", "Canal View Suites, Amsterdam", "Confirmed"]];
  acc.forEach(([d, h, s]) => {
    doc.setDrawColor(220); doc.roundedRect(15, y, 180, 8, 1.5, 1.5);
    doc.setTextColor(...MUTED); doc.setFont("courier", "normal"); doc.setFontSize(8);
    doc.text(d, 18, y + 5.2);
    doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    doc.text(h, 55, y + 5.4);
    doc.setTextColor(...GREEN); doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text(s.toUpperCase(), 192, y + 5.2, { align: "right" });
    y += 10;
  });
  y = section(doc, "4", "Ground Transport", y + 2);
  y = table(doc, ["Date", "City", "Service", "Reference"], [
    ["14 Jul", "London", "Airport transfer", "LDN-2241"],
    ["18 Jul", "Paris", "Rail Eurostar", "EUR-7782"],
    ["22 Jul", "Amsterdam", "High-speed rail", "AMS-5510"],
    ["28 Jul", "Singapore", "Airport transfer", "SIN-9911"],
  ], y);

  startPage(ctx, "Officer Notes & Approvals", 3);
  y = 34; y = section(doc, "5", "Notes", y);
  y = paragraph(doc, "All bookings are non-refundable. Travel insurance has been arranged through our partner provider and the policy reference is on file. Daily allowances and meal vouchers are listed in the supporting schedule.", y);
  y = section(doc, "6", "Approvals", y + 4);
  y = fields(doc, [["Prepared by", "VH Travel Desk"], ["Prepared on", "2026-05-21"], ["Approved by", "K. Tan"], ["Approved on", "2026-05-22"]], y);
  signatures(doc, client?.name || "Client", y + 10);
  stamp(doc);
}

function buildAgreement(ctx: Ctx) {
  const { doc, client } = ctx; const c = client;
  startPage(ctx, "Service Agreement", 1);
  let y = 38;
  doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.setTextColor(...INK);
  doc.text("CONSULTANCY SERVICE AGREEMENT", 105, y, { align: "center" }); y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...MUTED);
  doc.text("Between VisaHOBe PTE. LTD. and the Client named below", 105, y, { align: "center", charSpace: 0.4 });
  y += 8; y = section(doc, "1", "Parties", y);
  y = paragraph(doc, `VisaHOBe PTE. LTD. (UEN 202612345K), 10 Anson Road #14-06, Singapore 079903 ("the Company")`, y);
  y = paragraph(doc, `${c?.name || "Client"}, ${c?.country || ""}, reference ${c?.reference || "—"} ("the Client")`, y + 1);
  y = section(doc, "2", "Scope of Services", y + 4);
  ["Secure custody of all documents uploaded by the Client to the VisaHOBe Vault.",
    "Internal review, categorisation and quality assurance of submitted documents.",
    "Weekly status updates through the Client portal and email notifications.",
    "Support handover at completion, including a digital archive of all approved records."].forEach((t, i) => {
    y = paragraph(doc, `${i + 1}. ${t}`, y + 1, 178);
  });
  y = section(doc, "3", "Confidentiality", y + 4);
  paragraph(doc, "The Company shall hold all Client information in strict confidence. Information may only be disclosed to authorised personnel and shall not be shared with any third party without the Client's prior written consent, save where required by Singapore law.", y);

  startPage(ctx, "Service Agreement (cont.)", 2);
  y = 34; y = section(doc, "4", "Term & Termination", y);
  y = paragraph(doc, "This Agreement shall commence on the date of signature and continue for twelve (12) months unless terminated earlier by either party with thirty (30) days written notice. Any documents in custody shall be returned within seven (7) days of termination.", y);
  y = section(doc, "5", "Fees", y + 4);
  y = paragraph(doc, "The Client shall pay the engagement fees as outlined in the attached schedule. All fees are exclusive of GST and shall be invoiced monthly.", y);
  y = section(doc, "6", "Liability", y + 4);
  y = paragraph(doc, "The Company's total liability under this Agreement shall be limited to the fees paid by the Client during the twelve (12) months preceding any claim. The Company shall not be liable for any indirect or consequential loss.", y);
  y = section(doc, "7", "Governing Law", y + 4);
  paragraph(doc, "This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.", y);

  startPage(ctx, "Acknowledgement & Signatures", 3);
  y = 34; y = section(doc, "8", "Acknowledgement", y);
  y = paragraph(doc, "By signing below the parties confirm that they have read, understood and agreed to be bound by the terms of this Agreement. Each party has had the opportunity to take independent advice prior to signature.", y);
  y = section(doc, "9", "Execution", y + 4);
  y = fields(doc, [["Place of execution", "Singapore"], ["Date", "07 June 2026"], ["Witness", "Priya Menon"], ["Counterpart", "1 of 1"]], y);
  signatures(doc, c?.name || "Client", y + 12);
  stamp(doc);
}

function buildMedical(ctx: Ctx) {
  const { doc, client } = ctx; const c = client;
  startPage(ctx, "Medical Summary (Internal)", 1);
  let y = 34;
  doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(...MUTED);
  doc.text("Summary prepared by VisaHOBe for internal case-management only. Original clinical records remain with the issuing practitioner.", 15, y); y += 6;
  y = section(doc, "A", "Patient Reference", y);
  y = fields(doc, [["Client", c?.name || "—"], ["Reference", c?.reference || "—"], ["Country", c?.country || "—"], ["Summary Date", "04 June 2026"]], y);
  y = section(doc, "B", "Wellness Indicators", y + 2);
  const bars: [string, number][] = [["General health", 88], ["Vaccinations on file", 100], ["Allergies recorded", 30], ["Fitness clearance", 92]];
  bars.forEach(([k, v]) => {
    doc.setFontSize(8.5); doc.setTextColor(...INK); doc.setFont("helvetica", "normal");
    doc.text(k, 15, y); doc.text(`${v}%`, 195, y, { align: "right" });
    doc.setFillColor(230, 235, 240); doc.roundedRect(15, y + 1.5, 180, 2.4, 1.2, 1.2, "F");
    doc.setFillColor(...NAVY); doc.roundedRect(15, y + 1.5, 180 * (v / 100), 2.4, 1.2, 1.2, "F");
    y += 8;
  });
  stamp(doc);

  startPage(ctx, "Clinical History (Summary)", 2);
  y = 34; y = section(doc, "C", "Vaccinations", y);
  y = table(doc, ["Vaccine", "Date", "Practitioner"], [
    ["MMR", "2018-04-10", "Dr. L. Goh"],
    ["Tetanus booster", "2023-11-02", "Dr. M. Iyer"],
    ["Influenza", "2025-10-14", "Dr. S. Lim"],
    ["Hepatitis A & B", "2024-06-22", "Dr. L. Goh"],
  ], y);
  y = section(doc, "D", "Conditions on File", y + 4);
  const cond: [boolean, string][] = [
    [false, "Chronic condition"], [true, "Family GP on record"],
    [false, "Long-term medication"], [false, "Specialist referral"],
    [true, "Routine annual review"], [true, "Insurance details up to date"],
  ];
  cond.forEach((cv, i) => check(doc, cv[0], cv[1], 15 + (i % 2) * 95, y + Math.floor(i / 2) * 7));

  startPage(ctx, "Officer Notes & Sign-off", 3);
  y = 34; y = section(doc, "E", "Notes", y);
  doc.setDrawColor(220); doc.roundedRect(15, y, 180, 26, 1.5, 1.5);
  paragraph(doc, "All routine vaccinations are on file. Client reports no chronic conditions or long-term medication. Awaiting one outstanding clearance letter from the family practitioner before the case can be moved to the next review stage.", y + 6, 174);
  y += 32;
  y = section(doc, "F", "Approvals", y);
  y = fields(doc, [["Prepared by", "Wellness Desk"], ["Reviewed by", "Dr. M. Iyer (panel)"], ["Reviewed on", "2026-06-04"], ["Next review", "2027-06-04"]], y);
  signatures(doc, c?.name || "Client", y + 10);
  stamp(doc);
}

function buildOther(ctx: Ctx) {
  const { doc, client, name } = ctx;
  startPage(ctx, "Internal Document", 1);
  let y = 36;
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(...INK);
  doc.text(name, 15, y); y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...MUTED);
  doc.text(`Filed under client ${client?.reference || "—"} · ${client?.name || "—"}`, 15, y);
  y += 6; y = section(doc, "1", "Overview", y);
  y = paragraph(doc, "This document has been stored in the VisaHOBe vault as part of the client's ongoing engagement. The content has been categorised, indexed and is accessible to authorised members of the case team. A full audit trail is preserved for every access event.", y);
  y = section(doc, "2", "Indexed Fields", y + 4);
  y = fields(doc, [["Client", client?.name || "—"], ["Reference", client?.reference || "—"], ["Category", "Other"], ["Visibility", "Private"]], y);
  stamp(doc);

  startPage(ctx, "Audit Trail", 2);
  y = 34; y = section(doc, "3", "Recent Events", y);
  const events: [string, string][] = [
    ["07 Jun 2026 09:42", "Uploaded by VH Officer"],
    ["07 Jun 2026 10:15", "Categorised as Other"],
    ["07 Jun 2026 11:03", "Moved to secure vault"],
    ["07 Jun 2026 14:21", "Reviewed by Compliance"],
    ["08 Jun 2026 08:07", "Accessed by case team"],
    ["08 Jun 2026 16:55", "Tagged for archive"],
  ];
  events.forEach(([t, e]) => {
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED); doc.setFont("courier", "normal"); doc.text(t, 15, y);
    doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.text(e, 65, y);
    doc.setDrawColor(230); doc.line(15, y + 1.5, 195, y + 1.5);
    y += 7;
  });

  startPage(ctx, "Retention & Sign-off", 3);
  y = 34; y = section(doc, "4", "Retention", y);
  y = paragraph(doc, "This record will be retained for seven (7) years in line with our records-management policy. Early deletion may be requested in writing by the client, subject to legal and regulatory obligations.", y);
  y = section(doc, "5", "Sign-off", y + 4);
  y = fields(doc, [["Reviewed by", "Priya Menon"], ["Reviewed on", "2026-06-07"], ["Approved by", "K. Tan"], ["Approved on", "2026-06-07"]], y);
  signatures(doc, client?.name || "Client", y + 10);
  stamp(doc);
}

const builders: Record<FileCategory, (ctx: Ctx) => void> = {
  "Company Letter": buildCompanyLetter,
  "Identity": buildIdentity,
  "Travel": buildTravel,
  "Agreement": buildAgreement,
  "Medical": buildMedical,
  "Other": buildOther,
};

export function generateDemoPdf(opts: { category: FileCategory; name: string; refId: string; status: string; client?: PdfClient }): { blob: Blob; url: string; pages: number } {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
  doc.setProperties({ title: opts.name, subject: opts.category, author: "VisaHOBe PTE. LTD.", creator: "VisaHOBe Vault" });
  builders[opts.category]({ doc, client: opts.client, refId: opts.refId, status: opts.status, name: opts.name });
  const blob = doc.output("blob");
  return { blob, url: URL.createObjectURL(blob), pages: TOTAL };
}
