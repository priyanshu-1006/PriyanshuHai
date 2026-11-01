import { lazy, Suspense } from 'react'

const NexsusUniverse = lazy(() => import('./NexsusUniverse'))
const NexsusCounselling = lazy(() => import('./NexsusCounselling'))
const NexsusAssist = lazy(() => import('./NexsusAssist'))
const Cognito = lazy(() => import('./Cognito'))
const Gryork = lazy(() => import('./Gryork'))
const Washtro = lazy(() => import('./Washtro'))
const WashingBro = lazy(() => import('./WashingBro'))
const VigilantBhai = lazy(() => import('./VigilantBhai'))
const FractureVision = lazy(() => import('./FractureVision'))
const Haazir = lazy(() => import('./Haazir'))
const AuroraHai = lazy(() => import('./AuroraHai'))
const FinAgent = lazy(() => import('./FinAgent'))
const AnandPumps = lazy(() => import('./AnandPumps'))
const PathFinder = lazy(() => import('./PathFinder'))
const MediChain = lazy(() => import('./MediChain'))
const TechPreneur = lazy(() => import('./TechPreneur'))
const GdgMmmut = lazy(() => import('./GdgMmmut'))
const MmmutFdp = lazy(() => import('./MmmutFdp'))
const QuizWise = lazy(() => import('./QuizWise'))
const BookEase = lazy(() => import('./BookEase'))
const LittleCode = lazy(() => import('./LittleCode'))
const LittleTerminal = lazy(() => import('./LittleTerminal'))
const MmmutNotice = lazy(() => import('./MmmutNotice'))
const ManakMitra = lazy(() => import('./ManakMitra'))
const SatyaDwar = lazy(() => import('./SatyaDwar'))

/**
 * Slug → bespoke page. Every project now has one.
 *
 * Each has its own file, palette, display face and section structure. The
 * generic template in ProjectDetail remains as a fallback so adding a project
 * to the data without a page here still renders something.
 *
 * Returns a rendered element rather than a component reference, so callers
 * never appear to construct a component during render.
 */
const PAGES = {
  'little-code': <LittleCode />,
  'little-terminal': <LittleTerminal />,
  'mmmut-notice': <MmmutNotice />,
  manakmitra: <ManakMitra />,
  satyadwar: <SatyaDwar />,
  'nexsus-universe': <NexsusUniverse />,
  'nexsus-counselling': <NexsusCounselling />,
  'nexsus-assist': <NexsusAssist />,
  'cognito-learning-hub': <Cognito />,
  gryork: <Gryork />,
  washtro: <Washtro />,
  'washing-bro': <WashingBro />,
  'vigilant-bhai': <VigilantBhai />,
  'fracturevision-ai': <FractureVision />,
  haazir: <Haazir />,
  aurorahai: <AuroraHai />,
  'finagent-ai': <FinAgent />,
  'anand-pumps': <AnandPumps />,
  'pathfinder-ai': <PathFinder />,
  'medichain-ai': <MediChain />,
  'gryork-techpreneur': <TechPreneur />,
  'gdg-mmmut': <GdgMmmut />,
  'mmmut-fdp': <MmmutFdp />,
  'quizwise-ai': <QuizWise />,
  bookease: <BookEase />,
}

export const getBespokePage = (slug) => PAGES[slug] ? (
  <Suspense fallback={<div className="shell pt-32 pb-20 text-ink2" role="status">Opening case study…</div>}>
    {PAGES[slug]}
  </Suspense>
) : null
export const hasBespokePage = (slug) => slug in PAGES
