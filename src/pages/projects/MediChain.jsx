import { useState } from 'react'
import ProjectTheme from '../../components/ProjectTheme'
import { ArchitectureImage } from '../../components/Media'
import { Band, Eyebrow, BackLink, Meta, NextProject } from '../../components/project/Scaffold'
import { getProject } from '../../data/projects'

const project = getProject('medichain-ai')

/* One federated round, mocked from the spec. CIDs and hashes are illustrative —
   this is a recreation of the designed flow, not captured chain data. */
const ROUND = [
  {
    id: 0,
    phase: 'Initialise',
    actor: 'Coordinator',
    onChain: 'setGlobalModel(cid)',
    cid: 'bafybeig…4kq2',
    note: 'The baseline ResNet-50 is pinned to IPFS and its CID written to the contract as the current global model.',
    hospitals: ['idle', 'idle', 'idle'],
  },
  {
    id: 1,
    phase: 'Local training',
    actor: 'Hospitals',
    onChain: '— no transaction —',
    cid: '—',
    note: 'Each hospital pulls the baseline and trains on its own patient data. Raw scans never cross the firewall; nothing goes on-chain during this phase.',
    hospitals: ['training', 'training', 'training'],
  },
  {
    id: 2,
    phase: 'Gradient submission',
    actor: 'Hospitals',
    onChain: 'submitUpdate(cid)  ×3',
    cid: 'bafybeih…9x1p',
    note: 'Gradients — not data — are pinned to IPFS, and each hospital submits its CID as a transaction. Role-based access control means only whitelisted addresses can submit.',
    hospitals: ['submitted', 'submitted', 'submitted'],
  },
  {
    id: 3,
    phase: 'Aggregation',
    actor: 'Flower server',
    onChain: 'reads UpdateSubmitted events',
    cid: 'bafybeic…7m3v',
    note: 'The server watches the chain, pulls the submitted gradients from IPFS once quorum is reached, and runs FedAvg to produce a new global model.',
    hospitals: ['waiting', 'waiting', 'waiting'],
  },
  {
    id: 4,
    phase: 'Publish & reward',
    actor: 'Contract',
    onChain: 'setGlobalModel(cid) · mint($MEDAI)',
    cid: 'bafybeid…2t8w',
    note: 'The new model is pinned, the contract updated, and contributing hospitals receive ERC-20 tokens. The trail of who contributed to which version is now public and permanent.',
    hospitals: ['rewarded', 'rewarded', 'rewarded'],
  },
]

const STATE_TONE = {
  idle: 'text-ink3 border-rule',
  training: 'text-accent2 border-accent2/50',
  submitted: 'text-accent border-accent/50',
  waiting: 'text-ink3 border-rule',
  rewarded: 'text-accent3 border-accent3/50',
}

export default function MediChain() {
  const [i, setI] = useState(0)
  const r = ROUND[i]

  return (
    <article className="pt-24 md:pt-28">
      <ProjectTheme slug="medichain-ai" />

      <header className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-52 h-[62vh]"
          style={{ background: 'radial-gradient(42% 38% at 68% 24%, color-mix(in oklab, var(--c-accent) 20%, transparent), transparent 70%)' }}
        />
        <div className="shell relative">
          <BackLink />
          <Meta category="AI / ML">2026 · Architecture &amp; build · in progress</Meta>

          <h1 className="t-hero mt-7 text-ink" aria-label="Privacy was never the blocker">
            Privacy was never
            <br />
            <span className="text-accent">the blocker.</span>
          </h1>

          <p className="t-lead mt-8 max-w-2xl">
            Medical imaging models need data from many hospitals to generalise, and no hospital can
            legally or ethically hand over raw patient scans. Federated learning already solves
            that: train locally, share only gradients, and the data never moves.
          </p>

          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.72] text-ink">
            The unsolved part is <span className="font-semibold text-accent">trust in the
            aggregator</span>. No participant can independently verify which hospitals contributed
            to which model version, or that the coordinator behaved honestly. So the coordination
            layer goes on-chain.
          </p>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-rule bg-bg2 px-4 py-2 font-mono text-[12px] text-ink2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
            In progress — AI and contract layers exist; integration is the current work
          </p>
        </div>
      </header>

      {/* ── Round walkthrough — mock ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>One federated round</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Where the data stays, and the proof goes.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          Step through a training round. Watch which phases touch the chain and which never do.
        </p>

        <ol className="mt-10 grid gap-2 sm:grid-cols-5">
          {ROUND.map((p, idx) => (
            <li key={p.id}>
              <button type="button" onClick={() => setI(idx)} aria-current={idx === i ? 'step' : undefined} className="group w-full text-left">
                <span className={`block h-[3px] w-full rounded-full transition-colors duration-500 ${idx <= i ? 'bg-accent' : 'bg-rule2'}`} />
                <span className="t-mono mt-2.5 block text-ink3">{String(idx + 1).padStart(2, '0')}</span>
                <span className={`mt-1 block font-display text-[14px] font-semibold transition-colors ${idx === i ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>
                  {p.phase}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* the hospitals */}
          <div className="rounded-2xl border border-rule bg-bg p-6">
            <p className="t-label mb-5">Three participating hospitals</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {r.hospitals.map((state, hi) => (
                <div key={hi} className={`rounded-xl border p-4 transition-colors duration-300 ${STATE_TONE[state]}`}>
                  <p className="font-mono text-[11px] text-ink3">hospital_{hi + 1}</p>
                  <p className="mt-2 font-mono text-[13px] capitalize">{state}</p>
                  <p className="mt-3 border-t border-rule pt-2 font-mono text-[10.5px] text-ink3">
                    raw scans: never leave
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-ink2">{r.note}</p>
          </div>

          {/* the chain */}
          <div className="rounded-2xl border border-rule bg-bg p-6">
            <p className="t-label mb-4">On-chain</p>
            <dl className="space-y-3">
              {[
                ['actor', r.actor],
                ['call', r.onChain],
                ['ipfs cid', r.cid],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="t-mono text-ink3">{k}</dt>
                  <dd className="font-mono text-[12.5px] break-words text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 border-t border-rule pt-4 font-mono text-[11px] text-accent">
              audit trail: public, permanent
            </p>
          </div>
        </div>

        <p className="t-mono mt-4 text-ink3">
          Mocked from the spec — illustrative CIDs, not captured chain data.
        </p>
      </Band>

      {/* ── Architecture ── */}
      <Band>
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Three layers.</h2>
        <p className="t-lead mt-5 max-w-2xl">
          The local node inside each hospital, the federated aggregator that coordinates them, and
          the blockchain plus IPFS layer that records what actually happened.
        </p>
        <div className="mt-8">
          <ArchitectureImage src={project.architectureImage} alt="MediChain AI system architecture" />
        </div>
      </Band>

      {/* ── Stack ── */}
      <Band className="border-y border-rule bg-bg2/40">
        <Eyebrow>Stack</Eyebrow>
        <h2 className="t-h1 max-w-2xl text-ink">Bridging Python and Web3.</h2>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {[
            ['Learning', 'PyTorch + Flower', 'PyTorch gives the granular control over model weights that gradient extraction needs; Flower handles the networking and FedAvg.'],
            ['Model', 'ResNet-50', 'An industry-standard baseline for medical image classification.'],
            ['Contracts', 'Solidity + Hardhat', 'Access control, update logging and incentive distribution. Polygon Amoy for fast, cheap testing.'],
            ['Storage', 'IPFS via Pinata', 'Model weights and gradients are far too large for on-chain storage — only their content identifiers go on the chain.'],
            ['Interface', 'Next.js + Viem', 'Hospital dashboard for training rounds, accuracy over time and the audit trail.'],
          ].map(([layer, tech, why]) => (
            <li key={layer} className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[130px_190px_1fr]">
              <span className="t-label pt-0.5">{layer}</span>
              <span className="font-mono text-[13.5px] text-accent">{tech}</span>
              <span className="text-[14.5px] leading-relaxed text-ink2">{why}</span>
            </li>
          ))}
        </ul>
      </Band>

      {/* ── Honest status ── */}
      <Band className="border-t border-rule">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Status</Eyebrow>
          <h2 className="t-h1 text-ink">What exists, and what doesn&apos;t.</h2>
          <p className="mt-7 text-[1.0625rem] leading-[1.72] text-ink2">
            The AI and contract layers exist independently. Integration between them — having the
            Flower clients automatically trigger the IPFS upload and on-chain submission when a
            round finishes — is the current work, and the dashboard is not built yet.
          </p>
          <p className="mt-5 text-[1.0625rem] leading-[1.72] text-ink">
            There are no product screenshots on this page because there is no product to screenshot
            yet. The architectural bet is the deliverable so far, and it is the part I would defend:
            verifiability, not privacy, is federated learning&apos;s real blocker.
          </p>
          <ul className="mt-7 space-y-2">
            {project.nextSteps.map((s) => (
              <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-ink2">
                <span className="mt-[9px] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <NextProject slug={project.slug} />
    </article>
  )
}
