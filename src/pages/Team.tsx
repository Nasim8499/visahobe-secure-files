import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const team = [
  { n: "Priya Menon", r: "Managing Partner", e: "priya@visahobe.com", c: "from-[#003B73] to-[#177BBB]" },
  { n: "Marcus Chen", r: "Senior Consultant", e: "marcus@visahobe.com", c: "from-[#177BBB] to-[#E63946]" },
  { n: "Aisha Rahman", r: "Compliance Lead", e: "aisha@visahobe.com", c: "from-[#E63946] to-[#F1573D]" },
  { n: "Tom Becker", r: "Operations", e: "tom@visahobe.com", c: "from-[#003B73] to-[#E63946]" },
  { n: "Lina Park", r: "Client Success", e: "lina@visahobe.com", c: "from-[#F1573D] to-[#177BBB]" },
];

export default function Team() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">{team.length} active members</p>
        </div>
        <Button className="rounded-xl gradient-primary text-primary-foreground shadow-glow"><Plus className="h-4 w-4 mr-1" /> Invite</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {team.map((m) => (
          <div key={m.e} className="card-elevated p-5">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${m.c} text-white flex items-center justify-center font-semibold text-xl`}>{m.n[0]}</div>
            <div className="mt-3 font-semibold">{m.n}</div>
            <div className="text-xs text-muted-foreground">{m.r}</div>
            <div className="text-xs mt-3 flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3 w-3" /> {m.e}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
